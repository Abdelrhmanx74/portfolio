"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

const CodeBlock = dynamic(() => import("@/components/ui/CodeBlock"), {
    ssr: false,
    loading: () => (
        <div className="p-6 text-xs text-muted-foreground">Loading snippet…</div>
    ),
});

export type ShowcaseItem = {
    id: string;
    repo: string;
    ref: string;
    file: string;
    title: string;
    description: string;
    code?: string;
    fetchError?: string;
};

const MAX_MOBILE_ITEMS = 3;
const MAX_DESKTOP_ITEMS = 4;

type ShowcaseClientProps = {
    highlights: ShowcaseItem[];
};

export default function ShowcaseClient({ highlights }: ShowcaseClientProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const node = containerRef.current;
        if (!node) {
            setHydrated(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setHydrated(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px 0px" },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const visibleHighlights = useMemo(() => {
        if (!highlights.length) return [];
        const limit = isMobile ? MAX_MOBILE_ITEMS : MAX_DESKTOP_ITEMS;
        return highlights.slice(0, limit);
    }, [highlights, isMobile]);

    const selectedItem =
        selectedIndex !== null ? highlights[selectedIndex] : undefined;

    const openItem = (index: number) => {
        setSelectedIndex(index);
        setOpen(true);
    };

    const stepSelection = (step: 1 | -1) => {
        if (selectedIndex === null) return;
        const nextIndex = selectedIndex + step;
        if (nextIndex < 0 || nextIndex >= highlights.length) return;
        setSelectedIndex(nextIndex);
    };


    // Keyboard navigation for dialog
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                stepSelection(-1);
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                stepSelection(1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, selectedIndex, highlights.length]);

    if (!highlights.length) {
        return null;
    }

    return (
        <section
            id="showcase"
            data-scroll-section
            className="py-12 sm:py-24 px-6"
            ref={containerRef}
        >
            <div className="max-w-5xl mx-auto">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Showcase</h2>
                        <p className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground">
                            Work that shipped. A selection of projects that delivered results
                            and taught me something new.
                        </p>
                    </div>
                    {hydrated && highlights.length > visibleHighlights.length && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSelectedIndex(visibleHighlights.length);
                                setOpen(true);
                            }}
                        >
                            View all
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-testid="showcase-grid">
                    {(hydrated ? visibleHighlights : Array.from({ length: 4 })).map((item, index) => {
                        if (!hydrated) {
                            return (
                                <article
                                    key={`placeholder-${index}`}
                                    className="flex h-full flex-col gap-4 rounded-3xl border border-border/60 bg-card/40 p-6"
                                >
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-4 w-1/2 rounded bg-muted" />
                                        <div className="h-3 w-3/4 rounded bg-muted" />
                                        <div className="h-3 w-2/3 rounded bg-muted" />
                                    </div>
                                </article>
                            );
                        }

                        const data = item as ShowcaseItem;
                        const globalIndex = highlights.findIndex((highlight) => highlight.id === data.id);
                        const safeIndex = globalIndex === -1 ? highlights.indexOf(data) : globalIndex;

                        return (
                            <article
                                key={data.id}
                                className="flex h-full flex-col gap-4 rounded-3xl border border-border/60 bg-card/40 p-6 transition-all hover-elevate"
                            >
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-sm sm:text-base md:text-lg font-medium text-foreground line-clamp-2">
                                        {data.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-4">
                                        {data.description}
                                    </p>
                                </div>
                                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                        {data.repo.split("/").pop()} @{data.ref?.slice(0, 7)}
                                    </span>
                                    <Button variant="default" size="sm" onClick={() => openItem(safeIndex)}>
                                        View
                                    </Button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {selectedItem && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-[95vw] sm:max-w-7xl p-3 sm:p-6 max-h-[90vh] overflow-hidden">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 h-full overflow-hidden">
                            <div className="max-h-[50vh] sm:max-h-[70vh] flex-1 overflow-x-hidden overflow-y-auto rounded-xl bg-black">
                                {selectedItem.code ? (
                                    <CodeBlock code={selectedItem.code} />
                                ) : (
                                    <div className="p-4 sm:p-6 text-xs sm:text-sm text-muted-foreground">
                                        No snippet captured for this highlight.
                                    </div>
                                )}
                            </div>

                            <div className="sm:w-[320px] flex flex-col gap-2 sm:gap-4 overflow-y-auto min-h-0">
                                <div className="flex flex-col gap-2 sm:gap-4">
                                    <DialogTitle className="text-sm sm:text-lg md:text-xl min-h-[40px] sm:min-h-[56px] flex items-start">
                                        {selectedItem.title}
                                    </DialogTitle>
                                    <DialogDescription className="text-xs sm:text-sm md:text-base leading-relaxed min-h-[60px] sm:min-h-[80px] flex items-start">
                                        {selectedItem.description}
                                    </DialogDescription>

                                    <div className="mt-1 sm:mt-2 space-y-1 sm:space-y-2 text-[10px] sm:text-sm text-muted-foreground break-words">
                                        <p>
                                            <strong>Repo:</strong> {selectedItem.repo}@
                                            {selectedItem.ref?.slice(0, 7)}
                                        </p>
                                        <p className="break-all">
                                            <strong>File:</strong> {selectedItem.file}
                                        </p>
                                        {selectedItem.fetchError && (
                                            <p className="text-destructive">
                                                Snapshot error: {selectedItem.fetchError}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter className="mt-auto ml-auto flex flex-row gap-2 pt-2 sm:pt-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => stepSelection(-1)}
                                        disabled={selectedIndex === 0}
                                        aria-label="Previous highlight"
                                        className="h-8 w-8 sm:h-10 sm:w-10"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => stepSelection(1)}
                                        disabled={selectedIndex === highlights.length - 1}
                                        aria-label="Next highlight"
                                        className="h-8 w-8 sm:h-10 sm:w-10"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </DialogFooter>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
}
