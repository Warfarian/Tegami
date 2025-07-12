import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Index from './pages/Index'
import Login from './pages/Login'
import WriteInvite from './pages/WriteInvite'
import CassetteWall from './pages/CassetteWall'
import RecordCassette from './pages/RecordCassette'
import Journal from './pages/Journal'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-paper bg-paper-texture text-ink-blue font-serif">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/write-invite" element={<WriteInvite />} />
          <Route path="/cassette" element={<CassetteWall />} />
          <Route path="/record" element={<RecordCassette />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App