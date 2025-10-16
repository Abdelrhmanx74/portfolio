"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type SmoothContext = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number },
  ) => void;
  snapToSection: (index: number) => void;
  currentSection: number;
  sections: HTMLElement[];
  reduceMotion: boolean;
} | null;

const SmoothScrollContext = createContext<SmoothContext>(null);

type LenisInstance = {
  scroll: number;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; duration?: number },
  ) => void;
  raf: (time: number) => void;
  destroy: () => void;
};

const SCROLL_SELECTOR = "[data-scroll-section]";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisInstance | null>(null);
  const rafRef = useRef<number | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isSnapEnabled, setIsSnapEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduceMotion = () => setReduceMotion(media.matches);
    updateReduceMotion();
    media.addEventListener("change", updateReduceMotion);

    return () => media.removeEventListener("change", updateReduceMotion);
  }, []);

  useEffect(() => {
    // Only run Lenis on larger screens where snapping is enabled
    if (reduceMotion || typeof window === "undefined" || !isSnapEnabled) {
      return () => undefined;
    }

    let isMounted = true;

    const startLenis = async () => {
      const { default: Lenis } = await import("lenis");
      if (!isMounted) return;

      const lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        smoothTouch: false,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }) as LenisInstance;

      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };

      rafRef.current = requestAnimationFrame(raf);
    };

    startLenis();

    return () => {
      isMounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [reduceMotion, isSnapEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Enable snapping on all screen sizes (mobile and desktop)
    setIsSnapEnabled(true);

    const collectSections = () => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(SCROLL_SELECTOR),
      );
      sectionsRef.current = nodes;
      setSections(nodes);
    };

    collectSections();

    const pickClosestSectionToViewportCenter = () => {
      if (!sectionsRef.current.length) return;

      const viewportCenter = window.innerHeight / 2;
      let bestIndex = -1;
      let bestDistance = Number.POSITIVE_INFINITY;

      sectionsRef.current.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      });

      if (bestIndex !== -1 && bestIndex !== currentSection) {
        setCurrentSection(bestIndex);
      }
    };

    const observer = new IntersectionObserver(
      pickClosestSectionToViewportCenter,
      {
        rootMargin: "0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sectionsRef.current.forEach((section) => observer.observe(section));

    const resizeObserver = new ResizeObserver(() => {
      observer.disconnect();
      collectSections();
      sectionsRef.current.forEach((section) => observer.observe(section));
      // re-evaluate on resize
      pickClosestSectionToViewportCenter();
    });

    sectionsRef.current.forEach((section) => resizeObserver.observe(section));

    // Also listen for window resize / orientation changes to recompute
    const onWindowResize = () => pickClosestSectionToViewportCenter();
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("orientationchange", onWindowResize);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("orientationchange", onWindowResize);
    };
  }, []);

  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options?: { offset?: number }) => {
      const lenis = lenisRef.current;

      // Always recalculate the header offset at scroll time
      const header =
        typeof document !== "undefined"
          ? (document.querySelector(
              '[data-testid="header-navigation"]',
            ) as HTMLElement | null)
          : null;
      const headerOffset = header?.offsetHeight ?? 0;
      // For Lenis, offset should be negative so the scroll lands below the navbar
      const lenisOffset = -(options?.offset ?? headerOffset);
      const offset = options?.offset ?? headerOffset;

      // Debug log for troubleshooting
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log(
          "[SmoothScroll] Scrolling to:",
          target,
          "with offset:",
          offset,
          "header height:",
          headerOffset,
          "header element:",
          header,
        );
      }

      if (lenis && !reduceMotion) {
        lenis.scrollTo(target, { offset: lenisOffset });
        return;
      }

      const element =
        typeof target === "number"
          ? null
          : typeof target === "string"
            ? document.querySelector<HTMLElement>(target)
            : target;

      if (typeof target === "number") {
        window.scrollTo({
          top: target - offset,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      } else if (element) {
        const top =
          element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      }
    },
    [reduceMotion],
  );

  const snapToSection = useCallback(
    (index: number) => {
      if (!sectionsRef.current.length) return;
      const clamped = Math.max(
        0,
        Math.min(sectionsRef.current.length - 1, index),
      );
      const target = sectionsRef.current[clamped];
      if (!target) return;
      // Use a reduced offset for snapping so the title is closer to the navbar (especially on desktop)
      const header =
        typeof document !== "undefined"
          ? (document.querySelector(
              '[data-testid="header-navigation"]',
            ) as HTMLElement | null)
          : null;
      // Subtract 8px to bring the title closer to the navbar
      const headerOffset = (header?.offsetHeight ?? 0) - 8;
      scrollTo(target, { offset: headerOffset });
      setCurrentSection(clamped);
    },
    [scrollTo],
  );

  // --- Snapping handlers (wheel / touch / keyboard) ---
  useEffect(() => {
    // Only attach snapping handlers on large screens (desktop > tablet)
    if (typeof window === "undefined" || reduceMotion || !isSnapEnabled) return;

    let wheelTimeout: number | null = null;
    let lastWheel = 0;
    const WHEEL_DEBOUNCE = 80; // ms

    const isModalOpen = () => {
      // Detect open Radix Dialog (overlay/content carry data-state="open")
      return !!document.querySelector(
        '[data-slot="dialog-content"][data-state="open"], [data-slot="dialog-overlay"][data-state="open"], [role="dialog"][data-state="open"]',
      );
    };

    const onWheel = (e: WheelEvent) => {
      if (isModalOpen()) return;
      // ignore tiny deltas
      const delta = Math.abs(e.deltaY || 0);
      if (delta < 8) return;

      const now = Date.now();
      // throttle rapid wheel events and only act when a burst finishes
      lastWheel = now;
      if (wheelTimeout) window.clearTimeout(wheelTimeout);
      wheelTimeout = window.setTimeout(() => {
        if (Date.now() - lastWheel < WHEEL_DEBOUNCE) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = Math.max(
          0,
          Math.min(sectionsRef.current.length - 1, currentSection + direction),
        );
        if (nextIndex !== currentSection) {
          snapToSection(nextIndex);
        }
        wheelTimeout = null;
      }, WHEEL_DEBOUNCE);
    };

    // Handle keyboard navigation
    const onKey = (e: KeyboardEvent) => {
      if (isModalOpen()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        snapToSection(currentSection + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        snapToSection(currentSection - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        snapToSection(0);
      } else if (e.key === "End") {
        e.preventDefault();
        snapToSection(sectionsRef.current.length - 1);
      }
    };

    // Touch: detect swipe velocity / direction
    let touchStartY: number | null = null;
    let touchStartTime = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (isModalOpen()) return;
      touchStartY = e.touches[0]?.clientY ?? null;
      touchStartTime = Date.now();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isModalOpen()) return;
      if (touchStartY === null) return;
      const endY = (e.changedTouches && e.changedTouches[0]?.clientY) ?? null;
      if (endY === null) return;
      const dy = touchStartY - endY;
      const dt = Date.now() - touchStartTime;
      // simple velocity check
      const velocity = Math.abs(dy) / Math.max(1, dt);
      if (Math.abs(dy) < 24 && velocity < 0.2) return;
      const direction = dy > 0 ? 1 : -1;
      snapToSection(currentSection + direction);
      touchStartY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      if (wheelTimeout) window.clearTimeout(wheelTimeout);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [currentSection, reduceMotion, snapToSection, isSnapEnabled]);

  return (
    <SmoothScrollContext.Provider
      value={{
        scrollTo,
        snapToSection,
        currentSection,
        sections,
        reduceMotion,
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx)
    throw new Error(
      "useSmoothScroll must be used within a SmoothScrollProvider",
    );
  return ctx;
}
null;
