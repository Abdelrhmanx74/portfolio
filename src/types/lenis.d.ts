declare module 'lenis' {
    type LenisOptions = any;
    class Lenis {
        constructor(opts?: LenisOptions);
        raf(time: number): void;
        destroy(): void;
        scrollTo(target: any, options?: { offset?: number; duration?: number }): void;
        get scroll(): number;
    }
    export default Lenis;
}
