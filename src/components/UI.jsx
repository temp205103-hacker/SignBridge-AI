import { ArrowRight, Lock, Play, Sparkles } from 'lucide-react'

export function Button({ children, variant = 'primary', icon: Icon, ...props }) {
  return <button className={`button button-${variant}`} {...props}>{children}{Icon && <Icon size={16} strokeWidth={2.2} />}</button>
}

export function StatCard({ icon: Icon, label, value, detail, tone = 'coral' }) {
  return <div className={`stat-card stat-${tone}`}><div className="stat-icon"><Icon size={18} /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>
}

export function SignCard({ sign, compact = false }) {
  return <article className={`sign-card ${compact ? 'sign-compact' : ''}`}><div className="sign-visual"><span>{sign.emoji}</span><button className="icon-button" aria-label={`Play ${sign.term} demonstration`}><Play size={15} fill="currentColor" /></button></div><div className="sign-info"><div><h3>{sign.term}</h3><span className="pill">{sign.category}</span></div>{!compact && <p>{sign.description}</p>}</div></article>
}

export function ProgressBar({ value, tone = 'coral' }) {
  return <div className="progress-track" aria-label={`${value}% complete`}><span className={`progress-fill fill-${tone}`} style={{ width: `${value}%` }} /></div>
}

export function LessonRow({ lesson }) {
  return <div className="lesson-row"><div className={`lesson-mark mark-${lesson.color}`}><Sparkles size={18} /></div><div className="lesson-copy"><strong>{lesson.title}</strong><span>{lesson.meta}</span><ProgressBar value={lesson.progress} tone={lesson.color} /></div><span className="lesson-percent">{lesson.progress}%</span><ArrowRight size={17} className="muted-icon" /></div>
}

export function EmptyState({ title, text, locked = false }) {
  return <div className="empty-state">{locked ? <Lock size={22} /> : <Sparkles size={22} />}<strong>{title}</strong><p>{text}</p></div>
}
