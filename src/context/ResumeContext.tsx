import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { type ResumeData, type TemplateId, emptyResume, sampleResume } from '../types/resume'

interface ResumeState {
  data: ResumeData
  template: TemplateId
  setData: (data: ResumeData) => void
  updatePersonal: (partial: Partial<ResumeData['personal']>) => void
  setTemplate: (t: TemplateId) => void
  loadSample: () => void
  reset: () => void
}

const STORAGE_KEY = 'resumeace.current'

const ResumeContext = createContext<ResumeState | null>(null)

function loadFromStorage(): { data: ResumeData; template: TemplateId } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { data: parsed.data ?? emptyResume, template: parsed.template ?? 'modern' }
    }
  } catch {
    /* ignore */
  }
  return { data: emptyResume, template: 'modern' }
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<ResumeData>(emptyResume)
  const [template, setTemplateState] = useState<TemplateId>('modern')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const { data: d, template: t } = loadFromStorage()
    setDataState(d)
    setTemplateState(t)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, template }))
    } catch {
      /* ignore */
    }
  }, [data, template, hydrated])

  const setData = useCallback((d: ResumeData) => setDataState(d), [])
  const updatePersonal = useCallback(
    (partial: Partial<ResumeData['personal']>) =>
      setDataState((prev) => ({ ...prev, personal: { ...prev.personal, ...partial } })),
    [],
  )
  const setTemplate = useCallback((t: TemplateId) => setTemplateState(t), [])
  const loadSample = useCallback(() => setDataState(sampleResume), [])
  const reset = useCallback(() => setDataState(emptyResume), [])

  return (
    <ResumeContext.Provider value={{ data, template, setData, updatePersonal, setTemplate, loadSample, reset }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}
