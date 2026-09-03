import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, LockKeyhole, Sparkles } from 'lucide-react'
import { Button } from '../components/UI'

const accountKey = 'signbridge-account'
const userKey = 'signbridge-user'

function AuthLayout({ mode }) {
  const login = mode === 'login'
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const email = form.get('email').trim().toLowerCase()
    const password = form.get('password')

    if (login) {
      let account = null
      try { account = JSON.parse(localStorage.getItem(accountKey) || 'null') } catch {}
      const name = form.get('name').trim()
      if (!account || account.name.toLowerCase() !== name.toLowerCase() || account.email !== email || account.password !== password) {
        setError('That email or password does not match your account.')
        return
      }
      localStorage.setItem(userKey, JSON.stringify({ name: account.name, email: account.email }))
      navigate('/')
      return
    }

    const name = form.get('name').trim()
    localStorage.setItem(accountKey, JSON.stringify({ name, email, password }))
    navigate('/login')
  }

  return <main className="auth-page"><div className="auth-aside"><div className="brand auth-brand"><div className="brand-mark"><Sparkles size={17} /></div><strong>SignBridge <em>AI</em></strong></div><div className="auth-quote"><span>ISL learning, made human.</span><h1>Build a bridge<br />with every sign.</h1><p>Learn Indian Sign Language with a thoughtful companion that meets you where you are.</p></div><div className="auth-aside-footer"><span className="status-dot" />A calmer way to connect</div></div><section className="auth-form-wrap"><div className="auth-form"><div className="mobile-auth-brand"><div className="brand-mark"><Sparkles size={17} /></div><strong>SignBridge <em>AI</em></strong></div><span className="eyebrow">{login ? 'Welcome back' : 'Your first step'}</span><h2>{login ? 'Good to see you.' : 'Start your journey.'}</h2><p className="auth-subtitle">{login ? 'Continue learning at your own pace.' : 'Create your free account and learn your first signs.'}</p><form onSubmit={handleSubmit}>
          <label>Your name<div className="input-wrap"><input name="name" type="text" placeholder="Your name" autoComplete="name" required /></div></label>
          <label>Gmail address<div className="input-wrap"><Mail size={17} /><input name="email" type="email" placeholder="you@gmail.com" autoComplete="email" required /></div></label>
          <label>Password<div className="input-wrap"><LockKeyhole size={17} /><input name="password" type="password" placeholder="At least 8 characters" autoComplete={login ? 'current-password' : 'new-password'} minLength="8" required /></div></label>
          {login && <div className="form-meta"><label className="check-label"><input type="checkbox" /> Remember me</label><a href="#forgot">Forgot password?</a></div>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <Button type="submit" icon={ArrowRight}>{login ? 'Sign in' : 'Create account'}</Button>
        </form><p className="auth-switch">{login ? "Don't have an account?" : 'Already have an account?'} <Link to={login ? '/register' : '/login'}>{login ? 'Create one' : 'Sign in'}</Link></p><small className="auth-language">You are learning <strong>Indian Sign Language (ISL)</strong></small></div></section></main>
}
export function Login() { return <AuthLayout mode="login" /> }
export function Register() { return <AuthLayout mode="register" /> }
