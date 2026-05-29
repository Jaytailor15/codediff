import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/70 backdrop-blur-md">
      <div className="container flex flex-col gap-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#0b0f19] border border-border/40 shadow-glow shrink-0">
            <svg className="h-4 w-4" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 20V44L46 12" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 48L50 20V36" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="32" cy="32" r="8" stroke="#e2e8f0" strokeWidth="4.5" fill="none"/>
            </svg>
          </div>
          <span className="font-bold text-foreground">CodeDiff Pro</span>
        </div>
        
        <p className="max-w-md text-left md:text-center leading-relaxed">
          Built for local-first difference tracking, file comparison, and developer integrations.
        </p>

        <div className="flex items-center gap-4 font-semibold">
          <Link href="/docs" className="hover:text-primary transition-colors">
            Docs
          </Link>
          <span>·</span>
          <Link href="/docs?section=privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/docs?section=license" className="hover:text-primary transition-colors">
            License
          </Link>
        </div>
      </div>
    </footer>
  );
}
