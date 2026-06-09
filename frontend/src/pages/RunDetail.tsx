import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import type { BenchmarkRun, Question } from '../types'
import { ScoreBar } from '../components/ui/ScoreBar'
import { LoadingState } from '../components/ui/LoadingState'
import { Badge } from '../components/ui/Badge'
import { HallucinationBadge } from '../components/ui/HallucinationBadge'
import { getRegScores, scoreColor, scoreLetter, formatDate, formatDuration, hallucinationRate, hallucinationColor } from '../utils/scores'

const REG_LABELS: Record<string,string> = { AMF:'AMF', MIFID2:'MiFID II', DORA:'DORA' }

export default function RunDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [run, setRun] = useState<BenchmarkRun | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([api.getRun(Number(id)), api.getQuestions()])
      .then(([r, q]) => { setRun(r); setQuestions(q) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingState text="Loading results..." />
  if (!run) return <div className="error">Run not found</div>

  const regScores = getRegScores(run, questions)
  const getQ = (qid: number) => questions.find(q => q.id === qid)

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/')}>← Back to leaderboard</button>

      <div className="page-header">
        <div>
          <div className="page-title">{run.model_name}</div>
          <div className="page-subtitle">
            Run #{run.id} · {formatDate(run.started_at)} · Duration: {formatDuration(run.started_at, run.finished_at)}
          </div>
        </div>
        <div className="run-score-hero">
          <div className="score-hero-num" style={{color:scoreColor(run.avg_score)}}>
            {run.avg_score?.toFixed(1)}<span style={{fontSize:'1.5rem',color:'var(--text-3)'}}>/10</span>
          </div>
          <div style={{display:'flex',gap:'0.5rem',alignItems:'center',justifyContent:'flex-end',marginTop:'0.3rem'}}>
            <span style={{fontFamily:'Playfair Display,serif',fontSize:'1.3rem',fontWeight:600,color:scoreColor(run.avg_score)}}>{scoreLetter(run.avg_score)}</span>
            <div className="score-hero-label">Overall</div>
          </div>
          {(() => { const hr = hallucinationRate(run); return hr==null ? null : (
            <div style={{marginTop:'0.5rem',textAlign:'right'}}>
              <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.95rem',fontWeight:600,color:hallucinationColor(hr)}}>{(hr*100).toFixed(0)}%</span>
              <span style={{fontSize:'0.6rem',color:'var(--text-3)',letterSpacing:'0.1em',textTransform:'uppercase',marginLeft:'0.4rem'}}>Hallucination rate</span>
            </div>) })()}
        </div>
      </div>

      <div className="grid-stats" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:'2rem'}}>
        {(['AMF','MIFID2','DORA'] as const).map(r => {
          const val = regScores[r]
          return (
            <div key={r} className="stat-card">
              <div className="stat-label"><Badge type={r}>{REG_LABELS[r]}</Badge></div>
              <div className="stat-value" style={{fontSize:'1.8rem',color:scoreColor(val)}}>
                {val!=null?val.toFixed(1):'—'}{val!=null&&<span style={{fontSize:'0.9rem',color:'var(--text-3)'}}>/10</span>}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'1px'}}>
        {run.answers.map((a, i) => {
          const q = getQ(a.question_id)
          return (
            <div key={a.id} className="answer-card" style={{cursor:'pointer'}} onClick={()=>setExpanded(expanded===a.id?null:a.id)}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.6rem'}}>
                <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                  <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.65rem',color:'var(--text-3)'}}>Q{String(i+1).padStart(2,'0')}</span>
                  {q && <><Badge type={q.regulation}>{REG_LABELS[q.regulation]}</Badge><Badge type={q.difficulty}>{q.difficulty}</Badge><span style={{fontSize:'0.72rem',color:'var(--text-3)',fontFamily:'DM Mono,monospace'}}>{q.category}</span></>}
                  <HallucinationBadge hallucination={a.hallucination} detail={a.hallucination_detail} />
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  {a.latency_ms && <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.65rem',color:'var(--text-3)'}}>{(a.latency_ms/1000).toFixed(1)}s</span>}
                  <ScoreBar score={a.judge_score} />
                </div>
              </div>
              {q && <div style={{fontSize:'0.875rem',fontWeight:500,color:'var(--text)',marginBottom:expanded===a.id?'0.75rem':0,lineHeight:1.5}}>{q.question}</div>}
              {expanded === a.id && (
                <>
                  {a.model_response && <div className="answer-response">{a.model_response}</div>}
                  {a.judge_feedback && <div className="answer-feedback">Judge: {a.judge_feedback}</div>}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
