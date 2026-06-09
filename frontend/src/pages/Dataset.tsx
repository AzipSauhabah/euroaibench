import { useState, useEffect } from 'react'
import { api } from '../api/client'
import type { Question, Domain, Difficulty, Language } from '../types'
import { DOMAINS, DOMAIN_LABELS, DOMAIN_SHORT } from '../types'
import { Badge } from '../components/ui/Badge'
import { LoadingState } from '../components/ui/LoadingState'

export default function Dataset() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState<Domain | ''>('')
  const [lang, setLang] = useState<Language | ''>('')
  const [diff, setDiff] = useState<Difficulty | ''>('')
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => { api.getQuestions().then(setQuestions).finally(() => setLoading(false)) }, [])

  const filtered = questions.filter(q =>
    (!domain || q.domain === domain) &&
    (!lang || q.language === lang) &&
    (!diff || q.difficulty === diff) &&
    (!search || q.question.toLowerCase().includes(search.toLowerCase()) || q.category.toLowerCase().includes(search.toLowerCase()))
  )

  const counts = Object.fromEntries(DOMAINS.map(d => [d, questions.filter(q => q.domain === d).length])) as Record<Domain, number>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dataset</div>
          <div className="page-subtitle">{questions.length} quant questions · EN/FR · Expert-curated · CC BY-NC-ND</div>
        </div>
        <button className="btn btn-ghost" style={{fontSize:'0.75rem'}} onClick={() => {
          const csv = ['ID,Domain,Language,Difficulty,Category,Question,Reference Answer,Source'].join('\n') + '\n' +
            questions.map(q => [q.id,q.domain,q.language,q.difficulty,`"${q.category}"`,`"${q.question.replace(/"/g,'""')}"`,`"${q.reference_answer.replace(/"/g,'""')}"`,`"${q.source_ref ?? ''}"`].join(',')).join('\n')
          const a = document.createElement('a')
          a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
          a.download = 'quantaibench-dataset.csv'
          a.click()
        }}>↓ Export CSV</button>
      </div>

      <div className="grid-stats" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:'1.5rem'}}>
        {DOMAINS.map(d => (
          <div key={d} className="stat-card" style={{cursor:'pointer',outline: domain===d?'1px solid var(--gold)':'none'}} onClick={() => setDomain(domain===d?'':d)}>
            <div className="stat-label"><Badge type={d}>{DOMAIN_SHORT[d]}</Badge></div>
            <div className="stat-value" style={{fontSize:'1.5rem'}}>{counts[d]}<span style={{fontSize:'0.9rem',color:'var(--text-3)'}}> qs</span></div>
          </div>
        ))}
      </div>

      <div className="filter-row">
        <input className="input" style={{maxWidth:280}} placeholder="Search questions or categories..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="input" style={{maxWidth:120}} value={lang} onChange={e=>setLang(e.target.value as Language|'')}>
          <option value="">All langs</option>
          <option value="EN">EN</option>
          <option value="FR">FR</option>
        </select>
        <select className="input" style={{maxWidth:150}} value={diff} onChange={e=>setDiff(e.target.value as Difficulty|'')}>
          <option value="">All levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {(search||domain||lang||diff) && <button className="btn btn-ghost" style={{fontSize:'0.75rem'}} onClick={()=>{setSearch('');setDomain('');setLang('');setDiff('')}}>Clear filters</button>}
        <span style={{marginLeft:'auto',fontFamily:'DM Mono,monospace',fontSize:'0.7rem',color:'var(--text-3)'}}>{filtered.length} results</span>
      </div>

      {loading ? <LoadingState text="Loading dataset..." /> : (
        <div>
          {filtered.map(q => (
            <div key={q.id} className="q-card" style={{cursor:'pointer'}} onClick={() => setExpanded(expanded===q.id?null:q.id)}>
              <div className="q-meta">
                <Badge type={q.domain}>{DOMAIN_LABELS[q.domain]}</Badge>
                <Badge type={q.language.toLowerCase()}>{q.language}</Badge>
                <Badge type={q.difficulty}>{q.difficulty}</Badge>
                <span style={{fontSize:'0.72rem',color:'var(--text-3)',fontFamily:'DM Mono,monospace'}}>{q.category}</span>
                {q.source_ref && <span className="q-article">{q.source_ref}</span>}
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
