export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
  summary: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
  description: string
}

export interface SkillItem {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  link: string
  tech: string[]
}

export interface ResumeData {
  personal: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: SkillItem[]
  projects: ProjectItem[]
  certifications: string[]
  languages: string[]
  targetRole: string
}

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'compact'

export interface SavedResume {
  id: string
  name: string
  template: TemplateId
  data: ResumeData
  updatedAt: number
  createdAt: number
}

export const emptyResume: ResumeData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  targetRole: '',
}

export const sampleResume: ResumeData = {
  personal: {
    fullName: 'Aarav Sharma',
    title: 'Frontend Developer',
    email: 'aarav.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    website: 'aaravsharma.dev',
    linkedin: 'linkedin.com/in/aaravsharma',
    github: 'github.com/aaravsharma',
    summary:
      'Frontend Developer with 2 years of experience building responsive, accessible web applications with React and TypeScript. Passionate about clean UI architecture, performance optimization, and delivering pixel-perfect interfaces that delight users.',
  },
  experience: [
    {
      id: 'e1',
      company: 'TechNova Solutions',
      position: 'Junior Frontend Developer',
      location: 'Bengaluru, India',
      startDate: '2023-06',
      endDate: '',
      current: true,
      bullets: [
        'Developed and maintained 12+ React components for a customer dashboard used by 8,000+ users, improving page load time by 35%.',
        'Collaborated with designers to implement a design system that reduced UI inconsistencies by 50% across 4 products.',
        'Optimized bundle size using code splitting and lazy loading, reducing initial load time from 4.2s to 1.8s.',
      ],
    },
    {
      id: 'e2',
      company: 'StartupLab',
      position: 'Frontend Developer Intern',
      location: 'Remote',
      startDate: '2023-01',
      endDate: '2023-05',
      current: false,
      bullets: [
        'Built a landing page with Next.js that increased newsletter signups by 28%.',
        'Integrated REST APIs for a real-time analytics widget using React Query.',
      ],
    },
  ],
  education: [
    {
      id: 'ed1',
      institution: 'Vellore Institute of Technology',
      degree: 'B.Tech',
      field: 'Computer Science',
      startDate: '2019-08',
      endDate: '2023-05',
      gpa: '8.7 / 10',
      description: 'Coursework: Data Structures, Algorithms, Web Technologies, DBMS.',
    },
  ],
  skills: [
    { id: 's1', name: 'React', level: 'Advanced' },
    { id: 's2', name: 'TypeScript', level: 'Advanced' },
    { id: 's3', name: 'JavaScript', level: 'Advanced' },
    { id: 's4', name: 'Tailwind CSS', level: 'Advanced' },
    { id: 's5', name: 'Node.js', level: 'Intermediate' },
    { id: 's6', name: 'Git', level: 'Intermediate' },
    { id: 's7', name: 'REST APIs', level: 'Intermediate' },
    { id: 's8', name: 'Figma', level: 'Beginner' },
  ],
  projects: [
    {
      id: 'p1',
      name: 'DevFolio',
      description: 'A customizable developer portfolio generator built with React and Vite, with 200+ GitHub stars.',
      link: 'github.com/aaravsharma/devfolio',
      tech: ['React', 'Vite', 'Tailwind CSS'],
    },
    {
      id: 'p2',
      name: 'PomoFlow',
      description: 'A focus timer app with ambient sounds and productivity analytics, built during a hackathon.',
      link: 'github.com/aaravsharma/pomoflow',
      tech: ['React', 'TypeScript', 'IndexedDB'],
    },
  ],
  certifications: ['Meta Front-End Developer Certificate', 'freeCodeCamp Responsive Web Design'],
  languages: ['English (Fluent)', 'Hindi (Native)', 'Kannada (Conversational)'],
  targetRole: 'Frontend Developer',
}

export function formatDateRange(start: string, end: string, current: boolean): string {
  const fmt = (d: string) => {
    if (!d) return ''
    const [y, m] = d.split('-')
    if (!y) return d
    if (!m) return y
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const mi = parseInt(m, 10) - 1
    return `${months[mi] || ''} ${y}`.trim()
  }
  const s = fmt(start)
  const e = current ? 'Present' : fmt(end)
  if (s && e) return `${s} — ${e}`
  return s || e
}
