import { useState, useEffect } from 'react'
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
      if (res.error) setError(`Ollama: ${res.error}`)
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
      <h1>Nouveau Run de Benchmark</h1>
      <div className="card">
        <h2>1. Configurer Ollama</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input className="input" value={ollamaHost} onChange={e => setOllamaHost(e.target.value)} placeholder="http://IP:11434" />
          <button className="btn btn-ghost" onClick={fetchModels} disabled={loading}>{loading ? '...' : 'Détecter modèles'}</button>
        </div>
        {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {models.length > 0 && (
          <>
            <h2>2. Choisir le modèle</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {models.map(m => (
                <button key={m} className={`btn ${selectedModel === m ? 'btn-blue' : 'btn-ghost'}`} onClick={() => setSelectedModel(m)}>{m}</button>
              ))}
            </div>
          </>
        )}
        <h2>3. Lancer</h2>
        <p style={{ color: '#a0aec0', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Le benchmark va envoyer les 20 questions réglementaires au modèle, puis utiliser Ollama comme juge LLM pour noter chaque réponse sur 10.
          Durée estimée: 5–15 min selon le modèle.
        </p>
        <button className="btn btn-blue" onClick={startRun} disabled={running || !selectedModel} style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
          {running ? '⏳ Benchmark en cours...' : `▶ Lancer avec ${selectedModel || '—'}`}
        </button>
        {running && <p style={{ color: '#a0aec0', marginTop: '1rem', fontSize: '0.85rem' }}>
          Ne fermez pas cette fenêtre. Les 20 questions sont envoyées séquentiellement au LLM + juge.
        </p>}
      </div>
    </div>
  )
}
