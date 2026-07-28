import { type ResumeData, type Experience, type Education, type SkillItem, type ProjectItem } from '../../types/resume'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface Props {
  data: ResumeData
  setData: (d: ResumeData) => void
}

const uid = () => Math.random().toString(36).slice(2, 9)

const inputCls = 'input'
const labelCls = 'label'

/* ---------- Personal Step ---------- */
export function PersonalStep({ data, setData }: Props) {
  const p = data.personal
  const set = (partial: Partial<ResumeData['personal']>) =>
    setData({ ...data, personal: { ...data.personal, ...partial } })

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Full Name</label>
          <input className={inputCls} value={p.fullName} onChange={(e) => set({ fullName: e.target.value })} placeholder="Aarav Sharma" />
        </div>
        <div>
          <label className={labelCls}>Professional Title</label>
          <input className={inputCls} value={p.title} onChange={(e) => set({ title: e.target.value })} placeholder="Frontend Developer" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Email</label>
          <input className={inputCls} type="email" value={p.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@email.com" />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input className={inputCls} value={p.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+91 98765 43210" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Location</label>
          <input className={inputCls} value={p.location} onChange={(e) => set({ location: e.target.value })} placeholder="Bengaluru, India" />
        </div>
        <div>
          <label className={labelCls}>Website</label>
          <input className={inputCls} value={p.website} onChange={(e) => set({ website: e.target.value })} placeholder="yourname.dev" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>LinkedIn</label>
          <input className={inputCls} value={p.linkedin} onChange={(e) => set({ linkedin: e.target.value })} placeholder="linkedin.com/in/..." />
        </div>
        <div>
          <label className={labelCls}>GitHub</label>
          <input className={inputCls} value={p.github} onChange={(e) => set({ github: e.target.value })} placeholder="github.com/..." />
        </div>
      </div>
      <div>
        <label className={labelCls}>Professional Summary</label>
        <textarea className={inputCls} rows={4} value={p.summary} onChange={(e) => set({ summary: e.target.value })} placeholder="A short 2–3 sentence summary highlighting your skills, experience and career goals." />
        <p className="mt-1 text-xs text-slate-400">{p.summary.length} characters — aim for 200–400.</p>
      </div>
      <div>
        <label className={labelCls}>Target Role (used for analysis)</label>
        <input className={inputCls} value={data.targetRole} onChange={(e) => setData({ ...data, targetRole: e.target.value })} placeholder="e.g. Frontend Developer" />
      </div>
    </div>
  )
}

/* ---------- Experience Step ---------- */
export function ExperienceStep({ data, setData }: Props) {
  const add = () => {
    const exp: Experience = { id: uid(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] }
    setData({ ...data, experience: [...data.experience, exp] })
  }
  const remove = (id: string) => setData({ ...data, experience: data.experience.filter((e) => e.id !== id) })
  const update = (id: string, partial: Partial<Experience>) =>
    setData({ ...data, experience: data.experience.map((e) => (e.id === id ? { ...e, ...partial } : e)) })

  return (
    <div className="space-y-6">
      {data.experience.length === 0 && (
        <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          No experience added yet. Add internships, jobs, or volunteer work.
        </p>
      )}
      {data.experience.map((e, idx) => (
        <div key={e.id} className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <GripVertical className="h-4 w-4 text-slate-400" /> Experience #{idx + 1}
            </span>
            <button onClick={() => remove(e.id)} className="text-slate-400 hover:text-error-500" aria-label="Remove">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Position</label>
              <input className={inputCls} value={e.position} onChange={(ev) => update(e.id, { position: ev.target.value })} placeholder="Junior Developer" />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input className={inputCls} value={e.company} onChange={(ev) => update(e.id, { company: ev.target.value })} placeholder="TechNova" />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Start Date</label>
              <input type="month" className={inputCls} value={e.startDate} onChange={(ev) => update(e.id, { startDate: ev.target.value })} />
            </div>
            <div>
              <label className={labelCls}>End Date</label>
              <input type="month" className={inputCls} value={e.endDate} disabled={e.current} onChange={(ev) => update(e.id, { endDate: ev.target.value })} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input type="checkbox" checked={e.current} onChange={(ev) => update(e.id, { current: ev.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                Currently here
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Location</label>
            <input className={inputCls} value={e.location} onChange={(ev) => update(e.id, { location: ev.target.value })} placeholder="Bengaluru, India" />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Bullet Points (achievements)</label>
            <div className="space-y-2">
              {e.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-2">
                  <span className="mt-2.5 text-slate-400">•</span>
                  <input
                    className={inputCls}
                    value={b}
                    onChange={(ev) => {
                      const bullets = [...e.bullets]
                      bullets[bi] = ev.target.value
                      update(e.id, { bullets })
                    }}
                    placeholder="Developed X that improved Y by Z%"
                  />
                  <button
                    onClick={() => update(e.id, { bullets: e.bullets.filter((_, i) => i !== bi) })}
                    className="mt-1 text-slate-400 hover:text-error-500"
                    aria-label="Remove bullet"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => update(e.id, { bullets: [...e.bullets, ''] })}
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                <Plus className="h-4 w-4" /> Add bullet
              </button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="btn-secondary w-full">
        <Plus className="h-4 w-4" /> Add Experience
      </button>
    </div>
  )
}

/* ---------- Education Step ---------- */
export function EducationStep({ data, setData }: Props) {
  const add = () => {
    const edu: Education = { id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }
    setData({ ...data, education: [...data.education, edu] })
  }
  const remove = (id: string) => setData({ ...data, education: data.education.filter((e) => e.id !== id) })
  const update = (id: string, partial: Partial<Education>) =>
    setData({ ...data, education: data.education.map((e) => (e.id === id ? { ...e, ...partial } : e)) })

  return (
    <div className="space-y-6">
      {data.education.map((e, idx) => (
        <div key={e.id} className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Education #{idx + 1}</span>
            <button onClick={() => remove(e.id)} className="text-slate-400 hover:text-error-500" aria-label="Remove">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Institution</label>
              <input className={inputCls} value={e.institution} onChange={(ev) => update(e.id, { institution: ev.target.value })} placeholder="VIT University" />
            </div>
            <div>
              <label className={labelCls}>Degree</label>
              <input className={inputCls} value={e.degree} onChange={(ev) => update(e.id, { degree: ev.target.value })} placeholder="B.Tech" />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Field</label>
              <input className={inputCls} value={e.field} onChange={(ev) => update(e.id, { field: ev.target.value })} placeholder="Computer Science" />
            </div>
            <div>
              <label className={labelCls}>Start</label>
              <input type="month" className={inputCls} value={e.startDate} onChange={(ev) => update(e.id, { startDate: ev.target.value })} />
            </div>
            <div>
              <label className={labelCls}>End</label>
              <input type="month" className={inputCls} value={e.endDate} onChange={(ev) => update(e.id, { endDate: ev.target.value })} />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>GPA / Percentage</label>
              <input className={inputCls} value={e.gpa} onChange={(ev) => update(e.id, { gpa: ev.target.value })} placeholder="8.7 / 10" />
            </div>
            <div>
              <label className={labelCls}>Description (optional)</label>
              <input className={inputCls} value={e.description} onChange={(ev) => update(e.id, { description: ev.target.value })} placeholder="Relevant coursework, honors..." />
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="btn-secondary w-full">
        <Plus className="h-4 w-4" /> Add Education
      </button>
    </div>
  )
}

/* ---------- Skills Step ---------- */
export function SkillsStep({ data, setData }: Props) {
  const add = () => {
    const s: SkillItem = { id: uid(), name: '', level: 'Intermediate' }
    setData({ ...data, skills: [...data.skills, s] })
  }
  const remove = (id: string) => setData({ ...data, skills: data.skills.filter((s) => s.id !== id) })
  const update = (id: string, partial: Partial<SkillItem>) =>
    setData({ ...data, skills: data.skills.map((s) => (s.id === id ? { ...s, ...partial } : s)) })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {data.skills.map((s) => (
          <div key={s.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <input
              className="w-28 bg-transparent text-sm focus:outline-none"
              value={s.name}
              onChange={(e) => update(s.id, { name: e.target.value })}
              placeholder="Skill"
            />
            <select
              className="rounded border border-slate-200 bg-transparent px-1 py-0.5 text-xs text-slate-600 focus:outline-none dark:border-slate-700 dark:text-slate-300"
              value={s.level}
              onChange={(e) => update(s.id, { level: e.target.value as SkillItem['level'] })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <button onClick={() => remove(s.id)} className="text-slate-400 hover:text-error-500" aria-label="Remove skill">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} className="btn-secondary">
        <Plus className="h-4 w-4" /> Add Skill
      </button>

      <div className="mt-4 border-t border-slate-200 pt-5 dark:border-slate-800">
        <label className={labelCls}>Certifications (one per line)</label>
        <textarea
          className={inputCls}
          rows={3}
          value={data.certifications.join('\n')}
          onChange={(e) => setData({ ...data, certifications: e.target.value.split('\n') })}
          placeholder="Meta Front-End Developer Certificate&#10;AWS Cloud Practitioner"
        />
      </div>
      <div>
        <label className={labelCls}>Languages (one per line)</label>
        <textarea
          className={inputCls}
          rows={3}
          value={data.languages.join('\n')}
          onChange={(e) => setData({ ...data, languages: e.target.value.split('\n') })}
          placeholder="English (Fluent)&#10;Hindi (Native)"
        />
      </div>
    </div>
  )
}

/* ---------- Projects Step ---------- */
export function ProjectsStep({ data, setData }: Props) {
  const add = () => {
    const p: ProjectItem = { id: uid(), name: '', description: '', link: '', tech: [] }
    setData({ ...data, projects: [...data.projects, p] })
  }
  const remove = (id: string) => setData({ ...data, projects: data.projects.filter((p) => p.id !== id) })
  const update = (id: string, partial: Partial<ProjectItem>) =>
    setData({ ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, ...partial } : p)) })

  return (
    <div className="space-y-6">
      {data.projects.map((p, idx) => (
        <div key={p.id} className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project #{idx + 1}</span>
            <button onClick={() => remove(p.id)} className="text-slate-400 hover:text-error-500" aria-label="Remove">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Name</label>
              <input className={inputCls} value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} placeholder="DevFolio" />
            </div>
            <div>
              <label className={labelCls}>Link</label>
              <input className={inputCls} value={p.link} onChange={(e) => update(p.id, { link: e.target.value })} placeholder="github.com/..." />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Description</label>
            <textarea className={inputCls} rows={2} value={p.description} onChange={(e) => update(p.id, { description: e.target.value })} placeholder="What does it do? What problem does it solve?" />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Tech Stack (comma separated)</label>
            <input
              className={inputCls}
              value={p.tech.join(', ')}
              onChange={(e) => update(p.id, { tech: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
              placeholder="React, TypeScript, Vite"
            />
          </div>
        </div>
      ))}
      <button onClick={add} className="btn-secondary w-full">
        <Plus className="h-4 w-4" /> Add Project
      </button>
    </div>
  )
}
