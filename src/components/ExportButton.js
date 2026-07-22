"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ExportButton({ onExportExcel, onExportPDF, label = "Export" }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {label}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
            {onExportExcel && (
              <button
                onClick={() => { onExportExcel(); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <span className="text-lg">📊</span>
                Export to Excel
              </button>
            )}
            {onExportPDF && (
              <button
                onClick={() => { onExportPDF(); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <span className="text-lg">📄</span>
                Export to PDF
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Utility functions for exporting
export function exportToExcel(data, filename = "export") {
  try {
    // Dynamic import of xlsx
    import("xlsx").then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${filename}.xlsx`);
      toast.success("Excel file downloaded!");
    }).catch(() => {
      toast.error("Failed to load Excel export library");
    });
  } catch {
    toast.error("Failed to export to Excel");
  }
}

export function exportToPDF(data, columns, title, filename = "export") {
  try {
    import("jspdf").then(({ default: jsPDF }) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF("landscape");
        doc.setFontSize(16);
        doc.text(title, 14, 20);
        
        const tableData = data.map(row => columns.map(col => row[col.dataKey] ?? ""));
        
        doc.autoTable({
          head: [columns.map(col => col.label)],
          body: tableData,
          startY: 30,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [37, 99, 235] },
        });

        doc.save(`${filename}.pdf`);
        toast.success("PDF file downloaded!");
      }).catch(() => {
        toast.error("Failed to load PDF export library");
      });
    }).catch(() => {
      toast.error("Failed to load PDF export library");
    });
  } catch {
    toast.error("Failed to export to PDF");
  }
}

