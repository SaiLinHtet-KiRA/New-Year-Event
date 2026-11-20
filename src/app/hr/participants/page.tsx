import Link from "next/link";
import { connection } from "next/server";
import { Card, EmptyState, PageHeading, StatCard, StatusBadge, Table } from "@/components/ui";
import { getDashboardStats, getEvent, getParticipants } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/format";

function pageHref(page: number, query: string, department: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (department && department !== "All departments") {
    params.set("department", department);
  }
  params.set("page", String(page));
  return `/hr/participants?${params.toString()}`;
}

export default async function ParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; department?: string; page?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const query = params.q ?? "";
  const department = params.department ?? "All departments";
  const page = Number(params.page ?? "1") || 1;

  const [event, stats, participants] = await Promise.all([
    getEvent(),
    getDashboardStats(),
    getParticipants({ query, department, page }),
  ]);

  return (
    <div>
      <PageHeading
        eyebrow="HR administration"
        title="Participants"
        description="Everyone registered for the prize draw."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Participants" value={stats.participants} />
        <StatCard label="Registered" value={stats.registered} />
        <StatCard label="Departments" value={stats.departments} />
        <StatCard
          label="Registration closes"
          value={formatDate(event.registrationClosesAt)}
        />
      </div>

      <Card title="Search participants" className="mt-6">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <label className="min-w-[220px] flex-1">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">
              Search by ID or name
            </span>
            <input
              name="q"
              defaultValue={query}
              placeholder="Employee ID or name"
              className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />
          </label>
          <label className="min-w-[180px]">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">
              Department
            </span>
            <select
              name="department"
              defaultValue={department}
              className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            >
              <option>All departments</option>
              {participants.departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-xl bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-800"
          >
            Search
          </button>
        </form>
      </Card>

      <Card
        title="Registered employees"
        description={`${participants.total} matching record${participants.total === 1 ? "" : "s"}`}
        className="mt-6"
      >
        {participants.items.length === 0 ? (
          <EmptyState message="No participants match your search." />
        ) : (
          <Table headers={["Employee ID", "Name", "Department", "Registered at", "Status"]}>
            {participants.items.map((participant) => (
              <tr key={participant.employeeId}>
                <td className="px-3 py-3 pl-0 font-mono text-xs text-stone-700">
                  {participant.employeeId}
                </td>
                <td className="px-3 py-3 text-stone-800">{participant.fullName}</td>
                <td className="px-3 py-3 text-stone-700">{participant.department}</td>
                <td className="px-3 py-3 text-stone-600">
                  {formatDateTime(participant.registeredAt)}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={participant.status} />
                </td>
              </tr>
            ))}
          </Table>
        )}

        <div className="mt-5 flex items-center justify-between text-sm text-stone-600">
          <span>
            Page {participants.page} of {participants.pageCount}
          </span>
          <div className="flex gap-2">
            <Link
              href={pageHref(Math.max(1, participants.page - 1), query, department)}
              aria-disabled={participants.page <= 1}
              className={`rounded-lg border border-stone-300 px-3 py-1.5 ${
                participants.page <= 1
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-stone-50"
              }`}
            >
              Previous
            </Link>
            <Link
              href={pageHref(
                Math.min(participants.pageCount, participants.page + 1),
                query,
                department,
              )}
              aria-disabled={participants.page >= participants.pageCount}
              className={`rounded-lg border border-stone-300 px-3 py-1.5 ${
                participants.page >= participants.pageCount
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-stone-50"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
