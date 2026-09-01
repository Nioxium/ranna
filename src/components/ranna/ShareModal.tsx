import { Check, Copy, Facebook, Link2, Twitter } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ShareModal({ title, trigger }: { title: string; trigger: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard ✓");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Share</DialogTitle>
          <DialogDescription>Send “{title}” to a friend who cooks.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-3">
          {[
            { icon: Twitter, label: "Twitter" },
            { icon: Facebook, label: "Facebook" },
            { icon: Link2, label: "Copy link" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              onClick={copy}
              className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-secondary/50 p-4 text-xs transition-colors hover:bg-secondary"
            >
              <Icon className="size-5 text-primary" />
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
          <span className="truncate text-xs text-muted-foreground">{url}</span>
          <Button size="sm" variant="ghost" onClick={copy} className="ml-auto shrink-0">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
