import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-brand-light bg-white p-8 shadow-lg shadow-brand/10 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-brand-darker md:text-3xl">
          Sign in
        </h1>
        <p className="mt-2 text-base text-muted">
          Welcome back. Enter your details below.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
