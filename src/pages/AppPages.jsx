import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Camera, CheckCircle2, ChevronRight, Flame, Languages, RotateCcw, Send, ShieldCheck, Sparkles, Star, Trophy, UserRound, AlertTriangle, History, Square, Target } from 'lucide-react'
import { signs, lessons, textSignDictionary, frequentPhrases, learningCategories } from '../data/signs'
import { Button, EmptyState, LessonRow, ProgressBar, StatCard } from '../components/UI'
import { CameraConsentDialog } from '../components/CameraConsentDialog'
import { getCameraErrorMessage, requestCamera, stopCamera, hasUserConsent, setUserConsent } from '../services/cameraService'
import { classifyPrototypeGesture, closeLandmarkRecognizer, createLandmarkRecognizer, detectLandmarks, getPrototypeVocabulary } from '../services/signRecognitionService'
import { getCurrentUser, getUserInitials } from '../services/authService'

export function PageHeader({ eyebrow, title, description, action }) { const displayTitle = title.includes(' · Practice:') ? title.split(' · Practice:')[0] : title; return <div className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{displayTitle}</h1>{description && <p>{description}</p>}</div>{action}</div> }

const defaultProgress = { completedSigns: [], lessonsCompleted: 0, quizScores: [], practiceAttempts: 0, practiceSessions: 0, recognizedAttempts: 0, recognizedCorrect: 0, practiceDates: [], lastPracticeDate: null }
function getProgressKey() { const email = getCurrentUser()?.email?.trim().toLowerCase() || 'guest'; return `signbridge-learning-progress:${email}` }
function readProgress() { try { return { ...defaultProgress, ...JSON.parse(localStorage.getItem(getProgressKey()) || '{}') } } catch { return defaultProgress } }
function writeProgress(update) { const next = { ...readProgress(), ...update }; localStorage.setItem(getProgressKey(), JSON.stringify(next)); return next }
function useLearningProgress() { const [progress, setProgress] = useState(readProgress); const update = (change) => setProgress(writeProgress(typeof change === 'function' ? change(readProgress()) : change)); return [progress, update] }
function getLearningStreak(practiceDates) { const dates = new Set(practiceDates); let streak = 0; const cursor = new Date(); while (dates.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setDate(cursor.getDate() - 1) } return streak }

export function Home() {
  const user = getCurrentUser()
  const userName = user?.name || 'there'
  const navigate = useNavigate()
  const [progress] = useLearningProgress()
  const average = progress.quizScores.length ? Math.round(progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length) : 0
  const streak = getLearningStreak(progress.practiceDates)
  const nextSign = signs.find((sign) => !progress.completedSigns.includes(sign.id))
  const resumeLearning = () => navigate(nextSign ? `/practice?sign=${nextSign.id}` : '/learn')
  return <><PageHeader eyebrow="Wednesday, 14 August 2024" title={`Hello, ${userName}`} description="Keep your hands moving. You’re building something meaningful." action={<Button onClick={resumeLearning} icon={ArrowRight}>{nextSign ? 'Continue learning' : 'Review library'}</Button>} /><div className="hero-banner"><div><span className="eyebrow">Your next step</span><h2>{nextSign ? nextSign.term : 'Library complete'}</h2><p>{nextSign ? `Resume with ${nextSign.term}, your next sign from this checkpoint.` : 'You have completed every sign. Keep practicing to stay fluent.'}</p><Button onClick={resumeLearning} variant="dark" icon={PlayIcon}>{nextSign ? 'Resume lesson' : 'Review library'}</Button></div><div className="hero-art"><span>👋</span><span>✦</span></div></div><div className="stats-grid"><StatCard icon={Sparkles} label="Signs learned" value={`${progress.completedSigns.length}/${signs.length}`} detail={`${Math.round((progress.completedSigns.length / signs.length) * 100)}% of library`} /><StatCard icon={Flame} label="Practice streak" value={`${streak} day${streak === 1 ? '' : 's'}`} detail="Based on practice activity" tone="gold" /><StatCard icon={Trophy} label="Quiz score" value={average ? `${average}%` : '—'} detail={`${progress.quizScores.length} quiz${progress.quizScores.length === 1 ? '' : 'zes'} completed`} tone="blue" /></div><div className="dashboard-grid"><section className="panel lessons-panel"><div className="section-heading"><div><span className="eyebrow">Keep going</span><h2>Recent lessons</h2></div><a href="/learn">View all <ArrowRight size={15} /></a></div>{lessons.map((lesson) => <LessonRow key={lesson.title} lesson={lesson} />)}</section><section className="panel daily-panel"><span className="eyebrow">Daily practice</span><h2>A little practice<br /><em>goes a long way.</em></h2><p>Three minutes today keeps your progress moving forward.</p><div className="daily-ring"><strong>3</strong><span>min</span></div><Button onClick={resumeLearning} variant="outline" icon={ArrowRight}>{nextSign ? 'Practice next sign' : 'Review library'}</Button></section></div></>
}
function PlayIcon(props) { return <span {...props}>▶</span> }

export function Learn() { const [filter, setFilter] = useState('All signs'); const [progress, update] = useLearningProgress(); const filtered = filter === 'All signs' ? signs : signs.filter((sign) => sign.category === filter); const complete = (id) => update((current) => ({ completedSigns: current.completedSigns.includes(id) ? current.completedSigns : [...current.completedSigns, id] })); return <><PageHeader eyebrow="The library" title="Learn ISL, one sign at a time." description="Explore practical signs with clear meanings, examples, and an honest prototype demonstration area." action={<div className="library-count"><strong>{progress.completedSigns.length}</strong><span>of {signs.length}<br />signs completed</span></div>} /><div className="category-row"><button className={filter === 'All signs' ? 'filter-active' : ''} onClick={() => setFilter('All signs')}>All signs</button>{learningCategories.map((category) => <button key={category} className={filter === category ? 'filter-active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="learning-grid">{filtered.map((sign) => <article className="learning-card" key={sign.id}><div className="learning-visual"><span>{sign.emoji}</span><small>Prototype demonstration</small></div><div className="learning-copy"><div className="learning-title"><h2>{sign.term}</h2>{progress.completedSigns.includes(sign.id) && <CheckCircle2 size={18} className="completed-icon" />}</div><span className="pill">{sign.category}</span><p><strong>Meaning:</strong> {sign.meaning}</p><p><strong>Example:</strong> {sign.example}</p><div className="sign-representation-box"><div className="sign-component"><span className="sign-component-label">Hand Shape</span><div className="sign-component-value">{sign.handShape}</div></div><div className="sign-component"><span className="sign-component-label">Motion</span><div className="sign-motion">{sign.motion}</div></div><div className="sign-component"><span className="sign-component-label">Representation</span><div className="sign-component-description">{sign.representation}</div></div></div><div className="learning-actions"><Link className="button button-outline" to={`/practice?sign=${sign.id}`}>Practice <ArrowRight size={15} /></Link><button className="button button-primary" disabled={progress.completedSigns.includes(sign.id)} onClick={() => complete(sign.id)}>{progress.completedSigns.includes(sign.id) ? 'Completed' : 'Mark completed'} <CheckCircle2 size={15} /></button></div></div></article>)}</div></> }

export function Translator() {
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const streamRef = useRef(null)
  const recognizerRef = useRef(null)
  const frameRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [detected, setDetected] = useState(null)
  const [history, setHistory] = useState([])
  const [landmarksReady, setLandmarksReady] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [showConsent, setShowConsent] = useState(false)

  const clearLandmarkOverlay = () => {
    const canvas = overlayRef.current
    if (!canvas) return
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }

  const waitForVideoFrame = async () => {
    const video = videoRef.current
    if (!video) throw new Error('Video element is not available.')
    if (video.videoWidth > 0 && video.videoHeight > 0) return

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        video.removeEventListener('loadedmetadata', handleReady)
        reject(new Error('Camera video did not become ready.'))
      }, 5000)
      const handleReady = () => {
        clearTimeout(timeout)
        video.removeEventListener('loadedmetadata', handleReady)
        resolve()
      }
      video.addEventListener('loadedmetadata', handleReady, { once: true })
    })
  }

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current)
    clearLandmarkOverlay()
    closeLandmarkRecognizer(recognizerRef.current)
    stopCamera(streamRef.current, videoRef.current)
  }, [])

  const drawLandmarkOverlay = (hands, poseLandmarks) => {
    const canvas = overlayRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const width = video.clientWidth
    const height = video.clientHeight
    const pixelRatio = window.devicePixelRatio || 1
    if (canvas.width !== width * pixelRatio || canvas.height !== height * pixelRatio) {
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
    }

    const context = canvas.getContext('2d')
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    context.clearRect(0, 0, width, height)
    if ((!hands?.length && !poseLandmarks?.length) || !video.videoWidth || !video.videoHeight) return

    const scale = Math.max(width / video.videoWidth, height / video.videoHeight)
    const offsetX = (width - video.videoWidth * scale) / 2
    const offsetY = (height - video.videoHeight * scale) / 2
    const point = (landmark) => ({
      x: width - (landmark.x * video.videoWidth * scale + offsetX),
      y: landmark.y * video.videoHeight * scale + offsetY,
    })
    const connections = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]]
    const poseConnections = [[11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28]]

    if (poseLandmarks?.length) {
      poseLandmarks.forEach((landmarks) => {
        context.strokeStyle = 'rgba(255, 190, 120, .85)'
        context.lineWidth = 3
        poseConnections.forEach(([start, end]) => {
          if (!landmarks[start] || !landmarks[end]) return
          const first = point(landmarks[start])
          const second = point(landmarks[end])
          context.beginPath()
          context.moveTo(first.x, first.y)
          context.lineTo(second.x, second.y)
          context.stroke()
        })
      })
    }

    hands?.forEach((landmarks) => {
      context.strokeStyle = '#7de2d1'
      context.lineWidth = 3
      context.lineCap = 'round'
      connections.forEach(([start, end]) => {
        const first = point(landmarks[start])
        const second = point(landmarks[end])
        context.beginPath()
        context.moveTo(first.x, first.y)
        context.lineTo(second.x, second.y)
        context.stroke()
      })
      context.fillStyle = '#ffb199'
      landmarks.forEach((landmark) => {
        const position = point(landmark)
        context.beginPath()
        context.arc(position.x, position.y, 4, 0, Math.PI * 2)
        context.fill()
      })
    })
  }

  const scanFrame = (timestamp) => {
    try {
      const landmarks = detectLandmarks(recognizerRef.current, videoRef.current, timestamp)
      drawLandmarkOverlay(landmarks?.hands?.landmarks, landmarks?.pose?.landmarks)
      if (landmarks?.hands?.landmarks?.length > 0) {
        setStatus('hand-detected')
        const result = classifyPrototypeGesture(landmarks.hands.landmarks)
        if (result.sign) {
          setDetected(result)
          setHistory((items) => [{ sign: result.sign, confidence: Math.round(result.confidence * 100), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...items].slice(0, 8))
        }
      } else {
        setStatus('scanning')
      }
      frameRef.current = requestAnimationFrame(scanFrame)
    } catch (recognitionError) {
      clearLandmarkOverlay()
      setError(`Gesture detection stopped: ${recognitionError.message || 'the model returned an invalid frame.'}`)
      setStatus('model-error')
    }
  }

  const handleConsentAccept = async () => {
    setUserConsent(true)
    setShowConsent(false)
    await startCameraAfterConsent()
  }

  const handleConsentReject = () => {
    setShowConsent(false)
  }

  const startCameraAfterConsent = async () => {
    setError('')
    setStatus('requesting')
    try {
      if (!streamRef.current) {
        streamRef.current = await requestCamera(videoRef.current)
        setCameraReady(true)
      }
      await waitForVideoFrame()
      setStatus('loading-model')
      const result = await createLandmarkRecognizer()
      if (!result.available) {
        const detail = result.error?.message ? ` ${result.error.message}` : ''
        setError(`Hand landmark detection could not load.${detail} Check your internet connection and try again.`)
        setStatus('model-error')
        return
      }
      recognizerRef.current = { landmarker: result.landmarker, poseLandmarker: result.poseLandmarker }
      setLandmarksReady(true)
      setStatus('scanning')
      frameRef.current = requestAnimationFrame(scanFrame)
    } catch (cameraError) {
      setError(getCameraErrorMessage(cameraError))
      setStatus('error')
      stopCamera(streamRef.current, videoRef.current)
      streamRef.current = null
      setCameraReady(false)
      setLandmarksReady(false)
    }
  }

  const startCamera = () => {
    if (!hasUserConsent()) {
      setShowConsent(true)
    } else {
      startCameraAfterConsent()
    }
  }

  const stopScanning = () => {
    cancelAnimationFrame(frameRef.current)
    clearLandmarkOverlay()
    closeLandmarkRecognizer(recognizerRef.current)
    recognizerRef.current = null
    stopCamera(streamRef.current, videoRef.current)
    streamRef.current = null
    setCameraReady(false)
    setLandmarksReady(false)
    setStatus('idle')
  }

  const statusText = { idle: 'Camera is off', requesting: 'Requesting camera permission…', 'loading-model': 'Loading ISL gesture classifier…', scanning: 'Scanning for hand gesture…', 'hand-detected': 'Hand detected · analyzing gesture', error: 'Camera unavailable', 'model-error': 'Gesture model unavailable' }[status]
  const isActive = ['requesting', 'loading-model', 'scanning', 'hand-detected'].includes(status)
  const isPreviewActive = isActive || cameraReady

  return <><CameraConsentDialog isOpen={showConsent} onAccept={handleConsentAccept} onReject={handleConsentReject} /><PageHeader eyebrow="AI-powered practice" title="AI Sign Translator" description="An evaluated ISL gesture recognition model with hand tracking for real-time sign detection and feedback." /><div className="notice"><ShieldCheck size={18} /><span><strong>Prototype with evaluated gesture classifier.</strong> This gesture recognition model processes hand landmarks only and does not replace a qualified interpreter.</span></div><div className="translator-layout"><section className="camera-panel"><div className="camera-header"><span><span className={isPreviewActive ? 'live-dot' : 'status-dot'} />Live camera</span><span className="recognition-status">{statusText}</span></div><div className={`camera-preview camera-live ${isPreviewActive ? 'is-active' : ''}`}><video className={isPreviewActive ? '' : 'camera-video-hidden'} ref={videoRef} autoPlay muted playsInline aria-label="Live camera preview" /><canvas className="landmark-overlay" ref={overlayRef} aria-hidden="true" />{!isPreviewActive && <><Camera size={34} /><strong>Camera preview</strong><span>Camera access is off</span><small>Consent required to start camera</small></>} {isPreviewActive && <span className="camera-badge"><span className="live-dot" />LIVE</span>}</div>{error && <div className="camera-error" role="alert"><AlertTriangle size={17} /><span>{error}</span></div>}<div className="camera-actions"><Button onClick={isPreviewActive ? stopScanning : startCamera} icon={isPreviewActive ? Square : Camera}>{isPreviewActive ? 'Stop camera' : 'Start camera'}</Button>{status === 'error' || status === 'model-error' ? <button className="text-button retry-button" onClick={startCamera}>Try again</button> : null}</div></section><section className="translation-result"><div className="result-heading"><span className="eyebrow">Detected sign</span><button className="clear-button" onClick={() => setDetected(null)} disabled={!detected}>Clear <RotateCcw size={13} /></button></div><div className="result-word">{detected?.sign?.toUpperCase() || '—'}</div><div className="confidence" style={{ marginTop: detected ? '0' : '40px' }}><ProgressBar value={detected ? detected.confidence * 100 : 0} tone="coral" /><div className="confidence-row"><span>Confidence</span><strong>{detected ? `${Math.round(detected.confidence * 100)}%` : 'Waiting for a sign'}</strong></div></div><div className="result-note"><Languages size={19} className="muted-icon" />{detected ? <><div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Confidence: <strong style={{ color: 'var(--coral)' }}>{detected.confidence}%</strong></div><p style={{ fontSize: '12px', color: 'var(--muted)' }}>Sign recognized by the ISL gesture classifier.</p></> : landmarksReady ? <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>Hand landmarks detected. Waiting for a recognized gesture…</p> : <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>Start the camera to begin gesture recognition.</p>}</div><div className="pipeline"><span className="eyebrow">Pipeline status</span><div><span className="pipeline-done">Camera</span><ChevronRight size={13} /><span className={landmarksReady ? 'pipeline-done' : ''}>Hand landmarks</span><ChevronRight size={13} /><span>ISL classifier</span><ChevronRight size={13} /><span>Text output</span></div></div></section></div><div className="translator-lower"><section className="panel supported-signs"><div className="section-heading"><div><span className="eyebrow">Model scope</span><h2>Supported vocabulary</h2></div><span className="muted-text">{getPrototypeVocabulary().length} signs</span></div><div className="supported-list">{getPrototypeVocabulary().map((sign) => <span key={sign}>{sign}</span>)}</div></section><section className="panel history-panel"><div className="section-heading"><div><span className="eyebrow">Session log</span><h2>Translation history</h2></div><History size={18} className="muted-icon" /></div>{history.length ? history.map((item, index) => <div className="history-row" key={`${item.time}-${index}`}><CheckCircle2 size={16} /><strong>{item.sign}</strong><span>{item.confidence}% · {item.time}</span></div>) : <EmptyState title="No translations yet" text="Recognized signs will appear here during this session." />}</section></div></>
}

export function TextToSign() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('signbridge-recent-signs') || '[]'))

  const dictionaryByTerm = (term) => textSignDictionary.find((sign) => sign.term.toLowerCase() === term.toLowerCase())
  const translate = (value = text) => {
    const query = value.trim().replace(/\s+/g, ' ')
    if (!query) { setResult(null); return }
    const savedPhrase = frequentPhrases.find((item) => item.phrase.toLowerCase() === query.toLowerCase())
    const terms = savedPhrase?.sequence || query.split(' ')
    const sequence = terms.map(dictionaryByTerm).filter(Boolean)
    const complete = sequence.length === terms.length
    const nextResult = { query, sequence, complete, phrase: savedPhrase }
    setResult(nextResult)
    const nextRecent = [query, ...recent.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 5)
    setRecent(nextRecent)
    localStorage.setItem('signbridge-recent-signs', JSON.stringify(nextRecent))
  }
  const clear = () => { setText(''); setResult(null) }

  return <><PageHeader eyebrow="Communication tool" title="Text to Sign" description="Type a word or short phrase and receive a corresponding Indian Sign Language demonstration." /><div className="prototype-label"><ShieldCheck size={16} /><strong>Prototype supports selected signs.</strong><span>Demonstrations are placeholders until educator-reviewed media is available.</span></div><div className="text-sign-layout"><section className="panel text-input-panel"><div className="section-heading"><div><span className="eyebrow">Your phrase</span><h2>What would you like to say?</h2></div><span className="character-count">{text.length}/160</span></div><label className="sr-only" htmlFor="sign-query">Word or short phrase</label><textarea id="sign-query" maxLength="160" value={text} onChange={(e) => { setText(e.target.value); setResult(null) }} onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) translate() }} placeholder="Try “HELLO” or “PLEASE HELP”" /><div className="input-footer"><span><Sparkles size={15} /> ISL dictionary</span><div className="input-actions"><button className="clear-button" onClick={clear} disabled={!text && !result}>Clear</button><Button onClick={() => translate()} icon={Send}>Translate</Button></div></div></section><section className="panel phrase-output"><div className="section-heading"><div><span className="eyebrow">Sign result</span><h2>{result?.query?.toUpperCase() || '—'}</h2></div><Languages size={19} className="muted-icon" /></div>{result?.complete ? <div className="demonstration-result"><div className="demonstration-banner"><Camera size={18} /><strong>Sign demonstration area</strong><span>Placeholder demonstration</span></div><div className="demonstration-sequence">{result.sequence.map((sign, index) => <div className="demo-sign" key={sign.id}><div className="demo-visual"><span>{sign.emoji}</span><small>Placeholder</small></div><strong>{sign.term.toUpperCase()}</strong><p>{sign.demonstration}</p>{index < result.sequence.length - 1 && <ChevronRight className="demo-arrow" size={17} />}</div>)}</div></div> : result ? <div className="unsupported-result"><AlertTriangle size={22} /><strong>That phrase is outside the prototype dictionary.</strong><p>Try one supported sign at a time, or use a listed frequent phrase. No unverified gesture is shown.</p></div> : <EmptyState title="Your sign result will appear here" text="Search a supported word or phrase to begin." />}</section></div><div className="text-sign-bottom"><section className="panel phrase-presets"><div className="section-heading"><div><span className="eyebrow">Quick start</span><h2>Frequently used phrases</h2></div></div><div className="phrase-list">{frequentPhrases.map((item) => <button key={item.phrase} onClick={() => { setText(item.phrase); translate(item.phrase) }}><span>{item.phrase}</span><small>{item.category}</small><ArrowRight size={15} /></button>)}</div></section><section className="panel recent-searches"><div className="section-heading"><div><span className="eyebrow">Your activity</span><h2>Recently searched signs</h2></div><History size={18} className="muted-icon" /></div>{recent.length ? <div className="recent-list">{recent.map((item) => <button key={item} onClick={() => { setText(item); translate(item) }}>{item}<ChevronRight size={15} /></button>)}</div> : <EmptyState title="No recent searches" text="Your translated words will appear here." />}</section></div></>
}

export function Practice() { const params = new URLSearchParams(window.location.search); const initial = signs.find((sign) => sign.id === params.get('sign')) || signs[0]; const [target, setTarget] = useState(initial); const [progress, update] = useLearningProgress(); const [feedback, setFeedback] = useState(''); const [sessionStarted, setSessionStarted] = useState(false); const userName = getCurrentUser()?.name || 'there'; const markAttempt = (completed) => { const today = new Date().toISOString().slice(0, 10); setFeedback(completed ? `Self-check recorded for ${target.term}. This is your own confirmation, not an AI recognition result.` : 'Keep practicing, then use the self-check when you feel ready.'); update((current) => ({ practiceAttempts: current.practiceAttempts + 1, practiceSessions: sessionStarted ? current.practiceSessions : current.practiceSessions + 1, completedSigns: completed && !current.completedSigns.includes(target.id) ? [...current.completedSigns, target.id] : current.completedSigns, practiceDates: [...new Set([...current.practiceDates, today])], lastPracticeDate: today })); setSessionStarted(true) }; const next = () => { const index = signs.findIndex((sign) => sign.id === target.id); setTarget(signs[(index + 1) % signs.length]); setFeedback('') }; return <><PageHeader eyebrow="Build your fluency" title={`Hello, ${userName} · Practice: ${target.term.toUpperCase()}`} description="Practice at your own pace. Self-checks record your reflection; only the translator reports actual recognition data." action={<div className="practice-stat"><strong>{progress.practiceAttempts}</strong><span>attempts recorded</span></div>} /><div className="practice-workspace"><section className="practice-target panel"><span className="eyebrow">Target sign · {target.category}</span><div className="target-visual"><span>{target.emoji}</span><small>Sign demonstration area · placeholder</small></div><h2>{target.term}</h2><p>{target.meaning}</p><div className="practice-actions"><Button onClick={() => markAttempt(false)} variant="outline" icon={RotateCcw}>Try again</Button><Button onClick={() => markAttempt(true)} icon={CheckCircle2}>I did it</Button><Button onClick={next} variant="dark" icon={ArrowRight}>Next sign</Button></div>{feedback && <div className="practice-feedback" role="status">{feedback}</div>}</section><aside className="practice-guide panel"><span className="eyebrow">Practice notes</span><h2>Make it yours</h2><p>{target.example}</p><ul><li>Watch the placeholder demonstration carefully.</li><li>Repeat the movement several times.</li><li>Use I did it only for your own self-check.</li></ul><Link to="/translator" className="text-button">Use actual recognition in Translator <ArrowRight size={14} /></Link></aside></div></> }
export const LegacyPractice = Practice

export function Quiz() { const questions = signs.slice(0, 5).map((sign, index) => { const meaningQuestion = index % 2 === 0; return { sign, prompt: meaningQuestion ? `What does the sign “${sign.term}” mean?` : `Which sign means “${sign.meaning}”?`, correct: meaningQuestion ? sign.meaning : sign.term, answers: [meaningQuestion ? sign.meaning : sign.term, ...signs.filter((item) => item.id !== sign.id).slice(index, index + 3).map((item) => meaningQuestion ? item.meaning : item.term)] } }); const [step, setStep] = useState(0); const [selected, setSelected] = useState(null); const [score, setScore] = useState(0); const [finished, setFinished] = useState(false); const [progress, update] = useLearningProgress(); const question = questions[step]; const choose = (answer) => { if (selected) return; setSelected(answer); if (answer === question.correct) setScore((value) => value + 1) }; const next = () => { const finalScore = score + (step === questions.length - 1 && selected === question.correct ? 1 : 0); if (step === questions.length - 1) { update((current) => ({ quizScores: [...current.quizScores, Math.round((finalScore / questions.length) * 100)] })); setScore(finalScore); setFinished(true) } else { setStep((value) => value + 1); setSelected(null) } }; return <><PageHeader eyebrow="Check your progress" title="Daily quiz" description="Mix sign-to-meaning and meaning-to-sign questions. Answers are scored when you submit." />{finished ? <div className="quiz-shell quiz-finished"><Trophy size={34} /><span className="eyebrow">Quiz complete</span><h2>{score} / {questions.length}</h2><p>Your score: {Math.round((score / questions.length) * 100)}%</p><Button onClick={() => { setStep(0); setScore(0); setSelected(null); setFinished(false) }} icon={RotateCcw}>Try again</Button></div> : <div className="quiz-shell"><div className="quiz-top"><span>Question {step + 1} of {questions.length}</span><span>{progress.quizScores.length} completed quizzes</span></div><ProgressBar value={((step + 1) / questions.length) * 100} tone="coral" /><div className="quiz-question"><span className="question-number">0{step + 1}</span><h2>{question.prompt}</h2><div className="quiz-options">{question.answers.map((answer, index) => <button key={answer} className={selected && (answer === selected ? (answer === question.correct ? 'answer-correct' : 'answer-wrong') : '')} onClick={() => choose(answer)}><span>{String.fromCharCode(65 + index)}</span>{answer}{selected === answer && (answer === question.correct ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />)}</button>)}</div>{selected && <p className={selected === question.correct ? 'quiz-correct' : 'quiz-wrong'}>{selected === question.correct ? 'Correct. Nice work.' : `Not quite. The answer is ${question.correct}.`}</p>}<div className="quiz-footer"><span><Star size={16} /> {score} points</span><Button onClick={next} disabled={!selected} icon={ArrowRight}>{step === questions.length - 1 ? 'Finish quiz' : 'Next question'}</Button></div></div></div>}</> }

export function Progress() { const [progress] = useLearningProgress(); const percentage = Math.round((progress.completedSigns.length / signs.length) * 100); const average = progress.quizScores.length ? Math.round(progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length) : 0; const recognitionAccuracy = progress.recognizedAttempts ? `${Math.round((progress.recognizedCorrect / progress.recognizedAttempts) * 100)}%` : '—'; const dates = new Set(progress.practiceDates); let streak = 0; const cursor = new Date(); while (dates.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setDate(cursor.getDate() - 1) } return <><PageHeader eyebrow="Your learning journey" title="Progress that feels like progress." description="Your local prototype record keeps learning visible between visits." /><div className="stats-grid progress-stats"><StatCard icon={Sparkles} label="Signs learned" value={`${progress.completedSigns.length}/${signs.length}`} detail={`${percentage}% of library`} /><StatCard icon={CheckCircle2} label="Lessons completed" value={progress.lessonsCompleted} detail="Self-paced learning" tone="blue" /><StatCard icon={Star} label="Quiz scores" value={average ? `${average}%` : '—'} detail={`${progress.quizScores.length} quizzes`} tone="coral" /><StatCard icon={Target} label="Practice sessions" value={progress.practiceSessions} detail={`${progress.practiceAttempts} attempts`} tone="gold" /><StatCard icon={Languages} label="Recognition accuracy" value={recognitionAccuracy} detail={progress.recognizedAttempts ? `${progress.recognizedAttempts} detected attempts` : 'No recognition data yet'} tone="blue" /></div><div className="progress-overview"><div className="progress-score"><span className="eyebrow">Progress percentage</span><strong>{percentage}%</strong><ProgressBar value={percentage} tone="coral" /><span>{progress.completedSigns.length} of {signs.length} signs completed</span></div><div className="week-bars"><span className="eyebrow">Learning streak</span><strong className="streak-number">{streak} day{streak === 1 ? '' : 's'}</strong><p>{streak ? 'Your consecutive practice days.' : 'Complete a practice self-check to start.'}</p></div><StatCard icon={Flame} label="Learning streak" value={`${streak} day${streak === 1 ? '' : 's'}`} detail="Based on practice activity" tone="gold" /></div><section className="panel progress-lessons"><div className="section-heading"><div><span className="eyebrow">Learning paths</span><h2>Lesson progress</h2></div></div>{lessons.map((lesson) => <LessonRow key={lesson.title} lesson={lesson} />)}</section></> }

export function Profile() { const user = getCurrentUser(); const userName = user?.name || 'User'; const [progress] = useLearningProgress(); const average = progress.quizScores.length ? Math.round(progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length) : 0; const streak = getLearningStreak(progress.practiceDates); return <><PageHeader eyebrow="Your space" title="Profile" description="Make your learning experience feel like yours." /><div className="profile-layout"><section className="panel profile-card"><div className="profile-avatar">{getUserInitials(userName)}</div><h2>{userName}</h2><p>{user?.email || 'Learning ISL'} · Learning ISL since August 2024</p><span className="level-pill"><Sparkles size={14} /> Curious beginner</span><div className="profile-divider" /><div className="profile-mini-stats"><div><strong>{progress.completedSigns.length}</strong><span>Signs learned</span></div><div><strong>{streak}</strong><span>Day streak</span></div><div><strong>{average ? `${average}%` : '—'}</strong><span>Quiz average</span></div></div><Button variant="outline" icon={UserRound}>Edit profile</Button></section><section className="panel achievements"><div className="section-heading"><div><span className="eyebrow">Milestones</span><h2>Achievements</h2></div><span className="muted-text">3 of 8 unlocked</span></div><div className="achievement-grid">{[['🌱', 'First steps', 'Learn your first sign', true], ['🔥', 'On a roll', 'Practice 7 days in a row', true], ['💬', 'Conversation starter', 'Learn 50 signs', false], ['🏆', 'Quiz whiz', 'Score 100% on a quiz', false]].map(([emoji, title, text, unlocked]) => <div className={`achievement ${!unlocked ? 'locked' : ''}`} key={title}><span>{emoji}</span><div><strong>{title}</strong><p>{text}</p></div>{unlocked && <CheckCircle2 size={17} />}</div>)}</div></section></div></> }

export function Settings() { const [checked, setChecked] = useState(true); const resetProgress = () => { localStorage.removeItem(getProgressKey()); window.location.reload() }; return <><PageHeader eyebrow="Preferences" title="Settings" description="Shape SignBridge around the way you learn." /><div className="settings-list"><section className="panel settings-section"><div className="settings-title"><Sparkles size={19} /><div><h2>Learning preferences</h2><p>Keep your practice focused and comfortable.</p></div></div><div className="setting-row"><div><strong>Daily practice reminders</strong><span>Get a gentle nudge at your preferred time.</span></div><button className={`toggle ${checked ? 'toggle-on' : ''}`} onClick={() => setChecked(!checked)} aria-label="Toggle practice reminders"><i /></button></div><div className="setting-row"><div><strong>Demonstration captions</strong><span>Show descriptions alongside sign placeholders.</span></div><button className="toggle toggle-on" aria-label="Toggle demonstration captions"><i /></button></div></section><section className="panel settings-section"><div className="settings-title"><Languages size={19} /><div><h2>Language & accessibility</h2><p>These settings apply across your workspace.</p></div></div><div className="setting-row"><div><strong>Prototype sign language</strong><span>Indian Sign Language (ISL)</span></div><button className="select-button">ISL <ChevronRight size={15} /></button></div><div className="setting-row"><div><strong>Reduce motion</strong><span>Use fewer animations throughout the app.</span></div><button className="toggle" aria-label="Toggle reduced motion"><i /></button></div><div className="setting-row"><div><strong>Reset learning progress</strong><span>Remove completed signs, practice history, and quiz scores from this browser.</span></div><button className="button button-outline reset-button" onClick={resetProgress}>Reset progress <RotateCcw size={15} /></button></div></section></div></> }
