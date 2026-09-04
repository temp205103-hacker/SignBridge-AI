import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react'
import { signs } from '../data/signs'
import { Button, ProgressBar } from '../components/UI'
import { classifyPrototypeGesture, closeLandmarkRecognizer, createLandmarkRecognizer, detectLandmarks } from '../services/signRecognitionService'
import { requestCamera, stopCamera } from '../services/cameraService'

function PracticeVideo({ active, onDetection, onError }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const recognizerRef = useRef(null)
  const frameRef = useRef(null)
  const onDetectionRef = useRef(onDetection)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onDetectionRef.current = onDetection
    onErrorRef.current = onError
  }, [onDetection, onError])

  useEffect(() => {
    if (!active) return undefined
    let cancelled = false
    const video = videoRef.current

    const scan = (timestamp) => {
      try {
        const result = detectLandmarks(recognizerRef.current, video, timestamp)
        onDetectionRef.current(result?.hands?.landmarks?.length ? classifyPrototypeGesture(result.hands.landmarks) : null)
        frameRef.current = requestAnimationFrame(scan)
      } catch (error) {
        onErrorRef.current(error)
      }
    }

    const start = async () => {
      try {
        streamRef.current = await requestCamera(video)
        const result = await createLandmarkRecognizer()
        if (cancelled) return
        if (!result.available) throw result.error || new Error('The gesture model could not load.')
        recognizerRef.current = { landmarker: result.landmarker, poseLandmarker: result.poseLandmarker }
        frameRef.current = requestAnimationFrame(scan)
      } catch (error) {
        onErrorRef.current(error)
      }
    }

    start()
    return () => {
      cancelled = true
      cancelAnimationFrame(frameRef.current)
      closeLandmarkRecognizer(recognizerRef.current)
      recognizerRef.current = null
      stopCamera(streamRef.current, video)
      streamRef.current = null
    }
  }, [active])

  return <div className="practice-video"><video ref={videoRef} autoPlay muted playsInline aria-label="Practice camera preview" /><span>{active ? 'Move your hands in view' : 'Video practice is off'}</span></div>
}

export function PracticePage() {
  const params = new URLSearchParams(window.location.search)
  const initial = signs.find((sign) => sign.id === params.get('sign')) || signs[0]
  const [target, setTarget] = useState(initial)
  const [mode, setMode] = useState('none')
  const [detected, setDetected] = useState(null)
  const [videoError, setVideoError] = useState('')
  const [attempts, setAttempts] = useState(0)

  const next = () => {
    const index = signs.findIndex((sign) => sign.id === target.id)
    setTarget(signs[(index + 1) % signs.length])
    setDetected(null)
    setVideoError('')
  }
  const accuracy = detected?.sign?.toLowerCase() === target.term.toLowerCase() ? Math.round((detected.confidence || 0) * 100) : 0

  return <><div className="page-header"><div><span className="eyebrow">Build your fluency</span><h1>Practice: {target.term.toUpperCase()}</h1><p>Practice with or without video. Video accuracy compares the detected ISL sign with your selected target.</p></div><div className="practice-stat"><strong>{attempts}</strong><span>attempts recorded</span></div></div><div className="practice-mode-switch"><button className={mode === 'none' ? 'filter-active' : ''} onClick={() => { setMode('none'); setVideoError('') }}>Practice without video</button><button className={mode === 'video' ? 'filter-active' : ''} onClick={() => { setMode('video'); setVideoError('') }}>Practice with video</button></div><div className="practice-workspace"><section className="practice-target panel"><span className="eyebrow">Target sign · {target.category}</span><div className="target-visual"><span>{target.emoji}</span><small>Sign demonstration area · placeholder</small></div><h2>{target.term}</h2><p>{target.meaning}</p>{mode === 'video' ? <><PracticeVideo active onDetection={setDetected} onError={(error) => { setVideoError(error.message || 'Camera or gesture model unavailable.'); setMode('none') }} /><div className="practice-accuracy"><div><span>Accuracy</span><strong>{accuracy}%</strong></div><ProgressBar value={accuracy} tone="coral" /><p>{detected?.sign ? `Detected: ${detected.sign} · Confidence: ${Math.round((detected.confidence || 0) * 100)}%` : 'Make the target sign in front of the camera.'}</p></div></> : <div className="practice-actions"><Button onClick={() => setAttempts((value) => value + 1)} variant="outline" icon={RotateCcw}>Still practicing</Button><Button onClick={() => setAttempts((value) => value + 1)} icon={CheckCircle2}>I did it</Button></div>}{videoError && <div className="camera-error" role="alert"><AlertTriangle size={17} /><span>{videoError}</span></div>}<Button onClick={next} variant="outline" icon={ChevronRight}>Next sign</Button></section><section className="practice-guide panel"><span className="eyebrow">How to practice</span><h2>Small steps, repeated often.</h2><p>Copy the target hand shape and movement. Video accuracy is based on the prototype recognizer and is not a substitute for educator feedback.</p><div className="guide-list"><div><strong>1</strong><span>Choose a sign and study its shape.</span></div><div><strong>2</strong><span>Repeat the motion slowly and clearly.</span></div><div><strong>3</strong><span>Use self-check or camera feedback.</span></div></div></section></div></>
}
