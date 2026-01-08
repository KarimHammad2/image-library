import { DiseaseForm } from "@/components/admin/disease-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDiseases } from "@/lib/db";

export default async function AdminDiseasesPage() {
  const diseases = await getDiseases();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-bold">Diseases</h1>
          <p className="text-muted-foreground">
            Manage taxonomy, notifiable/EAD status, and relevance.
          </p>
        </div>
      </div>

      <DiseaseForm diseases={diseases} />

      <Card>
        <CardHeader>
          <CardTitle>Current diseases</CardTitle>
          <CardDescription>Used to populate image metadata and filters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {diseases.map((disease) => (
            <div key={disease.id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{disease.name}</p>
                <Badge variant="outline">{disease.notifiableStatus}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{disease.description}</p>
              <p className="text-xs text-muted-foreground">
                Species: {disease.species.join(", ")}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

