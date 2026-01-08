"use client";

import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { upsertImageAction } from "@/lib/actions";
import type { Disease, ImageMetadata } from "@/lib/types";
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

type Props = {
  images: ImageMetadata[];
  diseases: Disease[];
};

export function ImageForm({ images, diseases }: Props) {
  const [state, formAction] = useFormState(upsertImageAction, undefined);
  const [selectedId, setSelectedId] = useState<string>("new");
  const selected = useMemo(
    () => images.find((img) => img.id === selectedId),
    [images, selectedId],
  );

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Create / Edit Image</p>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Create new" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New image</SelectItem>
            {images.map((img) => (
              <SelectItem key={img.id} value={img.id}>
                Edit · {img.title}
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
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={selected?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fileName">File name (under /public)</Label>
          <Input
            id="fileName"
            name="fileName"
            defaultValue={selected?.fileName ?? "demo-images/"}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={selected?.description}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species">Species</Label>
          <Input id="species" name="species" defaultValue={selected?.species} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organ">Organ</Label>
          <Input id="organ" name="organ" defaultValue={selected?.organ} required />
        </div>
        <div className="space-y-2">
          <Label>Severity</Label>
          <Select defaultValue={selected?.severity ?? "MILD"} name="severity">
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="MILD">Mild</SelectItem>
              <SelectItem value="MODERATE">Moderate</SelectItem>
              <SelectItem value="SEVERE">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Disease</Label>
          <Select
            defaultValue={selected?.conditionDiseaseId ?? diseases[0]?.id}
            name="conditionDiseaseId"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select disease" />
            </SelectTrigger>
            <SelectContent>
              {diseases.map((disease) => (
                <SelectItem key={disease.id} value={disease.id}>
                  {disease.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="usageRights">Usage rights</Label>
          <Input
            id="usageRights"
            name="usageRights"
            defaultValue={selected?.usageRights ?? "Demo only"}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input id="source" name="source" defaultValue={selected?.source} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="geographicalIncidence">Geographical incidence</Label>
          <Input
            id="geographicalIncidence"
            name="geographicalIncidence"
            defaultValue={selected?.geographicalIncidence}
          />
        </div>
        <div className="space-y-2">
          <Label>Notifiable / EAD status</Label>
          <Select defaultValue={selected?.notifiableStatus ?? "NON_NOTIFIABLE"} name="notifiableStatus">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NON_NOTIFIABLE">Non-notifiable</SelectItem>
              <SelectItem value="NOTIFIABLE">Notifiable</SelectItem>
              <SelectItem value="EAD">EAD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Save image</Button>
        </div>
      </form>
    </div>
  );
}

