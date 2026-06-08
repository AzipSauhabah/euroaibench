import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">About EuroAIBench</div>
          <div className="page-subtitle">Open benchmark for European financial regulation</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',marginBottom:'1px'}}>
        <div className="run-section">
          <div className="section-label">Mission</div>
          <p style={{fontSize:'0.875rem',color:'var(--text-2)',lineHeight:1.8}}>
            LLMs are increasingly used in financial services for compliance assistance, regulatory Q&A,
            and legal research. Yet no public benchmark existed for European financial regulation in French.
            EuroAIBench fills that gap with a rigorous, expert-curated evaluation framework.
          </p>
        </div>
        <div className="run-section">
          <div className="section-label">Methodology</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.75rem',color:'var(--text-2)',lineHeight:2}}>
            <div>20 questions · expert-curated</div>
            <div>3 regulations: AMF · MiFID II · DORA</div>
            <div>3 difficulty levels: easy · medium · hard</div>
            <div>LLM judge scoring 0–10</div>
            <div>Criteria: accuracy · completeness · citations</div>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1px',marginBottom:'1px'}}>
        {[
          { reg:'AMF', color:'#5a7ec2', desc:'Autorité des marchés financiers. Market abuse, investor protection, PSI conduct, sanctions, OPCVM reporting.' },
          { reg:'MiFID II', color:'#c9a84c', desc:'Markets in Financial Instruments Directive. Client classification, best execution, product governance, transaction reporting, research unbundling.' },
          { reg:'DORA', color:'#5a9c6e', desc:'Digital Operational Resilience Act. ICT risk management, incident reporting, TLPT testing, third-party risk. In force since Jan 2025.' },
        ].map(r => (
          <div key={r.reg} className="run-section">
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',fontWeight:600,color:r.color,marginBottom:'0.5rem'}}>{r.reg}</div>
            <p style={{fontSize:'0.8rem',color:'var(--text-2)',lineHeight:1.7}}>{r.desc}</p>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',marginBottom:'1px'}}>
        <div className="run-section">
          <div className="section-label">Licensing</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.75rem',lineHeight:2}}>
            <div><span style={{color:'var(--gold)'}}>Code</span> <span style={{color:'var(--text-2)'}}>AGPL-3.0 — open source</span></div>
            <div><span style={{color:'var(--gold)'}}>Dataset</span> <span style={{color:'var(--text-2)'}}>CC BY-NC-ND 4.0</span></div>
            <div><span style={{color:'var(--gold)'}}>Results</span> <span style={{color:'var(--text-2)'}}>CC BY 4.0 — freely reusable</span></div>
          </div>
        </div>
        <div className="run-section">
          <div className="section-label">Built by</div>
          <p style={{fontSize:'0.875rem',color:'var(--text-2)',lineHeight:1.8,marginBottom:'0.75rem'}}>
            <strong style={{color:'var(--text)'}}>Sauhabah Advisory</strong> — independent quantitative finance platform.
            Senior front office developer background (C++, equity derivatives, fixed income).
          </p>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <a href="https://github.com/AzipSauhabah/euroaibench" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{fontSize:'0.75rem'}}>GitHub ↗</a>
            <a href="https://sauhabah-advisory.eu" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{fontSize:'0.75rem'}}>Website ↗</a>
          </div>
        </div>
      </div>

      <div className="run-section" style={{textAlign:'center',padding:'2.5rem'}}>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.3rem',marginBottom:'0.75rem',color:'var(--text)'}}>Run the benchmark yourself</div>
        <p style={{fontSize:'0.85rem',color:'var(--text-2)',marginBottom:'1.5rem',maxWidth:480,margin:'0 auto 1.5rem'}}>Any Ollama-compatible model. Self-hosted, no data leaves your infrastructure.</p>
        <button className="btn btn-gold" onClick={()=>navigate('/run')}>▶ Start evaluation</button>
      </div>
    </div>
  )
}
