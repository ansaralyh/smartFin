export function PageLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}

export function PageError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-danger/20 bg-red-50 p-6 text-sm text-danger">
      {message}
    </div>
  );
}
