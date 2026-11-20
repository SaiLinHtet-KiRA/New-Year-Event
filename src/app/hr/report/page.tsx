import { connection } from "next/server";
import { Card, EmptyState, PageHeading, StatCard, Table } from "@/components/ui";
import { getReport } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import ExportPdfButton from "./export-pdf-button";

export default async function ReportPage() {
  await connection();

  const report = await getReport();

  return (
    <div>
      <PageHeading
        eyebrow="HR administration"
        title="Management report"
        description="Prize collection status for management."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Participants" value={report.stats.participants} />
        <StatCard label="Total winners" value={report.stats.winners} />
        <StatCard label="Prizes collected" value={report.stats.collected} />
        <StatCard label="Pending collection" value={report.stats.pending} />
        <StatCard label="Collection rate" value={`${report.stats.collectionRate}%`} />
      </div>

      <Card
        title="Status by prize"
        className="mt-6"
        action={
          <div className="no-print flex flex-wrap gap-2">
            <a
              href="/api/report/csv"
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Export CSV
            </a>
            <ExportPdfButton
              generatedLabel={formatDateTime(report.generatedAt)}
              generatedBy={report.generatedBy}
              stats={report.stats}
              byPrize={report.byPrize}
            />
          </div>
        }
      >
        {report.byPrize.length === 0 ? (
          <EmptyState message="No prize data available yet." />
        ) : (
          <Table headers={["Prize", "Winners", "Collected", "Pending", "Progress"]}>
            {report.byPrize.map((row) => (
              <tr key={row.prize}>
                <td className="px-3 py-3 pl-0 font-medium text-stone-800">
                  {row.prize}
                </td>
                <td className="px-3 py-3 text-stone-700">{row.winners}</td>
                <td className="px-3 py-3 text-emerald-700">{row.collected}</td>
                <td className="px-3 py-3 text-amber-700">{row.pending}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${row.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-stone-600">{row.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <p className="mt-5 text-xs text-stone-500">
        Generated on {formatDateTime(report.generatedAt)} by {report.generatedBy}
      </p>
    </div>
  );
}
