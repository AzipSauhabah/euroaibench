import type { BenchmarkRun, Question, ModelInfo } from '../types'

export const MOCK_RUNS: BenchmarkRun[] = [
  {
    id: 1, model_name: 'mistral:7b', started_at: '2026-06-01T10:00:00Z',
    finished_at: '2026-06-01T10:12:00Z', avg_score: 7.4,
    answers: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1, question_id: i + 1,
      judge_score: [8,7,6,9,7,8,6,7,8,7,9,6,7,8,7,6,8,7,9,7][i],
      latency_ms: 3200 + Math.floor(Math.random() * 2000),
      model_response: 'Réponse simulée du modèle pour cette question quantitative.',
      judge_feedback: 'Réponse correcte avec dérivations pertinentes.'
    }))
  },
  {
    id: 2, model_name: 'qwen2.5:14b', started_at: '2026-06-02T14:00:00Z',
    finished_at: '2026-06-02T14:18:00Z', avg_score: 8.2,
    answers: Array.from({ length: 20 }, (_, i) => ({
      id: i + 21, question_id: i + 1,
      judge_score: [9,8,7,9,8,9,7,8,9,8,9,7,8,9,8,7,9,8,9,8][i],
      latency_ms: 4100 + Math.floor(Math.random() * 2000),
      model_response: 'Réponse simulée du modèle pour cette question quantitative.',
      judge_feedback: 'Excellente rigueur technique et formules complètes.'
    }))
  },
  {
    id: 3, model_name: 'llama3.1:8b', started_at: '2026-06-03T09:00:00Z',
    finished_at: '2026-06-03T09:14:00Z', avg_score: 6.1,
    answers: Array.from({ length: 20 }, (_, i) => ({
      id: i + 41, question_id: i + 1,
      judge_score: [6,5,7,6,5,7,6,5,7,6,7,5,6,7,6,5,7,6,7,6][i],
      latency_ms: 2800 + Math.floor(Math.random() * 1500),
      model_response: 'Réponse simulée du modèle pour cette question quantitative.',
      judge_feedback: 'Réponse partielle, manque de rigueur dans les calculs.'
    }))
  }
]

export const MOCK_MODELS: ModelInfo[] = [
  { name: 'qwen2.5:14b', family: 'Qwen', params: '14B', description: 'Alibaba multilingual model, strong on structured technical text', runs_count: 1, best_score: 8.2, avg_score: 8.2, last_run: '2026-06-02' },
  { name: 'mistral:7b', family: 'Mistral', params: '7B', description: 'French-origin model, good French language understanding', runs_count: 1, best_score: 7.4, avg_score: 7.4, last_run: '2026-06-01' },
  { name: 'llama3.1:8b', family: 'Llama', params: '8B', description: 'Meta general purpose model', runs_count: 1, best_score: 6.1, avg_score: 6.1, last_run: '2026-06-03' },
]

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
