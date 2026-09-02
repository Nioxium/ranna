import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryRail } from "@/components/ranna/CategoryRail";
import { CreatorCard } from "@/components/ranna/CreatorCard";
import { RecipeGrid } from "@/components/ranna/RecipeCard";
import { SearchBar } from "@/components/ranna/SearchBar";
import { Rating } from "@/components/ranna/Rating";
import { UserAvatar } from "@/components/ranna/UserAvatar";
import { LikeButton, SaveButton } from "@/components/ranna/ActionButtons";
import { communityPosts, images, popularSearches } from "@/data/mock";
import { formatCount, formatTime, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ranna — Discover recipes. Share your taste." },
      {
        name: "description",
        content:
          "Discover delicious recipes from home cooks and food lovers around the world. Trending dishes, Bengali classics and a community of creators.",
      },
      { property: "og:title", content: "Ranna — Discover recipes. Share your taste." },
      {
        property: "og:description",
        content: "Trending recipes, food creators and a community of home cooks.",
      },
    ],
  }),
  component: Home,
});

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && (
        <Button asChild variant="outline" className="rounded-full">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link to={action.to as any}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

function Home() {
  const { recipes, users, getRecipe, getUser } = useStore();
  const featured = getRecipe("r1")!;
  const trending = recipes.slice(0, 6);

  return (
    <div className="animate-rise">
      {/* Hero */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              From your kitchen to everyone's table
            </span>
            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem]">
              What are you cooking today?
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Discover delicious recipes from home cooks and food lovers around the world.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBar />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Popular searches:</span>
              {popularSearches.map((p) => (
                <Link
                  key={p}
                  to="/search"
                  search={{ q: p }}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-lift">
              <img
                src={images.hero}
                alt="A home cook plating fresh food in a sunlit kitchen"
                width={960}
                height={1200}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 hidden items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-5 shadow-lift sm:flex">
              <img
                src={images.kacchi}
                alt=""
                loading="lazy"
                className="size-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-medium">2,480 recipes</p>
                <p className="text-xs text-muted-foreground">shared this week</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading
          title="Browse by category"
          subtitle="Every mood, every meal, every craving."
        />
        <CategoryRail />
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <SectionHeading
          title="Trending Recipes"
          subtitle="What the Ranna community is cooking right now."
          action={{ label: "Explore all", to: "/explore" }}
        />
        <RecipeGrid recipes={trending} />
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-card lg:grid-cols-2">
          <div className="relative min-h-64 overflow-hidden">
            <img
              src={featured.image}
              alt={featured.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Editor's Pick
            </span>
            <h2 className="font-display text-3xl sm:text-4xl">{featured.title}</h2>
            <p className="text-muted-foreground">{featured.description}</p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <Rating value={featured.rating} />
              <span className="inline-flex items-center gap-1.5">
                <Heart className="size-4" /> {formatCount(featured.likes)} likes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="size-4" /> {featured.commentCount} comments
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" /> {formatTime(featured.totalMinutes)}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-7">
                <Link to="/recipe/$slug" params={{ slug: featured.slug }}>
                  View Recipe
                </Link>
              </Button>
              <SaveButton recipeId={featured.id} variant="full" />
            </div>
          </div>
        </div>
      </section>

      {/* Creators */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading
            title="Meet the Food Creators"
            subtitle="Home cooks sharing their kitchens with the community."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {users.map((u) => (
              <CreatorCard key={u.id} user={u} />
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          title="From the Community"
          subtitle="Real plates from real kitchens."
          action={{ label: "Open community", to: "/community" }}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {communityPosts.slice(0, 4).map((post) => {
            const author = getUser(post.authorId);
            const recipe = post.recipeId ? getRecipe(post.recipeId) : undefined;
            return (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <div className="flex items-center gap-3 p-4">
                  {author && <UserAvatar user={author} size="sm" />}
                  <div>
                    <p className="text-sm font-medium">{author?.name}</p>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                </div>
                <p className="px-4 pb-3 text-sm">{post.caption}</p>
                <img
                  src={post.image}
                  alt={post.caption}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="flex items-center gap-5 p-4 text-sm text-muted-foreground">
                  {recipe && <LikeButton recipeId={recipe.id} baseCount={post.likes} />}
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="size-4" /> {post.comments}
                  </span>
                  {recipe && (
                    <Link
                      to="/recipe/$slug"
                      params={{ slug: recipe.slug }}
                      className="ml-auto text-xs font-medium text-primary hover:underline"
                    >
                      View recipe
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
