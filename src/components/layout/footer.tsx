import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/70">
      <div className="container flex flex-col gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span>CodeDiff Pro</span>
        </div>
        <p>
          Built for fast local-first comparison, export, and developer review
          workflows.
        </p>
      </div>
    </footer>
  );
}
