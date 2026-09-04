import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/ranna/AuthLayout";
import { images } from "@/data/mock";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Ranna" },
      { name: "description", content: "Welcome back to Ranna. Sign in to your recipe community account." },
      { property: "og:title", content: "Sign In — Ranna" },
      { property: "og:description", content: "Welcome back to Ranna." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthLayout
      title="Welcome back to Ranna."
      subtitle="Sign in to keep cooking, saving and sharing."
      image={images.kacchi}
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email || !password) {
            toast.error("Enter your email and password");
            return;
          }
          toast.success("Welcome back to Ranna ✓");
          navigate({ to: "/" });
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-xl"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-xl"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <Checkbox id="remember" /> <span>Remember me</span>
          </label>
          <button type="button" className="text-primary hover:underline" onClick={() => toast("Password reset link sent")}>
            Forgot password?
          </button>
        </div>
        <Button type="submit" className="w-full rounded-full">
          Sign In
        </Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full"
          onClick={() => toast("Google sign-in is not connected yet")}
        >
          Continue with Google
        </Button>
      </form>
    </AuthLayout>
  );
}
