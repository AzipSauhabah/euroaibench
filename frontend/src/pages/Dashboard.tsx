import { useState, useEffect } from 'react'
import { api, Run } from '../api/client'

interface Props { onSelectRun: (id: number) => void; onNewRun: () => void }

export default function Dashboard({ onSelectRun, onNewRun }: Props) {
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getRuns().then(setRuns).finally(() => setLoading(false)) }, [])

  const avgScore = runs.filter(r => r.avg_score).reduce((a, r, _, arr) => a + (r.avg_score || 0) / arr.length, 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Dashboard</h1>
        <button className="btn btn-blue" onClick={onNewRun}>▶ Nouveau Run</button>
      </div>
      <div className="grid-stats">
        <div className="stat-card"><div className="stat-label">Runs total</div><div className="stat-value">{runs.length}</div></div>
        <div className="stat-card"><div className="stat-label">Score moyen</div><div className="stat-value" style={{ color: '#60a5fa' }}>{avgScore ? avgScore.toFixed(1) : '—'}<span style={{ fontSize: '1rem' }}>/10</span></div></div>
        <div className="stat-card"><div className="stat-label">Meilleur score</div><div className="stat-value" style={{ color: '#34d399' }}>{runs.length ? Math.max(...runs.filter(r => r.avg_score).map(r => r.avg_score!)).toFixed(1) : '—'}</div></div>
        <div className="stat-card"><div className="stat-label">Modèles testés</div><div className="stat-value">{new Set(runs.map(r => r.model_name)).size}</div></div>
      </div>
      {loading ? <div className="loading">Chargement...</div> : (
        <div className="card">
          <table>
            <thead><tr><th>#</th><th>Modèle</th><th>Score</th><th>Questions</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {runs.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#a0aec0', padding: '2rem' }}>Aucun run. Lancez votre premier benchmark !</td></tr>}
              {runs.map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => onSelectRun(r.id)}>
                  <td style={{ color: '#a0aec0' }}>#{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.model_name}</td>
                  <td><span style={{ color: scoreColor(r.avg_score), fontWeight: 700 }}>{r.avg_score ? `${r.avg_score}/10` : '—'}</span></td>
                  <td>{r.answers.length}</td>
                  <td style={{ color: '#a0aec0', fontSize: '0.85rem' }}>{new Date(r.started_at).toLocaleDateString('fr-FR')}</td>
                  <td><button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); onSelectRun(r.id) }}>Détail →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function scoreColor(s?: number) {
  if (!s) return '#a0aec0'
  if (s >= 7) return '#34d399'
  if (s >= 5) return '#fbbf24'
  return '#f87171'
}
