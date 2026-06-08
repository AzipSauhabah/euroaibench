import { useState, useEffect } from 'react'
import { api, Run, Question } from '../api/client'

interface Props { runId: number; onBack: () => void }

function scoreColor(s?: number) {
  if (!s) return 'var(--text-3)'
  if (s >= 7) return 'var(--green)'
  if (s >= 5) return 'var(--amber)'
  return 'var(--red)'
}

function ScoreBar({ score }: { score?: number }) {
  const s = score || 0
  const col = scoreColor(score)
  return (
    <div className="score-bar-wrap">
      <span className="score-num" style={{ color: col }}>{s ? s.toFixed(1) : '—'}</span>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${(s / 10) * 100}%`, background: col }} />
      </div>
    </div>
  )
}

export default function RunDetail({ runId, onBack }: Props) {
  const [run, setRun] = useState<Run | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getRun(runId), api.getQuestions()])
      .then(([r, q]) => { setRun(r); setQuestions(q) })
      .finally(() => setLoading(false))
  }, [runId])

  if (loading) return <div className="loading">Loading results...</div>
  if (!run) return <div className="error">Run not found</div>

  const getQ = (qid: number) => questions.find(q => q.id === qid)
  const regScores = { AMF: [] as number[], MIFID2: [] as number[], DORA: [] as number[] }
  run.answers.forEach(a => {
    const q = getQ(a.question_id)
    if (q && a.judge_score != null) regScores[q.regulation as keyof typeof regScores]?.push(a.judge_score)
  })
  const regAvg = (arr: number[]) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—'

  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Back to leaderboard</button>

      <div className="page-header">
        <div>
          <div className="page-title">{run.model_name}</div>
          <div className="page-subtitle">
            Run #{run.id} · {new Date(run.started_at).toLocaleString('fr-FR')}
            {run.finished_at && ` → ${new Date(run.finished_at).toLocaleString('fr-FR')}`}
          </div>
        </div>
        <div className="run-score-hero">
          <div className="score-hero-num" style={{ color: scoreColor(run.avg_score) }}>
            {run.avg_score?.toFixed(1)}<span style={{ fontSize: '1.5rem', color: 'var(--text-3)' }}>/10</span>
          </div>
          <div className="score-hero-label">Overall score</div>
        </div>
      </div>

      <div className="grid-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '2rem' }}>
        {[
          { label: 'AMF', val: regAvg(regScores.AMF), badge: 'amf', n: regScores.AMF.length },
          { label: 'MiFID II', val: regAvg(regScores.MIFID2), badge: 'mifid2', n: regScores.MIFID2.length },
          { label: 'DORA', val: regAvg(regScores.DORA), badge: 'dora', n: regScores.DORA.length },
        ].map(({ label, val, badge, n }) => (
          <div key={label} className="stat-card">
            <div className="stat-label"><span className={`badge badge-${badge}`}>{label}</span> <span style={{color:'var(--text-3)',fontSize:'0.6rem'}}>{n} questions</span></div>
            <div className="stat-value" style={{ fontSize: '1.8rem', color: val !== '—' ? scoreColor(parseFloat(val)) : undefined }}>
              {val}{val !== '—' && <span style={{ fontSize: '0.9rem', color: 'var(--text-3)' }}>/10</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {run.answers.map((a, i) => {
          const q = getQ(a.question_id)
          return (
            <div key={a.id} className="answer-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--text-3)' }}>Q{String(i + 1).padStart(2, '0')}</span>
                  {q && (
                    <>
                      <span className={`badge badge-${q.regulation.toLowerCase().replace('mifid2','mifid2')}`}>{q.regulation === 'MIFID2' ? 'MiFID II' : q.regulation}</span>
                      <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: 'DM Mono, monospace' }}>{q.category}</span>
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {a.latency_ms && <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--text-3)' }}>{(a.latency_ms / 1000).toFixed(1)}s</span>}
                  <ScoreBar score={a.judge_score} />
                </div>
              </div>
              {q && <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.5rem' }}>{q.question}</div>}
              {a.model_response && (
                <details>
                  <summary>Model response</summary>
                  <div className="answer-response">{a.model_response}</div>
                </details>
              )}
              {a.judge_feedback && <div className="answer-feedback">Judge: {a.judge_feedback}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
