import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

applyPlugin(jsPDF);

export interface ReportData {
  title: string;
  type: string;
  summary: string;
  tableHeaders: string[];
  tableRows: string[][];
  stats?: { label: string; value: string }[];
}

export function generatePDF(data: ReportData): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const ml = 14; const mr = 14;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(34, 197, 94);
  doc.text('Kenya Scout Association', pw / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.text('Management Information System', pw / 2, 28, { align: 'center' });
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.5);
  doc.line(ml, 33, pw - mr, 33);

  // Report title
  doc.setFontSize(16);
  doc.setTextColor(17, 24, 39);
  doc.text(data.title, ml, 46);

  // Metadata
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  const now = new Date();
  doc.text(`Generated: ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, ml, 54);
  doc.text(`Type: ${data.type}`, ml, 60);

  doc.setDrawColor(224, 224, 224);
  doc.line(ml, 65, pw - mr, 65);

  let cursorY = 73;

  // Stats summary cards
  if (data.stats && data.stats.length > 0) {
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 71);
    doc.text('Summary', ml, cursorY);
    cursorY += 8;

    data.stats.forEach((s, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = ml + col * 45;
      const y = cursorY + row * 14;
      doc.setFillColor(249, 250, 251);
      doc.rect(x, y - 4, 43, 12, 'F');
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      doc.text(s.label, x + 1, y + 1);
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.text(s.value, x + 1, y + 8);
      doc.setFont('helvetica', 'normal');
    });

    cursorY += (Math.ceil(data.stats.length / 4)) * 14 + 8;
    doc.setDrawColor(224, 224, 224);
    doc.line(ml, cursorY - 4, pw - mr, cursorY - 4);
  }

  // Narrative summary
  const summaryTextY = cursorY + 2;
  if (data.summary) {
    const lines = doc.splitTextToSize(data.summary, pw - ml - mr);
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text(lines, ml, summaryTextY);
    cursorY = summaryTextY + lines.length * 5 + 10;
  }

  // Data table
  const footerText = (page: number, total: number) =>
    `Kenya Scout Association — Confidential — Page ${page} of ${total}`;

  if (data.tableRows.length > 0) {
    try {
      (doc as any).autoTable({
        startY: cursorY + 2,
        head: [data.tableHeaders],
        body: data.tableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
        },
        bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        styles: { cellPadding: 4, halign: 'left' },
        margin: { top: 10, bottom: 20 },
      });
    } catch (e) {
      console.warn('AutoTable failed, drawing text manually:', e);
      doc.setFontSize(8);
      doc.setTextColor(55, 65, 81);
      data.tableRows.forEach((row, ri) => {
        const rowText = row.join('  |  ');
        if (cursorY > ph - 30) { doc.addPage(); cursorY = 20; }
        doc.text(rowText, ml, cursorY);
        cursorY += 6;
      });
    }
  }

  // Page labels
  for (let i = 1; i <= doc.getNumberOfPages(); i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(
      footerText(i, doc.getNumberOfPages()),
      pw / 2, ph - 10, { align: 'center' }
    );
  }

  return doc;
}
