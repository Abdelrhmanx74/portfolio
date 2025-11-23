"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  children: React.ReactNode;
};

export default function SmoothScroll({ children }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const body = document.body;
    // Respect user motion preferences and mobile devices
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    if (reducedMotion || isMobile) {
      // Do not apply custom smooth behavior. Reset body height and leave default scrolling.
      body.style.height = '';
      return undefined;
    }
    const setBodyHeight = () => {
      body.style.height = `${container.getBoundingClientRect().height}px`;
    };

    // Initial value
    setBodyHeight();

    const resizeObserver = new ResizeObserver(setBodyHeight);
    resizeObserver.observe(container);

    // Smooth scroll values
    let targetY = 0;
    let currentY = 0;
    let height = 0;
    let rafId: number | null = null;

    const onScroll = () => {
      targetY = window.scrollY || window.pageYOffset;
    };

    function rafLoop() {
      currentY += (targetY - currentY) * 0.08; // ease multiplier
      const rounded = Math.round(currentY * 100) / 100;
      gsap.set(container, { y: -rounded });
      rafId = requestAnimationFrame(rafLoop);
    }

    // Sync
    window.addEventListener("scroll", onScroll, { passive: true });
    rafLoop();

    // Anchor navigation: intercept clicks on internal anchors and handle hashchange
    const scrollToHash = (hash: string | null) => {
      if (!hash || hash === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (!el) return;
      const elTop = el.getBoundingClientRect().top + window.scrollY;
      // Account for the fixed header height so the element isn't hidden behind it
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
      const targetTop = Math.max(0, elTop - headerHeight - 8);
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    };

    const onHashChange = () => scrollToHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);

    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      // Accept '#id' and '/#id' formats
      const isSamePageHash = href.startsWith('#') || href.startsWith('/#');
      if (!isSamePageHash) return;

      e.preventDefault();
      // Update history without jumping
      // Update URL hash without jumping
      history.pushState({}, '', href);
      // Smooth scroll to target element
      scrollToHash(href);
    };
    document.addEventListener('click', onDocumentClick);

    // If there's a hash on initial load - jump smoothly to it
    if (window.location.hash) {
      // Give the layout a frame to measure
      setTimeout(() => scrollToHash(window.location.hash), 50);
    }

    // Keep body height in case of dynamic changes
    const onResize = () => setBodyHeight();
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      body.style.height = "";
      gsap.set(container, { clearProps: "all" });
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('click', onDocumentClick);
    };
  }, []);

  return (
    <div id="smooth-scroll-wrapper" style={{ position: "relative", width: "100%" }}>
      <div
        id="smooth-scroll-container"
        ref={containerRef}
        style={{ position: "fixed", width: "100%", top: 0, left: 0, willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}
