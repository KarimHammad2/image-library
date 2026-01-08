import Link from "next/link";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const memberLinks = [
  { href: "/library", label: "Library" },
  { href: "/compare", label: "Compare" },
  { href: "/premium", label: "Premium" },
];

export default async function MemberLayout({ children }: PropsWithChildren) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container flex flex-wrap items-center gap-3 py-4">
          <div className="flex flex-1 items-center gap-6">
            <Link href="/library" className="text-lg font-semibold">
              Animal Disease Image Library
            </Link>
            <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {memberLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-1 hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="rounded-md px-2 py-1 font-medium text-primary hover:bg-muted"
                >
                  Admin
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              {user.name} · {user.role}
              {user.isPremium ? " · Premium" : ""}
            </span>
            <form action={logoutAction}>
              <Button variant="outline" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  );
}

