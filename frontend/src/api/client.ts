const BASE = import.meta.env.VITE_API_URL || 'http://192.168.1.47:8002'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res.json()
}

export const api = {
  getQuestions: () => apiFetch<Question[]>('/questions/'),
  getRuns: () => apiFetch<Run[]>('/runs/'),
  getRun: (id: number) => apiFetch<Run>(`/runs/${id}`),
  createRun: (model_name: string, ollama_host?: string) =>
    apiFetch<Run>('/runs/', { method: 'POST', body: JSON.stringify({ model_name, ollama_host }) }),
  getModels: (host?: string) =>
    apiFetch<{ models: string[]; host: string; error?: string }>(`/models/${host ? `?host=${encodeURIComponent(host)}` : ''}`),
}

export interface Question {
  id: number; regulation: string; difficulty: string; category: string
  question: string; reference_answer: string; article_ref?: string
}
export interface Answer {
  id: number; question_id: number; model_response?: string
  judge_score?: number; judge_feedback?: string; latency_ms?: number
}
export interface Run {
  id: number; model_name: string; started_at: string; finished_at?: string
  avg_score?: number; answers: Answer[]
}
