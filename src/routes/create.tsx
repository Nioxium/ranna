import { createFileRoute } from "@tanstack/react-router";
import { RecipeForm } from "@/components/ranna/RecipeForm";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Recipe — Ranna" },
      {
        name: "description",
        content:
          "Publish your recipe on Ranna: add ingredients, step-by-step instructions, photos and tags.",
      },
      { property: "og:title", content: "Create a Recipe — Ranna" },
      {
        property: "og:description",
        content: "Share something delicious with the Ranna community.",
      },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="font-display text-4xl sm:text-5xl">Create a Recipe</h1>
        <p className="mt-3 text-muted-foreground">
          Share something delicious with the Ranna community.
        </p>
      </header>
      <RecipeForm />
    </div>
  );
}
