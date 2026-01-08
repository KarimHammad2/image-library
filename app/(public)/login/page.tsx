import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Access
        </p>
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          Sign in to view the library, compare images, and access premium areas.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

