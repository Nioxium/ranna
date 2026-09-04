import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ranna/EmptyState";
import { NotificationItem } from "@/components/ranna/NotificationItem";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Ranna" },
      { name: "description", content: "Likes, comments, follows and ratings on your Ranna recipes." },
      { property: "og:title", content: "Notifications — Ranna" },
      { property: "og:description", content: "Stay on top of your Ranna community activity." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, markNotificationsRead } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const t = setTimeout(markNotificationsRead, 2500);
    return () => clearTimeout(t);
  }, [markNotificationsRead]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Notifications</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {unread ? `${unread} new updates` : "You're all caught up."}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" className="rounded-full" onClick={markNotificationsRead}>
            Mark all as read
          </Button>
        )}
      </header>

      {notifications.length ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="size-7" />}
          title="Nothing here yet"
          description="When people like, comment on or save your recipes, you'll see it here."
          actionLabel="Explore Recipes"
          actionTo="/explore"
        />
      )}
    </div>
  );
}
