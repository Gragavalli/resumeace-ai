import { jsPDF } from 'jspdf'
import type { ResumeData, TemplateId } from '../types/resume'
import { formatDateRange } from '../types/resume'

const MARGIN = 40
const PAGE_W = 595.28 // A4 in pt
const PAGE_H = 841.89
const CONTENT_W = PAGE_W - MARGIN * 2
const LINE_H = 14

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - MARGIN) {
    doc.addPage()
    return MARGIN
  }
  return y
}

function addWrappedText(doc: jsPDF, text: string, y: number, indent = 0): number {
  const lines = doc.splitTextToSize(text, CONTENT_W - indent) as string[]
  for (const line of lines) {
    y = ensureSpace(doc, y, LINE_H)
    doc.text(line, MARGIN + indent, y)
    y += LINE_H
  }
  return y
}

export function generatePdf(data: ResumeData, _template: TemplateId): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setFont('helvetica', 'normal')
  let y = MARGIN

  // Name
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 41, 59)
  doc.text(data.personal.fullName || 'Your Name', MARGIN, y)
  y += 22

  // Title
  if (data.personal.title) {
    doc.setFontSize(13)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(24, 102, 236)
    doc.text(data.personal.title, MARGIN, y)
    y += 16
  }

  // Contact line 1
  doc.setFontSize(9.5)
  doc.setTextColor(71, 85, 105)
  const contact1 = [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join('  •  ')
  if (contact1) {
    doc.text(contact1, MARGIN, y)
    y += 12
  }
  const contact2 = [data.personal.website, data.personal.linkedin, data.personal.github].filter(Boolean).join('  •  ')
  if (contact2) {
    doc.text(contact2, MARGIN, y)
    y += 12
  }

  // Divider
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.8)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  y += 16

  const sectionTitle = (title: string, currentY: number) => {
    currentY = ensureSpace(doc, currentY, 24)
    doc.setFontSize(10.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 41, 59)
    doc.text(title.toUpperCase(), MARGIN, currentY)
    currentY += 4
    doc.setDrawColor(203, 213, 225)
    doc.setLineWidth(0.4)
    doc.line(MARGIN, currentY, PAGE_W - MARGIN, currentY)
    currentY += 12
    doc.setFont('helvetica', 'normal')
    return currentY
  }

  // Summary
  if (data.personal.summary) {
    y = sectionTitle('Summary', y)
    doc.setFontSize(10)
    doc.setTextColor(51, 65, 85)
    y = addWrappedText(doc, data.personal.summary, y)
    y += 8
  }

  // Experience
  if (data.experience.length > 0) {
    y = sectionTitle('Experience', y)
    for (const e of data.experience) {
      y = ensureSpace(doc, y, 40)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      const header = e.position + (e.company ? `, ${e.company}` : '')
      doc.text(doc.splitTextToSize(header, CONTENT_W - 110)[0], MARGIN, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text(formatDateRange(e.startDate, e.endDate, e.current), PAGE_W - MARGIN, y, { align: 'right' })
      y += 13
      if (e.location) {
        doc.setFontSize(9.5)
        doc.setTextColor(100, 116, 139)
        doc.text(e.location, MARGIN, y)
        y += 12
      }
      for (const b of e.bullets.filter(Boolean)) {
        doc.setFontSize(10)
        doc.setTextColor(51, 65, 85)
        const lines = doc.splitTextToSize(`• ${b}`, CONTENT_W - 12) as string[]
        for (const line of lines) {
          y = ensureSpace(doc, y, LINE_H)
          doc.text(line, MARGIN + 8, y)
          y += LINE_H
        }
      }
      y += 6
    }
  }

  // Projects
  if (data.projects.length > 0) {
    y = sectionTitle('Projects', y)
    for (const p of data.projects) {
      y = ensureSpace(doc, y, 30)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text(p.name, MARGIN, y)
      y += 13
      if (p.description) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(51, 65, 85)
        y = addWrappedText(doc, p.description, y, 4)
      }
      if (p.tech.length > 0) {
        doc.setFontSize(9)
        doc.setTextColor(100, 116, 139)
        y = addWrappedText(doc, `Tech: ${p.tech.join(', ')}`, y, 4)
      }
      y += 4
    }
  }

  // Education
  if (data.education.length > 0) {
    y = sectionTitle('Education', y)
    for (const e of data.education) {
      y = ensureSpace(doc, y, 30)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text(doc.splitTextToSize(e.institution, CONTENT_W - 110)[0], MARGIN, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text(formatDateRange(e.startDate, e.endDate, false), PAGE_W - MARGIN, y, { align: 'right' })
      y += 13
      doc.setFontSize(10)
      doc.setTextColor(51, 65, 85)
      const eduLine = e.degree + (e.field ? `, ${e.field}` : '') + (e.gpa ? ` — GPA: ${e.gpa}` : '')
      y = addWrappedText(doc, eduLine, y)
      if (e.description) {
        y = addWrappedText(doc, e.description, y, 4)
      }
      y += 4
    }
  }

  // Skills
  if (data.skills.length > 0) {
    y = sectionTitle('Skills', y)
    doc.setFontSize(10)
    doc.setTextColor(51, 65, 85)
    y = addWrappedText(doc, data.skills.map((s) => s.name).join(', '), y)
    y += 8
  }

  // Certifications
  if (data.certifications.filter(Boolean).length > 0) {
    y = sectionTitle('Certifications', y)
    doc.setFontSize(10)
    doc.setTextColor(51, 65, 85)
    for (const c of data.certifications.filter(Boolean)) {
      y = addWrappedText(doc, `• ${c}`, y)
    }
    y += 4
  }

  // Languages
  if (data.languages.filter(Boolean).length > 0) {
    y = sectionTitle('Languages', y)
    doc.setFontSize(10)
    doc.setTextColor(51, 65, 85)
    y = addWrappedText(doc, data.languages.filter(Boolean).join(', '), y)
  }

  const fileName = (data.personal.fullName || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase()
  doc.save(`${fileName}_resume.pdf`)
}
