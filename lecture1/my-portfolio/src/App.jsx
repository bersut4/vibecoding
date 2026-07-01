import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AboutMePage from './pages/AboutMePage'
import ProjectsPage from './pages/ProjectsPage'

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutMePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
