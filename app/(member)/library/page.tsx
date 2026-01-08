import { LibraryExplorer } from "@/components/library/library-explorer";
import { getDiseases, getImages } from "@/lib/db";

export const revalidate = 0;

export default async function LibraryPage() {
  const [images, diseases] = await Promise.all([getImages(), getDiseases()]);
  const approved = images.filter((img) => img.isApproved);
  const items = approved.map((image) => ({
    image,
    disease: diseases.find((d) => d.id === image.conditionDiseaseId),
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Library
          </p>
          <h1 className="text-3xl font-bold">Image Library</h1>
          <p className="text-muted-foreground">
            Search and filter approved imagery with linked disease metadata.
          </p>
        </div>
      </div>
      <LibraryExplorer items={items} />
    </div>
  );
}

