import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";

// Ensure login/signup routes stay on the Node.js runtime (uses fs-backed data helpers)
export const runtime = "nodejs";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-lg font-semibold">
            Animal Disease Image Library
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}

