import type { ScoreBreakdown } from './analysis'

export interface TextAnalysisResult {
  overall: number
  scores: ScoreBreakdown[]
  hiringChance: number
  missingKeywords: string[]
  weakActionVerbs: string[]
  strongActionVerbs: string[]
  suggestions: string[]
  wordCount: number
  keywordMatches: string[]
  detectedSections: string[]
  hasEmail: boolean
  hasPhone: boolean
  hasLinks: boolean
}

import { KEYWORD_BANK, STRONG_VERBS, WEAK_VERBS } from './analysisKeywords'

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function hasSection(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text))
}

export function analyzeText(text: string): TextAnalysisResult {
  const lower = text.toLowerCase()
  const wordCount = countWords(text)
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean)

  // ---- Section detection ----
  const detectedSections: string[] = []
  if (hasSection(lower, [/^summary\b/m, /^profile\b/m, /^objective\b/m, /^about\b/m])) detectedSections.push('Summary')
  if (hasSection(lower, [/^experience\b/m, /^work\b/m, /^employment\b/m, /^internship/m])) detectedSections.push('Experience')
  if (hasSection(lower, [/^education\b/m])) detectedSections.push('Education')
  if (hasSection(lower, [/^skills?\b/m, /^technical skills\b/m, /^core competencies\b/m])) detectedSections.push('Skills')
  if (hasSection(lower, [/^projects?\b/m, /^personal projects\b/m])) detectedSections.push('Projects')
  if (hasSection(lower, [/^certifications?\b/m, /^certificates?\b/m])) detectedSections.push('Certifications')
  if (hasSection(lower, [/^languages?\b/m])) detectedSections.push('Languages')

  // ---- Contact info ----
  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text)
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(text)
  const hasLinks = /linkedin\.com|github\.com|https?:\/\//i.test(text)

  // ---- Skills Score ----
  let skillsScore = 0
  const skillsDetails: string[] = []
  const skillKeywordsFound = KEYWORD_BANK.filter((k) => lower.includes(k))
  if (skillKeywordsFound.length >= 12) skillsScore = 100
  else if (skillKeywordsFound.length >= 8) skillsScore = 85
  else if (skillKeywordsFound.length >= 5) skillsScore = 70
  else if (skillKeywordsFound.length >= 3) skillsScore = 50
  else if (skillKeywordsFound.length >= 1) skillsScore = 30
  if (skillKeywordsFound.length < 5) skillsDetails.push('Very few skills detected — add a dedicated skills section.')

  // ---- Keyword Score ----
  const keywordMatches = [...new Set(KEYWORD_BANK.filter((k) => lower.includes(k)))]
  let keywordScore = Math.min(100, keywordMatches.length * 4)
  const keywordDetails: string[] = []
  if (keywordMatches.length < 10) keywordDetails.push(`Only ${keywordMatches.length} ATS keywords found. Add role-specific terms.`)
  const missingKeywords = KEYWORD_BANK.filter((k) => !lower.includes(k)).slice(0, 15)

  // ---- Formatting Score ----
  let formattingScore = 100
  const formattingDetails: string[] = []
  if (!hasEmail) { formattingScore -= 20; formattingDetails.push('Missing email address — essential for contact.') }
  if (!hasPhone) { formattingScore -= 10; formattingDetails.push('Missing phone number.') }
  if (!hasLinks) { formattingScore -= 8; formattingDetails.push('No LinkedIn or GitHub links detected.') }
  if (detectedSections.length < 4) {
    formattingScore -= 15
    formattingDetails.push(`Only ${detectedSections.length} sections detected. Aim for at least 4 (summary, experience, education, skills).`)
  }
  if (wordCount < 200) { formattingScore -= 15; formattingDetails.push('Resume is very short — add more detail.') }
  if (wordCount > 900) { formattingScore -= 10; formattingDetails.push('Resume may be too long for a fresher — aim for one page.') }
  // bullet detection
  const bulletLines = lines.filter((l) => /^[•\-*▪◦]/.test(l) || /^\d+\.\s/.test(l)).length
  if (bulletLines < 3 && wordCount > 100) {
    formattingScore -= 8
    formattingDetails.push('Few bullet points detected — use bullets for experience achievements.')
  }
  formattingScore = Math.max(0, Math.min(100, formattingScore))

  // ---- Experience Score ----
  let experienceScore = 0
  const experienceDetails: string[] = []
  const hasExperienceSection = detectedSections.includes('Experience')
  if (hasExperienceSection) experienceScore += 40
  // quantify check
  const quantified = (lower.match(/\d+%|\$\d|\d+x|\d+,\d+|\d+\s(users?|customers?|clients?|projects?|months?|years?)/g) || []).length
  experienceScore += Math.min(40, quantified * 8)
  // action verbs in text
  const verbCount = STRONG_VERBS.filter((v) => new RegExp(`\\b${v}\\b`).test(lower)).length
  experienceScore += Math.min(20, verbCount * 3)
  if (!hasExperienceSection) experienceDetails.push('No experience section detected — add internships, jobs, or projects.')
  if (quantified < 3) experienceDetails.push('Few quantified achievements — add numbers (%, $, users, time saved).')
  experienceScore = Math.max(0, Math.min(100, experienceScore))

  // ---- Education Score ----
  let educationScore = 0
  const educationDetails: string[] = []
  if (detectedSections.includes('Education')) educationScore += 70
  if (/\b(b\.?tech|bachelor|b\.?e\.?|b\.?sc|m\.?tech|master|m\.?sc|mba|diploma|phd)\b/i.test(text)) educationScore += 20
  if (/\b(gpa|cgpa|percentage|%\s*(?:scored|obtained)|\d+\.\d+\s*\/\s*10)\b/i.test(text)) educationScore += 10
  if (!detectedSections.includes('Education')) educationDetails.push('No education section detected — required for student/fresher resumes.')
  educationScore = Math.max(0, Math.min(100, educationScore))

  // ---- Scores ----
  const scores: ScoreBreakdown[] = [
    { label: 'ATS Compatibility', score: formattingScore, max: 100, weight: 0.25, details: formattingDetails },
    { label: 'Skills', score: skillsScore, max: 100, weight: 0.20, details: skillsDetails },
    { label: 'Keywords', score: keywordScore, max: 100, weight: 0.20, details: keywordDetails },
    { label: 'Experience', score: experienceScore, max: 100, weight: 0.20, details: experienceDetails },
    { label: 'Education', score: educationScore, max: 100, weight: 0.15, details: educationDetails },
  ]
  const overall = Math.round(scores.reduce((sum, s) => sum + s.score * s.weight, 0))
  const hiringChance = Math.round(
    Math.min(98, overall * 0.5 + experienceScore * 0.2 + keywordScore * 0.15 + formattingScore * 0.15),
  )

  // ---- Verbs ----
  const weakActionVerbs: string[] = []
  for (const v of WEAK_VERBS) {
    if (new RegExp(`\\b${v}\\b`, 'i').test(lower) && !weakActionVerbs.includes(v)) weakActionVerbs.push(v)
  }
  const strongActionVerbs: string[] = []
  for (const v of STRONG_VERBS) {
    if (new RegExp(`\\b${v}\\b`, 'i').test(lower) && !strongActionVerbs.includes(v)) strongActionVerbs.push(v)
  }

  // ---- 10 Suggestions ----
  const suggestions: string[] = []
  if (!hasEmail) suggestions.push('Add a professional email address so recruiters can contact you.')
  if (!hasPhone) suggestions.push('Add a phone number for recruiters to reach you.')
  if (!hasLinks) suggestions.push('Add your LinkedIn and GitHub profile links.')
  if (!detectedSections.includes('Summary')) suggestions.push('Add a professional summary at the top — it is the first thing recruiters read.')
  if (!detectedSections.includes('Experience')) suggestions.push('Add an experience section with internships, jobs, or volunteer work.')
  if (!detectedSections.includes('Education')) suggestions.push('Add your education details — degree, institution and dates.')
  if (!detectedSections.includes('Skills')) suggestions.push('Add a dedicated skills section with 8–12 relevant skills.')
  if (quantified < 3) suggestions.push('Quantify your achievements with numbers (%, $, users impacted, time saved).')
  if (weakActionVerbs.length > 0) suggestions.push(`Replace weak verbs like "${weakActionVerbs.slice(0, 3).join(', ')}" with strong action verbs.`)
  if (keywordMatches.length < 12) suggestions.push('Add more role-relevant keywords to pass ATS screening filters.')
  if (skillKeywordsFound.length < 8) suggestions.push('List at least 8–12 skills relevant to your target role.')
  if (wordCount < 200) suggestions.push('Your resume is short — add more detail to your experience and projects.')
  if (wordCount > 900) suggestions.push('Trim your resume to one page — freshers rarely need more.')
  if (bulletLines < 3) suggestions.push('Use bullet points for your experience achievements instead of paragraphs.')
  if (!detectedSections.includes('Projects')) suggestions.push('Add 1–2 projects to showcase hands-on skills, especially as a fresher.')
  if (/responsible for/i.test(lower)) suggestions.push('Rewrite "Responsible for..." as active achievements using strong verbs.')

  const filler = [
    'Use a clean, single-column layout for maximum ATS compatibility.',
    'Proofread for spelling and grammar — small errors hurt your credibility.',
    'Tailor your resume for each role by mirroring the job description keywords.',
    'Keep consistent date formatting across all entries (e.g., Mon YYYY).',
    'Save and submit your resume as a PDF to preserve formatting.',
  ]
  let fi = 0
  while (suggestions.length < 10 && fi < filler.length) {
    if (!suggestions.includes(filler[fi])) suggestions.push(filler[fi])
    fi++
  }

  return {
    overall,
    scores,
    hiringChance,
    missingKeywords,
    weakActionVerbs,
    strongActionVerbs,
    suggestions: suggestions.slice(0, 10),
    wordCount,
    keywordMatches,
    detectedSections,
    hasEmail,
    hasPhone,
    hasLinks,
  }
}
