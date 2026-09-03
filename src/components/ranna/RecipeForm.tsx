import { useNavigate } from "@tanstack/react-router";
import { GripVertical, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cuisines, difficulties, images, mealTypes } from "@/data/mock";
import { useStore } from "@/lib/store";
import type { Difficulty, Recipe } from "@/data/types";
import { RecipeCard } from "./RecipeCard";

interface Row {
  id: string;
  quantity: string;
  unit: string;
  name: string;
}
interface StepRow {
  id: string;
  title: string;
  description: string;
}

const uid = () => Math.random().toString(36).slice(2, 9);

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function RecipeForm({ existing }: { existing?: Recipe }) {
  const { addRecipe, updateRecipe, deleteRecipe, currentUser } = useStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [image, setImage] = useState(existing?.image ?? images.kacchi);
  const [cuisine, setCuisine] = useState(existing?.cuisine ?? "Bangladeshi");
  const [mealType, setMealType] = useState(existing?.mealType ?? "Dinner");
  const [difficulty, setDifficulty] = useState<Difficulty>(existing?.difficulty ?? "Easy");
  const [prep, setPrep] = useState(String(existing?.prepMinutes ?? 15));
  const [cook, setCook] = useState(String(existing?.cookMinutes ?? 30));
  const [servings, setServings] = useState(String(existing?.servings ?? 4));
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [rows, setRows] = useState<Row[]>(
    existing
      ? existing.ingredients.flatMap((g) =>
          g.items.map((i) => ({ id: uid(), quantity: "", unit: "", name: i })),
        )
      : [{ id: uid(), quantity: "", unit: "", name: "" }],
  );
  const [steps, setSteps] = useState<StepRow[]>(
    existing?.steps.map((s) => ({ id: uid(), title: s.title, description: s.description })) ?? [
      { id: uid(), title: "", description: "" },
    ],
  );
  const [dragId, setDragId] = useState<string | null>(null);

  function buildRecipe(): Recipe {
    const total = Number(prep || 0) + Number(cook || 0);
    return {
      id: existing?.id ?? `r-${uid()}`,
      slug: existing?.slug ?? slugify(title || "untitled-recipe"),
      title: title || "Untitled recipe",
      description,
      image,
      cuisine,
      mealType,
      category: cuisine === "Bangladeshi" ? "Bengali" : cuisine,
      difficulty,
      prepMinutes: Number(prep || 0),
      cookMinutes: Number(cook || 0),
      totalMinutes: total,
      servings: Number(servings || 1),
      rating: existing?.rating ?? 5,
      likes: existing?.likes ?? 0,
      commentCount: existing?.commentCount ?? 0,
      authorId: existing?.authorId ?? currentUser.id,
      tags,
      dietary: existing?.dietary ?? [],
      ingredients: [
        {
          group: "Ingredients",
          items: rows
            .filter((r) => r.name.trim())
            .map((r) => [r.quantity, r.unit, r.name].filter(Boolean).join(" ").trim()),
        },
      ],
      steps: steps
        .filter((s) => s.title.trim() || s.description.trim())
        .map((s) => ({ title: s.title || "Step", description: s.description })),
      createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
    };
  }

  function publish() {
    if (!title.trim()) {
      toast.error("Give your recipe a title first");
      return;
    }
    const recipe = buildRecipe();
    if (existing) {
      updateRecipe(existing.id, recipe);
      toast.success("Recipe updated ✓");
    } else {
      addRecipe(recipe);
      toast.success("Recipe published to the Ranna community ✓");
    }
    navigate({ to: "/recipe/$slug", params: { slug: recipe.slug } });
  }

  function reorder(targetId: string) {
    if (!dragId || dragId === targetId) return;
    setSteps((prev) => {
      const from = prev.findIndex((s) => s.id === dragId);
      const to = prev.findIndex((s) => s.id === targetId);
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  const section = "rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8";

  return (
    <div className="grid gap-6">
      <section className={section}>
        <h2 className="font-display text-2xl">Basic Information</h2>
        <div className="mt-6 grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="title">Recipe title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dhaka Style Kacchi Biriyani"
              className="rounded-xl"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Short description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people what makes this dish special..."
              className="min-h-24 rounded-xl"
            />
          </div>
          <div className="grid gap-2">
            <Label>Cover image</Label>
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={image}
                alt="Recipe cover preview"
                loading="lazy"
                className="h-28 w-40 rounded-xl border border-border object-cover"
              />
              <div className="flex flex-wrap gap-2">
                {Object.entries(images)
                  .filter(([k]) => k !== "hero")
                  .map(([k, src]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setImage(src)}
                      aria-label={`Use ${k} image`}
                      className="size-12 overflow-hidden rounded-lg border-2 border-transparent transition-all hover:scale-105 data-[on=true]:border-primary"
                      data-on={image === src}
                    >
                      <img src={src} alt="" loading="lazy" className="size-full object-cover" />
                    </button>
                  ))}
                <label className="flex size-12 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground hover:text-primary">
                  <ImagePlus className="size-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImage(URL.createObjectURL(file));
                        toast.success("Cover image updated");
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={section}>
        <h2 className="font-display text-2xl">Recipe Details</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-2">
            <Label>Cuisine</Label>
            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cuisines.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Meal type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mealTypes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prep">Preparation time (min)</Label>
            <Input id="prep" value={prep} onChange={(e) => setPrep(e.target.value)} className="rounded-xl" inputMode="numeric" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cook">Cooking time (min)</Label>
            <Input id="cook" value={cook} onChange={(e) => setCook(e.target.value)} className="rounded-xl" inputMode="numeric" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="servings">Servings</Label>
            <Input id="servings" value={servings} onChange={(e) => setServings(e.target.value)} className="rounded-xl" inputMode="numeric" />
          </div>
        </div>
      </section>

      <section className={section}>
        <h2 className="font-display text-2xl">Ingredients</h2>
        <div className="mt-6 space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-[70px_90px_1fr_auto] gap-2">
              <Input
                value={row.quantity}
                placeholder="1"
                aria-label="Quantity"
                className="rounded-xl"
                onChange={(e) =>
                  setRows((r) => r.map((x) => (x.id === row.id ? { ...x, quantity: e.target.value } : x)))
                }
              />
              <Input
                value={row.unit}
                placeholder="kg"
                aria-label="Unit"
                className="rounded-xl"
                onChange={(e) =>
                  setRows((r) => r.map((x) => (x.id === row.id ? { ...x, unit: e.target.value } : x)))
                }
              />
              <Input
                value={row.name}
                placeholder="Mutton, cut into pieces"
                aria-label="Ingredient"
                className="rounded-xl"
                onChange={(e) =>
                  setRows((r) => r.map((x) => (x.id === row.id ? { ...x, name: e.target.value } : x)))
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove ingredient"
                onClick={() => setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== row.id) : r))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => setRows((r) => [...r, { id: uid(), quantity: "", unit: "", name: "" }])}
        >
          <Plus className="size-4" /> Add Ingredient
        </Button>
      </section>

      <section className={section}>
        <h2 className="font-display text-2xl">Cooking Steps</h2>
        <p className="mt-1 text-sm text-muted-foreground">Drag a step by its handle to reorder.</p>
        <div className="mt-6 space-y-4">
          {steps.map((step, i) => (
            <div
              key={step.id}
              draggable
              onDragStart={() => setDragId(step.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                reorder(step.id);
                setDragId(null);
              }}
              className="flex gap-3 rounded-2xl border border-border bg-secondary/40 p-4"
            >
              <span className="mt-2 cursor-grab text-muted-foreground active:cursor-grabbing">
                <GripVertical className="size-4" />
              </span>
              <span className="mt-1 font-display text-xl text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 space-y-2">
                <Input
                  value={step.title}
                  placeholder="Step title"
                  className="rounded-xl bg-card"
                  onChange={(e) =>
                    setSteps((s) => s.map((x) => (x.id === step.id ? { ...x, title: e.target.value } : x)))
                  }
                />
                <Textarea
                  value={step.description}
                  placeholder="Describe what to do..."
                  className="min-h-20 rounded-xl bg-card"
                  onChange={(e) =>
                    setSteps((s) =>
                      s.map((x) => (x.id === step.id ? { ...x, description: e.target.value } : x)),
                    )
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove step"
                onClick={() => setSteps((s) => (s.length > 1 ? s.filter((x) => x.id !== step.id) : s))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => setSteps((s) => [...s, { id: uid(), title: "", description: "" }])}
        >
          <Plus className="size-4" /> Add Step
        </Button>
      </section>

      <section className={section}>
        <h2 className="font-display text-2xl">Tags</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
            >
              #{t}
              <button type="button" aria-label={`Remove ${t}`} onClick={() => setTags((x) => x.filter((y) => y !== t))}>
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const t = tagInput.trim().replace(/^#/, "");
                if (t) setTags((x) => Array.from(new Set([...x, t])));
                setTagInput("");
              }
            }}
            placeholder="Add a tag and press Enter (e.g. Kacchi)"
            className="rounded-xl"
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 pb-4">
        <Button className="rounded-full px-7" onClick={publish}>
          {existing ? "Save Changes" : "Publish Recipe"}
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => toast.success("Draft saved ✓")}
        >
          Save Draft
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="rounded-full">
              Preview Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Card preview</DialogTitle>
            </DialogHeader>
            <RecipeCard recipe={buildRecipe()} />
          </DialogContent>
        </Dialog>
        {existing && (
          <Button
            variant="ghost"
            className="ml-auto rounded-full text-destructive hover:text-destructive"
            onClick={() => {
              deleteRecipe(existing.id);
              toast.success("Recipe deleted");
              navigate({ to: "/explore" });
            }}
          >
            <Trash2 className="size-4" /> Delete recipe
          </Button>
        )}
      </div>
    </div>
  );
}
