import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Bookmark, Compass, Home, Menu, PlusCircle, Search, User, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";
import { UserAvatar } from "./UserAvatar";
import { NotificationItem } from "./NotificationItem";

const mainLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/community", label: "Community" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-lg text-primary-foreground">
        R
      </span>
      <span className="font-display text-2xl leading-none tracking-tight">Ranna</span>
    </Link>
  );
}

export function Navbar() {
  const { notifications, markNotificationsRead, currentUser } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {mainLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="rounded-full"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="size-5" />
          </Button>

          <Button asChild className="hidden rounded-full md:inline-flex">
            <Link to="/create">
              <PlusCircle className="size-4" /> Create Recipe
            </Link>
          </Button>

          <DropdownMenu onOpenChange={(o) => o && markNotificationsRead()}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative hidden rounded-full sm:inline-flex"
              >
                <Bell className="size-5" />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <DropdownMenuLabel className="px-4 py-3 font-display text-base">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="m-0" />
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <NotificationItem key={n.id} notification={n} compact />
                ))}
              </div>
              <DropdownMenuSeparator className="m-0" />
              <DropdownMenuItem
                onSelect={() => navigate({ to: "/notifications" })}
                className="justify-center py-3 text-sm font-medium text-primary"
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Account menu" className="hidden rounded-full sm:block">
                <UserAvatar user={currentUser} size="md" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-xs font-normal text-muted-foreground">
                  @{currentUser.username}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() =>
                  navigate({ to: "/profile/$username", params: { username: currentUser.username } })
                }
              >
                <User className="size-4" /> My profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate({ to: "/saved" })}>
                <Bookmark className="size-4" /> Saved recipes
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate({ to: "/create" })}>
                <PlusCircle className="size-4" /> Create recipe
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate({ to: "/login" })}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="rounded-full sm:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <SheetTitle className="font-display text-2xl">Ranna</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {[
                  { to: "/", label: "Home", icon: Home },
                  { to: "/explore", label: "Explore", icon: Compass },
                  { to: "/community", label: "Community", icon: Users },
                  { to: "/saved", label: "Saved", icon: Bookmark },
                  { to: "/notifications", label: "Notifications", icon: Bell },
                  { to: "/create", label: "Create Recipe", icon: PlusCircle },
                ].map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-secondary"
                  >
                    <Icon className="size-4 text-primary" /> {label}
                  </Link>
                ))}
                <Link
                  to="/profile/$username"
                  params={{ username: currentUser.username }}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-secondary"
                >
                  <User className="size-4 text-primary" /> My Profile
                </Link>
                <Link
                  to="/login"
                  className="mt-4 rounded-xl bg-secondary px-3 py-3 text-sm font-medium"
                >
                  Sign out
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-all duration-300",
          searchOpen ? "max-h-24" : "max-h-0 border-t-0",
        )}
      >
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <SearchBar size="md" />
        </div>
      </div>
    </header>
  );
}

const mobileTabs = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/explore", label: "Explore", icon: Compass, exact: false },
  { to: "/create", label: "Create", icon: PlusCircle, exact: false },
  { to: "/saved", label: "Saved", icon: Bookmark, exact: false },
] as const;

export function MobileNavigation() {
  const { currentUser } = useStore();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-5">
        {mobileTabs.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact }}
            activeProps={{ className: "text-primary" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
        <Link
          to="/profile/$username"
          params={{ username: currentUser.username }}
          activeProps={{ className: "text-primary" }}
          className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
        >
          <User className="size-5" />
          Profile
        </Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Discover recipes. Share your taste. From your kitchen to everyone's table.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/explore" className="hover:text-primary">
                All recipes
              </Link>
            </li>
            <li>
              <Link to="/community" className="hover:text-primary">
                Community
              </Link>
            </li>
            <li>
              <Link to="/saved" className="hover:text-primary">
                Saved recipes
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base">Create</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/create" className="hover:text-primary">
                Publish a recipe
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-primary">
                Join Ranna
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ranna. A community of home cooks.
      </div>
    </footer>
  );
}
