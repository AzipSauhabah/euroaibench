import { describe, it, expect } from 'vitest'
import { scoreColor, scoreLetter, formatDate, formatDuration, getRegScores } from '../utils/scores'
import type { BenchmarkRun } from '../types'

describe('scoreColor', () => {
  it('returns green for score >= 7', () => {
    expect(scoreColor(7)).toBe('var(--green)')
    expect(scoreColor(8.5)).toBe('var(--green)')
    expect(scoreColor(10)).toBe('var(--green)')
  })

  it('returns amber for score 5-6.9', () => {
    expect(scoreColor(5)).toBe('var(--amber)')
    expect(scoreColor(6.9)).toBe('var(--amber)')
  })

  it('returns red for score < 5', () => {
    expect(scoreColor(4.9)).toBe('var(--red)')
    expect(scoreColor(0)).toBe('var(--red)')
  })

  it('returns text-3 for null/undefined', () => {
    expect(scoreColor(null)).toBe('var(--text-3)')
    expect(scoreColor(undefined)).toBe('var(--text-3)')
  })
})

describe('scoreLetter', () => {
  it('returns A+ for >= 9', () => expect(scoreLetter(9)).toBe('A+'))
  it('returns A for 8-8.9', () => expect(scoreLetter(8)).toBe('A'))
  it('returns B+ for 7-7.9', () => expect(scoreLetter(7)).toBe('B+'))
  it('returns B for 6-6.9', () => expect(scoreLetter(6)).toBe('B'))
  it('returns C for 5-5.9', () => expect(scoreLetter(5)).toBe('C'))
  it('returns D for < 5', () => expect(scoreLetter(3)).toBe('D'))
  it('returns — for null', () => expect(scoreLetter(null)).toBe('—'))
})

describe('formatDate', () => {
  it('formats ISO date to French locale', () => {
    const result = formatDate('2026-06-01T10:00:00Z')
    expect(result).toMatch(/juin|Jun/i)
    expect(result).toMatch(/2026/)
  })
})

describe('formatDuration', () => {
  it('returns — when no end date', () => {
    expect(formatDuration('2026-06-01T10:00:00Z')).toBe('—')
  })

  it('formats minutes and seconds', () => {
    const start = '2026-06-01T10:00:00Z'
    const end = '2026-06-01T10:05:30Z'
    const result = formatDuration(start, end)
    expect(result).toMatch(/5m/)
    expect(result).toMatch(/30s/)
  })

  it('formats seconds only for < 1 min', () => {
    const start = '2026-06-01T10:00:00Z'
    const end = '2026-06-01T10:00:45Z'
    const result = formatDuration(start, end)
    expect(result).toBe('45s')
  })
})

describe('getRegScores', () => {
  const mockQuestions = [
    { id: 1, regulation: 'AMF' as const },
    { id: 2, regulation: 'AMF' as const },
    { id: 3, regulation: 'MIFID2' as const },
    { id: 4, regulation: 'DORA' as const },
  ]

  const mockRun: BenchmarkRun = {
    id: 1, model_name: 'test', started_at: '2026-06-01T10:00:00Z',
    avg_score: 7.5,
    answers: [
      { id: 1, question_id: 1, judge_score: 8.0 },
      { id: 2, question_id: 2, judge_score: 6.0 },
      { id: 3, question_id: 3, judge_score: 9.0 },
      { id: 4, question_id: 4, judge_score: 7.0 },
    ]
  }

  it('calculates AMF average correctly', () => {
    const scores = getRegScores(mockRun, mockQuestions)
    expect(scores.AMF).toBeCloseTo(7.0)
  })

  it('calculates MIFID2 average correctly', () => {
    const scores = getRegScores(mockRun, mockQuestions)
    expect(scores.MIFID2).toBeCloseTo(9.0)
  })

  it('calculates DORA average correctly', () => {
    const scores = getRegScores(mockRun, mockQuestions)
    expect(scores.DORA).toBeCloseTo(7.0)
  })

  it('returns null for regulation with no answers', () => {
    const emptyRun: BenchmarkRun = { ...mockRun, answers: [] }
    const scores = getRegScores(emptyRun, mockQuestions)
    expect(scores.AMF).toBeNull()
    expect(scores.MIFID2).toBeNull()
    expect(scores.DORA).toBeNull()
  })
})
