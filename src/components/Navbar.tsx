import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun, Menu, X, FileText } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/builder', label: 'Resume Builder' },
  { to: '/analysis', label: 'Resume Analysis' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <nav className="container-wide flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <FileText className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            ResumeAce<span className="text-brand-600"> AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="btn-ghost h-9 w-9 !px-0"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/builder" className="btn-primary hidden sm:inline-flex">
            Get Started
          </Link>
          <button
            className="btn-ghost h-9 w-9 !px-0 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/builder" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
