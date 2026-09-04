import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, BookOpen, Brain, ChevronDown, CircleUserRound, Gauge, Home, Languages, Menu, Moon, Settings, Sparkles, Sun, Target, Type, X } from 'lucide-react'
import { useState } from 'react'
import { getCurrentUser, getUserInitials } from '../services/authService'

const links = [
  { to: '/', label: 'Home', icon: Home }, { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/translator', label: 'AI Translator', icon: Languages }, { to: '/text-to-sign', label: 'Text to Sign', icon: Type },
  { to: '/practice', label: 'Practice', icon: Target }, { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/progress', label: 'Progress', icon: Gauge }, { to: '/profile', label: 'Profile', icon: CircleUserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ onClose }) {
  return <aside className="sidebar"><div className="brand"><div className="brand-mark"><Sparkles size={17} /></div><div><strong>SignBridge <em>AI</em></strong><span>Learn. Understand. Communicate.</span></div><button className="close-mobile icon-button" onClick={onClose} aria-label="Close navigation"><X size={18} /></button></div><nav className="side-nav" aria-label="Main navigation"><p className="nav-label">Workspace</p>{links.slice(0, 7).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={onClose}><Icon size={18} /><span>{label}</span>{label === 'AI Translator' && <span className="new-dot" />}</NavLink>)}<p className="nav-label nav-label-lower">Account</p>{links.slice(7).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onClose}><Icon size={18} /><span>{label}</span></NavLink>)}</nav><div className="language-note"><span className="status-dot" />Prototype language<strong>Indian Sign Language (ISL)</strong></div></aside>
}

export function Topbar({ onMenu, dark, onTheme }) {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const userName = user?.name || 'User'
  return <header className="topbar"><button className="mobile-menu icon-button" onClick={onMenu} aria-label="Open navigation"><Menu size={21} /></button><div className="topbar-context"><span>Workspace</span><ChevronDown size={14} /></div><div className="topbar-actions"><button className="icon-button" onClick={onTheme} aria-label="Toggle color theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><button className="avatar" onClick={() => navigate('/profile')} aria-label={`Open ${userName} profile`}>{getUserInitials(userName)}</button></div></header>
}

export function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('signbridge-theme') === 'dark')
  const toggleTheme = () => { const next = !dark; setDark(next); document.documentElement.dataset.theme = next ? 'dark' : 'light'; localStorage.setItem('signbridge-theme', next ? 'dark' : 'light') }
  return <div className="app-shell"><div className={`sidebar-wrap ${mobileOpen ? 'is-open' : ''}`}><Sidebar onClose={() => setMobileOpen(false)} /></div>{mobileOpen && <button className="backdrop" onClick={() => setMobileOpen(false)} aria-label="Close navigation" /> }<main className="main-area"><Topbar onMenu={() => setMobileOpen(true)} dark={dark} onTheme={toggleTheme} /><div className="page-content">{children}</div></main></div>
}
