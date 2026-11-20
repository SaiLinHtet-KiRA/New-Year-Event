import { connection } from "next/server";
import { getReport } from "@/lib/data";

function escapeCsv(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET() {
  await connection();

  const report = await getReport();
  const lines = [
    ["New Year Prize Draw - Management Report"],
    [`Generated on ${report.generatedAt} by ${report.generatedBy}`],
    [],
    ["Participants", "Total winners", "Prizes collected", "Pending collection", "Collection rate"],
    [
      report.stats.participants,
      report.stats.winners,
      report.stats.collected,
      report.stats.pending,
      `${report.stats.collectionRate}%`,
    ],
    [],
    ["Prize", "Winners", "Collected", "Pending", "Progress"],
    ...report.byPrize.map((row) => [
      row.prize,
      row.winners,
      row.collected,
      row.pending,
      `${row.progress}%`,
    ]),
  ];

  const csv = lines.map((line) => line.map(escapeCsv).join(",")).join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="prize-draw-report.csv"',
    },
  });
}
