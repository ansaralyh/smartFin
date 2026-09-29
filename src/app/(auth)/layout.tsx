import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-subtle">
      <div className="hero-gradient flex flex-1 flex-col">
        <header className="px-6 py-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
              S
            </span>
            <span className="text-lg font-bold text-brand-darker">{APP_NAME}</span>
          </Link>
        </header>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
