import { useState, useEffect } from 'react'
import { api, Run } from '../api/client'

interface Props { runId: number; onBack: () => void }

export default function RunDetail({ runId, onBack }: Props) {
  const [run, setRun] = useState<Run | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getRun(runId), api.getQuestions()]).then(([r, q]) => { setRun(r); setQuestions(q) }).finally(() => setLoading(false))
  }, [runId])

  if (loading) return <div className="loading">Chargement...</div>
  if (!run) return <div className="error">Run introuvable</div>

  const scoreColor = (s?: number) => { if (!s) return '#a0aec0'; if (s >= 7) return '#34d399'; if (s >= 5) return '#fbbf24'; return '#f87171' }
  const getQ = (qid: number) => questions.find(q => q.id === qid)

  return (
    <div>
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '1.5rem' }}>← Retour</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1>Run #{run.id} — {run.model_name}</h1>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
            {new Date(run.started_at).toLocaleString('fr-FR')}
            {run.finished_at && ` → ${new Date(run.finished_at).toLocaleString('fr-FR')}`}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: scoreColor(run.avg_score) }}>{run.avg_score?.toFixed(1)}<span style={{ fontSize: '1.2rem', color: '#a0aec0' }}>/10</span></div>
          <div style={{ color: '#a0aec0', fontSize: '0.85rem' }}>Score moyen</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {run.answers.map((a, i) => {
          const q = getQ(a.question_id)
          return (
            <div key={a.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>Q{i + 1}</span>
                  {q && <><span className={`badge badge-${q.regulation.toLowerCase().replace('mifid2','mifid')}`}>{q.regulation}</span><span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>{q.category}</span></>}
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {a.latency_ms && <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{(a.latency_ms / 1000).toFixed(1)}s</span>}
                  <span style={{ fontWeight: 700, fontSize: '1.2rem', color: scoreColor(a.judge_score) }}>{a.judge_score?.toFixed(1)}/10</span>
                </div>
              </div>
              {q && <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{q.question}</p>}
              <details>
                <summary style={{ cursor: 'pointer', color: '#60a5fa', marginBottom: '0.5rem' }}>Réponse du modèle</summary>
                <p style={{ color: '#e2e8f0', lineHeight: 1.6, margin: '0.75rem 0', padding: '0.75rem', background: '#0f1117', borderRadius: '6px', fontSize: '0.9rem' }}>{a.model_response}</p>
              </details>
              {a.judge_feedback && <p style={{ color: '#a0aec0', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.5rem' }}>💬 {a.judge_feedback}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
