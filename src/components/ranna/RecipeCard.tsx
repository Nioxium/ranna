import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import type { Recipe } from "@/data/types";
import { formatTime, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { LikeButton, SaveButton } from "./ActionButtons";
import { Rating } from "./Rating";
import { UserAvatar } from "./UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";

export function RecipeCard({ recipe, className }: { recipe: Recipe; className?: string }) {
  const { getUser } = useStore();
  const author = getUser(recipe.authorId);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Link
        to="/recipe/$slug"
        params={{ slug: recipe.slug }}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {recipe.category} · {recipe.mealType}
          </p>
          <h3 className="line-clamp-2 font-display text-lg leading-snug">{recipe.title}</h3>
          <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
            <span className="flex min-w-0 items-center gap-2">
              {author && <UserAvatar user={author} size="xs" />}
              <span className="truncate text-xs text-muted-foreground">{author?.name}</span>
            </span>
            <Rating value={recipe.rating} className="text-xs" />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formatTime(recipe.totalMinutes)}
            </span>
            <LikeButton recipeId={recipe.id} baseCount={recipe.likes} />
          </div>
        </div>
      </Link>
      <SaveButton recipeId={recipe.id} className="absolute right-3 top-3 shadow-card" />
    </article>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

export function RecipeGrid({
  recipes,
  loading = false,
  columns = "responsive",
}: {
  recipes: Recipe[];
  loading?: boolean;
  columns?: "responsive" | "wide";
}) {
  const grid =
    columns === "wide"
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";

  if (loading) {
    return (
      <div className={grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={grid}>
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  );
}
