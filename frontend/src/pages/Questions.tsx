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

  const regBadge = (r: string) => `badge badge-${r.toLowerCase().replace('mifid2', 'mifid')}`
  const diffBadge = (d: string) => `badge badge-${d}`

  return (
    <div>
      <h1>Dataset — {questions.length} questions réglementaires</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input className="input" placeholder="Rechercher..." value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 300 }} />
        <select className="input" value={regFilter} onChange={e => setRegFilter(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="">Toutes</option>
          <option value="AMF">AMF</option>
          <option value="MiFID2">MiFID II</option>
          <option value="DORA">DORA</option>
        </select>
      </div>
      {loading ? <div className="loading">Chargement...</div> : filtered.map(q => (
        <div key={q.id} className="card">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            <span className={regBadge(q.regulation)}>{q.regulation}</span>
            <span className={diffBadge(q.difficulty)}>{q.difficulty}</span>
            <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>{q.category}</span>
            {q.article_ref && <span style={{ marginLeft: 'auto', color: '#60a5fa', fontSize: '0.8rem' }}>📎 {q.article_ref}</span>}
          </div>
          <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{q.question}</p>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem', lineHeight: 1.6 }}>{q.reference_answer}</p>
        </div>
      ))}
    </div>
  )
}
