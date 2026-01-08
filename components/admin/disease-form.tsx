"use client";

import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { upsertDiseaseAction } from "@/lib/actions";
import type { Disease } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DiseaseForm({ diseases }: { diseases: Disease[] }) {
  const [state, formAction] = useFormState(upsertDiseaseAction, undefined);
  const [selectedId, setSelectedId] = useState<string>("new");
  const selected = useMemo(
    () => diseases.find((d) => d.id === selectedId),
    [diseases, selectedId],
  );

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Create / Edit Disease</p>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select disease" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New disease</SelectItem>
            {diseases.map((disease) => (
              <SelectItem key={disease.id} value={disease.id}>
                Edit · {disease.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state?.success ? (
        <Alert>
          <AlertDescription>Saved successfully.</AlertDescription>
        </Alert>
      ) : null}

      <form key={selectedId} action={formAction} className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="id" defaultValue={selected?.id ?? ""} />
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={selected?.name} required />
        </div>
        <div className="space-y-2">
          <Label>Notifiable / EAD</Label>
          <Select defaultValue={selected?.notifiableStatus ?? "NON_NOTIFIABLE"} name="notifiableStatus">
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NON_NOTIFIABLE">Non-notifiable</SelectItem>
              <SelectItem value="NOTIFIABLE">Notifiable</SelectItem>
              <SelectItem value="EAD">EAD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={selected?.description} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="relevance">Relevance</Label>
          <Input id="relevance" name="relevance" defaultValue={selected?.relevance} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="species">Species (comma separated)</Label>
          <Input
            id="species"
            name="species"
            defaultValue={selected?.species.join(", ")}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="geographicalIncidence">Geographical incidence</Label>
          <Input
            id="geographicalIncidence"
            name="geographicalIncidence"
            defaultValue={selected?.geographicalIncidence}
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Save disease</Button>
        </div>
      </form>
    </div>
  );
}

