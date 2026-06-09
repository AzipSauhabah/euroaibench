import { useNavigate } from 'react-router-dom'

const DOMAIN_CARDS = [
  { name:'Market Finance', color:'#c9a84c', desc:'Derivatives, structured products (autocalls, Phoenix, Himalaya), the Greeks, volatility and hedging.' },
  { name:'Corporate Finance', color:'#5a7ec2', desc:'Valuation (DCF/FCFF), WACC, capital structure, Modigliani-Miller, M&A and LBO.' },
  { name:'Project Finance', color:'#5a9c6e', desc:'SPV structuring, non-recourse debt, DSCR/LLCR debt sizing and sculpting, ring-fencing.' },
  { name:'Risk Management', color:'#c25a5a', desc:'VaR and Expected Shortfall, coherence, Basel/FRTB, CVA and the broader xVA family.' },
  { name:'Quant Strategies', color:'#9c5ac2', desc:'Sharpe and information ratios, factor investing, Fama-French, backtesting pitfalls.' },
  { name:'Rates & Fixed Income', color:'#4ca89c', desc:'Duration and convexity, swap valuation, par rates, multi-curve and OIS discounting.' },
]

export default function About() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">About QuantAIBench</div>
          <div className="page-subtitle">Open benchmark for quantitative &amp; market finance</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',marginBottom:'1px'}}>
        <div className="run-section">
          <div className="section-label">Mission</div>
          <p style={{fontSize:'0.875rem',color:'var(--text-2)',lineHeight:1.8}}>
            LLMs are increasingly used across trading floors, quant desks and finance functions for
            modeling, derivation and technical Q&amp;A. Yet no public benchmark measured how reliably they
            handle rigorous quantitative finance — and how often they hallucinate formulas or results.
            QuantAIBench fills that gap with an expert-curated, bilingual evaluation framework.
          </p>
        </div>
        <div className="run-section">
          <div className="section-label">Methodology</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.75rem',color:'var(--text-2)',lineHeight:2}}>
            <div>24 questions · expert-curated · bilingual EN/FR</div>
            <div>6 domains: market · corporate · project · risk · quant · rates</div>
            <div>3 difficulty levels: easy · medium · hard</div>
            <div>LLM judge scoring 0–10</div>
            <div>Criteria: technical accuracy · rigor · hallucination detection</div>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1px',marginBottom:'1px'}}>
        {DOMAIN_CARDS.map(d => (
          <div key={d.name} className="run-section">
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',fontWeight:600,color:d.color,marginBottom:'0.5rem'}}>{d.name}</div>
            <p style={{fontSize:'0.8rem',color:'var(--text-2)',lineHeight:1.7}}>{d.desc}</p>
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
            Senior front office developer background (C++, equity derivatives, fixed income, IRD).
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
