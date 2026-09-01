import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-secondary/40 px-6 py-16 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-card text-primary shadow-card">
        {icon}
      </div>
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionTo && (
        <Button asChild className="mt-6 rounded-full px-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link to={actionTo as any}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
