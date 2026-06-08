import { useState } from 'react'
import { api } from '../api/client'

interface Props { onRunCreated: (id: number) => void }

export default function NewRun({ onRunCreated }: Props) {
  const [ollamaHost, setOllamaHost] = useState('http://192.168.1.164:11434')
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  const fetchModels = async () => {
    setLoading(true); setError('')
    try {
      const res = await api.getModels(ollamaHost)
      setModels(res.models)
      if (res.error) setError(res.error)
      if (res.models.length > 0) setSelectedModel(res.models[0])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const startRun = async () => {
    if (!selectedModel) return
    setRunning(true); setError('')
    try {
      const run = await api.createRun(selectedModel, ollamaHost)
      onRunCreated(run.id)
    } catch (e: any) { setError(e.message); setRunning(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Run Benchmark</div>
          <div className="page-subtitle">Evaluate an LLM on 20 regulatory questions via Ollama</div>
        </div>
      </div>

      <div className="run-section">
        <div className="section-label"><span className="section-num">01</span> Ollama endpoint</div>
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 560 }}>
          <input className="input" value={ollamaHost} onChange={e => setOllamaHost(e.target.value)} placeholder="http://IP:11434" />
          <button className="btn btn-ghost" onClick={fetchModels} disabled={loading} style={{ whiteSpace: 'nowrap', minWidth: 130 }}>
            {loading ? '...' : 'Detect models'}
          </button>
        </div>
        {error && <div className="error" style={{ marginTop: '0.75rem', maxWidth: 560 }}>{error}</div>}
      </div>

      {models.length > 0 && (
        <div className="run-section">
          <div className="section-label"><span className="section-num">02</span> Select model</div>
          <div className="model-grid">
            {models.map(m => (
              <button key={m} className={`model-btn ${selectedModel === m ? 'selected' : ''}`} onClick={() => setSelectedModel(m)}>{m}</button>
            ))}
          </div>
        </div>
      )}

      <div className="run-section">
        <div className="section-label"><span className="section-num">{models.length > 0 ? '03' : '02'}</span> Launch</div>
        <div className="run-info">
          <p>The benchmark sends <strong>20 questions</strong> (AMF · MiFID II · DORA) to the selected model, then uses Ollama as an <strong>LLM judge</strong> to score each response from 0 to 10. Estimated duration: <strong>5–15 min</strong>.</p>
        </div>
        <button
          className="btn btn-gold"
          onClick={startRun}
          disabled={running || !selectedModel}
          style={{ fontSize: '0.9rem', padding: '0.7rem 2rem', opacity: (!selectedModel && !running) ? 0.4 : 1 }}
        >
          {running ? 'Running...' : `▶ Start with ${selectedModel || '—'}`}
        </button>
        {running && (
          <div className="running-indicator">
            <div className="pulse" />
            Benchmark in progress — do not close this window
          </div>
        )}
      </div>
    </div>
  )
}
