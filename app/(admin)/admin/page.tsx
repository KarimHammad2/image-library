import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/lib/analytics";
import { getDiseases, getImages, getUsers } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [users, images, diseases, analytics] = await Promise.all([
    getUsers(),
    getImages(),
    getDiseases(),
    getAnalyticsSummary(),
  ]);

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const premiumCount = users.filter((u) => u.isPremium).length;
  const approvedImages = images.filter((img) => img.isApproved).length;
  const pendingImages = images.filter((img) => !img.isApproved).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">Quick snapshot of members, content, and events.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Members" value={totalUsers} description={`${adminCount} admins · ${premiumCount} premium`} />
        <StatCard title="Images" value={approvedImages} description={`${pendingImages} pending approval`} />
        <StatCard title="Diseases" value={diseases.length} description="Managed taxonomy" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent analytics events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {analytics.recent.length === 0 ? (
            <p className="text-muted-foreground">No events logged yet.</p>
          ) : (
            analytics.recent.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col gap-1 rounded-lg border px-3 py-2 md:flex-row md:items-center md:justify-between"
              >
                <span className="font-medium">{evt.type}</span>
                <span className="text-muted-foreground">
                  {new Date(evt.timestamp).toLocaleString()} · {evt.userId || "anonymous"}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, description }: { title: string; value: number; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

