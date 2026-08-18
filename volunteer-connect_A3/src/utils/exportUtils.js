import { jsPDF } from 'jspdf'

function escapeCsv(value) {
  const text = value == null ? '' : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

export function downloadCsv(filename, rows) {
  if (!rows.length) return false
  const columns = Object.keys(rows[0])
  const csv = [columns, ...rows.map((row) => columns.map((column) => row[column]))]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
  return true
}

export function downloadPdf(filename, title, rows) {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
  pdf.setFontSize(18)
  pdf.text(title, 40, 48)
  pdf.setFontSize(9)
  let y = 72
  rows.forEach((row) => {
    const line = Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(' | ')
    const lines = pdf.splitTextToSize(line, 515)
    if (y + lines.length * 13 > 790) { pdf.addPage(); y = 42 }
    pdf.text(lines, 40, y)
    y += lines.length * 13 + 8
  })
  pdf.save(filename)
  return true
}

export function csvAttachment(rows, filename = 'volunteerconnect-export.csv') {
  const columns = rows.length ? Object.keys(rows[0]) : []
  const csv = [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(escapeCsv).join(',')).join('\r\n')
  return { filename, content: btoa(unescape(encodeURIComponent(csv))), type: 'text/csv' }
}

