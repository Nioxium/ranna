import { Link } from "@tanstack/react-router";
import type { User } from "@/data/types";
import { formatCount } from "@/lib/store";
import { FollowButton } from "./ActionButtons";
import { UserAvatar } from "./UserAvatar";

export function CreatorCard({ user }: { user: User }) {
  return (
    <article className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to="/profile/$username" params={{ username: user.username }}>
        <UserAvatar user={user} size="lg" />
      </Link>
      <Link
        to="/profile/$username"
        params={{ username: user.username }}
        className="mt-3 font-display text-lg hover:text-primary"
      >
        {user.name}
      </Link>
      <p className="text-xs text-muted-foreground">@{user.username}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{user.recipeCount}</span> Recipes
        <span className="mx-2 text-border">·</span>
        <span className="font-semibold text-foreground">{formatCount(user.followers)}</span>{" "}
        Followers
      </p>
      <FollowButton userId={user.id} className="mt-4 w-full" />
    </article>
  );
}
