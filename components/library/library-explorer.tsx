"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { logEventAction } from "@/lib/actions";
import type { Disease, ImageMetadata } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LibraryItem = {
  image: ImageMetadata;
  disease?: Disease;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Filters = {
  search: string;
  species: string;
  organ: string;
  disease: string;
  severity: string;
  notifiableStatus: string;
  startsWith: string;
};

const defaultFilters: Filters = {
  search: "",
  species: "all",
  organ: "all",
  disease: "all",
  severity: "all",
  notifiableStatus: "all",
  startsWith: "",
};

export function LibraryExplorer({ items }: { items: LibraryItem[] }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [applied, setApplied] = useState<Filters>(defaultFilters);
  const [isPending, startTransition] = useTransition();
  const hasChanges = useMemo(
    () => JSON.stringify(filters) !== JSON.stringify(defaultFilters),
    [filters],
  );

  const speciesList = useMemo(
    () => Array.from(new Set(items.map((i) => i.image.species))).sort(),
    [items],
  );
  const organList = useMemo(
    () => Array.from(new Set(items.map((i) => i.image.organ))).sort(),
    [items],
  );
  const diseaseList = useMemo(
    () =>
      Array.from(
        new Set(items.map((i) => i.disease?.id).filter(Boolean) as string[]),
      ).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    return items.filter((entry) => {
      const { image, disease } = entry;
      const matchesSearch =
        !applied.search ||
        image.title.toLowerCase().includes(applied.search.toLowerCase()) ||
        image.description.toLowerCase().includes(applied.search.toLowerCase()) ||
        (disease?.name || "").toLowerCase().includes(applied.search.toLowerCase());

      const matchesSpecies = applied.species === "all" || image.species === applied.species;
      const matchesOrgan = applied.organ === "all" || image.organ === applied.organ;
      const matchesDisease = applied.disease === "all" || image.conditionDiseaseId === applied.disease;
      const matchesSeverity = applied.severity === "all" || image.severity === applied.severity;
      const matchesNotifiable =
        applied.notifiableStatus === "all" ||
        image.notifiableStatus === applied.notifiableStatus ||
        disease?.notifiableStatus === applied.notifiableStatus;
      const matchesAlpha =
        !applied.startsWith ||
        (disease?.name || image.title)
          .toLowerCase()
          .startsWith(applied.startsWith.toLowerCase());

      return (
        matchesSearch &&
        matchesSpecies &&
        matchesOrgan &&
        matchesDisease &&
        matchesSeverity &&
        matchesNotifiable &&
        matchesAlpha
      );
    });
  }, [items, applied]);

  const applyFilters = () => {
    setApplied(filters);
    startTransition(async () => {
      await logEventAction("FILTER_USE", { filters });
      if (filters.search) {
        await logEventAction("SEARCH", { term: filters.search, filters });
      }
    });
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setApplied(defaultFilters);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Keyword</label>
          <Input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Search title, description, disease..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Species</label>
          <Select
            value={filters.species}
            onValueChange={(val) => setFilters((f) => ({ ...f, species: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {speciesList.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Organ</label>
          <Select
            value={filters.organ}
            onValueChange={(val) => setFilters((f) => ({ ...f, organ: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All organs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {organList.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Disease/Defect</label>
          <Select
            value={filters.disease}
            onValueChange={(val) => setFilters((f) => ({ ...f, disease: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All diseases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {diseaseList.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Severity</label>
          <Select
            value={filters.severity}
            onValueChange={(val) => setFilters((f) => ({ ...f, severity: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="MILD">Mild</SelectItem>
              <SelectItem value="MODERATE">Moderate</SelectItem>
              <SelectItem value="SEVERE">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Notifiable/EAD</label>
          <Select
            value={filters.notifiableStatus}
            onValueChange={(val) => setFilters((f) => ({ ...f, notifiableStatus: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="NOTIFIABLE">Notifiable</SelectItem>
              <SelectItem value="NON_NOTIFIABLE">Non-notifiable</SelectItem>
              <SelectItem value="EAD">EAD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2 lg:col-span-3">
          <label className="text-sm font-medium">A–Z by disease name</label>
          <Tabs
            value={filters.startsWith || "all"}
            onValueChange={(val) =>
              setFilters((f) => ({ ...f, startsWith: val === "all" ? "" : val }))
            }
          >
            <TabsList className="flex w-full flex-wrap justify-start">
              <TabsTrigger value="all">All</TabsTrigger>
              {alphabet.map((l) => (
                <TabsTrigger key={l} value={l}>
                  {l}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={filters.startsWith || "all"} />
          </Tabs>
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-2 lg:col-span-3">
          <Button onClick={applyFilters} disabled={isPending}>
            Apply filters
          </Button>
          <Button onClick={clearFilters} variant="outline" disabled={isPending}>
            Clear
          </Button>
          {hasChanges ? (
            <span className="text-sm text-muted-foreground">
              Showing {filtered.length} of {items.length}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(({ image, disease }) => (
          <Card key={image.id} className="flex flex-col overflow-hidden">
            <CardHeader className="space-y-1">
              <CardTitle className="line-clamp-1">{image.title}</CardTitle>
              <CardDescription className="line-clamp-2">{image.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={`/${image.fileName}`}
                  alt={image.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">{image.species}</Badge>
                <Badge variant="outline">{image.organ}</Badge>
                <Badge>{image.severity}</Badge>
                {disease ? <Badge variant="outline">{disease.name}</Badge> : null}
                {image.notifiableStatus ? (
                  <Badge variant="destructive">{image.notifiableStatus}</Badge>
                ) : null}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Source: {image.source}</p>
                {image.geographicalIncidence ? <p>Incidence: {image.geographicalIncidence}</p> : null}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Button asChild variant="outline" size="sm">
                <Link href={`/library/${image.id}`}>Details</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/compare?left=${image.id}`}>Add to compare</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No results</CardTitle>
            <CardDescription>Try relaxing filters or searching another term.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}

