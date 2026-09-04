import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { images } from "@/data/mock";
import { Logo } from "./Navbar";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  image,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  image?: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-sm text-muted-foreground">{footer}</p>
        </div>
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
          ← Back to Ranna
        </Link>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={image ?? images.hero}
          alt="Home cooking on Ranna"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <blockquote className="absolute bottom-12 left-12 right-12 font-display text-3xl text-background">
          “From your kitchen to everyone's table.”
        </blockquote>
      </div>
    </div>
  );
}
