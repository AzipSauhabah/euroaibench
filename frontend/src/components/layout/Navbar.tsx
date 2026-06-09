import { NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        Σ QuantAIBench
        <span className="brand-sub">v1.0 · Market · Corporate · Risk · Quant</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-active' : ''}>Leaderboard</NavLink>
        <NavLink to="/dataset" className={({ isActive }) => isActive ? 'nav-active' : ''}>Dataset</NavLink>
        <NavLink to="/models" className={({ isActive }) => isActive ? 'nav-active' : ''}>Models</NavLink>
        <NavLink to="/docs" className={({ isActive }) => isActive ? 'nav-active' : ''}>API Docs</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-active' : ''}>About</NavLink>
        <NavLink to="/run" className="btn-run">▶ Run Benchmark</NavLink>
      </div>
    </nav>
  )
}
