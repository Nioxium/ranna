import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/ranna/AuthLayout";
import { images } from "@/data/mock";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join Ranna — Create your account" },
      {
        name: "description",
        content: "Join the Ranna community: publish recipes, save favourites and follow food creators.",
      },
      { property: "og:title", content: "Join the Ranna community" },
      { property: "og:description", content: "Create your free Ranna account and start sharing recipes." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthLayout
      title="Join the Ranna community."
      subtitle="Discover recipes. Share your taste."
      image={images.breakfast}
      footer={
        <>
          Already cooking with us?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name || !form.email || !form.password) {
            toast.error("Please fill in every field");
            return;
          }
          if (form.password !== form.confirm) {
            toast.error("Passwords do not match");
            return;
          }
          toast.success("Welcome to Ranna ✓");
          navigate({ to: "/" });
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={set("name")} placeholder="Nipa Rahman" className="rounded-xl" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="rounded-xl" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" className="rounded-xl" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" className="rounded-xl" />
        </div>
        <Button type="submit" className="w-full rounded-full">
          Create Account
        </Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full"
          onClick={() => toast("Google sign-up is not connected yet")}
        >
          Continue with Google
        </Button>
      </form>
    </AuthLayout>
  );
}
