import Link from "next/link";
import { connection } from "next/server";
import { Card, StatusBadge } from "@/components/ui";
import { getEvent } from "@/lib/data";
import { formatDate } from "@/lib/format";
import RegisterForm from "./register-form";
import ResultForm from "./result-form";

export default async function EmployeePage() {
  await connection();

  const event = await getEvent();

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
            Employee screens
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
            New Year Prize Draw
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Registration closes {formatDate(event.registrationClosesAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={event.published ? "Published" : "Draft"} />
          <Link href="/" className="text-sm font-medium text-rose-700 hover:underline">
            Home
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card
          title="Register for the prize draw"
          description="Registered employees are included in the random draw."
        >
          <RegisterForm />
        </Card>

        <Card
          title="Check your prize result"
          description={
            event.published
              ? "The winner list is published. Look up your result below."
              : "Results become available after HR publishes the winner list."
          }
        >
          <ResultForm />
        </Card>
      </div>
    </main>
  );
}
