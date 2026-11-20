import { connection } from "next/server";
import { Card, EmptyState, PageHeading, StatusBadge, Table } from "@/components/ui";
import { HR_STAFF_NAME } from "@/lib/config";
import { findWinner, getEvent, getRecentlyCollected } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import AddPrize from "./add-prize";
import CollectForm from "./collect-form";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ employeeId?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const employeeId = (params.employeeId ?? "").trim();
  const [event, winner, recentlyCollected] = await Promise.all([
    getEvent(),
    employeeId ? findWinner(employeeId) : Promise.resolve(null),
    getRecentlyCollected(),
  ]);

  return (
    <div>
      <PageHeading
        eyebrow="HR administration"
        title="Prize collection"
        description="Look up a winner by employee ID and record that the prize was collected."
      />

      <AddPrize prizes={event.prizes} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Find winner">
          <form method="get" className="flex flex-wrap items-end gap-3">
            <label className="min-w-[200px] flex-1">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">
                Employee ID
              </span>
              <input
                name="employeeId"
                defaultValue={employeeId}
                placeholder="e.g. EMP-1001"
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-800"
            >
              Look up
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">
            Lookup only shows employees who won a prize in the draw.
          </div>
        </Card>

        <Card title="Winner details">
          {!employeeId ? (
            <EmptyState message="Enter an employee ID to see winner details." />
          ) : !winner ? (
            <EmptyState message="No winner found for this employee ID." />
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-lg font-semibold text-stone-900">
                  {winner.employeeName}{" "}
                  <span className="font-mono text-sm font-normal text-stone-500">
                    ({winner.employeeId})
                  </span>
                </p>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Department</dt>
                  <dd className="text-stone-800">{winner.department}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Prize</dt>
                  <dd className="font-medium text-stone-800">{winner.prize}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-stone-500">Status</dt>
                  <dd>
                    <StatusBadge status={winner.status} />
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Collected at</dt>
                  <dd className="text-stone-800">
                    {formatDateTime(winner.collectedAt)}
                  </dd>
                </div>
              </dl>

              {winner.status === "Won" ? (
                <div className="border-t border-stone-100 pt-5">
                  <CollectForm
                    employeeId={winner.employeeId}
                    handedBy={HR_STAFF_NAME}
                  />
                </div>
              ) : (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  Collected by {winner.handedBy ?? HR_STAFF_NAME}.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>

      <Card
        title="Recently collected"
        description="Latest prizes handed out by HR"
        className="mt-6"
      >
        {recentlyCollected.length === 0 ? (
          <EmptyState message="No prizes have been collected yet." />
        ) : (
          <Table
            headers={["Employee ID", "Name", "Prize", "Status", "Collected at", "Handed by"]}
          >
            {recentlyCollected.map((item) => (
              <tr key={item.employeeId}>
                <td className="px-3 py-3 pl-0 font-mono text-xs text-stone-700">
                  {item.employeeId}
                </td>
                <td className="px-3 py-3 text-stone-800">{item.employeeName}</td>
                <td className="px-3 py-3 text-stone-700">{item.prize}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-3 py-3 text-stone-600">
                  {formatDateTime(item.collectedAt)}
                </td>
                <td className="px-3 py-3 text-stone-600">
                  {item.handedBy ?? HR_STAFF_NAME}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
