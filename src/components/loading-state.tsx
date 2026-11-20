export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-stone-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="h-28 animate-pulse rounded-2xl bg-stone-200" />
        <div className="h-28 animate-pulse rounded-2xl bg-stone-200" />
        <div className="h-28 animate-pulse rounded-2xl bg-stone-200" />
      </div>
      <p className="mt-8 text-sm text-stone-500">Loading prize draw data…</p>
    </div>
  );
}
