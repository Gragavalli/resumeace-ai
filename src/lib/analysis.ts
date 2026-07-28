import type { ResumeData } from '../types/resume'
import { KEYWORD_BANK, STRONG_VERBS, WEAK_VERBS } from './analysisKeywords'

export interface ScoreBreakdown {
  label: string
  score: number
  max: number
  weight: number
  details: string[]
}

export interface AnalysisResult {
  overall: number
  scores: ScoreBreakdown[]
  hiringChance: number
  missingKeywords: string[]
  weakActionVerbs: string[]
  strongActionVerbs: string[]
  suggestions: string[]
  wordCount: number
  keywordMatches: string[]
}

function normalize(text: string): string {
  return text.toLowerCase()
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function extractResumeText(data: ResumeData): string {
  const parts: string[] = []
  parts.push(data.personal.fullName, data.personal.title, data.personal.summary)
  for (const e of data.experience) {
    parts.push(e.position, e.company, ...e.bullets)
  }
  for (const p of data.projects) {
    parts.push(p.name, p.description, ...p.tech)
  }
  for (const e of data.education) {
    parts.push(e.institution, e.degree, e.field, e.description)
  }
  parts.push(...data.skills.map((s) => s.name))
  parts.push(...data.certifications, ...data.languages, data.targetRole)
  return normalize(parts.filter(Boolean).join(' '))
}

export function analyzeResume(data: ResumeData): AnalysisResult {
  const text = extractResumeText(data)
  const words = text.split(/\s+/).filter(Boolean)
  const wordCount = words.length

  // ---- Skills Score ----
  const resumeSkills = data.skills.map((s) => normalize(s.name))
  const skillsPresent = resumeSkills.length
  let skillsScore = 0
  const skillsDetails: string[] = []
  if (skillsPresent >= 12) skillsScore = 100
  else if (skillsPresent >= 8) skillsScore = 85
  else if (skillsPresent >= 5) skillsScore = 70
  else if (skillsPresent >= 3) skillsScore = 50
  else if (skillsPresent >= 1) skillsScore = 30
  if (skillsPresent < 5) skillsDetails.push('Add more skills — aim for at least 8–12 relevant ones.')
  if (skillsPresent === 0) skillsDetails.push('No skills listed. This is critical for ATS parsing.')

  // ---- Keyword Score ----
  const keywordMatches: string[] = []
  for (const kw of KEYWORD_BANK) {
    if (text.includes(kw)) keywordMatches.push(kw)
  }
  const uniqueMatches = [...new Set(keywordMatches)]
  let keywordScore = Math.min(100, uniqueMatches.length * 4)
  const keywordDetails: string[] = []
  if (uniqueMatches.length < 10) keywordDetails.push(`Only ${uniqueMatches.length} ATS keywords found. Add role-specific terms.`)
  if (uniqueMatches.length < 5) keywordDetails.push('Very few keywords — your resume may be filtered out by ATS.')

  // missing keywords — suggest relevant ones not present
  const missingKeywords = KEYWORD_BANK.filter((kw) => !text.includes(kw)).slice(0, 15)

  // ---- Formatting Score ----
  let formattingScore = 100
  const formattingDetails: string[] = []
  const hasEmail = /@/.test(data.personal.email)
  const hasPhone = data.personal.phone.length > 0
  const hasLocation = data.personal.location.length > 0
  const sectionCount =
    (data.experience.length > 0 ? 1 : 0) +
    (data.education.length > 0 ? 1 : 0) +
    (data.skills.length > 0 ? 1 : 0) +
    (data.projects.length > 0 ? 1 : 0) +
    (data.personal.summary.length > 0 ? 1 : 0)

  if (!hasEmail) { formattingScore -= 20; formattingDetails.push('Missing email address — essential for contact.') }
  if (!hasPhone) { formattingScore -= 10; formattingDetails.push('Missing phone number.') }
  if (!hasLocation) { formattingScore -= 5; formattingDetails.push('Missing location.') }
  if (sectionCount < 4) { formattingScore -= 15; formattingDetails.push(`Only ${sectionCount} sections detected. Aim for at least 4 (summary, experience, education, skills).`) }
  if (wordCount < 200) { formattingScore -= 15; formattingDetails.push('Resume is very short — add more detail to your experience bullets.') }
  if (wordCount > 900) { formattingScore -= 10; formattingDetails.push('Resume may be too long — aim for 1 page as a fresher.') }
  // bullet quality
  const allBullets = data.experience.flatMap((e) => e.bullets.filter(Boolean))
  const longBullets = allBullets.filter((b) => countWords(b) < 8).length
  if (allBullets.length > 0 && longBullets / allBullets.length > 0.4) {
    formattingScore -= 10
    formattingDetails.push('Many experience bullets are very short — expand them with metrics and impact.')
  }
  formattingScore = Math.max(0, Math.min(100, formattingScore))

  // ---- Experience Score ----
  let experienceScore = 0
  const experienceDetails: string[] = []
  const expCount = data.experience.length
  const totalBullets = data.experience.reduce((n, e) => n + e.bullets.filter(Boolean).length, 0)
  if (expCount >= 2) experienceScore += 40
  else if (expCount >= 1) experienceScore += 25
  if (totalBullets >= 6) experienceScore += 35
  else if (totalBullets >= 3) experienceScore += 20
  else if (totalBullets >= 1) experienceScore += 10
  // quantify check
  const quantified = allBullets.filter((b) => /\d+%|\$\d|\d+x|\d+,\d+|\d+\s/.test(b)).length
  if (allBullets.length > 0) {
    experienceScore += Math.round((quantified / allBullets.length) * 25)
    if (quantified / allBullets.length < 0.3) {
      experienceDetails.push('Few bullets contain numbers — add quantified achievements (e.g., "improved speed by 40%").')
    }
  }
  if (expCount === 0) experienceDetails.push('No experience entries. Add internships, projects, or volunteer work.')
  experienceScore = Math.max(0, Math.min(100, experienceScore))

  // ---- Education Score ----
  let educationScore = 0
  const educationDetails: string[] = []
  const eduCount = data.education.length
  if (eduCount >= 1) educationScore += 60
  if (eduCount >= 2) educationScore += 15
  const hasGpa = data.education.some((e) => e.gpa.length > 0)
  if (hasGpa) educationScore += 15
  const hasField = data.education.some((e) => e.field.length > 0)
  if (hasField) educationScore += 10
  if (eduCount === 0) educationDetails.push('No education entries — required for student/fresher resumes.')
  if (!hasGpa && eduCount > 0) educationDetails.push('Add your GPA or percentage to strengthen education.')
  educationScore = Math.max(0, Math.min(100, educationScore))

  // ---- ATS Overall Score (weighted) ----
  const scores: ScoreBreakdown[] = [
    { label: 'ATS Compatibility', score: formattingScore, max: 100, weight: 0.25, details: formattingDetails },
    { label: 'Skills', score: skillsScore, max: 100, weight: 0.20, details: skillsDetails },
    { label: 'Keywords', score: keywordScore, max: 100, weight: 0.20, details: keywordDetails },
    { label: 'Experience', score: experienceScore, max: 100, weight: 0.20, details: experienceDetails },
    { label: 'Education', score: educationScore, max: 100, weight: 0.15, details: educationDetails },
  ]
  const overall = Math.round(scores.reduce((sum, s) => sum + s.score * s.weight, 0))

  // ---- Hiring Chance ----
  // Weighted blend favouring experience + ATS + keywords
  const hiringChance = Math.round(
    Math.min(
      98,
      overall * 0.5 +
        experienceScore * 0.2 +
        keywordScore * 0.15 +
        formattingScore * 0.15,
    ),
  )

  // ---- Weak / strong action verbs ----
  const verbText = data.experience.flatMap((e) => e.bullets).join(' ').toLowerCase()
  const foundWeak: string[] = []
  for (const v of WEAK_VERBS) {
    const re = new RegExp(`\\b${v}\\b`, 'i')
    if (re.test(verbText) && !foundWeak.includes(v)) foundWeak.push(v)
  }
  const foundStrong: string[] = []
  for (const v of STRONG_VERBS) {
    const re = new RegExp(`\\b${v}\\b`, 'i')
    if (re.test(verbText) && !foundStrong.includes(v)) foundStrong.push(v)
  }

  // ---- 10 Suggestions ----
  const suggestions: string[] = []

  if (!hasEmail) suggestions.push('Add a professional email address so recruiters can contact you.')
  if (data.personal.summary.length < 50)
    suggestions.push('Write a stronger professional summary (2–3 sentences) highlighting your value.')
  if (data.personal.summary.length === 0)
    suggestions.push('Add a professional summary at the top — it is the first thing recruiters read.')
  if (expCount === 0)
    suggestions.push('Add at least one experience entry — internships, projects or volunteer work count.')
  if (totalBullets < 5)
    suggestions.push('Expand your experience bullets — aim for 3 quantified points per role.')
  if (allBullets.length > 0 && quantified / allBullets.length < 0.4)
    suggestions.push('Quantify your achievements with numbers (%, $, time saved, users impacted).')
  if (foundWeak.length > 0)
    suggestions.push(`Replace weak verbs like "${foundWeak.slice(0, 3).join(', ')}" with strong action verbs.`)
  if (uniqueMatches.length < 12)
    suggestions.push('Add more role-relevant keywords to pass ATS screening filters.')
  if (skillsPresent < 8)
    suggestions.push('List at least 8–12 skills relevant to your target role.')
  if (!hasGpa && eduCount > 0)
    suggestions.push('Include your GPA or percentage in your education section.')
  if (eduCount === 0)
    suggestions.push('Add your education details — degree, institution and dates.')
  if (data.projects.length === 0)
    suggestions.push('Add 1–2 projects to showcase hands-on skills, especially as a fresher.')
  if (!data.personal.linkedin)
    suggestions.push('Add your LinkedIn profile URL — many recruiters use it to verify candidates.')
  if (wordCount > 900)
    suggestions.push('Trim your resume to one page — freshers rarely need more.')
  if (sectionCount < 4)
    suggestions.push('Include all key sections: summary, experience, education and skills.')
  if (allBullets.some((b) => b.startsWith('Responsible for')))
    suggestions.push('Rewrite "Responsible for..." bullets as active achievements using strong verbs.')

  // Ensure exactly 10 suggestions
  while (suggestions.length < 10) {
    const filler = [
      'Use a clean, single-column layout for maximum ATS compatibility.',
      'Proofread for spelling and grammar — small errors hurt your credibility.',
      'Tailor your resume for each role by mirroring the job description keywords.',
      'Keep consistent date formatting across all entries (e.g., Mon YYYY).',
      'Save and submit your resume as a PDF to preserve formatting.',
    ]
    const next = filler[suggestions.length % filler.length]
    if (!suggestions.includes(next)) suggestions.push(next)
    else break
  }

  return {
    overall,
    scores,
    hiringChance,
    missingKeywords,
    weakActionVerbs: foundWeak,
    strongActionVerbs: foundStrong,
    suggestions: suggestions.slice(0, 10),
    wordCount,
    keywordMatches: uniqueMatches,
  }
}
