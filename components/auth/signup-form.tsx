"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, undefined);

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="text-sm text-muted-foreground">
        Members can browse the library and preview premium sections.
      </p>
      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" type="text" required placeholder="Dr. Jane Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>
        {state?.error ? (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline">
          Login
        </Link>
      </p>
    </div>
  );
}

