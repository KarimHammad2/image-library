import Link from "next/link";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/images", label: "Images" },
  { href: "/admin/diseases", label: "Diseases" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default async function AdminLayout({ children }: PropsWithChildren) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container flex flex-wrap items-center gap-3 py-4">
          <div className="flex flex-1 items-center gap-6">
            <Link href="/admin" className="text-lg font-semibold">
              Admin Console
            </Link>
            <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-1 hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/library"
                className="rounded-md px-2 py-1 text-primary hover:bg-muted"
              >
                Member View
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              {user.name} · Admin
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

