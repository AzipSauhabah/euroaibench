import { useState, useEffect } from 'react'
import { api, Question } from '../api/client'

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filter, setFilter] = useState('')
  const [regFilter, setRegFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getQuestions().then(setQuestions).finally(() => setLoading(false)) }, [])

  const filtered = questions.filter(q =>
    (!regFilter || q.regulation === regFilter) &&
    (!filter || q.question.toLowerCase().includes(filter.toLowerCase()) || q.category.toLowerCase().includes(filter.toLowerCase()))
  )

  const counts = { AMF: questions.filter(q => q.regulation === 'AMF').length, MIFID2: questions.filter(q => q.regulation === 'MIFID2').length, DORA: questions.filter(q => q.regulation === 'DORA').length }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dataset</div>
          <div className="page-subtitle">{questions.length} regulatory questions · French · Expert-curated</div>
        </div>
      </div>

      <div className="grid-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'AMF', val: counts.AMF, badge: 'amf' },
          { label: 'MiFID II', val: counts.MIFID2, badge: 'mifid2' },
          { label: 'DORA', val: counts.DORA, badge: 'dora' },
        ].map(({ label, val, badge }) => (
          <div key={label} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setRegFilter(regFilter === label.replace(' ','').toUpperCase().replace('MIFIDII','MIFID2') ? '' : label.replace(' ','').toUpperCase().replace('MIFIDII','MIFID2'))}>
            <div className="stat-label"><span className={`badge badge-${badge}`}>{label}</span></div>
            <div className="stat-value">{val}<span style={{fontSize:'1rem',color:'var(--text-3)'}}> questions</span></div>
          </div>
        ))}
      </div>

      <div className="filter-row">
        <input className="input" style={{ maxWidth: 320 }} placeholder="Search questions..." value={filter} onChange={e => setFilter(e.target.value)} />
        <select className="input" style={{ maxWidth: 160 }} value={regFilter} onChange={e => setRegFilter(e.target.value)}>
          <option value="">All regulations</option>
          <option value="AMF">AMF</option>
          <option value="MIFID2">MiFID II</option>
          <option value="DORA">DORA</option>
        </select>
        {(filter || regFilter) && (
          <button className="btn btn-ghost" style={{fontSize:'0.75rem'}} onClick={() => { setFilter(''); setRegFilter('') }}>Clear</button>
        )}
        <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--text-3)' }}>{filtered.length} results</span>
      </div>

      {loading ? <div className="loading">Loading dataset...</div> : (
        <div>
          {filtered.map(q => (
            <div key={q.id} className="q-card">
              <div className="q-meta">
                <span className={`badge badge-${q.regulation.toLowerCase().replace('mifid2','mifid2')}`}>{q.regulation === 'MIFID2' ? 'MiFID II' : q.regulation}</span>
                <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'DM Mono, monospace' }}>{q.category}</span>
                {q.article_ref && <span className="q-article">{q.article_ref}</span>}
              </div>
              <div className="q-text">{q.question}</div>
              <div className="q-answer">{q.reference_answer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
