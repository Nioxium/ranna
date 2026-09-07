import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, Flame, Heart, MessageCircle, Share2, Users2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FollowButton, LikeButton, SaveButton } from "@/components/ranna/ActionButtons";
import { Rating, StarRow } from "@/components/ranna/Rating";
import { ShareModal } from "@/components/ranna/ShareModal";
import { UserAvatar } from "@/components/ranna/UserAvatar";
import { RecipeCard } from "@/components/ranna/RecipeCard";
import { formatCount, formatTime, useStore } from "@/lib/store";
import type { Comment } from "@/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recipe/$slug")({
  head: ({ params }) => {
    const title = params.slug
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} — Ranna` },
        {
          name: "description",
          content: `Ingredients, step-by-step instructions and community tips for ${title} on Ranna.`,
        },
        { property: "og:title", content: `${title} — Ranna` },
        {
          property: "og:description",
          content: `A community recipe on Ranna: ${title}.`,
        },
      ],
    };
  },
  component: RecipeDetail,
});

function CommentBlock({
  comment,
  replies,
  onReply,
}: {
  comment: Comment;
  replies: Comment[];
  onReply: (parentId: string, body: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");

  return (
    <div className="border-b border-border py-6 last:border-b-0">
      <div className="flex gap-3">
        <UserAvatar
          user={{ name: comment.authorName, avatarColor: "oklch(0.5 0.06 60)" }}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{comment.authorName}</span>
            {comment.rating && <StarRow value={comment.rating} size={12} />}
            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{comment.body}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="size-3.5" /> {comment.likes}
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="font-medium hover:text-primary"
            >
              Reply
            </button>
          </div>
          {open && (
            <div className="mt-3 flex gap-2">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`Reply to ${comment.authorName}...`}
                className="min-h-16 rounded-xl"
              />
              <Button
                className="self-end rounded-full"
                onClick={() => {
                  if (!body.trim()) return;
                  onReply(comment.id, body.trim());
                  setBody("");
                  setOpen(false);
                }}
              >
                Post
              </Button>
            </div>
          )}
          {replies.length > 0 && (
            <div className="mt-4 space-y-4 border-l-2 border-border pl-4">
              {replies.map((r) => (
                <div key={r.id} className="flex gap-3">
                  <UserAvatar
                    user={{ name: r.authorName, avatarColor: "oklch(0.605 0.153 42)" }}
                    size="xs"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {r.authorName}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        {r.createdAt}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecipeDetail() {
  const { slug } = Route.useParams();
  const { getRecipe, getUser, allComments, addComment, currentUser, recipes } = useStore();
  const recipe = getRecipe(slug);
  const [checked, setChecked] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  if (!recipe) throw notFound();
  const author = getUser(recipe.authorId)!;
  const comments = allComments.filter((c) => c.recipeId === recipe.id && !c.parentId);
  const related = recipes.filter((r) => r.id !== recipe.id && r.category === recipe.category).slice(0, 3);

  function postComment(body: string, parentId?: string) {
    addComment({
      recipeId: recipe!.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      body,
      createdAt: "Just now",
      ...(parentId ? { parentId } : {}),
    });
    toast.success("Comment posted ✓");
  }

  return (
    <article className="animate-rise">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/explore" search={{ category: recipe.category }} className="hover:text-primary">
            {recipe.category}
          </Link>
          <span className="mx-2">/</span>
          <span>{recipe.mealType}</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">{recipe.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="self-start overflow-hidden rounded-[1.75rem] border border-border shadow-card">
            <img
              src={recipe.image}
              alt={recipe.title}
              width={1024}
              height={768}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {recipe.cuisine} · {recipe.mealType}
              </p>
              <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
                {recipe.title}
              </h1>
              <p className="mt-4 text-muted-foreground">{recipe.description}</p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <Link to="/profile/$username" params={{ username: author.username }}>
                <UserAvatar user={author} size="md" />
              </Link>
              <div className="min-w-0">
                <Link
                  to="/profile/$username"
                  params={{ username: author.username }}
                  className="text-sm font-medium hover:text-primary"
                >
                  {author.name}
                </Link>
                <p className="text-xs text-muted-foreground">{author.recipeCount} recipes</p>
              </div>
              <FollowButton userId={author.id} className="ml-auto" />
            </div>

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Rating", value: recipe.rating.toFixed(1), icon: null },
                { label: "Likes", value: formatCount(recipe.likes), icon: Heart },
                { label: "Comments", value: `${recipe.commentCount}`, icon: MessageCircle },
                { label: "Total time", value: formatTime(recipe.totalMinutes), icon: Clock },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-secondary/50 p-4 text-center"
                >
                  <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="mt-1 flex items-center justify-center gap-1.5 text-lg font-semibold">
                    {s.icon ? <s.icon className="size-4 text-primary" /> : <Rating value={recipe.rating} showValue={false} />}
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Flame className="size-4 text-primary" /> {recipe.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users2 className="size-4 text-primary" /> {recipe.servings} servings
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-primary" /> Prep {recipe.prepMinutes} min · Cook{" "}
                {recipe.cookMinutes} min
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <SaveButton recipeId={recipe.id} variant="full" className="px-6" />
              <ShareModal
                title={recipe.title}
                trigger={
                  <Button variant="outline" className="rounded-full">
                    <Share2 className="size-4" /> Share
                  </Button>
                }
              />
              <LikeButton
                recipeId={recipe.id}
                baseCount={recipe.likes}
                className="rounded-full border border-border px-4 py-2"
              />
              {recipe.authorId === currentUser.id && (
                <Button asChild variant="ghost" className="rounded-full">
                  <Link to="/edit/$id" params={{ id: recipe.id }}>
                    Edit recipe
                  </Link>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Ingredients */}
          <section>
            <h2 className="font-display text-3xl">Ingredients</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tick items off as you gather them.
            </p>
            <div className="mt-6 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card">
              {recipe.ingredients.map((group) => (
                <div key={group.group}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {group.group}
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {group.items.map((item) => {
                      const id = `${group.group}-${item}`;
                      const on = checked.includes(id);
                      return (
                        <li key={id} className="flex items-center gap-3">
                          <Checkbox
                            id={id}
                            checked={on}
                            onCheckedChange={() =>
                              setChecked((c) =>
                                on ? c.filter((x) => x !== id) : [...c, id],
                              )
                            }
                          />
                          <label
                            htmlFor={id}
                            className={cn(
                              "cursor-pointer text-sm transition-colors",
                              on && "text-muted-foreground line-through",
                            )}
                          >
                            {item}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Steps */}
          <section>
            <h2 className="font-display text-3xl">Cooking Instructions</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Follow along step by step — take your time on the dum.
            </p>
            <ol className="mt-6 space-y-6">
              {recipe.steps.map((step, i) => (
                <li key={step.title} className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-card">
                  <span className="font-display text-2xl text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Comments */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-display text-3xl">What people are saying</h2>
          <div className="mt-6 flex gap-3">
            <UserAvatar user={currentUser} size="sm" />
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts or ask a question..."
                className="min-h-24 rounded-2xl"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  className="rounded-full px-6"
                  onClick={() => {
                    if (!newComment.trim()) return;
                    postComment(newComment.trim());
                    setNewComment("");
                  }}
                >
                  Post comment
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          {comments.length ? (
            comments.map((c) => (
              <CommentBlock
                key={c.id}
                comment={c}
                replies={allComments.filter((r) => r.parentId === c.id)}
                onReply={(parentId, body) => postComment(body, parentId)}
              />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No comments yet — be the first to cook this and tell us how it went.
            </p>
          )}
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl">More {recipe.category} recipes</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
