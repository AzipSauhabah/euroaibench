import { describe, it, expect } from 'vitest'
import { MOCK_RUNS, MOCK_MODELS } from '../data/mock'

describe('MOCK_RUNS', () => {
  it('contains at least one run', () => {
    expect(MOCK_RUNS.length).toBeGreaterThan(0)
  })

  it('each run has required fields', () => {
    MOCK_RUNS.forEach(run => {
      expect(run).toHaveProperty('id')
      expect(run).toHaveProperty('model_name')
      expect(run).toHaveProperty('started_at')
      expect(run).toHaveProperty('answers')
      expect(run).toHaveProperty('avg_score')
    })
  })

  it('each answer has question_id and judge_score', () => {
    MOCK_RUNS.forEach(run => {
      run.answers.forEach(answer => {
        expect(answer).toHaveProperty('question_id')
        expect(answer).toHaveProperty('judge_score')
      })
    })
  })

  it('all avg_scores are between 0 and 10', () => {
    MOCK_RUNS.forEach(run => {
      if (run.avg_score != null) {
        expect(run.avg_score).toBeGreaterThanOrEqual(0)
        expect(run.avg_score).toBeLessThanOrEqual(10)
      }
    })
  })

  it('all judge_scores are between 0 and 10', () => {
    MOCK_RUNS.forEach(run => {
      run.answers.forEach(answer => {
        if (answer.judge_score != null) {
          expect(answer.judge_score).toBeGreaterThanOrEqual(0)
          expect(answer.judge_score).toBeLessThanOrEqual(10)
        }
      })
    })
  })
})

describe('MOCK_MODELS', () => {
  it('contains model entries', () => {
    expect(MOCK_MODELS.length).toBeGreaterThan(0)
  })

  it('each model has required fields', () => {
    MOCK_MODELS.forEach(m => {
      expect(m).toHaveProperty('name')
      expect(m).toHaveProperty('family')
      expect(m).toHaveProperty('params')
      expect(m).toHaveProperty('best_score')
    })
  })

  it('best_scores are valid', () => {
    MOCK_MODELS.forEach(m => {
      if (m.best_score != null) {
        expect(m.best_score).toBeGreaterThanOrEqual(0)
        expect(m.best_score).toBeLessThanOrEqual(10)
      }
    })
  })
})
