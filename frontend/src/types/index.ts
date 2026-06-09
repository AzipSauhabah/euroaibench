export type Regulation = 'AMF' | 'MIFID2' | 'DORA'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: number
  regulation: Regulation
  difficulty: Difficulty
  category: string
  question: string
  reference_answer: string
  article_ref?: string
}

export interface Answer {
  id: number
  question_id: number
  model_response?: string
  judge_score?: number
  judge_feedback?: string
  latency_ms?: number
  hallucination?: boolean
  hallucination_detail?: string
}

export interface BenchmarkRun {
  id: number
  model_name: string
  ollama_host?: string
  started_at: string
  finished_at?: string
  avg_score?: number
  hallucination_rate?: number
  answers: Answer[]
}

export interface ModelInfo {
  name: string
  family: string
  params: string
  description: string
  runs_count: number
  best_score?: number
  avg_score?: number
  last_run?: string
}

export interface RegScores {
  AMF: number | null
  MIFID2: number | null
  DORA: number | null
}
