"use client";

import { jsPDF } from "jspdf";
import type { DashboardStats, PrizeReportRow } from "@/lib/types";

export default function ExportPdfButton({
  generatedLabel,
  generatedBy,
  stats,
  byPrize,
}: {
  generatedLabel: string;
  generatedBy: string;
  stats: DashboardStats;
  byPrize: PrizeReportRow[];
}) {
  function exportPdf() {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("HR Prize Draw - Management Report", 14, 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on ${generatedLabel} by ${generatedBy}`, 14, 26);
    doc.setDrawColor(210);
    doc.line(14, 31, 196, 31);

    let y = 42;
    doc.setFont("helvetica", "bold");
    doc.text("Overall collection status", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(
      `Participants: ${stats.participants}    Total winners: ${stats.winners}`,
      14,
      y,
    );
    y += 6;
    doc.text(
      `Prizes collected: ${stats.collected}    Pending collection: ${stats.pending}`,
      14,
      y,
    );
    y += 6;
    doc.text(`Collection rate: ${stats.collectionRate}%`, 14, y);

    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("Status by prize", 14, y);
    y += 8;
    doc.setFontSize(9);
    doc.text("Prize", 14, y);
    doc.text("Winners", 105, y);
    doc.text("Collected", 135, y);
    doc.text("Pending", 165, y);
    y += 3;
    doc.setDrawColor(220);
    doc.line(14, y, 196, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    for (const row of byPrize) {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(row.prize.slice(0, 38), 14, y);
      doc.text(String(row.winners), 105, y);
      doc.text(String(row.collected), 135, y);
      doc.text(String(row.pending), 165, y);
      y += 7;
    }

    doc.save("prize-draw-report.pdf");
  }

  return (
    <button
      type="button"
      onClick={exportPdf}
      className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
    >
      Export PDF
    </button>
  );
}
