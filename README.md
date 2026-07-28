# ResumeAce AI

AI Resume Builder for Indian Students and Freshers.

Build ATS-ready resumes with a live preview, instant ATS scoring, and one-click PDF download — all in your browser. No login, no database, no payment.

## Features

- **Landing Page** — premium Stripe/Notion-style hero, features, testimonials and CTAs
- **Resume Builder** — multi-step form (personal, experience, education, skills, projects) with a live preview that updates as you type
- **Live Resume Preview** — see changes instantly in a real resume layout
- **4 ATS-friendly Templates** — Modern, Classic, Minimal, Compact
- **Download PDF** — clean, print-ready PDF generated locally (no watermarks)
- **Resume Analysis** — upload any resume PDF and get instant scoring:
  - ATS Compatibility score
  - Skills score
  - Keyword score
  - Formatting score
  - Experience score
  - Education score
  - Hiring chance %
  - Missing keywords
  - Weak and strong action verbs
  - 10 improvement suggestions
  - Interactive charts (gauge, bar, radar)
- **PDF Upload & Text Extraction** — extracts text from uploaded PDFs entirely in-browser
- **Dark Mode** — full light/dark theme with system preference detection
- **Mobile Responsive** — works from phone to desktop
- **Local Storage Only** — your data stays on your device, never sent anywhere

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- React Router 6
- Recharts (charts)
- jsPDF (PDF generation)
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
```

## Project Structure

```
src/
  components/        # Navbar, Footer, ResumePreview, ResumeTemplates, Charts
    builder/         # Multi-step form components
  context/           # Theme + Resume state (localStorage)
  lib/               # PDF generation, text extraction, analysis engine
  pages/             # Landing, Builder, Analysis, About, Contact, Pricing
  types/             # Resume data model
```

All data is stored in the browser's localStorage. No backend, no accounts, no tracking.
