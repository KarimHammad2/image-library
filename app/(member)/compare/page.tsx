import { CompareView } from "@/components/library/compare-view";
import { getDiseases, getImages } from "@/lib/db";

export const revalidate = 0;

export default async function ComparePage({
  searchParams,
}: {
  searchParams?: { left?: string; right?: string };
}) {
  const [images, diseases] = await Promise.all([getImages(), getDiseases()]);
  const approved = images.filter((img) => img.isApproved);
  const items = approved.map((image) => ({
    image,
    disease: diseases.find((d) => d.id === image.conditionDiseaseId),
  }));

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Compare
        </p>
        <h1 className="text-3xl font-bold">Image Comparison</h1>
        <p className="text-muted-foreground">
          Select two images to compare side-by-side or use quick presets for normal vs lesion.
        </p>
      </div>
      <CompareView items={items} initialLeft={searchParams?.left} initialRight={searchParams?.right} />
    </div>
  );
}

