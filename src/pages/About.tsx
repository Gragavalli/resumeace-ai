import { Link } from 'react-router-dom'
import { Heart, ShieldCheck, Zap, Target, ArrowRight, Sparkles } from 'lucide-react'

export default function About() {
  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300">
          <Sparkles className="h-4 w-4" /> Our Story
        </div>
        <h1 className="section-title">Helping students land their first job</h1>
        <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
          ResumeAce AI was built for a simple reason: most students and freshers struggle to create a resume
          that gets past automated screening systems. We make it easy to build, score, and improve your resume —
          all in your browser.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: Target, title: 'Our Mission', desc: 'Democratize access to great resumes. Every student deserves a fair shot at interviews, regardless of background or resources.' },
          { icon: ShieldCheck, title: 'Privacy First', desc: 'Your resume data never leaves your device. Everything runs locally in your browser — no accounts, no servers, no tracking.' },
          { icon: Zap, title: 'Instant Results', desc: 'No waiting, no emails. Get your ATS score, keyword analysis and improvement suggestions the moment you upload.' },
        ].map((f) => (
          <div key={f.title} className="card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-10 dark:from-slate-900 dark:to-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why ATS matters</h2>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Over 75% of resumes are filtered by Applicant Tracking Systems before a human ever sees them.
          These systems scan for keywords, formatting and structure. ResumeAce AI scores your resume
          against the same criteria, so you can fix issues before applying.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { stat: '75%', label: 'of resumes rejected by ATS before human review' },
            { stat: '40%', label: 'of candidates eliminated by keyword filtering' },
            { stat: '2x', label: 'more interviews with an optimized resume' },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <p className="text-3xl font-bold gradient-text">{s.stat}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-center">
        <Heart className="h-8 w-8 text-white" />
        <h2 className="text-2xl font-bold text-white">Built with care for students</h2>
        <p className="max-w-md text-brand-100">ResumeAce AI is and always will be free for students. No paywalls, no premium tiers that lock core features.</p>
        <Link to="/builder" className="btn bg-white text-brand-700 hover:bg-brand-50">
          Start building <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
