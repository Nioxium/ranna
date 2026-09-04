import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, MessageCircle } from "lucide-react";
import { CreatorCard } from "@/components/ranna/CreatorCard";
import { LikeButton } from "@/components/ranna/ActionButtons";
import { UserAvatar } from "@/components/ranna/UserAvatar";
import { communityPosts } from "@/data/mock";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Ranna" },
      {
        name: "description",
        content: "See what the Ranna community is cooking: fresh plates, kitchen wins and creators to follow.",
      },
      { property: "og:title", content: "Community — Ranna" },
      { property: "og:description", content: "Real plates from real kitchens, shared by home cooks." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const { getUser, getRecipe, users } = useStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl">From the Community</h1>
        <p className="mt-3 text-muted-foreground">
          Kitchen wins, weeknight rescues and weekend feasts — posted by home cooks like you.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {communityPosts.map((post) => {
            const author = getUser(post.authorId);
            const recipe = post.recipeId ? getRecipe(post.recipeId) : undefined;
            return (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <div className="flex items-center gap-3 p-5">
                  {author && (
                    <Link to="/profile/$username" params={{ username: author.username }}>
                      <UserAvatar user={author} size="md" />
                    </Link>
                  )}
                  <div>
                    <p className="text-sm font-medium">{author?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{author?.username} · {post.time}
                    </p>
                  </div>
                </div>
                <p className="px-5 pb-4">{post.caption}</p>
                <img
                  src={post.image}
                  alt={post.caption}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="flex flex-wrap items-center gap-5 p-5 text-sm text-muted-foreground">
                  {recipe && <LikeButton recipeId={recipe.id} baseCount={post.likes} />}
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="size-4" /> {post.comments}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 hover:text-primary"
                    onClick={() => toast.success("Post saved ✓")}
                  >
                    <Bookmark className="size-4" /> Save
                  </button>
                  {recipe && (
                    <Link
                      to="/recipe/$slug"
                      params={{ slug: recipe.slug }}
                      className="ml-auto rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-accent"
                    >
                      {recipe.title}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-5">
          <h2 className="font-display text-2xl">Creators to follow</h2>
          {users.slice(0, 4).map((u) => (
            <CreatorCard key={u.id} user={u} />
          ))}
        </aside>
      </div>
    </div>
  );
}
