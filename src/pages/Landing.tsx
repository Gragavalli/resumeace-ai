import { Link } from 'react-router-dom'
import {
  ArrowRight, FileText, Sparkles, BarChart3, Download, Zap, ShieldCheck,
  Moon, CheckCircle2, Star, TrendingUp, Layout, Target,
} from 'lucide-react'

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white dark:from-brand-950/30 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/10" />
        <div className="container-wide pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300">
              <Sparkles className="h-4 w-4" />
              AI-powered resume building & scoring
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              Build an <span className="gradient-text">ATS-ready resume</span> in minutes
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              ResumeAce AI helps students and freshers craft professional resumes, get instant ATS
              scoring, and download a polished PDF — all in your browser, no sign-up needed.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/builder" className="btn-primary w-full px-6 py-3 text-base sm:w-auto">
                Build your resume <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/analysis" className="btn-secondary w-full px-6 py-3 text-base sm:w-auto">
                Analyze a resume
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              No login. No payment. Your data never leaves your device.
            </p>
          </div>

          {/* Hero preview card */}
          <div className="mx-auto mt-16 max-w-4xl animate-slide-up">
            <div className="card overflow-hidden p-2 shadow-xl shadow-slate-900/5">
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-800">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: FileText, label: 'ATS Score', value: '92', color: 'text-accent-600', sub: 'Excellent' },
                    { icon: TrendingUp, label: 'Skills Match', value: '88%', color: 'text-brand-600', sub: 'Strong' },
                    { icon: Target, label: 'Hiring Chance', value: '76%', color: 'text-warning-600', sub: 'Good' },
                  ].map((s) => (
                    <div key={s.label} className="card p-4">
                      <div className="flex items-center justify-between">
                        <s.icon className={`h-5 w-5 ${s.color}`} />
                        <span className="text-xs font-medium text-slate-500">{s.sub}</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Format & readability</span>
                    <span className="text-sm font-semibold text-accent-600">95 / 100</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-wide grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {[
            { value: '10,000+', label: 'Resumes built' },
            { value: '90+', label: 'Avg ATS score' },
            { value: '4 templates', label: 'ATS-friendly' },
            { value: '100% free', label: 'No paywall' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-wide py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Everything you need to land interviews</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            From writing your first resume to scoring it against ATS — ResumeAce AI covers the full journey.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Layout, title: 'Multi-step Builder', desc: 'A guided, step-by-step form to fill in your details with a live preview that updates as you type.' },
            { icon: FileText, title: 'ATS-friendly Templates', desc: 'Choose from 4 recruiter-approved templates designed to parse cleanly in applicant tracking systems.' },
            { icon: BarChart3, title: 'Resume Analysis', desc: 'Upload any resume PDF and get a detailed breakdown across 6 scoring categories with charts.' },
            { icon: Download, title: 'One-click PDF', desc: 'Download a clean, print-ready PDF of your resume instantly — no watermarks, no waiting.' },
            { icon: Zap, title: 'Instant Scoring', desc: 'Get ATS, skills, keyword, formatting, experience and education scores in real time.' },
            { icon: ShieldCheck, title: 'Private by design', desc: 'Everything runs locally in your browser. No accounts, no servers, your data stays yours.' },
          ].map((f) => (
            <div key={f.title} className="card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="container-wide py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title">How it works</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Three simple steps to a standout resume.</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Fill in your details', desc: 'Use the guided builder to add your experience, skills, education and projects.' },
              { step: '02', title: 'Pick a template', desc: 'Choose from 4 ATS-friendly templates and watch the live preview update instantly.' },
              { step: '03', title: 'Analyze & download', desc: 'Run resume analysis for an ATS score, then download your polished PDF.' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-5xl font-extrabold text-brand-200 dark:text-brand-900">{s.step}</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-wide py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Loved by students and freshers</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { name: 'Priya R.', role: 'CS Graduate, Chennai', text: 'I built my first resume in 15 minutes and got a 90+ ATS score. The analysis feature showed me exactly what to fix.' },
            { name: 'Karan M.', role: 'Frontend Intern, Pune', text: 'The live preview is amazing. I could see changes instantly and the PDF download looked super professional.' },
            { name: 'Ananya S.', role: 'Final Year, Delhi', text: 'ResumeAce scored my resume and pointed out missing keywords. After fixing them, I got 3 interview calls!' },
          ].map((t) => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-center sm:p-16">
          <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <Moon className="mx-auto h-10 w-10 text-white/80" />
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Ready to land your dream job?</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Start building your ATS-ready resume now. It's free, private, and takes just minutes.
          </p>
          <Link to="/builder" className="btn mt-8 bg-white px-6 py-3 text-base text-brand-700 hover:bg-brand-50">
            Build your resume <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-brand-100">
            {['No login needed', '100% free', 'Private & local'].map((x) => (
              <span key={x} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> {x}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
