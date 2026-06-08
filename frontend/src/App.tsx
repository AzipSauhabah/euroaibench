import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import Leaderboard from './pages/Leaderboard'
import Dataset from './pages/Dataset'
import Models from './pages/Models'
import RunPage from './pages/RunPage'
import RunDetail from './pages/RunDetail'
import ApiDocs from './pages/ApiDocs'
import About from './pages/About'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Leaderboard />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/models" element={<Models />} />
            <Route path="/run" element={<RunPage />} />
            <Route path="/run/:id" element={<RunDetail />} />
            <Route path="/docs" element={<ApiDocs />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
