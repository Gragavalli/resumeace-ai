import { Link } from 'react-router-dom'
import { Check, ArrowRight, Sparkles, Building2 } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      desc: 'Everything you need to build and score your resume.',
      icon: Sparkles,
      features: [
        'Unlimited resume building',
        '4 ATS-friendly templates',
        'Live resume preview',
        'PDF download',
        'Resume analysis & scoring',
        'ATS, skills & keyword scores',
        '10 improvement suggestions',
        'Local storage — no login',
      ],
      cta: 'Get Started',
      featured: true,
    },
    {
      name: 'Campus',
      price: '₹0',
      period: 'for students',
      desc: 'Same powerful tools, branded for campus drives.',
      icon: Building2,
      features: [
        'Everything in Free',
        'Bulk resume scoring',
        'Campus branding',
        'Placement cell dashboard',
        'Email support',
      ],
      cta: 'Contact Us',
      featured: false,
    },
  ]

  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="section-title">Simple, honest pricing</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          ResumeAce AI is free for every student. No hidden fees, no premium paywalls on core features.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`card relative p-8 ${p.featured ? 'ring-2 ring-brand-500' : ''}`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
            )}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{p.name}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.desc}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{p.price}</span>
              <span className="text-sm text-slate-500">/{p.period}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to={p.featured ? '/builder' : '/contact'}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                p.featured
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {p.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
        All features work offline in your browser. Your data is never sent to a server.
      </p>
    </div>
  )
}
