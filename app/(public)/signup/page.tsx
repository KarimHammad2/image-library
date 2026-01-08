import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Join
        </p>
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-muted-foreground">
          Members can browse the library. Premium upgrades are toggled by admins.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}

