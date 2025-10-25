"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "showcase", label: "Highlights" },
  { id: "tech-stack", label: "Stack" },
];

export function Navigation() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
      data-testid="header-navigation"
      role="banner"
      aria-label="Primary"
    >
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center">
        <a
          href="#"
          className="text-base md:text-sm hover-elevate active-elevate-2 px-2 py-1 transition-colors font-bold"
          data-testid="button-logo"
          aria-label="Home"
        >
          [AM]
        </a>

        <nav
          className="hidden md:flex items-center gap-4 text-xs mx-auto"
          role="navigation"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="relative px-3 py-1 font-medium transition-all duration-200 hover:bg-accent/70 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              data-testid={`link-${item.id}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop preview trigger (uncontrolled Sheet) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="default"
              className="ml-auto px-3 py-1 rounded-md text-sm hidden md:inline-block"
              aria-label="Open mobile preview"
              data-testid="button-preview"
            >
              Try the responsive
            </Button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="max-w-3xl mx-auto rounded-lg p-0 bg-black/90"
          >
            <SheetTitle className="sr-only">Mobile preview</SheetTitle>

            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <div className="text-sm font-medium">Mobile preview</div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" aria-label="Close preview">
                  <X className="w-4 h-4" />
                </Button>
              </SheetClose>
            </div>

            <div className="p-4 flex justify-center">
              <div
                className="bg-black rounded-2xl shadow-lg"
                style={{ width: 390, height: 844 }}
              >
                <iframe
                  src="/"
                  title="Mobile preview"
                  style={{
                    width: "390px",
                    height: "844px",
                    border: "none",
                    borderRadius: 20,
                    display: "block",
                  }}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile burger menu (Sheet) */}
        <div className="md:hidden flex items-center absolute right-6 top-1/2 -translate-y-1/2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent className="rounded-b-xl" side="top">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="px-6 py-4 flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="w-full text-left text-base py-2 px-3 rounded-lg font-medium"
                      data-testid={`mobile-link-${item.id}`}
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
