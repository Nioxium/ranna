import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EmptyState } from "@/components/ranna/EmptyState";
import { RecipeGrid } from "@/components/ranna/RecipeCard";
import { SearchBar } from "@/components/ranna/SearchBar";
import {
  cuisines,
  dietaryOptions,
  difficulties,
  mealTypes,
  timeFilters,
} from "@/data/mock";
import { useStore } from "@/lib/store";

interface ExploreSearch {
  category?: string | undefined;
  q?: string | undefined;
}

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore Recipes — Ranna" },
      {
        name: "description",
        content:
          "Filter recipes by cuisine, meal type, cooking time, difficulty and diet. Find something delicious for every mood.",
      },
      { property: "og:title", content: "Explore Recipes — Ranna" },
      {
        property: "og:description",
        content: "Find something delicious for every mood, meal and moment.",
      },
    ],
  }),
  component: Explore,
});

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="border-b border-border py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="space-y-2.5">
        {options.map((o) => (
          <div key={o} className="flex items-center gap-2.5">
            <Checkbox
              id={`${title}-${o}`}
              checked={selected.includes(o)}
              onCheckedChange={() => onToggle(o)}
            />
            <Label htmlFor={`${title}-${o}`} className="text-sm font-normal text-muted-foreground">
              {o}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

function Explore() {
  const { category } = Route.useSearch();
  const { recipes } = useStore();
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [meal, setMeal] = useState<string[]>([]);
  const [time, setTime] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [sort, setSort] = useState<string>("Popular");

  const filtered = useMemo(() => {
    let list = recipes.slice();
    if (category) list = list.filter((r) => r.category === category);
    if (cuisine.length) list = list.filter((r) => cuisine.includes(r.cuisine));
    if (meal.length) list = list.filter((r) => meal.includes(r.mealType));
    if (difficulty.length) list = list.filter((r) => difficulty.includes(r.difficulty));
    if (dietary.length) list = list.filter((r) => dietary.every((d) => r.dietary.includes(d)));
    if (time.length) {
      list = list.filter((r) =>
        time.some((label) => {
          const f = timeFilters.find((t) => t.label === label)!;
          return label === "1+ hour" ? r.totalMinutes >= 60 : r.totalMinutes <= f.max;
        }),
      );
    }
    switch (sort) {
      case "Highest Rated":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "Newest":
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "Quickest":
        list.sort((a, b) => a.totalMinutes - b.totalMinutes);
        break;
      default:
        list.sort((a, b) => b.likes - a.likes);
    }
    return list;
  }, [recipes, category, cuisine, meal, time, difficulty, dietary, sort]);

  const activeCount = cuisine.length + meal.length + time.length + difficulty.length + dietary.length;

  const filters = (
    <div className="animate-rise">
      <FilterGroup title="Cuisine" options={cuisines} selected={cuisine} onToggle={(v) => setCuisine(toggle(cuisine, v))} />
      <FilterGroup title="Meal Type" options={mealTypes} selected={meal} onToggle={(v) => setMeal(toggle(meal, v))} />
      <FilterGroup
        title="Cooking Time"
        options={timeFilters.map((t) => t.label)}
        selected={time}
        onToggle={(v) => setTime(toggle(time, v))}
      />
      <FilterGroup title="Difficulty" options={difficulties} selected={difficulty} onToggle={(v) => setDifficulty(toggle(difficulty, v))} />
      <FilterGroup title="Dietary" options={dietaryOptions} selected={dietary} onToggle={(v) => setDietary(toggle(dietary, v))} />
      {activeCount > 0 && (
        <Button
          variant="ghost"
          className="mt-4 w-full rounded-full text-primary"
          onClick={() => {
            setCuisine([]);
            setMeal([]);
            setTime([]);
            setDifficulty([]);
            setDietary([]);
          }}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl">Explore Recipes</h1>
        <p className="mt-3 text-muted-foreground">
          Find something delicious for every mood, meal and moment.
        </p>
      </header>
      <div className="mt-8 max-w-2xl">
        <SearchBar />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-display text-xl">Filters</h2>
            {filters}
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> recipes
              {category ? ` in ${category}` : ""}
            </p>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="rounded-full lg:hidden">
                    <SlidersHorizontal className="size-4" /> Filters
                    {activeCount > 0 && (
                      <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                        {activeCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto p-6">
                  <SheetTitle className="font-display text-2xl">Filters</SheetTitle>
                  <div className="mt-4">{filters}</div>
                </SheetContent>
              </Sheet>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-44 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Popular", "Highest Rated", "Newest", "Quickest"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length ? (
            <RecipeGrid recipes={filtered} columns="wide" />
          ) : (
            <EmptyState
              icon={<UtensilsCrossed className="size-7" />}
              title="No recipes match those filters"
              description="Try removing a filter or two — there is always something cooking."
              actionLabel="Browse all recipes"
              actionTo="/explore"
            />
          )}
        </div>
      </div>
    </div>
  );
}
