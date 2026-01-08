"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { logEventAction } from "@/lib/actions";
import type { Disease, ImageMetadata } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Joined = { image: ImageMetadata; disease?: Disease };

const presets = [
  { label: "Normal vs BRD lesion", left: "img-normal-lung", right: "img-brd-lung" },
  { label: "Mastitis vs normal lung", left: "img-mastitis-udder", right: "img-normal-lung" },
];

export function CompareView({
  items,
  initialLeft,
  initialRight,
}: {
  items: Joined[];
  initialLeft?: string;
  initialRight?: string;
}) {
  const [leftId, setLeftId] = useState(initialLeft || "");
  const [rightId, setRightId] = useState(initialRight || "");
  const [isPending, startTransition] = useTransition();
  const left = useMemo(() => items.find((i) => i.image.id === leftId), [items, leftId]);
  const right = useMemo(() => items.find((i) => i.image.id === rightId), [items, rightId]);

  useEffect(() => {
    if (left && right) {
      startTransition(async () => {
        await logEventAction("IMAGE_COMPARE", {
          left: left.image.id,
          right: right.image.id,
        });
      });
    }
  }, [left, right]);

  const renderCard = (entry?: Joined, title?: string) => {
    if (!entry) {
      return (
        <Card className="flex h-full items-center justify-center bg-muted/40">
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">
              Select an image {title ? `for ${title}` : ""}
            </CardTitle>
          </CardHeader>
        </Card>
      );
    }

    const { image, disease } = entry;
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="line-clamp-1">{image.title}</CardTitle>
          <CardDescription className="line-clamp-2">{image.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={`/${image.fileName}`}
              alt={image.title}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">{image.species}</Badge>
            <Badge variant="outline">{image.organ}</Badge>
            <Badge>{image.severity}</Badge>
            {disease ? <Badge variant="outline">{disease.name}</Badge> : null}
            {image.notifiableStatus ? <Badge variant="destructive">{image.notifiableStatus}</Badge> : null}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Source: {image.source}</p>
            <p>Usage: {image.usageRights}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Select value={leftId} onValueChange={setLeftId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Left image" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.image.id} value={item.image.id}>
                  {item.image.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={rightId} onValueChange={setRightId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Right image" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.image.id} value={item.image.id}>
                  {item.image.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => { setLeftId(""); setRightId(""); }}>
            Clear
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              size="sm"
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                setLeftId(preset.left);
                setRightId(preset.right);
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {renderCard(left, "left")}
        {renderCard(right, "right")}
      </div>
    </div>
  );
}

