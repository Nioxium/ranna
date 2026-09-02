import { Heart, MessageCircle, Star, UserPlus } from "lucide-react";
import type { AppNotification } from "@/data/types";
import { cn } from "@/lib/utils";

const config = {
  like: { icon: Heart, tone: "text-primary bg-primary/10" },
  comment: { icon: MessageCircle, tone: "text-fresh bg-fresh/10" },
  follow: { icon: UserPlus, tone: "text-foreground bg-secondary" },
  rating: { icon: Star, tone: "text-[var(--gold)] bg-[var(--gold)]/10" },
};

export function NotificationItem({
  notification,
  compact = false,
}: {
  notification: AppNotification;
  compact?: boolean;
}) {
  const { icon: Icon, tone } = config[notification.type];
  return (
    <div
      className={cn(
        "flex items-start gap-3 border-b border-border last:border-b-0",
        compact ? "px-4 py-3" : "px-4 py-4 sm:px-5",
        !notification.read && "bg-secondary/50",
      )}
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", tone)}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className={cn("text-sm", compact && "line-clamp-2")}>{notification.text}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{notification.time}</p>
      </div>
      {!notification.read && <span className="ml-auto mt-2 size-2 shrink-0 rounded-full bg-primary" />}
    </div>
  );
}
