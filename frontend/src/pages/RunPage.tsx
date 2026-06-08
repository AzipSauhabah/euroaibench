import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { ErrorBanner } from '../components/ui/ErrorBanner'

export default function RunPage() {
  const [host, setHost] = useState('http://192.168.1.164:11434')
  const [models, setModels] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const detectModels = async () => {
    setLoading(true); setError('')
    try {
      const res = await api.getModels(host)
      setModels(res.models)
      if (res.error) setError(res.error)
      if (res.models[0]) setSelected(res.models[0])
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Connection failed') }
    finally { setLoading(false) }
  }

  const startRun = async () => {
    if (!selected) return
    setRunning(true); setError('')
    try {
      const run = await api.createRun(selected, host)
      navigate(`/run/${run.id}`)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Run failed'); setRunning(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Run Benchmark</div>
          <div className="page-subtitle">Evaluate an LLM on 20 regulatory questions in French</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'1px',marginBottom:'1px'}}>
        <div className="run-section">
          <div className="section-label"><span className="section-num">01</span> Ollama endpoint</div>
          <div style={{display:'flex',gap:'0.75rem',marginBottom:'0.5rem'}}>
            <input className="input" value={host} onChange={e=>setHost(e.target.value)} placeholder="http://IP:11434" />
            <button className="btn btn-ghost" onClick={detectModels} disabled={loading} style={{whiteSpace:'nowrap',minWidth:130}}>
              {loading ? 'Detecting...' : 'Detect models'}
            </button>
          </div>
          {error && <ErrorBanner message={error} />}
        </div>

        <div className="run-section" style={{borderLeft:'none'}}>
          <div className="section-label"><span className="section-num">Info</span></div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',color:'var(--text-3)',lineHeight:1.8}}>
            <div>Questions: <span style={{color:'var(--text-2)'}}>20</span></div>
            <div>Regulations: <span style={{color:'var(--text-2)'}}>AMF · MiFID II · DORA</span></div>
            <div>Language: <span style={{color:'var(--text-2)'}}>French</span></div>
            <div>Judge: <span style={{color:'var(--text-2)'}}>Ollama LLM-as-judge</span></div>
            <div>Duration: <span style={{color:'var(--text-2)'}}>5–15 min</span></div>
          </div>
        </div>
      </div>

      {models.length > 0 && (
        <div className="run-section">
          <div className="section-label"><span className="section-num">02</span> Select model</div>
          <div className="model-grid">
            {models.map(m => (
              <button key={m} className={`model-btn ${selected===m?'selected':''}`} onClick={()=>setSelected(m)}>{m}</button>
            ))}
          </div>
        </div>
      )}

      <div className="run-section">
        <div className="section-label"><span className="section-num">{models.length>0?'03':'02'}</span> Launch evaluation</div>
        <div className="run-info" style={{marginBottom:'1.25rem'}}>
          <p>Each question is sent to <strong>{selected||'the selected model'}</strong>. An LLM judge then scores each response 0–10 on accuracy, completeness, and regulatory citations.</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
          <button className="btn btn-gold" onClick={startRun} disabled={running||!selected}
            style={{fontSize:'0.9rem',padding:'0.7rem 2rem',opacity:(!selected&&!running)?0.4:1}}>
            {running ? 'Running...' : `▶ Start with ${selected||'—'}`}
          </button>
          {running && (
            <div className="running-indicator">
              <div className="pulse" />
              Benchmark in progress — do not close this window
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
