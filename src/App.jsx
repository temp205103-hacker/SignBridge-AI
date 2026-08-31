import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/Layout'
import { Home, Learn, Translator, TextToSign, Practice, Quiz, Progress, Profile, Settings } from './pages/AppPages'
import { Login, Register } from './pages/AuthPages'

function App() {
  return <BrowserRouter><Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/*" element={<AppShell><Routes><Route index element={<Home />} /><Route path="learn" element={<Learn />} /><Route path="translator" element={<Translator />} /><Route path="text-to-sign" element={<TextToSign />} /><Route path="practice" element={<Practice />} /><Route path="quiz" element={<Quiz />} /><Route path="progress" element={<Progress />} /><Route path="profile" element={<Profile />} /><Route path="settings" element={<Settings />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppShell>} /></Routes></BrowserRouter>
}

export default App
