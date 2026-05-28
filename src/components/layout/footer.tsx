import Link from "next/link";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/70 backdrop-blur-md">
      <div className="container flex flex-col gap-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between px-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
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
