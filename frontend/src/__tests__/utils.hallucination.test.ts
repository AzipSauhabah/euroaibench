import { describe, it, expect } from 'vitest'
import { hallucinationRate, hallucinationColor } from '../utils/scores'
import type { BenchmarkRun } from '../types'

const baseRun = (over: Partial<BenchmarkRun>): BenchmarkRun => ({
  id: 1, model_name: 'test', started_at: '2026-06-01T10:00:00Z',
  answers: [], ...over,
})

describe('hallucinationRate', () => {
  it('prefers backend hallucination_rate field when present', () => {
    const run = baseRun({ hallucination_rate: 0.25, answers: [
      { id: 1, question_id: 1, judge_score: 7, hallucination: false },
    ]})
    expect(hallucinationRate(run)).toBeCloseTo(0.25)
  })

  it('computes rate from answers when field absent', () => {
    const run = baseRun({ answers: [
      { id: 1, question_id: 1, judge_score: 7, hallucination: true },
      { id: 2, question_id: 2, judge_score: 6, hallucination: false },
      { id: 3, question_id: 3, judge_score: 8, hallucination: true },
      { id: 4, question_id: 4, judge_score: 5, hallucination: false },
      { id: 5, question_id: 5, judge_score: 9, hallucination: false },
    ]})
    expect(hallucinationRate(run)).toBeCloseTo(0.4)
  })

  it('returns null when no answers and no field', () => {
    expect(hallucinationRate(baseRun({ answers: [] }))).toBeNull()
  })

  it('treats missing hallucination flag as false', () => {
    const run = baseRun({ answers: [
      { id: 1, question_id: 1, judge_score: 7 },
      { id: 2, question_id: 2, judge_score: 6, hallucination: true },
    ]})
    expect(hallucinationRate(run)).toBeCloseTo(0.5)
  })
})

describe('hallucinationColor', () => {
  it('returns green for low rate (<= 0.05)', () => {
    expect(hallucinationColor(0)).toBe('var(--green)')
    expect(hallucinationColor(0.05)).toBe('var(--green)')
  })
  it('returns amber for moderate rate (0.05-0.15)', () => {
    expect(hallucinationColor(0.1)).toBe('var(--amber)')
    expect(hallucinationColor(0.15)).toBe('var(--amber)')
  })
  it('returns red for high rate (> 0.15)', () => {
    expect(hallucinationColor(0.16)).toBe('var(--red)')
    expect(hallucinationColor(0.5)).toBe('var(--red)')
  })
  it('returns text-3 for null/undefined', () => {
    expect(hallucinationColor(null)).toBe('var(--text-3)')
    expect(hallucinationColor(undefined)).toBe('var(--text-3)')
  })
})
