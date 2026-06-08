import type { Question, BenchmarkRun } from '../types'
import { MOCK_RUNS, USE_MOCK } from '../data/mock'

const BASE = import.meta.env.VITE_API_URL || 'http://192.168.1.47:8002'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`)
  return res.json()
}

export const api = {
  getQuestions: (): Promise<Question[]> =>
    USE_MOCK ? Promise.resolve([]) : apiFetch('/questions/'),

  getRuns: (): Promise<BenchmarkRun[]> =>
    USE_MOCK ? Promise.resolve(MOCK_RUNS) : apiFetch<BenchmarkRun[]>('/runs/').catch(() => MOCK_RUNS),

  getRun: (id: number): Promise<BenchmarkRun> =>
    USE_MOCK
      ? Promise.resolve(MOCK_RUNS.find(r => r.id === id)!)
      : apiFetch<BenchmarkRun>(`/runs/${id}`).catch(() => MOCK_RUNS.find(r => r.id === id)!),

  createRun: (model_name: string, ollama_host?: string): Promise<BenchmarkRun> =>
    apiFetch('/runs/', { method: 'POST', body: JSON.stringify({ model_name, ollama_host }) }),

  getModels: (host?: string): Promise<{ models: string[]; host: string; error?: string }> =>
    apiFetch(`/models/${host ? `?host=${encodeURIComponent(host)}` : ''}`),
}
