import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import type { BenchmarkRun, Question } from '../types'
import { ScoreBar } from '../components/ui/ScoreBar'
import { LoadingState } from '../components/ui/LoadingState'
import { EmptyState } from '../components/ui/EmptyState'
import { BarComparison } from '../components/charts/BarComparison'
import { DomainRadar } from '../components/charts/RadarChart'
import { scoreColor, scoreLetter, formatDate, formatDuration, hallucinationRate, hallucinationColor } from '../utils/scores'
import { HallucinationScatter } from '../components/charts/HallucinationScatter'

export default function Leaderboard() {
  const [runs, setRuns] = useState<BenchmarkRun[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([api.getRuns(), api.getQuestions()])
      .then(([r, q]) => { setRuns(r); setQuestions(q) })
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...runs].filter(r => r.avg_score != null).sort((a, b) => (b.avg_score ?? 0) - (a.avg_score ?? 0))
  const best = sorted[0]
  const avgAll = sorted.length ? sorted.reduce((a, r) => a + (r.avg_score ?? 0), 0) / sorted.length : null

  return (
    <div>
      {/* HERO */}
      <div className="hero-section">
        <div className="hero-eyebrow">Quantitative Finance Benchmark</div>
        <h1 className="hero-title">Which LLM understands<br /><em>quantitative finance?</em></h1>
        <p className="hero-sub">
          24 expert-curated questions across market, corporate &amp; project finance, risk, quant
          strategies and rates — bilingual EN/FR, scored 0–10 by an LLM judge on technical accuracy.
        </p>
        <div className="hero-actions">
          <button className="btn btn-gold" onClick={() => navigate('/run')}>▶ Run a benchmark</button>
          <button className="btn btn-ghost" onClick={() => navigate('/dataset')}>Browse dataset →</button>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-label">Models evaluated</div>
          <div className="stat-value">{new Set(runs.map(r => r.model_name)).size}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total runs</div>
          <div className="stat-value">{sorted.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average score</div>
          <div className="stat-value gold">{avgAll ? avgAll.toFixed(1) : '—'}<span style={{fontSize:'1rem',color:'var(--text-3)'}}>/10</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best model</div>
          <div className="stat-value" style={{fontSize:'1.3rem', color: 'var(--gold)'}}>{best?.model_name.split(':')[0] ?? '—'}</div>
        </div>
      </div>

      {/* CHARTS ROW */}
      {sorted.length > 0 && (
        <div className="charts-row">
          <div className="chart-card">
            <div className="chart-label">Score comparison</div>
            <BarComparison runs={sorted} />
          </div>
          <div className="chart-card">
            <div className="chart-label">By domain (top 3)</div>
            <DomainRadar runs={sorted} questions={questions} />
          </div>
          <div className="chart-card">
            <div className="chart-label">Score vs Hallucination rate</div>
            <HallucinationScatter runs={sorted} />
          </div>
        </div>
      )}

      {/* LEADERBOARD TABLE */}
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Rankings — 24 questions · 6 domains · EN/FR</span>
          {sorted.length > 0 && (
            <button className="btn btn-ghost" style={{fontSize:'0.72rem'}} onClick={() => {
              const csv = ['Rank,Model,Score,HallucinationRate,Questions,Duration,Date',
                ...sorted.map((r,i) => { const hr = hallucinationRate(r); return `${i+1},${r.model_name},${r.avg_score?.toFixed(1)},${hr!=null?(hr*100).toFixed(0)+'%':'—'},${r.answers.length},${formatDuration(r.started_at,r.finished_at)},${formatDate(r.started_at)}` })
              ].join('\n')
              const a = document.createElement('a')
              a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
              a.download = 'euroaibench-leaderboard.csv'
              a.click()
            }}>↓ Export CSV</button>
          )}
        </div>

        {loading ? <LoadingState text="Loading benchmark data..." /> :
         sorted.length === 0 ? (
          <EmptyState icon="⚖" title="No benchmarks yet"
            sub="Run your first evaluation to see results"
            action={<button className="btn btn-gold" onClick={() => navigate('/run')}>▶ Run benchmark</button>} />
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{width:48}}>#</th>
                <th>Model</th>
                <th style={{width:180}}>Score</th>
                <th style={{width:80}}>Grade</th>
                <th style={{width:130}}>Hallucination</th>
                <th style={{width:80}}>Questions</th>
                <th style={{width:90}}>Duration</th>
                <th style={{width:110}}>Date</th>
                <th style={{width:80}}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.id} onClick={() => navigate(`/run/${r.id}`)}>
                  <td><span className={`rank-num rank-${i+1}`}>{i+1}</span></td>
                  <td><span className="model-tag">{r.model_name}</span></td>
                  <td><ScoreBar score={r.avg_score} /></td>
                  <td><span style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',fontWeight:600,color:scoreColor(r.avg_score)}}>{scoreLetter(r.avg_score)}</span></td>
                  <td>{(() => { const hr = hallucinationRate(r); return hr==null ? <span style={{color:'var(--text-3)',fontFamily:'DM Mono,monospace',fontSize:'0.75rem'}}>—</span> : <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.78rem',fontWeight:600,color:hallucinationColor(hr)}}>{(hr*100).toFixed(0)}%</span> })()}</td>
                  <td style={{fontFamily:'DM Mono,monospace',fontSize:'0.75rem'}}>{r.answers.length}/20</td>
                  <td style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',color:'var(--text-3)'}}>{formatDuration(r.started_at,r.finished_at)}</td>
                  <td style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',color:'var(--text-3)'}}>{formatDate(r.started_at)}</td>
                  <td><button className="btn btn-ghost" style={{fontSize:'0.72rem',padding:'0.25rem 0.7rem'}} onClick={e=>{e.stopPropagation();navigate(`/run/${r.id}`)}}>View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
