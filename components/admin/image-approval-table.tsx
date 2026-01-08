"use client";

import { useTransition } from "react";
import { approveImageAction } from "@/lib/actions";
import type { Disease, ImageMetadata } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  images: ImageMetadata[];
  diseases: Disease[];
};

export function ImageApprovalTable({ images, diseases }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Images</CardTitle>
        <CardDescription>Approve or unpublish submissions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {images.map((img) => {
          const disease = diseases.find((d) => d.id === img.conditionDiseaseId);
          return (
            <div
              key={img.id}
              className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">{img.title}</p>
                <p className="text-xs text-muted-foreground">
                  {img.species} · {img.organ} · {disease?.name ?? "Unknown disease"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={img.isApproved ? "default" : "outline"}>
                  {img.isApproved ? "Approved" : "Pending"}
                </Badge>
                <Button
                  size="sm"
                  variant={img.isApproved ? "outline" : "default"}
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      await approveImageAction(img.id, !img.isApproved);
                    })
                  }
                >
                  {img.isApproved ? "Unpublish" : "Approve"}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

