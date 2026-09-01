import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  showValue = true,
  size = 14,
  className,
}: {
  value: number;
  showValue?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star size={size} className="fill-[var(--gold)] text-[var(--gold)]" />
      {showValue && <span className="font-medium tabular-nums">{value.toFixed(1)}</span>}
    </span>
  );
}

export function StarRow({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(value)
              ? "fill-[var(--gold)] text-[var(--gold)]"
              : "text-muted-foreground/40"
          }
        />
      ))}
    </span>
  );
}
