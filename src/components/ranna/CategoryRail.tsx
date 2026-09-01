import { Link } from "@tanstack/react-router";
import { categories } from "@/data/mock";

export function CategoryRail() {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {categories.map((c) => (
        <Link
          key={c.name}
          to="/explore"
          search={{ category: c.name }}
          className="group flex w-24 shrink-0 snap-start flex-col items-center gap-3 sm:w-28"
        >
          <span className="relative size-24 overflow-hidden rounded-full border border-border shadow-card transition-transform duration-300 group-hover:-translate-y-1 sm:size-28">
            <img
              src={c.image}
              alt={c.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </span>
          <span className="text-center text-sm font-medium">
            <span aria-hidden className="mr-1">
              {c.emoji}
            </span>
            {c.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
