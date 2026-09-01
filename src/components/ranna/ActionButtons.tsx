import { Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCount, useStore } from "@/lib/store";

export function SaveButton({
  recipeId,
  variant = "icon",
  className,
}: {
  recipeId: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { isSaved, toggleSave, collections } = useStore();
  const [pop, setPop] = useState(false);
  const saved = isSaved(recipeId);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleSave(recipeId);
    setPop(true);
    setTimeout(() => setPop(false), 340);
    toast.success(
      next
        ? `Recipe saved to ${collections[0]?.name ?? "Saved"} ✓`
        : "Removed from your saved recipes",
    );
  }

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant={saved ? "default" : "outline"}
        onClick={onClick}
        className={cn("rounded-full", className)}
      >
        <Bookmark className={cn("size-4", saved && "fill-current", pop && "animate-pop")} />
        {saved ? "Saved" : "Save Recipe"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={saved ? "Remove from saved" : "Save recipe"}
      aria-pressed={saved}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-all hover:bg-card hover:scale-105",
        saved && "bg-primary text-primary-foreground hover:bg-primary",
        className,
      )}
    >
      <Bookmark className={cn("size-4", saved && "fill-current", pop && "animate-pop")} />
    </button>
  );
}

export function LikeButton({
  recipeId,
  baseCount,
  className,
  showCount = true,
}: {
  recipeId: string;
  baseCount: number;
  className?: string;
  showCount?: boolean;
}) {
  const { isLiked, toggleLike } = useStore();
  const [pop, setPop] = useState(false);
  const liked = isLiked(recipeId);

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "Unlike recipe" : "Like recipe"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(recipeId);
        setPop(true);
        setTimeout(() => setPop(false), 340);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary",
        liked && "text-primary",
        className,
      )}
    >
      <Heart className={cn("size-4", liked && "fill-current", pop && "animate-pop")} />
      {showCount && (
        <span className="text-sm tabular-nums">{formatCount(baseCount + (liked ? 1 : 0))}</span>
      )}
    </button>
  );
}

export function FollowButton({
  userId,
  size = "sm",
  className,
}: {
  userId: string;
  size?: "sm" | "default";
  className?: string;
}) {
  const { isFollowing, toggleFollow, getUser } = useStore();
  const following = isFollowing(userId);

  return (
    <Button
      type="button"
      size={size}
      variant={following ? "outline" : "default"}
      className={cn("rounded-full", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = toggleFollow(userId);
        toast.success(
          next
            ? `You now follow ${getUser(userId)?.name ?? "this creator"}`
            : `Unfollowed ${getUser(userId)?.name ?? "creator"}`,
        );
      }}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
