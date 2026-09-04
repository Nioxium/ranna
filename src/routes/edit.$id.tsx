import { createFileRoute, Link } from "@tanstack/react-router";
import { RecipeForm } from "@/components/ranna/RecipeForm";
import { EmptyState } from "@/components/ranna/EmptyState";
import { ChefHat } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/edit/$id")({
  head: () => ({
    meta: [
      { title: "Edit Recipe — Ranna" },
      { name: "description", content: "Update your recipe details, ingredients and steps on Ranna." },
      { property: "og:title", content: "Edit Recipe — Ranna" },
      { property: "og:description", content: "Update your published recipe on Ranna." },
    ],
  }),
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  const { getRecipe } = useStore();
  const recipe = getRecipe(id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="font-display text-4xl sm:text-5xl">Edit Recipe</h1>
        <p className="mt-3 text-muted-foreground">
          {recipe ? (
            <>
              Editing{" "}
              <Link
                to="/recipe/$slug"
                params={{ slug: recipe.slug }}
                className="text-primary hover:underline"
              >
                {recipe.title}
              </Link>
            </>
          ) : (
            "This recipe could not be found."
          )}
        </p>
      </header>
      {recipe ? (
        <RecipeForm existing={recipe} />
      ) : (
        <EmptyState
          icon={<ChefHat className="size-7" />}
          title="Recipe not found"
          description="It may have been deleted. Browse the community for more inspiration."
          actionLabel="Explore Recipes"
          actionTo="/explore"
        />
      )}
    </div>
  );
}
