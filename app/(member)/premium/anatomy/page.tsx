import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getAnatomyContent } from "@/lib/db";

export default async function AnatomyListPage() {
  const [items, user] = await Promise.all([getAnatomyContent(), getCurrentUser()]);
  const gated = !user?.isPremium;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Premium · Anatomy
          </p>
          <h1 className="text-3xl font-bold">Anatomy &amp; EAD Training</h1>
          <p className="text-muted-foreground">
            Videos, PDFs, and articles. Premium-only items are flagged.
          </p>
        </div>
        {user?.isPremium ? <Badge>Premium enabled</Badge> : <Badge variant="outline">Locked</Badge>}
      </div>

      {gated ? (
        <Alert>
          <AlertTitle>Premium required</AlertTitle>
          <AlertDescription>
            Premium content is gated in this demo. Ask an admin to toggle your premium flag on the
            Users page.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {item.title}
                {item.isPremium ? <Badge>Premium</Badge> : <Badge variant="secondary">Member</Badge>}
              </CardTitle>
              <CardDescription className="line-clamp-3">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Type: {item.type}</p>
              <Button asChild variant="outline" disabled={item.isPremium && gated}>
                <Link href={`/premium/anatomy/${item.id}`}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

