"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Client-side Google Analytics (GA4) integration component.
 *
 * Usage:
 * - Add <Analytics /> near the root of your app (e.g. inside `root layout` or a top-level client wrapper).
 * - Set the environment variable `NEXT_PUBLIC_GA_ID` to your GA4 Measurement ID (e.g. "G-XXXXXXXXXX").
 *
 * Notes:
 * - The component loads the GA script and initializes gtag with `send_page_view: false`
 *   so we can manually control page_view events (single-page navigation).
 * - It listens to pathname changes (app router) and sends `page_view` events automatically.
 * - Helper functions `trackEvent` and `pageview` are exported for manual tracking.
 */

/* Expose a typed gtag on window to satisfy TypeScript */
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/* Read the public GA ID injected at build time */
const GA_ID =
  typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_GA_ID ?? "") : "";

function ensureGtag() {
  if (typeof window === "undefined") return false;
  return typeof window.gtag === "function";
}

/**
 * Send a page_view event to GA4
 * @param url - the path/url to record (e.g. pathname)
 */
export function pageview(url: string) {
  if (!ensureGtag()) return;
  window.gtag!("event", "page_view", {
    page_location: window.location.href,
    page_path: url,
    page_title: document.title,
  });
}

/**
 * Generic event tracking helper.
 * Example: trackEvent('select_content', { content_type: 'button', item_id: 'signup' })
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!ensureGtag()) return;
  window.gtag!("event", eventName, params || {});
}

export default function Analytics(): React.ReactElement | null {
  const pathname = usePathname();

  // Send a page_view whenever the pathname changes (SPA navigation)
  useEffect(() => {
    // If no GA ID is present, skip any gtag-related work
    if (!GA_ID) return;

    // Wait until gtag is available
    if (ensureGtag()) {
      pageview(pathname || window.location.pathname);
      return;
    } else {
      // In rare cases gtag may not be ready yet; poll briefly (simple approach).
      let mounted = true;
      const interval = setInterval(() => {
        if (!mounted) return;
        if (ensureGtag()) {
          pageview(pathname || window.location.pathname);
          clearInterval(interval);
        }
      }, 200);

      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }
  }, [pathname]);

  // If no GA ID is present, render nothing (no-op).
  if (!GA_ID) return null;

  return (
    <>
      {/* GA script loader */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/* gtag initialization */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // We disable automatic page_view so we control SPA navigation views manually
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
