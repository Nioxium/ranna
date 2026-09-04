import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, Share2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowButton } from "@/components/ranna/ActionButtons";
import { EmptyState } from "@/components/ranna/EmptyState";
import { RecipeGrid } from "@/components/ranna/RecipeCard";
import { ShareModal } from "@/components/ranna/ShareModal";
import { UserAvatar } from "@/components/ranna/UserAvatar";
import { formatCount, useStore } from "@/lib/store";

export const Route = createFileRoute("/profile/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Ranna` },
      {
        name: "description",
        content: `Recipes, saved dishes and kitchen story from @${params.username} on Ranna.`,
      },
      { property: "og:title", content: `@${params.username} on Ranna` },
      { property: "og:description", content: `Browse recipes shared by @${params.username}.` },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  const { getUserByUsername, recipes, saved, liked, currentUser } = useStore();
  const user = getUserByUsername(username);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={<UserX className="size-7" />}
          title="Creator not found"
          description="This profile doesn't exist or has been removed."
          actionLabel="Meet other creators"
          actionTo="/community"
        />
      </div>
    );
  }

  const isMe = user.id === currentUser.id;
  const own = recipes.filter((r) => r.authorId === user.id);
  const savedRecipes = recipes.filter((r) => saved.includes(r.id));
  const likedRecipes = recipes.filter((r) => liked.includes(r.id));

  return (
    <div className="animate-rise">
      <div className="relative h-52 overflow-hidden sm:h-72">
        <img src={user.cover} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-foreground/25" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mt-16 flex flex-col gap-6 sm:-mt-20 sm:flex-row sm:items-end">
          <UserAvatar user={user} size="xl" className="ring-4 ring-background" />
          <div className="flex-1">
            <h1 className="font-display text-3xl sm:text-4xl">{user.name}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">{user.bio}</p>
          </div>
          <div className="flex gap-3 pb-1">
            {isMe ? (
              <Button asChild className="rounded-full">
                <Link to="/create">Create Recipe</Link>
              </Button>
            ) : (
              <FollowButton userId={user.id} size="default" className="px-7" />
            )}
            <ShareModal
              title={user.name}
              trigger={
                <Button variant="outline" className="rounded-full">
                  <Share2 className="size-4" /> Share Profile
                </Button>
              }
            />
          </div>
        </div>

        <dl className="mt-8 flex flex-wrap gap-10 border-y border-border py-5">
          {[
            { label: "Recipes", value: `${own.length || user.recipeCount}` },
            { label: "Followers", value: formatCount(user.followers) },
            { label: "Following", value: `${user.following}` },
          ].map((s) => (
            <div key={s.label}>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dt>
              <dd className="font-display text-2xl">{s.value}</dd>
            </div>
          ))}
        </dl>

        <Tabs defaultValue="recipes" className="mt-10">
          <TabsList className="rounded-full">
            <TabsTrigger value="recipes" className="rounded-full px-5">
              Recipes
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-full px-5">
              Saved
            </TabsTrigger>
            <TabsTrigger value="liked" className="rounded-full px-5">
              Liked
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-full px-5">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="mt-8">
            {own.length ? (
              <RecipeGrid recipes={own} columns="wide" />
            ) : (
              <EmptyState
                icon={<ChefHat className="size-7" />}
                title="No recipes yet"
                description="Your kitchen story starts here."
                actionLabel="Create Your First Recipe"
                actionTo="/create"
              />
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-8">
            {savedRecipes.length ? (
              <RecipeGrid recipes={savedRecipes} columns="wide" />
            ) : (
              <EmptyState
                icon={<ChefHat className="size-7" />}
                title="No saved recipes"
                description="Save recipes you love and they'll appear here."
                actionLabel="Explore Recipes"
                actionTo="/explore"
              />
            )}
          </TabsContent>

          <TabsContent value="liked" className="mt-8">
            {likedRecipes.length ? (
              <RecipeGrid recipes={likedRecipes} columns="wide" />
            ) : (
              <EmptyState
                icon={<ChefHat className="size-7" />}
                title="Nothing liked yet"
                description="Tap the heart on a recipe to keep it here."
                actionLabel="Explore Recipes"
                actionTo="/explore"
              />
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-8 max-w-2xl">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
              <h2 className="font-display text-2xl">About {user.name}</h2>
              <p className="mt-3 text-muted-foreground">{user.bio}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Cooking and sharing on Ranna · {user.recipeCount} published recipes ·{" "}
                {formatCount(user.followers)} followers
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
