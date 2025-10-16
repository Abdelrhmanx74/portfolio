"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSmoothScroll } from "@/lib/smooth-scroll/SmoothScrollProvider";

const NAV_ITEMS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "showcase", label: "Highlights" },
  { id: "tech-stack", label: "Stack" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  // mobileOpen state replaced by shadcn Sheet (Radix) components
  // Desktop-only preview state to open a mobile-sized preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { snapToSection, currentSection, reduceMotion } = useSmoothScroll();

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 48);
        frame = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSnap = useCallback(
    (index: number) => {
      snapToSection(index);
    },
    [snapToSection],
  );

  const navItems = useMemo(() => NAV_ITEMS, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      }`}
      data-testid="header-navigation"
    >
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center relative">
        <button
          type="button"
          onClick={() => handleSnap(0)}
          className="text-base md:text-sm hover-elevate active-elevate-2 px-2 py-1 transition-colors font-bold"
          data-testid="button-logo"
        >
          [AM]
        </button>

        <nav className="hidden md:flex items-center gap-4 text-xs absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSnap(index + 1)}
              className={`relative px-3 py-1 font-medium transition-all duration-200 hover:bg-accent/70 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${currentSection === index + 1 ? "font-semibold bg-accent/90 text-accent-foreground" : ""}`}
              aria-current={currentSection === index + 1}
              data-testid={`link-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <Button
          variant="default"
          className="ml-auto px-3 py-1 rounded-md text-sm hidden md:block"
          onClick={() => setIsPreviewOpen(true)}
          aria-label="Open mobile preview"
        >
          Try the responsive
        </Button>

        <div className="md:hidden flex items-center absolute right-6 top-1/2 -translate-y-1/2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent className="rounded-b-xl" side="top">
              {/* Provide an accessible title for the Dialog (visually hidden) to satisfy Radix a11y checks */}
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="px-6 py-4 flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <SheetClose asChild key={item.id}>
                    <Button
                      variant={
                        currentSection === index + 1 ? "secondary" : "ghost"
                      }
                      className="w-full justify-start text-base py-2 px-3 rounded-lg font-medium"
                      onClick={() => handleSnap(index + 1)}
                      data-testid={`mobile-link-${item.id}`}
                    >
                      {item.label}
                    </Button>
                  </SheetClose>
                ))}
                {reduceMotion && (
                  <p className="text-xs text-muted-foreground/80 mt-2">
                    Motion effects are reduced to respect your accessibility
                    settings.
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile menu is rendered via the shadcn Sheet component (Radix) */}
      {/* Desktop preview sheet: shows a phone-sized iframe to quickly test responsive layout */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent
          side="bottom"
          className="max-w-3xl mx-auto rounded-lg p-0 bg-black/90"
        >
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
    </header>
  );
}
