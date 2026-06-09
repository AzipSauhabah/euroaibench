const ENDPOINTS = [
  { method:'GET', path:'/health', desc:'Health check', response:'{"status":"ok","service":"quantaibench"}' },
  { method:'GET', path:'/questions/', desc:'List all 24 benchmark questions', response:'[{"id":1,"domain":"MARKET","language":"EN","difficulty":"hard","category":"...","question":"...","reference_answer":"...","source_ref":"..."}]' },
  { method:'GET', path:'/questions/{id}', desc:'Get a single question by ID', response:'{"id":1,...}' },
  { method:'GET', path:'/runs/', desc:'List all benchmark runs ordered by date', response:'[{"id":1,"model_name":"mistral:7b","avg_score":7.4,"answers":[...],...}]' },
  { method:'POST', path:'/runs/', desc:'Launch a new benchmark run', response:'{"id":4,"model_name":"...","avg_score":...}', body:'{"model_name":"mistral:7b","ollama_host":"http://IP:11434"}' },
  { method:'GET', path:'/runs/{id}', desc:'Get a run with all answers and scores', response:'{"id":1,...,"answers":[{"judge_score":8.0,"judge_feedback":"..."},...]}' },
  { method:'POST', path:'/judge/', desc:'Score a single response with LLM judge', response:'{"score":7.5,"feedback":"..."}', body:'{"question_id":1,"model_response":"..."}' },
  { method:'GET', path:'/models/', desc:'List available Ollama models', response:'{"models":["mistral:7b","qwen2.5:14b"],"host":"http://..."}' },
]

const METHOD_COLORS: Record<string,string> = { GET:'#5a9c6e', POST:'#c9a84c', DELETE:'#c25a5a' }

export default function ApiDocs() {
  const base = import.meta.env.VITE_API_URL || 'https://api-bench.sauhabah-advisory.eu'

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">API Documentation</div>
          <div className="page-subtitle">REST API · OpenAPI 3.1 · Base URL: {base}</div>
        </div>
        <a href={`${base}/docs`} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{fontSize:'0.75rem',padding:'0.5rem 1rem',border:'1px solid var(--border)',borderRadius:3,color:'var(--text-2)'}}>
          Swagger UI ↗
        </a>
      </div>

      <div className="run-section" style={{marginBottom:'1px'}}>
        <div className="section-label">Authentication</div>
        <p style={{fontSize:'0.85rem',color:'var(--text-2)',lineHeight:1.7}}>
          The API is currently open. Rate limiting and API keys will be added in a future release.
          For bulk access or integration partnerships, contact us.
        </p>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'1px'}}>
        {ENDPOINTS.map(ep => (
          <div key={ep.path} className="run-section">
            <div style={{display:'flex',gap:'0.75rem',alignItems:'center',marginBottom:'0.75rem'}}>
              <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.7rem',fontWeight:600,color:METHOD_COLORS[ep.method]||'var(--text-2)',background:`${METHOD_COLORS[ep.method]}18`,padding:'0.2rem 0.55rem',borderRadius:2,border:`1px solid ${METHOD_COLORS[ep.method]}30`}}>{ep.method}</span>
              <code style={{fontFamily:'DM Mono,monospace',fontSize:'0.85rem',color:'var(--text)'}}>{ep.path}</code>
            </div>
            <p style={{fontSize:'0.82rem',color:'var(--text-2)',marginBottom:'0.75rem'}}>{ep.desc}</p>
            {ep.body && (
              <div style={{marginBottom:'0.5rem'}}>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.6rem',color:'var(--text-3)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.3rem'}}>Request body</div>
                <pre style={{background:'var(--bg)',border:'1px solid var(--border-2)',borderRadius:3,padding:'0.75rem 1rem',fontFamily:'DM Mono,monospace',fontSize:'0.75rem',color:'var(--text-2)',overflowX:'auto',margin:0}}>{ep.body}</pre>
              </div>
            )}
            <div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.6rem',color:'var(--text-3)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.3rem'}}>Response</div>
              <pre style={{background:'var(--bg)',border:'1px solid var(--border-2)',borderRadius:3,padding:'0.75rem 1rem',fontFamily:'DM Mono,monospace',fontSize:'0.75rem',color:'var(--gold-dim)',overflowX:'auto',margin:0}}>{ep.response}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
