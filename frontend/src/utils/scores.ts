import type { BenchmarkRun, DomainScores, Domain } from '../types'
import { DOMAINS } from '../types'

export function scoreColor(s?: number | null): string {
  if (s == null) return 'var(--text-3)'
  if (s >= 7) return 'var(--green)'
  if (s >= 5) return 'var(--amber)'
  return 'var(--red)'
}

export function scoreLetter(s?: number | null): string {
  if (s == null) return '—'
  if (s >= 9) return 'A+'
  if (s >= 8) return 'A'
  if (s >= 7) return 'B+'
  if (s >= 6) return 'B'
  if (s >= 5) return 'C'
  return 'D'
}

export function getDomainScores(run: BenchmarkRun, questions: { id: number; domain: Domain }[]): DomainScores {
  const buckets = {} as Record<Domain, number[]>
  DOMAINS.forEach(d => { buckets[d] = [] })
  run.answers.forEach(a => {
    const q = questions.find(q => q.id === a.question_id)
    if (q && a.judge_score != null) buckets[q.domain].push(a.judge_score)
  })
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null
  const out = {} as DomainScores
  DOMAINS.forEach(d => { out[d] = avg(buckets[d]) })
  return out
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDuration(start: string, end?: string): string {
  if (!end) return '—'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export function hallucinationRate(run: BenchmarkRun): number | null {
  if (run.hallucination_rate != null) return run.hallucination_rate
  if (!run.answers || run.answers.length === 0) return null
  const count = run.answers.filter(a => a.hallucination === true).length
  return count / run.answers.length
}

export function hallucinationColor(rate?: number | null): string {
  if (rate == null) return 'var(--text-3)'
  if (rate <= 0.05) return 'var(--green)'
  if (rate <= 0.15) return 'var(--amber)'
  return 'var(--red)'
}
