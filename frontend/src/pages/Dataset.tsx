import { useState, useEffect } from 'react'
import { api } from '../api/client'
import type { Question, Regulation, Difficulty } from '../types'
import { Badge } from '../components/ui/Badge'
import { LoadingState } from '../components/ui/LoadingState'

const REG_LABELS: Record<Regulation, string> = { AMF: 'AMF', MIFID2: 'MiFID II', DORA: 'DORA' }

export default function Dataset() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [reg, setReg] = useState<Regulation | ''>('')
  const [diff, setDiff] = useState<Difficulty | ''>('')
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => { api.getQuestions().then(setQuestions).finally(() => setLoading(false)) }, [])

  const filtered = questions.filter(q =>
    (!reg || q.regulation === reg) &&
    (!diff || q.difficulty === diff) &&
    (!search || q.question.toLowerCase().includes(search.toLowerCase()) || q.category.toLowerCase().includes(search.toLowerCase()))
  )

  const counts = {
    AMF: questions.filter(q => q.regulation === 'AMF').length,
    MIFID2: questions.filter(q => q.regulation === 'MIFID2').length,
    DORA: questions.filter(q => q.regulation === 'DORA').length,
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dataset</div>
          <div className="page-subtitle">{questions.length} regulatory questions · French · Expert-curated · CC BY-NC-ND</div>
        </div>
        <button className="btn btn-ghost" style={{fontSize:'0.75rem'}} onClick={() => {
          const csv = ['ID,Regulation,Difficulty,Category,Question,Reference Answer,Article'].join('\n') + '\n' +
            questions.map(q => [q.id,q.regulation,q.difficulty,`"${q.category}"`,`"${q.question}"`,`"${q.reference_answer}"`,q.article_ref ?? ''].join(',')).join('\n')
          const a = document.createElement('a')
          a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
          a.download = 'euroaibench-dataset.csv'
          a.click()
        }}>↓ Export CSV</button>
      </div>

      <div className="grid-stats" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:'1.5rem'}}>
        {(['AMF','MIFID2','DORA'] as Regulation[]).map(r => (
          <div key={r} className="stat-card" style={{cursor:'pointer',outline: reg===r?'1px solid var(--gold)':'none'}} onClick={() => setReg(reg===r?'':r)}>
            <div className="stat-label"><Badge type={r}>{REG_LABELS[r]}</Badge></div>
            <div className="stat-value">{counts[r]}<span style={{fontSize:'1rem',color:'var(--text-3)'}}> qs</span></div>
          </div>
        ))}
      </div>

      <div className="filter-row">
        <input className="input" style={{maxWidth:300}} placeholder="Search questions or categories..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="input" style={{maxWidth:150}} value={diff} onChange={e=>setDiff(e.target.value as Difficulty|'')}>
          <option value="">All levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {(search||reg||diff) && <button className="btn btn-ghost" style={{fontSize:'0.75rem'}} onClick={()=>{setSearch('');setReg('');setDiff('')}}>Clear filters</button>}
        <span style={{marginLeft:'auto',fontFamily:'DM Mono,monospace',fontSize:'0.7rem',color:'var(--text-3)'}}>{filtered.length} results</span>
      </div>

      {loading ? <LoadingState text="Loading dataset..." /> : (
        <div>
          {filtered.map(q => (
            <div key={q.id} className="q-card" style={{cursor:'pointer'}} onClick={() => setExpanded(expanded===q.id?null:q.id)}>
              <div className="q-meta">
                <Badge type={q.regulation}>{REG_LABELS[q.regulation]}</Badge>
                <Badge type={q.difficulty}>{q.difficulty}</Badge>
                <span style={{fontSize:'0.72rem',color:'var(--text-3)',fontFamily:'DM Mono,monospace'}}>{q.category}</span>
                {q.article_ref && <span className="q-article">{q.article_ref}</span>}
                <span style={{marginLeft:'auto',fontFamily:'DM Mono,monospace',fontSize:'0.65rem',color:'var(--text-3)'}}>{expanded===q.id?'▲':'▼'}</span>
              </div>
              <div className="q-text">{q.question}</div>
              {expanded === q.id && (
                <div className="q-answer" style={{marginTop:'0.75rem'}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.6rem',color:'var(--gold-dim)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.4rem'}}>Reference answer</div>
                  {q.reference_answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
