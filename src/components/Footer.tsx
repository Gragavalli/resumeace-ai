import { Link } from 'react-router-dom'
import { FileText, Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-wide py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <FileText className="h-4 w-4" />
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                ResumeAce AI
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-400">
              Build ATS-friendly resumes with AI-powered analysis, instant scoring and one-click
              PDF download. Designed for students and freshers.
            </p>
            <div className="mt-4 flex gap-3">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-brand-700 dark:hover:text-brand-400"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Product</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/builder" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">Resume Builder</Link></li>
              <li><Link to="/analysis" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">Resume Analysis</Link></li>
              <li><Link to="/pricing" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/about" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">About</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ResumeAce AI. Built for students and freshers. All data stays on your device.</p>
        </div>
      </div>
    </footer>
  )
}
