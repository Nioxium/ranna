import { cn } from "@/lib/utils";
import type { User } from "@/data/types";

const sizes = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-28 text-2xl",
};

export function UserAvatar({
  user,
  size = "sm",
  className,
}: {
  user: Pick<User, "name" | "avatarColor">;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      aria-hidden
      style={{ backgroundColor: user.avatarColor }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground ring-2 ring-card",
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
