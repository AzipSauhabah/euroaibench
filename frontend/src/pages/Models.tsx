import { useNavigate } from 'react-router-dom'
import { MOCK_MODELS } from '../data/mock'
import { scoreColor, scoreLetter } from '../utils/scores'

export default function Models() {
  const navigate = useNavigate()
  const sorted = [...MOCK_MODELS].sort((a,b) => (b.best_score??0)-(a.best_score??0))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Models</div>
          <div className="page-subtitle">All LLMs evaluated on QuantAIBench · Run via Ollama</div>
        </div>
      </div>

      <div className="models-grid">
        {sorted.map(m => (
          <div key={m.name} className="model-card">
            <div className="model-card-header">
              <div>
                <div className="model-name">{m.name}</div>
                <div className="model-meta">{m.family} · {m.params} parameters</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',fontWeight:600,lineHeight:1,color:scoreColor(m.best_score)}}>
                  {m.best_score?.toFixed(1) ?? '—'}
                </div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.6rem',color:'var(--text-3)',letterSpacing:'0.1em',textTransform:'uppercase'}}>Best score</div>
              </div>
            </div>
            <div className="model-desc">{m.description}</div>
            <div className="model-footer">
              <span className="score-grade" style={{color:scoreColor(m.best_score)}}>{scoreLetter(m.best_score)}</span>
              <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.7rem',color:'var(--text-3)'}}>{m.runs_count} run{m.runs_count>1?'s':''}</span>
              {m.last_run && <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.7rem',color:'var(--text-3)'}}>Last: {m.last_run}</span>}
              <button className="btn btn-ghost" style={{marginLeft:'auto',fontSize:'0.72rem',padding:'0.25rem 0.7rem'}} onClick={()=>navigate('/run')}>Re-run →</button>
            </div>
          </div>
        ))}

        <div className="model-card model-card-ghost">
          <div style={{textAlign:'center',padding:'2rem 1rem'}}>
            <div style={{fontSize:'2rem',marginBottom:'0.75rem',opacity:0.3}}>+</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'1rem',color:'var(--text-2)',marginBottom:'0.5rem'}}>Evaluate a new model</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',color:'var(--text-3)',marginBottom:'1.25rem'}}>Any Ollama-compatible model</div>
            <button className="btn btn-gold" style={{fontSize:'0.8rem'}} onClick={()=>navigate('/run')}>▶ Run benchmark</button>
          </div>
        </div>
      </div>
    </div>
  )
}
