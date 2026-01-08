import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";

export default async function PremiumPage() {
  const user = await getCurrentUser();
  const gated = !user?.isPremium;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Premium</p>
          <h1 className="text-3xl font-bold">Premium Dashboard</h1>
          <p className="text-muted-foreground">
            Quizzes, anatomy learning, and EAD training resources.
          </p>
        </div>
        {user?.isPremium ? <Badge>Premium enabled</Badge> : <Badge variant="outline">Member</Badge>}
      </div>

      {gated ? (
        <Alert>
          <AlertTitle>Upgrade required</AlertTitle>
          <AlertDescription>
            Premium content is gated in this demo. Ask an admin to toggle your premium flag on the
            Users page to explore quizzes and anatomy materials.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quizzes</CardTitle>
            <CardDescription>Assess recognition of diseases and response actions.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Includes MCQ and image recognition.</p>
            <Button asChild variant="outline" disabled={gated}>
              <Link href="/premium/quizzes">Open</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Anatomy & Training</CardTitle>
            <CardDescription>Videos, PDFs, and articles for premium learners.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Includes secure link demo handling.</p>
            <Button asChild variant="outline" disabled={gated}>
              <Link href="/premium/anatomy">Open</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

