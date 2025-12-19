import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ================= SAFE FORMATTERS ================= */

const text = (v) =>
  v === null || v === undefined || v === '' ? '-' : String(v);

const money = (v) =>
  typeof v === 'number' && !isNaN(v) ? v.toFixed(2) : '0.00';

const date = (v) =>
  v ? new Date(v).toLocaleDateString() : '-';

const dateTime = (v) =>
  v ? new Date(v).toLocaleString() : '-';

/* ================= PDF GENERATOR ================= */

export const downloadInvoicePdf = (invoice = {}, companyId) => {
  const doc = new jsPDF();

  /* ---------- COLORS ---------- */
  const emerald = [16, 185, 129];
  const lightGray = [243, 244, 246];
  const darkGray = [75, 85, 99];
  const white = [255, 255, 255];

  /* ---------- HEADER ---------- */
  doc.setFillColor(...emerald);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(...white);
  doc.setFontSize(26);
  doc.setFont(undefined, 'bold');
  doc.text('BuRolls', 14, 20);

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Business Unit and Invoice Management System', 14, 27);

  let y = 45;

  /* ---------- INVOICE DETAILS ---------- */
  doc.setTextColor(...darkGray);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(`Invoice #${text(invoice.number)}`, 14, y);
  y += 10;

  doc.setFillColor(...lightGray);
  doc.roundedRect(14, y, 182, 24, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Type: ${text(invoice.type)}`, 20, y + 7);
  doc.text(`Status: ${text(invoice.status)}`, 20, y + 14);
  doc.text(`Created: ${date(invoice.createdAt)}`, 20, y + 21);

  y += 32;

  /* ---------- PAYMENT SUMMARY ---------- */
  const companyStatus = invoice.perCompanyStatus?.find(
    (p) => String(p?.company) === String(companyId)
  );

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...emerald);
  doc.text('Payment Summary', 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Amount']],
    body: [
      ['Total Amount', `$${money(invoice.totalAmount)}`],
      ['Your Share', `$${money(companyStatus?.companyShareAmount)}`],
      [
        `Super Admin Share (${text(invoice.superAdminPercentage)}%)`,
        `$${money(companyStatus?.superAdminShareAmount)}`
      ]
    ],
    headStyles: {
      fillColor: emerald,
      textColor: white,
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: darkGray,
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: lightGray
    },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 15;

  /* ---------- ITEMS ---------- */
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...emerald);
  doc.text('Invoice Items', 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['#', 'Customer', 'Address', 'Date', 'Code', 'Amount']],
    body:
      invoice.items?.map((item = {}, i) => [
        i + 1,
        text(item.customerName),
        text(item.billingAddress),
        date(item.billingDate),
        text(item.paymentCode),
        `$${money(item.amount)}`
      ]) || [],
    headStyles: {
      fillColor: emerald,
      textColor: white,
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGray
    },
    alternateRowStyles: {
      fillColor: lightGray
    },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 15;

  /* ---------- ACTION HISTORY ---------- */
  if (invoice.actionHistory?.length) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...emerald);
    doc.text('Action History', 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Role', 'Action', 'Date', 'Note']],
      body: invoice.actionHistory.map((a = {}, i) => [
        i + 1,
        text(a.actorRole),
        text(a.action),
        dateTime(a.createdAt),
        text(a.note)
      ]),
      headStyles: {
        fillColor: emerald,
        textColor: white,
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkGray
      },
      alternateRowStyles: {
        fillColor: lightGray
      },
      margin: { left: 14, right: 14 }
    });
  }

  /* ---------- FOOTER ---------- */
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...darkGray);
    doc.text(
      `Page ${i} of ${pages}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  /* ---------- SAVE ---------- */
  doc.save(`invoice-${text(invoice.number)}.pdf`);
};
