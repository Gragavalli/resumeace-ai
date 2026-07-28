import { useState } from 'react'
import { Mail, MessageSquare, MapPin, Send, CircleCheck as CheckCircle2 } from 'lucide-react'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="section-title">Get in touch</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Have a question, suggestion, or found a bug? We'd love to hear from you.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-[1fr_2fr]">
        {/* Info */}
        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email', value: 'hello@resumeace.ai' },
            { icon: MessageSquare, title: 'Feedback', value: 'We read every message' },
            { icon: MapPin, title: 'Location', value: 'Bengaluru, India' },
          ].map((c) => (
            <div key={c.title} className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{c.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="card p-6">
          {sent && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent-50 px-4 py-3 text-sm text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
              <CheckCircle2 className="h-5 w-5" /> Thanks! Your message has been recorded locally.
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="input" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Send className="h-4 w-4" /> Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
