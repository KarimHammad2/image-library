"use client";

import { useTransition } from "react";
import { updateUserAccessAction } from "@/lib/actions";
import type { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UserTable({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition();

  const sorted = [...users].sort((a, b) => a.email.localeCompare(b.email));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Toggle roles and premium access.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((user) => (
          <div
            key={user.id}
            className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{user.role}</Badge>
              {user.isPremium ? <Badge>Premium</Badge> : <Badge variant="secondary">Member</Badge>}
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await updateUserAccessAction({
                      userId: user.id,
                      isPremium: !user.isPremium,
                    });
                  })
                }
              >
                {user.isPremium ? "Revoke premium" : "Grant premium"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await updateUserAccessAction({
                      userId: user.id,
                      role: user.role === "ADMIN" ? "MEMBER" : "ADMIN",
                    });
                  })
                }
              >
                {user.role === "ADMIN" ? "Set member" : "Promote to admin"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

