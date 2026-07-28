import { type ResumeData, formatDateRange } from '../types/resume'

interface Props {
  data: ResumeData
}

function MailIcon() {
  return <span className="mx-1.5 text-slate-400">•</span>
}

export function ModernTemplate({ data }: Props) {
  const { personal, experience, education, skills, projects, certifications, languages } = data
  return (
    <div className="resume-page mx-auto w-full max-w-[800px] px-10 py-10 font-sans text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="border-b-2 border-slate-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{personal.fullName || 'Your Name'}</h1>
        <p className="mt-1 text-base font-medium text-brand-700">{personal.title || 'Your Title'}</p>
        <p className="mt-2 text-slate-600">
          {personal.email && <>{personal.email}</>}
          {personal.phone && <MailIcon />}{personal.phone}
          {personal.location && <MailIcon />}{personal.location}
        </p>
        <p className="mt-1 text-slate-600">
          {personal.website && <>{personal.website}</>}
          {personal.linkedin && <MailIcon />}{personal.linkedin}
          {personal.github && <MailIcon />}{personal.github}
        </p>
      </header>

      {personal.summary && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">Summary</h2>
          <p className="text-slate-700">{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Experience</h2>
          {experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-slate-900">{e.position}{e.company && `, ${e.company}`}</h3>
                <span className="text-xs text-slate-500">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.location && <p className="text-xs italic text-slate-500">{e.location}</p>}
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-slate-700">
                  {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Projects</h2>
          {projects.map((p) => (
            <div key={p.id} className="mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-slate-900">{p.name}</h3>
                {p.link && <span className="text-xs text-slate-500">{p.link}</span>}
              </div>
              {p.description && <p className="text-slate-700">{p.description}</p>}
              {p.tech.length > 0 && <p className="text-xs text-slate-500"><em>Tech: {p.tech.join(', ')}</em></p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Education</h2>
          {education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-slate-900">{e.institution}</h3>
                <span className="text-xs text-slate-500">{formatDateRange(e.startDate, e.endDate, false)}</span>
              </div>
              <p className="text-slate-700">{e.degree}{e.field && `, ${e.field}`}{e.gpa && ` — GPA: ${e.gpa}`}</p>
              {e.description && <p className="text-slate-600">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s.id} className="rounded border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <section className="mt-4 grid grid-cols-2 gap-4">
          {certifications.length > 0 && (
            <div>
              <h2 className="mb-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">Certifications</h2>
              <ul className="list-disc space-y-0.5 pl-5 text-slate-700">
                {certifications.filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h2 className="mb-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">Languages</h2>
              <ul className="list-disc space-y-0.5 pl-5 text-slate-700">
                {languages.filter(Boolean).map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export function ClassicTemplate({ data }: Props) {
  const { personal, experience, education, skills, projects, certifications, languages } = data
  return (
    <div className="resume-page mx-auto w-full max-w-[800px] px-10 py-10 font-serif text-[13px]" style={{ fontFamily: 'Lora, Georgia, serif' }}>
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">{personal.fullName || 'Your Name'}</h1>
        <p className="mt-1 text-base text-slate-700">{personal.title || 'Your Title'}</p>
        <p className="mt-2 text-xs text-slate-600">
          {[personal.email, personal.phone, personal.location].filter(Boolean).join('  |  ')}
        </p>
        <p className="text-xs text-slate-600">
          {[personal.website, personal.linkedin, personal.github].filter(Boolean).join('  |  ')}
        </p>
      </header>
      <hr className="my-3 border-slate-300" />

      {personal.summary && (
        <section className="mb-3">
          <h2 className="mb-1 border-b border-slate-300 pb-0.5 text-sm font-bold uppercase tracking-wide text-slate-800">Summary</h2>
          <p className="text-slate-700">{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-3">
          <h2 className="mb-1 border-b border-slate-300 pb-0.5 text-sm font-bold uppercase tracking-wide text-slate-800">Experience</h2>
          {experience.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="font-bold text-slate-900">{e.company || e.position}</h3>
                <span className="text-xs text-slate-500">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              <p className="italic text-slate-700">{e.position}{e.location && ` · ${e.location}`}</p>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-slate-700">
                  {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-3">
          <h2 className="mb-1 border-b border-slate-300 pb-0.5 text-sm font-bold uppercase tracking-wide text-slate-800">Projects</h2>
          {projects.map((p) => (
            <div key={p.id} className="mb-1.5">
              <h3 className="font-bold text-slate-900">{p.name}</h3>
              {p.description && <p className="text-slate-700">{p.description}</p>}
              {p.tech.length > 0 && <p className="text-xs text-slate-500">Tech: {p.tech.join(', ')}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-3">
          <h2 className="mb-1 border-b border-slate-300 pb-0.5 text-sm font-bold uppercase tracking-wide text-slate-800">Education</h2>
          {education.map((e) => (
            <div key={e.id} className="mb-1.5">
              <div className="flex items-baseline justify-between">
                <h3 className="font-bold text-slate-900">{e.institution}</h3>
                <span className="text-xs text-slate-500">{formatDateRange(e.startDate, e.endDate, false)}</span>
              </div>
              <p className="text-slate-700">{e.degree}{e.field && `, ${e.field}`}{e.gpa && ` · GPA: ${e.gpa}`}</p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-3">
          <h2 className="mb-1 border-b border-slate-300 pb-0.5 text-sm font-bold uppercase tracking-wide text-slate-800">Skills</h2>
          <p className="text-slate-700">{skills.map((s) => s.name).join(', ')}</p>
        </section>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <section className="grid grid-cols-2 gap-4">
          {certifications.length > 0 && (
            <div>
              <h2 className="mb-1 border-b border-slate-300 pb-0.5 text-sm font-bold uppercase tracking-wide text-slate-800">Certifications</h2>
              <ul className="list-disc space-y-0.5 pl-5 text-slate-700">
                {certifications.filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h2 className="mb-1 border-b border-slate-300 pb-0.5 text-sm font-bold uppercase tracking-wide text-slate-800">Languages</h2>
              <ul className="list-disc space-y-0.5 pl-5 text-slate-700">
                {languages.filter(Boolean).map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export function MinimalTemplate({ data }: Props) {
  const { personal, experience, education, skills, projects, certifications, languages } = data
  return (
    <div className="resume-page mx-auto w-full max-w-[800px] px-10 py-10 font-sans text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header>
        <h1 className="text-2xl font-light tracking-tight text-slate-900">{personal.fullName || 'Your Name'}</h1>
        <p className="mt-0.5 text-sm font-medium text-slate-500">{personal.title || 'Your Title'}</p>
        <p className="mt-2 text-xs text-slate-500">
          {[personal.email, personal.phone, personal.location, personal.website, personal.linkedin, personal.github].filter(Boolean).join('  ·  ')}
        </p>
      </header>

      {personal.summary && (
        <section className="mt-5">
          <p className="text-slate-600">{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Experience</h2>
          {experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-medium text-slate-900">{e.position}</h3>
                <span className="text-xs text-slate-400">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              <p className="text-sm text-slate-500">{e.company}{e.location && ` · ${e.location}`}</p>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-slate-600">
                  {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Projects</h2>
          {projects.map((p) => (
            <div key={p.id} className="mb-2">
              <h3 className="font-medium text-slate-900">{p.name}</h3>
              {p.description && <p className="text-slate-600">{p.description}</p>}
              {p.tech.length > 0 && <p className="text-xs text-slate-400">{p.tech.join(' · ')}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Education</h2>
          {education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="font-medium text-slate-900">{e.institution}</h3>
                <span className="text-xs text-slate-400">{formatDateRange(e.startDate, e.endDate, false)}</span>
              </div>
              <p className="text-sm text-slate-500">{e.degree}{e.field && `, ${e.field}`}{e.gpa && ` · ${e.gpa}`}</p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Skills</h2>
          <p className="text-slate-600">{skills.map((s) => s.name).join(' · ')}</p>
        </section>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <section className="mt-5 grid grid-cols-2 gap-4">
          {certifications.length > 0 && (
            <div>
              <h2 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Certifications</h2>
              <ul className="space-y-0.5 text-slate-600">
                {certifications.filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h2 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Languages</h2>
              <ul className="space-y-0.5 text-slate-600">
                {languages.filter(Boolean).map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export function CompactTemplate({ data }: Props) {
  const { personal, experience, education, skills, projects, certifications, languages } = data
  return (
    <div className="resume-page mx-auto w-full max-w-[800px] px-8 py-8 font-sans text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="flex items-start justify-between border-b border-slate-300 pb-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm text-brand-700">{personal.title || 'Your Title'}</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>{personal.email}</p>
          <p>{personal.phone}</p>
          <p>{personal.location}</p>
          {personal.linkedin && <p>{personal.linkedin}</p>}
        </div>
      </header>

      {personal.summary && (
        <section className="mt-2">
          <h2 className="text-[11px] font-bold uppercase text-slate-700">Profile</h2>
          <p className="mt-0.5 text-slate-600">{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-3">
          <h2 className="text-[11px] font-bold uppercase text-slate-700">Experience</h2>
          {experience.map((e) => (
            <div key={e.id} className="mt-1.5">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-slate-900">{e.position} · {e.company}</span>
                <span className="text-xs text-slate-400">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-slate-600">
                  {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-3">
          <h2 className="text-[11px] font-bold uppercase text-slate-700">Projects</h2>
          {projects.map((p) => (
            <div key={p.id} className="mt-1">
              <span className="font-semibold text-slate-900">{p.name}</span>
              {p.description && <span className="text-slate-600"> — {p.description}</span>}
              {p.tech.length > 0 && <span className="text-xs text-slate-400"> ({p.tech.join(', ')})</span>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-3">
          <h2 className="text-[11px] font-bold uppercase text-slate-700">Education</h2>
          {education.map((e) => (
            <div key={e.id} className="mt-1 flex items-baseline justify-between">
              <span className="font-semibold text-slate-900">{e.institution} — {e.degree}{e.field && `, ${e.field}`}</span>
              <span className="text-xs text-slate-400">{formatDateRange(e.startDate, e.endDate, false)}</span>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-3">
          <h2 className="text-[11px] font-bold uppercase text-slate-700">Skills</h2>
          <p className="mt-0.5 text-slate-600">{skills.map((s) => s.name).join(' · ')}</p>
        </section>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <section className="mt-3 grid grid-cols-2 gap-3">
          {certifications.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase text-slate-700">Certs</h2>
              <p className="text-slate-600">{certifications.filter(Boolean).join(' · ')}</p>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase text-slate-700">Languages</h2>
              <p className="text-slate-600">{languages.filter(Boolean).join(' · ')}</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
