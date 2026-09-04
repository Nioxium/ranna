import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, SearchX, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { CreatorCard } from "@/components/ranna/CreatorCard";
import { EmptyState } from "@/components/ranna/EmptyState";
import { RecipeGrid } from "@/components/ranna/RecipeCard";
import { SearchBar } from "@/components/ranna/SearchBar";
import { categories, popularSearches } from "@/data/mock";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Search Recipes — Ranna" },
      {
        name: "description",
        content: "Search Ranna across recipe names, ingredients, creators and categories.",
      },
      { property: "og:title", content: "Search Recipes — Ranna" },
      { property: "og:description", content: "Search recipes, ingredients and creators on Ranna." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { recipes, users, recentSearches } = useStore();
  const query = q.trim().toLowerCase();

  const { matchedRecipes, matchedCreators, matchedCategories } = useMemo(() => {
    if (!query) return { matchedRecipes: [], matchedCreators: [], matchedCategories: [] };
    const matchedRecipes = recipes.filter((r) =>
      [
        r.title,
        r.description,
        r.cuisine,
        r.category,
        r.mealType,
        ...r.tags,
        ...r.ingredients.flatMap((g) => g.items),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
    const matchedCreators = users.filter((u) =>
      `${u.name} ${u.username} ${u.bio}`.toLowerCase().includes(query),
    );
    const matchedCategories = categories.filter((c) => c.name.toLowerCase().includes(query));
    return { matchedRecipes, matchedCreators, matchedCategories };
  }, [query, recipes, users]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl">Search</h1>
        <p className="mt-3 text-muted-foreground">
          Recipes, ingredients, creators and categories — all in one place.
        </p>
      </header>

      <div className="mt-8 max-w-2xl">
        <SearchBar defaultValue={q} />
      </div>

      {!query ? (
        <div className="mt-12 grid max-w-2xl gap-8">
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Clock className="size-4 text-primary" /> Recent searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.length ? (
                recentSearches.map((s) => (
                  <Link
                    key={s}
                    to="/search"
                    search={{ q: s }}
                    className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
                  >
                    {s}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent searches yet.</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="size-4 text-primary" /> Popular searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((s) => (
                <Link
                  key={s}
                  to="/search"
                  search={{ q: s }}
                  className="rounded-full bg-secondary px-4 py-1.5 text-sm hover:bg-accent"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-14">
          <section>
            <h2 className="font-display text-2xl">
              {matchedRecipes.length} recipes found for “{q}”
            </h2>
            <div className="mt-6">
              {matchedRecipes.length ? (
                <RecipeGrid recipes={matchedRecipes} columns="wide" />
              ) : (
                <EmptyState
                  icon={<SearchX className="size-7" />}
                  title="No recipes matched"
                  description="Try a different ingredient, dish or creator name."
                  actionLabel="Explore Recipes"
                  actionTo="/explore"
                />
              )}
            </div>
          </section>

          {matchedCategories.length > 0 && (
            <section>
              <h2 className="font-display text-2xl">Categories</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {matchedCategories.map((c) => (
                  <Link
                    key={c.name}
                    to="/explore"
                    search={{ category: c.name }}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary"
                  >
                    {c.emoji} {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {matchedCreators.length > 0 && (
            <section>
              <h2 className="font-display text-2xl">Creators</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {matchedCreators.map((u) => (
                  <CreatorCard key={u.id} user={u} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
