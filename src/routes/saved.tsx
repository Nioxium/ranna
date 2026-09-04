import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ranna/EmptyState";
import { RecipeGrid } from "@/components/ranna/RecipeCard";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Your Saved Recipes — Ranna" },
      {
        name: "description",
        content: "Your saved recipes on Ranna, organised into collections you can cook from later.",
      },
      { property: "og:title", content: "Your Saved Recipes — Ranna" },
      { property: "og:description", content: "Recipes you saved, organised into collections." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { collections, saved, recipes, addCollection } = useStore();
  const [active, setActive] = useState<string>("all");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const savedRecipes = recipes.filter((r) => saved.includes(r.id));
  const current = collections.find((c) => c.id === active);
  const visible = current
    ? recipes.filter((r) => current.recipeIds.includes(r.id))
    : savedRecipes;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Your Saved Recipes</h1>
          <p className="mt-3 text-muted-foreground">
            {savedRecipes.length} recipes waiting in your recipe box.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="size-4" /> New Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">New collection</DialogTitle>
            </DialogHeader>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramadan Iftar"
              className="rounded-xl"
            />
            <DialogFooter>
              <Button
                className="rounded-full"
                onClick={() => {
                  if (!name.trim()) return;
                  addCollection(name.trim());
                  toast.success(`Collection “${name.trim()}” created ✓`);
                  setName("");
                  setOpen(false);
                }}
              >
                Create collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="no-scrollbar mt-8 flex gap-3 overflow-x-auto pb-2">
        {[{ id: "all", name: "All saved", count: savedRecipes.length }, ...collections.map((c) => ({ id: c.id, name: c.name, count: c.recipeIds.length }))].map(
          (c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={cn(
                "shrink-0 rounded-2xl border border-border bg-card px-5 py-4 text-left shadow-card transition-all hover:-translate-y-0.5",
                active === c.id && "border-primary bg-primary/5",
              )}
            >
              <p className="font-display text-lg">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.count} recipes</p>
            </button>
          ),
        )}
      </div>

      <div className="mt-10">
        {visible.length ? (
          <RecipeGrid recipes={visible} columns="wide" />
        ) : (
          <EmptyState
            icon={<Bookmark className="size-7" />}
            title="Your recipe box is empty"
            description="Save recipes you love and they'll appear here."
            actionLabel="Explore Recipes"
            actionTo="/explore"
          />
        )}
      </div>
    </div>
  );
}
