import { useState, useEffect } from 'react'
import { api, Run } from '../api/client'

interface Props { onSelectRun: (id: number) => void; onNewRun: () => void }

function scoreColor(s?: number) {
  if (!s) return 'var(--text-3)'
  if (s >= 7) return 'var(--green)'
  if (s >= 5) return 'var(--amber)'
  return 'var(--red)'
}

function ScoreBar({ score }: { score?: number }) {
  const s = score || 0
  const pct = (s / 10) * 100
  const col = scoreColor(score)
  return (
    <div className="score-bar-wrap">
      <span className="score-num" style={{ color: col }}>{s ? s.toFixed(1) : '—'}</span>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: col }} />
      </div>
    </div>
  )
}

export default function Dashboard({ onSelectRun, onNewRun }: Props) {
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getRuns().then(setRuns).finally(() => setLoading(false)) }, [])

  const completed = runs.filter(r => r.avg_score != null)
  const avgScore = completed.length ? completed.reduce((a, r) => a + (r.avg_score || 0), 0) / completed.length : null
  const bestScore = completed.length ? Math.max(...completed.map(r => r.avg_score!)) : null
  const uniqueModels = new Set(runs.map(r => r.model_name)).size

  const sorted = [...completed].sort((a, b) => (b.avg_score || 0) - (a.avg_score || 0))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Leaderboard</div>
          <div className="page-subtitle">LLM Performance on European Financial Regulation · French</div>
        </div>
        <button className="btn btn-gold" onClick={onNewRun}>▶ Run Benchmark</button>
      </div>

      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-label">Total runs</div>
          <div className="stat-value">{runs.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average score</div>
          <div className="stat-value gold">{avgScore ? avgScore.toFixed(1) : '—'}<span style={{fontSize:'1rem',color:'var(--text-3)'}}>/10</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best score</div>
          <div className="stat-value green">{bestScore ? bestScore.toFixed(1) : '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Models tested</div>
          <div className="stat-value">{uniqueModels}</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Rankings — 20 questions · AMF · MiFID II · DORA</span>
        </div>

        {loading ? (
          <div className="loading">Loading benchmark data...</div>
        ) : runs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚖</div>
            <div className="empty-text">No benchmarks run yet</div>
            <div className="empty-sub">Install Ollama and run your first evaluation</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Model</th>
                <th>Score</th>
                <th>Questions</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.id} onClick={() => onSelectRun(r.id)}>
                  <td>
                    <span className={`rank-num rank-${i + 1}`}>{i + 1}</span>
                  </td>
                  <td>
                    <span className="model-tag">{r.model_name}</span>
                  </td>
                  <td><ScoreBar score={r.avg_score} /></td>
                  <td style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem' }}>{r.answers.length} / 20</td>
                  <td style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: 'var(--text-3)' }}>
                    {new Date(r.started_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td><button className="btn btn-ghost" style={{fontSize:'0.75rem',padding:'0.3rem 0.8rem'}} onClick={e => { e.stopPropagation(); onSelectRun(r.id) }}>View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
