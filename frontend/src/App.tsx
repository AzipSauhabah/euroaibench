import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Questions from './pages/Questions'
import RunDetail from './pages/RunDetail'
import NewRun from './pages/NewRun'
import './App.css'

type Page = { name: 'dashboard' } | { name: 'questions' } | { name: 'run'; id: number } | { name: 'new-run' }

export default function App() {
  const [page, setPage] = useState<Page>({ name: 'dashboard' })

  const nav = (p: Page) => setPage(p)

  return (
    <div className="app">
      <nav className="navbar">
        <span className="brand" onClick={() => nav({ name: 'dashboard' })}>⚖️ EuroAIBench</span>
        <div className="nav-links">
          <button onClick={() => nav({ name: 'dashboard' })}>Dashboard</button>
          <button onClick={() => nav({ name: 'questions' })}>Questions</button>
          <button onClick={() => nav({ name: 'new-run' })} className="btn-primary">▶ Nouveau Run</button>
        </div>
      </nav>
      <main className="main">
        {page.name === 'dashboard' && <Dashboard onSelectRun={(id) => nav({ name: 'run', id })} onNewRun={() => nav({ name: 'new-run' })} />}
        {page.name === 'questions' && <Questions />}
        {page.name === 'run' && <RunDetail runId={page.id} onBack={() => nav({ name: 'dashboard' })} />}
        {page.name === 'new-run' && <NewRun onRunCreated={(id) => nav({ name: 'run', id })} />}
      </main>
    </div>
  )
}
