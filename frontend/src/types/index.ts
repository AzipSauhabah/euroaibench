export type Domain = 'MARKET' | 'CORPORATE' | 'PROJECT' | 'RISK' | 'QUANT' | 'RATES'
export type Language = 'EN' | 'FR'
export type Difficulty = 'easy' | 'medium' | 'hard'

export const DOMAINS: Domain[] = ['MARKET', 'CORPORATE', 'PROJECT', 'RISK', 'QUANT', 'RATES']

export const DOMAIN_LABELS: Record<Domain, string> = {
  MARKET: 'Market Finance',
  CORPORATE: 'Corporate Finance',
  PROJECT: 'Project Finance',
  RISK: 'Risk Management',
  QUANT: 'Quant Strategies',
  RATES: 'Rates & Fixed Income',
}

export const DOMAIN_SHORT: Record<Domain, string> = {
  MARKET: 'Market',
  CORPORATE: 'Corporate',
  PROJECT: 'Project',
  RISK: 'Risk',
  QUANT: 'Quant',
  RATES: 'Rates',
}

export interface Question {
  id: number
  domain: Domain
  language: Language
  difficulty: Difficulty
  category: string
  question: string
  reference_answer: string
  source_ref?: string
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

export type DomainScores = Record<Domain, number | null>
