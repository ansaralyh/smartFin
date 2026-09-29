import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-brand-light bg-white p-8 shadow-lg shadow-brand/10 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-brand-darker md:text-3xl">
          Create account
        </h1>
        <p className="mt-2 text-base text-muted">
          Start tracking your finances in a few seconds.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
