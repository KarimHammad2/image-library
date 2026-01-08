import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { logAnalyticsEvent } from "@/lib/analytics";
import { getDiseases, getImages } from "@/lib/db";

export default async function ImageDetailPage({
  params,
}: {
  params: { imageId: string };
}) {
  const { imageId } = params;
  const [images, diseases, user] = await Promise.all([
    getImages(),
    getDiseases(),
    getCurrentUser(),
  ]);
  const image = images.find((img) => img.id === imageId && img.isApproved);
  if (!image) return notFound();
  const disease = diseases.find((d) => d.id === image.conditionDiseaseId);

  await logAnalyticsEvent("IMAGE_VIEW", {
    userId: user?.id,
    metadata: { imageId },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Image detail
          </p>
          <h1 className="text-3xl font-bold">{image.title}</h1>
          <p className="text-muted-foreground">{image.description}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">{image.species}</Badge>
          <Badge variant="outline">{image.organ}</Badge>
          <Badge>{image.severity}</Badge>
          {image.notifiableStatus ? <Badge variant="destructive">{image.notifiableStatus}</Badge> : null}
          {disease ? <Badge variant="outline">{disease.name}</Badge> : null}
        </div>
      </div>

      <Card>
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-muted">
          <Image
            src={`/${image.fileName}`}
            alt={image.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <CardContent className="grid gap-4 rounded-b-xl bg-card/60 p-4 md:grid-cols-2">
          <MetadataItem label="Species" value={image.species} />
          <MetadataItem label="Organ" value={image.organ} />
          <MetadataItem label="Severity" value={image.severity} />
          <MetadataItem label="Geographical incidence" value={image.geographicalIncidence} />
          <MetadataItem label="Usage rights" value={image.usageRights} />
          <MetadataItem label="Source" value={image.source} />
          <MetadataItem label="Created" value={new Date(image.createdAt).toLocaleString()} />
        </CardContent>
      </Card>

      {disease ? (
        <Card>
          <CardHeader>
            <CardTitle>Disease / Defect</CardTitle>
            <CardDescription>{disease.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{disease.description}</p>
            <p>
              <span className="font-medium text-foreground">Relevance:</span> {disease.relevance}
            </p>
            <p>
              <span className="font-medium text-foreground">Species:</span>{" "}
              {disease.species.join(", ")}
            </p>
            <p>
              <span className="font-medium text-foreground">Notifiable/EAD:</span>{" "}
              {disease.notifiableStatus}
            </p>
            {disease.geographicalIncidence ? (
              <p>
                <span className="font-medium text-foreground">Incidence:</span>{" "}
                {disease.geographicalIncidence}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/library">Back to library</Link>
        </Button>
        <Button asChild>
          <Link href={`/compare?left=${image.id}`}>Add to comparison</Link>
        </Button>
      </div>
    </div>
  );
}

function MetadataItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="space-y-1 rounded-lg border bg-muted/50 p-3">
      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

