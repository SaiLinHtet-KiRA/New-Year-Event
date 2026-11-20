import Link from "next/link";
import { connection } from "next/server";
import { Card, EmptyState, PageHeading, StatCard, StatusBadge, Table } from "@/components/ui";
import { getDashboardStats, getEvent, getWinners } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/format";
import DrawControls from "./draw-controls";

export default async function DrawPage() {
  await connection();

  const [event, stats, winners] = await Promise.all([
    getEvent(),
    getDashboardStats(),
    getWinners(),
  ]);

  return (
    <div>
      <PageHeading
        eyebrow="HR administration"
        title="Draw & winners"
        description="Run the draw, publish winners, record collection and report to management."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Participants" value={stats.participants} />
        <StatCard label="Winners" value={stats.winners} />
        <StatCard label="Prizes collected" value={stats.collected} />
        <StatCard label="Pending" value={stats.pending} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card
          title="Draw controls"
          description={`Registration closes ${formatDate(event.registrationClosesAt)}`}
          className="lg:col-span-1"
          action={<StatusBadge status={event.published ? "Published" : "Draft"} />}
        >
          <DrawControls hasDraw={Boolean(event.drawAt)} published={event.published} />
          <dl className="mt-6 space-y-2 border-t border-stone-100 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Drawn at</dt>
              <dd className="text-right text-stone-800">{formatDateTime(event.drawAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Published at</dt>
              <dd className="text-right text-stone-800">
                {formatDateTime(event.publishedAt)}
              </dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-stone-100 pt-4">
            <p className="text-sm font-medium text-stone-700">Configured prizes</p>
            <div className="mt-2 flex max-h-28 flex-wrap gap-2 overflow-y-auto pr-1">
              {event.prizes.map((prize) => (
                <span
                  key={prize.name}
                  className="h-fit rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-700"
                >
                  {prize.name} ×{prize.count}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card
          title="Prize Winners"
          description={`${winners.length} winner${winners.length === 1 ? "" : "s"} selected in the draw`}
          className="lg:col-span-2"
        >
          {winners.length === 0 ? (
            <EmptyState message="No winners yet. Run the draw to select prize winners." />
          ) : (
            <Table headers={["Employee ID", "Name", "Prize", "Status", "Action"]}>
              {winners.map((winner) => (
                <tr key={winner.employeeId}>
                  <td className="px-3 py-3 pl-0 font-mono text-xs text-stone-700">
                    {winner.employeeId}
                  </td>
                  <td className="px-3 py-3 text-stone-800">{winner.employeeName}</td>
                  <td className="px-3 py-3 text-stone-700">{winner.prize}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={winner.status} />
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/hr/collection?employeeId=${encodeURIComponent(winner.employeeId)}`}
                      className="text-sm font-medium text-rose-700 hover:underline"
                    >
                      {winner.status === "Prize collected" ? "View" : "Collect"}
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>

      <div className="mt-6 flex gap-5 text-sm font-medium text-rose-700">
        <Link href="/hr/participants" className="hover:underline">
          View participants →
        </Link>
        <Link href="/hr/report" className="hover:underline">
          Management report →
        </Link>
      </div>
    </div>
  );
}
