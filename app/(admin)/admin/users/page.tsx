import { UserTable } from "@/components/admin/user-table";
import { getUsers } from "@/lib/db";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Promote admins and toggle premium flags (mocked payments).
          </p>
        </div>
      </div>

      <UserTable users={users} />
    </div>
  );
}

