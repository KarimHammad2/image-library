import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const featureCards = [
  {
    title: "Image Library",
    body: "Search, filter, and compare high-quality disease and defect imagery with mandatory metadata.",
  },
  {
    title: "Premium Training",
    body: "Quizzes, anatomy content, and secure resources gated via mock premium access.",
  },
  {
    title: "Admin Console",
    body: "Approve uploads, manage diseases, users, and basic analytics from JSON-backed storage.",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-2xl border bg-card p-8 shadow-sm lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Demo</Badge>
            <Badge variant="outline">Next.js</Badge>
            <Badge variant="outline">Tailwind + shadcn/ui</Badge>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Animal Disease &amp; Defect Image Library
          </h1>
          <p className="text-muted-foreground">
            A demo platform showing membership, premium gating, admin approvals, advanced search, and
            analytics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/signup">Create account</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/library">Browse library</Link>
            </Button>
          </div>
          <Alert className="max-w-xl">
            <AlertTitle>Default admin</AlertTitle>
            <AlertDescription>
              Use admin@example.com / Admin123! to explore the admin console and premium toggles.
            </AlertDescription>
          </Alert>
        </div>
       
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {featureCards.map((item) => (
          <Card key={item.title} className="h-full">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.body}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

