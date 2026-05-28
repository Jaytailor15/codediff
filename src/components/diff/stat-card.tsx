import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { DESIGN_TOKENS } from "@/lib/style-config";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "green" | "red" | "amber" | "neutral";
}

const toneClasses = {
  green: "text-emerald-500 bg-emerald-500/10",
  red: "text-rose-500 bg-rose-500/10",
  amber: "text-amber-500 bg-amber-500/10",
  neutral: "text-muted-foreground bg-muted"
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral"
}: StatCardProps) {
  const st = DESIGN_TOKENS.statCard;
  return (
    <div className={cn("flex w-full items-center gap-2.5 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition duration-200", st.padding)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-md shrink-0 shadow-inner",
          st.badgeSize,
          toneClasses[tone]
        )}
      >
        <Icon className={st.iconSize} />
      </span>
      <div className="min-w-0 flex flex-col justify-center">
        <div className={st.valueFont}>
          {value}
        </div>
        <div className={st.labelFont}>
          {label}
        </div>
      </div>
    </div>
  );
}
