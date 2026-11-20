import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-900 via-rose-800 to-amber-700 px-6 py-16">
      <div className="w-full max-w-4xl">
        <div className="text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">
            Celebrate together
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            New Year Prize Draw
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-rose-100 sm:text-lg">
            Register for the draw, check your prize result, and let HR manage
            winners and collection in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <Link
            href="/employee"
            className="group rounded-2xl bg-white p-8 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
              For employees
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-stone-900">
              Register & check results
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Sign up with your employee ID, or look up your prize once HR has
              published the winner list.
            </p>
            <span className="mt-6 inline-block text-sm font-semibold text-rose-700 group-hover:underline">
              Go to employee screens →
            </span>
          </Link>

          <Link
            href="/hr"
            className="group rounded-2xl bg-stone-900 p-8 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              For HR
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Manage the draw
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Run the draw, publish winners, record prize collection and export
              management reports.
            </p>
            <span className="mt-6 inline-block text-sm font-semibold text-amber-300 group-hover:underline">
              Open HR administration →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
