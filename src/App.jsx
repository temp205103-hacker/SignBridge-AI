import './App.css'
import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/Layout'
import { Home, Learn, Translator, TextToSign, Quiz, Progress, Profile, Settings } from './pages/AppPages'
import { PracticePage } from './pages/PracticePage'
import { Login, Register } from './pages/AuthPages'

function ProtectedApp() {
  const isSignedIn = Boolean(localStorage.getItem('signbridge-user'))

  if (!isSignedIn) return <Navigate to="/login" replace />

  return <AppShell><Routes><Route index element={<Home />} /><Route path="learn" element={<Learn />} /><Route path="translator" element={<Translator />} /><Route path="text-to-sign" element={<TextToSign />} /><Route path="practice" element={<PracticePage />} /><Route path="quiz" element={<Quiz />} /><Route path="progress" element={<Progress />} /><Route path="profile" element={<Profile />} /><Route path="settings" element={<Settings />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppShell>
}

function App() {
  return <BrowserRouter><Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/*" element={<AppShell><Routes><Route index element={<Home />} /><Route path="learn" element={<Learn />} /><Route path="translator" element={<Translator />} /><Route path="text-to-sign" element={<TextToSign />} /><Route path="practice" element={<PracticePage />} /><Route path="quiz" element={<Quiz />} /><Route path="progress" element={<Progress />} /><Route path="profile" element={<Profile />} /><Route path="settings" element={<Settings />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppShell>} /></Routes></BrowserRouter>
}

export default App
