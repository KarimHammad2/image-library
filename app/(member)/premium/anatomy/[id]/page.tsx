import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { logAnalyticsEvent } from "@/lib/analytics";
import { getAnatomyContent } from "@/lib/db";

export default async function AnatomyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [items, user] = await Promise.all([getAnatomyContent(), getCurrentUser()]);
  const item = items.find((i) => i.id === id);
  if (!item) return notFound();

  if (item.isPremium && !user?.isPremium) {
    return (
      <Alert>
        <AlertTitle>Premium required</AlertTitle>
        <AlertDescription>
          This content is restricted. Ask an admin to toggle premium on your account.
        </AlertDescription>
      </Alert>
    );
  }

  await logAnalyticsEvent("PREMIUM_CONTENT_VIEW", {
    userId: user?.id,
    metadata: { contentId: id, type: item.type },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {item.title}
          {item.isPremium ? <Badge>Premium</Badge> : <Badge variant="secondary">Member</Badge>}
        </CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.type === "VIDEO" && item.videoUrl ? (
          <video controls className="w-full rounded-lg border" src={item.videoUrl} />
        ) : null}
        {item.type === "PDF" && item.pdfUrl ? (
          <a
            href={item.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            Open PDF in new tab
          </a>
        ) : null}
        {item.type === "ARTICLE" ? (
          <p className="text-muted-foreground">
            {item.description} (Demo placeholder — add secure article content here.)
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

