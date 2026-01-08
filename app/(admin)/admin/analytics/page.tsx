import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/lib/analytics";

export default async function AdminAnalyticsPage() {
  const summary = await getAnalyticsSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Basic counts and recent events from analytics.json.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/api/admin/analytics/export/csv">Export CSV</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/api/admin/analytics/export/json">Export JSON</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total events" value={summary.totalEvents} />
        {Object.entries(summary.byType).map(([type, value]) => (
          <StatCard key={type} title={type} value={value} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent events</CardTitle>
          <CardDescription>Last 50 events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {summary.recent.length === 0 ? (
            <p className="text-muted-foreground">No events logged yet.</p>
          ) : (
            summary.recent.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{evt.type}</Badge>
                  <span className="text-muted-foreground">{evt.userId ?? "anonymous"}</span>
                </div>
                <span className="text-muted-foreground">
                  {new Date(evt.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

