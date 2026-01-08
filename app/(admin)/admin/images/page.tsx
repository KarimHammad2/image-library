import { ImageApprovalTable } from "@/components/admin/image-approval-table";
import { ImageForm } from "@/components/admin/image-form";
import { getDiseases, getImages } from "@/lib/db";

export default async function AdminImagesPage() {
  const [images, diseases] = await Promise.all([getImages(), getDiseases()]);

  const pending = images.filter((img) => !img.isApproved).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-bold">Images</h1>
          <p className="text-muted-foreground">
            Create/edit metadata and approve submissions. Pending: {pending}
          </p>
        </div>
      </div>

      <ImageForm images={images} diseases={diseases} />
      <ImageApprovalTable images={images} diseases={diseases} />
    </div>
  );
}

