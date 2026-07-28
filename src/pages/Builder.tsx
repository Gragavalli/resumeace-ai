import { useState } from 'react'
import { useResume } from '../context/ResumeContext'
import { type TemplateId } from '../types/resume'
import {
  User, Briefcase, GraduationCap, Wrench, FolderGit2, Layout, Eye,
  Download, FileText, RotateCcw, Sparkles, ChevronLeft, ChevronRight, Check,
} from 'lucide-react'
import { PersonalStep, ExperienceStep, EducationStep, SkillsStep, ProjectsStep } from '../components/builder/FormSteps'
import ResumePreview from '../components/ResumePreview'
import { generatePdf } from '../lib/pdf'

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
] as const

const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'modern', name: 'Modern', desc: 'Clean sans-serif with subtle accents' },
  { id: 'classic', name: 'Classic', desc: 'Traditional serif, centered header' },
  { id: 'minimal', name: 'Minimal', desc: 'Light, airy, lots of whitespace' },
  { id: 'compact', name: 'Compact', desc: 'Dense layout, fits more per page' },
]

export default function Builder() {
  const { data, template, setData, setTemplate, loadSample, reset } = useResume()
  const [step, setStep] = useState(0)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const goPrev = () => setStep((s) => Math.max(s - 1, 0))

  const handleDownload = () => generatePdf(data, template)

  return (
    <div className="container-wide py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">Resume Builder</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fill in your details — the preview updates live.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={loadSample} className="btn-secondary text-sm">
            <Sparkles className="h-4 w-4" /> Load Sample
          </button>
          <button onClick={reset} className="btn-ghost text-sm">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button onClick={handleDownload} className="btn-primary text-sm">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Mobile tab toggle */}
      <div className="mb-4 flex rounded-lg border border-slate-200 p-1 lg:hidden dark:border-slate-800">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mobileTab === 'edit' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Edit
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mobileTab === 'preview' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Preview
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* ---- Editor column ---- */}
        <div className={`${mobileTab === 'edit' ? 'block' : 'hidden'} lg:block`}>
          {/* Step indicator */}
          <div className="mb-5 flex items-center gap-1 overflow-x-auto pb-1">
            {STEPS.map((s, i) => {
              const active = i === step
              const done = i < step
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(i)}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                      : done
                        ? 'text-accent-600 dark:text-accent-400'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${active ? 'bg-brand-600 text-white' : done ? 'bg-accent-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              )
            })}
          </div>

          {/* Form card */}
          <div className="card p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              {(() => {
                const Icon = STEPS[step].icon
                return <Icon className="h-5 w-5 text-brand-600" />
              })()}
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{STEPS[step].label}</h2>
            </div>

            {step === 0 && <PersonalStep data={data} setData={setData} />}
            {step === 1 && <ExperienceStep data={data} setData={setData} />}
            {step === 2 && <EducationStep data={data} setData={setData} />}
            {step === 3 && <SkillsStep data={data} setData={setData} />}
            {step === 4 && <ProjectsStep data={data} setData={setData} />}

            {/* Nav buttons */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <button onClick={goPrev} disabled={step === 0} className="btn-secondary text-sm">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={goNext} className="btn-primary text-sm">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={handleDownload} className="btn-primary text-sm">
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              )}
            </div>
          </div>

          {/* Template picker */}
          <div className="mt-5 card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Layout className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Template</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`rounded-xl border p-3 text-left transition-all ${template === t.id ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:bg-brand-950/30' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}
                >
                  <div className="mb-2 flex h-16 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Preview column ---- */}
        <div className={`${mobileTab === 'preview' ? 'block' : 'hidden'} lg:block`}>
          <div className="lg:sticky lg:top-20">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Eye className="h-4 w-4" /> Live Preview
              </div>
              <button onClick={handleDownload} className="btn-ghost text-sm">
                <Download className="h-4 w-4" /> PDF
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner dark:border-slate-800 dark:bg-slate-800">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="origin-top scale-[0.78] sm:scale-90 lg:scale-100">
                  <ResumePreview data={data} template={template} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
