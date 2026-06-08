import type { BenchmarkRun, RegScores, Regulation } from '../types'

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

export function getRegScores(run: BenchmarkRun, questions: { id: number; regulation: Regulation }[]): RegScores {
  const scores: Record<Regulation, number[]> = { AMF: [], MIFID2: [], DORA: [] }
  run.answers.forEach(a => {
    const q = questions.find(q => q.id === a.question_id)
    if (q && a.judge_score != null) scores[q.regulation].push(a.judge_score)
  })
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null
  return { AMF: avg(scores.AMF), MIFID2: avg(scores.MIFID2), DORA: avg(scores.DORA) }
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
