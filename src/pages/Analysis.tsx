import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Loader as Loader2, CircleAlert as AlertCircle, TrendingUp, Target, Zap, Sparkles, Lightbulb, Circle as XCircle, CircleCheck as CheckCircle2, KeyRound, TriangleAlert as AlertTriangle, ArrowRight, RefreshCw, FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { extractTextFromPdf } from '../lib/pdfExtract'
import { analyzeText, type TextAnalysisResult } from '../lib/analyzeText'
import { useResume } from '../context/ResumeContext'
import { analyzeResume } from '../lib/analysis'
import { ScoreGauge, ScoreBars, ScoreRadar, scoreColor, scoreLabel } from '../components/Charts'

type Mode = 'idle' | 'loading' | 'result' | 'error'

export default function Analysis() {
  const { data } = useResume()
  const [mode, setMode] = useState<Mode>('idle')
  const [result, setResult] = useState<TextAnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file.')
      setMode('error')
      return
    }
    setMode('loading')
    setFileName(file.name)
    try {
      const extracted = await extractTextFromPdf(file)
      if (extracted.wordCount < 20) {
        setError('Could not extract enough text from this PDF. It may be a scanned image or use unusual encoding.')
        setMode('error')
        return
      }
      const analysis = analyzeText(extracted.text)
      setResult(analysis)
      setMode('result')
    } catch {
      setError('Failed to read this PDF file. Please try a different file.')
      setMode('error')
    }
  }, [])

  const handleAnalyzeBuilt = () => {
    const analysis = analyzeResume(data)
    const textResult: TextAnalysisResult = {
      overall: analysis.overall,
      scores: analysis.scores,
      hiringChance: analysis.hiringChance,
      missingKeywords: analysis.missingKeywords,
      weakActionVerbs: analysis.weakActionVerbs,
      strongActionVerbs: analysis.strongActionVerbs,
      suggestions: analysis.suggestions,
      wordCount: analysis.wordCount,
      keywordMatches: analysis.keywordMatches,
      detectedSections: [],
      hasEmail: !!data.personal.email,
      hasPhone: !!data.personal.phone,
      hasLinks: !!data.personal.linkedin || !!data.personal.github,
    }
    setResult(textResult)
    setFileName('Your built resume')
    setMode('result')
  }

  const reset = () => {
    setMode('idle')
    setResult(null)
    setError('')
    setFileName('')
  }

  return (
    <div className="container-wide py-6 sm:py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Resume Analysis</h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600 dark:text-slate-400">
          Upload a resume PDF or analyze the one you built. Get instant ATS scoring across 5 categories.
        </p>
      </div>

      {/* Upload / options */}
      {mode === 'idle' && (
        <div className="mx-auto max-w-2xl space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const f = e.dataTransfer.files?.[0]
              if (f) handleFile(f)
            }}
            className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
              dragOver
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <Upload className="h-7 w-7" />
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Drop your resume PDF here</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or click to browse — processed locally, never uploaded</p>
            <button onClick={() => inputRef.current?.click()} className="btn-primary mt-5">
              <FileText className="h-4 w-4" /> Choose PDF
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <button onClick={handleAnalyzeBuilt} className="btn-secondary w-full">
            <FileSearch className="h-4 w-4" /> Analyze the resume I built
          </button>
        </div>
      )}

      {mode === 'loading' && (
        <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
          <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Analyzing "{fileName}"…</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Extracting text and calculating scores</p>
        </div>
      )}

      {mode === 'error' && (
        <div className="mx-auto max-w-md py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-error-500/10 text-error-500">
            <AlertCircle className="h-7 w-7" />
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Something went wrong</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{error}</p>
          <button onClick={reset} className="btn-secondary mt-5">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
        </div>
      )}

      {/* Results */}
      {mode === 'result' && result && (
        <div className="animate-fade-in space-y-6">
          {/* Top bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <FileText className="h-4 w-4" /> {fileName}
              <span className="text-slate-300">|</span>
              <span>{result.wordCount} words</span>
            </div>
            <button onClick={reset} className="btn-secondary text-sm">
              <RefreshCw className="h-4 w-4" /> Analyze another
            </button>
          </div>

          {/* Overall scores row */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card flex flex-col items-center p-6">
              <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Overall ATS Score</p>
              <ScoreGauge score={result.overall} label="ATS Score" />
              <p className="mt-2 text-sm font-semibold" style={{ color: scoreColor(result.overall) }}>
                {scoreLabel(result.overall)}
              </p>
            </div>
            <div className="card flex flex-col items-center justify-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <Target className="h-6 w-6" />
              </div>
              <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">{result.hiringChance}%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Estimated Hiring Chance</p>
            </div>
            <div className="card flex flex-col items-center justify-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">{result.keywordMatches.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">ATS Keywords Found</p>
            </div>
          </div>

          {/* Score breakdown bars + radar */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Score Breakdown</h2>
              <ScoreBars scores={result.scores} />
            </div>
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Skill Radar</h2>
              <ScoreRadar scores={result.scores} />
            </div>
          </div>

          {/* Individual scores detail */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.scores.map((s) => (
              <div key={s.label} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{s.label}</span>
                  <span className="text-lg font-bold" style={{ color: scoreColor(s.score) }}>{s.score}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.score}%`, backgroundColor: scoreColor(s.score) }} />
                </div>
                <span className="mt-1 block text-xs" style={{ color: scoreColor(s.score) }}>{scoreLabel(s.score)}</span>
                {s.details.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {s.details.map((d, i) => (
                      <li key={i} className="flex gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0 text-warning-500" /> {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Missing keywords */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Missing Keywords</h2>
            </div>
            {result.missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((k) => (
                  <span key={k} className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    + {k}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No missing keywords — you have great coverage!</p>
            )}
          </div>

          {/* Verbs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-warning-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Weak Action Verbs</h2>
              </div>
              {result.weakActionVerbs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.weakActionVerbs.map((v) => (
                    <span key={v} className="badge bg-warning-500/10 text-warning-600 dark:text-warning-500">
                      <XCircle className="h-3 w-3" /> {v}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="flex items-center gap-1.5 text-sm text-accent-600">
                  <CheckCircle2 className="h-4 w-4" /> No weak verbs found — great!
                </p>
              )}
            </div>
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Strong Action Verbs Used</h2>
              </div>
              {result.strongActionVerbs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.strongActionVerbs.map((v) => (
                    <span key={v} className="badge bg-accent-500/10 text-accent-600 dark:text-accent-400">
                      <CheckCircle2 className="h-3 w-3" /> {v}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No strong action verbs detected yet — add some!</p>
              )}
            </div>
          </div>

          {/* 10 Suggestions */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">10 Improvement Suggestions</h2>
            </div>
            <ol className="space-y-3">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* CTA to builder */}
          <div className="card flex flex-col items-center justify-between gap-4 bg-gradient-to-br from-brand-600 to-brand-800 p-6 sm:flex-row">
            <div>
              <h2 className="text-lg font-semibold text-white">Ready to improve your resume?</h2>
              <p className="text-sm text-brand-100">Use the builder to create an ATS-ready resume with a live preview.</p>
            </div>
            <Link to="/builder" className="btn bg-white text-brand-700 hover:bg-brand-50">
              Open Builder <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
