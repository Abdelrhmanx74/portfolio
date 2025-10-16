export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 py-12 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground" data-testid="text-footer-copyright">
            © {currentYear} Abdelrhman Mahmoud. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground" data-testid="text-footer-tagline">
            Built with React, TypeScript & Tailwind — and a bit of stubbornness
          </p>
        </div>
      </div>
    </footer>
  );
}
