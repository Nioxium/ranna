import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function SearchBar({
  defaultValue = "",
  size = "lg",
  placeholder = "Search for recipes, ingredients, or dishes...",
  className,
}: {
  defaultValue?: string;
  size?: "lg" | "md";
  placeholder?: string;
  className?: string;
}) {
  const [q, setQ] = useState(defaultValue);
  const navigate = useNavigate();
  const { addRecentSearch } = useStore();

  function submit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    addRecentSearch(query);
    navigate({ to: "/search", search: { q: query } });
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "flex w-full items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-card transition-shadow focus-within:shadow-lift",
        size === "lg" ? "pl-5" : "pl-4",
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Search recipes"
        className={cn(
          "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
          size === "lg" ? "py-2.5 text-base" : "py-1.5 text-sm",
        )}
      />
      <Button
        type="submit"
        className={cn("rounded-full", size === "lg" ? "px-6 sm:px-7" : "px-4 text-sm")}
      >
        Search
      </Button>
    </form>
  );
}
