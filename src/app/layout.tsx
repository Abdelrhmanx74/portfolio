import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll.client";

const siteUrl = process.env.siteUrl || "http://localhost:3000";
const heroImage = `${siteUrl}/me.jpg`;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // Optimize font loading with swap strategy huhu
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Abdelrhman Mahmoud | Frontend Developer",
  description:
    "Frontend developer specializing in React, Next.js, and TypeScript. Building fast, scalable web applications with modern technologies.",
  keywords: [
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Web Development",
    "Abdelrhman Mahmoud",
    "Next.js developer",
    "React developer",
    "frontend engineer portfolio",
    "Egypt",
    "Alexandria",
  ],
  authors: [{ name: "Abdelrhman Mahmoud" }],
  creator: "Abdelrhman Mahmoud",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Abdelrhman Mahmoud | Frontend Developer",
    description:
      "Frontend developer specializing in React, Next.js, and TypeScript",
    siteName: "Abdelrhman Mahmoud Portfolio",
    images: [
      {
        url: "/me.jpg",
        width: 1200,
        height: 630,
        alt: "Abdelrhman Mahmoud smiling in front of a neutral background",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@abdelrhmanx74",
    title: "Abdelrhman Mahmoud | Frontend Developer",
    description:
      "Frontend developer specializing in React, Next.js, and TypeScript",
    images: ["/me.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Abdelrhman Mahmoud",
    url: siteUrl,
    image: heroImage,
    jobTitle: "Frontend Developer",
    description:
      "Frontend developer specializing in React, Next.js, and TypeScript, building fast, scalable web applications.",
    sameAs: [
      "https://linkedin.com/in/abdelrhmanx74",
      "https://github.com/abdelrhmanx74",
      "mailto:abdelrhmanx74@gmail.com",
    ],
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Abdelrhman Mahmoud Portfolio",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className={`dark ${jetbrainsMono.variable} antialiased`}>
        <Script
          id="schema-person"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body >
    </html >
  );
}
