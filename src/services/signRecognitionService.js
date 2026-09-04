const PROTOTYPE_VOCABULARY = ['Hello', 'Good Morning', 'Thank You', 'Please', 'Sorry', 'Yes', 'No', 'A', 'B', 'One', 'Two', 'Water', 'Food', 'School', 'Help', 'Stop', 'Doctor']

// Simple landmark-based gesture classifier
// In production, this would use a trained TensorFlow.js model or backend API
class ISLGestureClassifier {
  constructor() {
    this.vocabulary = PROTOTYPE_VOCABULARY
    this.frameBuffer = []
    this.bufferSize = 18
    this.confidenceThreshold = 0.62
  }

  // Extract features from hand landmarks
  extractFeatures(landmarks) {
    if (!landmarks || landmarks.length === 0) return null
    
    const points = landmarks.slice(0, 21) // 21 hand landmarks
    if (points.length < 21) return null

    // Calculate hand centroid
    const centroidX = points.reduce((sum, p) => sum + p.x, 0) / points.length
    const centroidY = points.reduce((sum, p) => sum + p.y, 0) / points.length
    const centroidZ = points.reduce((sum, p) => sum + p.z, 0) / points.length

    // Calculate hand bounding box
    const xs = points.map(p => p.x)
    const ys = points.map(p => p.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const width = maxX - minX
    const height = maxY - minY

    // Normalize landmarks relative to centroid
    const normalizedPoints = points.map(p => ({
      x: (p.x - centroidX) / (width || 1),
      y: (p.y - centroidY) / (height || 1),
      z: p.z
    }))

    // Calculate finger distances and angles
    const fingerFeatures = this.extractFingerFeatures(normalizedPoints)
    
    // Calculate hand orientation (wrist to middle finger)
    const wrist = normalizedPoints[0]
    const middleFinger = normalizedPoints[12]
    const orientation = Math.atan2(middleFinger.y - wrist.y, middleFinger.x - wrist.x)

    // Calculate hand spread (distance between thumb and pinky)
    const thumb = normalizedPoints[4]
    const pinky = normalizedPoints[20]
    const handSpread = Math.sqrt(Math.pow(pinky.x - thumb.x, 2) + Math.pow(pinky.y - thumb.y, 2))

    return {
      centroid: { x: centroidX, y: centroidY, z: centroidZ },
      width,
      height,
      handSpread,
      orientation,
      fingerFeatures,
      normalizedPoints
    }
  }

  getMotion() {
    if (this.frameBuffer.length < 4) return { dx: 0, dy: 0, distance: 0, vertical: 0, horizontal: 0, depth: 0 }
    const first = this.frameBuffer[0].centroid
    const last = this.frameBuffer[this.frameBuffer.length - 1].centroid
    const dx = last.x - first.x
    const dy = last.y - first.y
    const depth = last.z - first.z
    return { dx, dy, distance: Math.hypot(dx, dy), vertical: Math.abs(dy), horizontal: Math.abs(dx), depth: Math.abs(depth) }
  }

  extractFingerFeatures(points) {
    // Helper to calculate distance between two points
    const distance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
    
    // Calculate finger extension (distance from wrist to finger tip)
    const wrist = points[0]
    const fingerTips = [4, 8, 12, 16, 20] // thumb, index, middle, ring, pinky tips
    
    return {
      thumbExtension: distance(wrist, points[4]),
      indexExtension: distance(wrist, points[8]),
      middleExtension: distance(wrist, points[12]),
      ringExtension: distance(wrist, points[16]),
      pinkyExtension: distance(wrist, points[20]),
      handOpenness: fingerTips.reduce((sum, tip) => sum + distance(wrist, points[tip]), 0) / fingerTips.length
    }
  }

  // Simple gesture classifier based on hand pose features
  classifyFeatures(features, motion) {
    if (!features) return null

    const f = features.fingerFeatures
    const spread = features.handSpread

    const scores = {}
    const open = f.handOpenness
    const fist = open < 0.42
    const indexOnly = f.indexExtension > 0.42 && f.middleExtension < 0.42 && f.ringExtension < 0.42
    const openHand = open > 0.58
    const moving = motion.distance > 0.06
    const upward = motion.dy < -0.045
    const sideways = motion.horizontal > 0.055

    scores['Hello'] = openHand && sideways ? 0.88 : 0.08
    scores['Good Morning'] = indexOnly && upward ? 0.92 : 0.08
    scores['Thank You'] = openHand && motion.dy > 0.035 && motion.depth > 0.008 ? 0.86 : 0.08
    scores['Please'] = openHand && motion.distance > 0.025 && !sideways ? 0.72 : 0.08
    scores['Sorry'] = fist && motion.distance > 0.025 ? 0.82 : 0.08
    scores['Yes'] = fist && motion.vertical > 0.035 ? 0.84 : 0.08
    scores['No'] = openHand && sideways ? 0.78 : 0.08
    scores['A'] = fist && !moving ? 0.82 : 0.08
    scores['B'] = openHand && !moving && spread > 0.35 ? 0.84 : 0.08
    scores['One'] = indexOnly && !moving ? 0.87 : 0.08
    scores['Two'] = f.indexExtension > 0.42 && f.middleExtension > 0.42 && f.ringExtension < 0.42 && !moving ? 0.87 : 0.08
    scores['Water'] = f.indexExtension > 0.3 && f.middleExtension > 0.3 && f.ringExtension < 0.45 ? 0.78 : 0.08
    scores['Food'] = openHand && motion.dy > 0.025 ? 0.74 : 0.08
    scores['School'] = openHand && sideways && motion.distance < 0.2 ? 0.7 : 0.08
    scores['Help'] = openHand && upward ? 0.86 : 0.08
    scores['Stop'] = openHand && spread > 0.5 && !moving ? 0.9 : 0.08
    scores['Doctor'] = indexOnly && motion.horizontal > 0.025 ? 0.72 : 0.08

    return scores
  }

  // Add frame to buffer and get smoothed prediction
  addFrameAndPredict(landmarks) {
    const features = this.extractFeatures(landmarks)
    if (!features) return { sign: null, confidence: 0, reason: 'invalid-landmarks' }

    this.frameBuffer.push(features)
    if (this.frameBuffer.length > this.bufferSize) {
      this.frameBuffer.shift()
    }

    // Get average scores across buffer
    const scores = {}
    PROTOTYPE_VOCABULARY.forEach(sign => {
      scores[sign] = 0
    })

    const motion = this.getMotion()
    this.frameBuffer.forEach(frame => {
      const frameScores = this.classifyFeatures(frame, motion)
      Object.keys(frameScores).forEach(sign => {
        scores[sign] = (scores[sign] || 0) + frameScores[sign]
      })
    })

    // Average the scores
    Object.keys(scores).forEach(sign => {
      scores[sign] = scores[sign] / this.frameBuffer.length
    })

    // Find best match
    const bestSign = Object.entries(scores).reduce((best, [sign, score]) => 
      score > best.score ? { sign, score } : best, 
      { sign: null, score: 0 }
    )

    if (bestSign.score < this.confidenceThreshold) {
      return { sign: null, confidence: 0, reason: 'low-confidence' }
    }

    return {
      sign: bestSign.sign,
      confidence: Math.min(bestSign.score, 1),
      reason: 'classified'
    }
  }

  reset() {
    this.frameBuffer = []
  }
}

let classifier = null

export function getPrototypeVocabulary() {
  return [...PROTOTYPE_VOCABULARY]
}

export async function createLandmarkRecognizer() {
  try {
    const { HandLandmarker, PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
    const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm')
    const baseOptions = {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
    }
    let landmarker
    let poseLandmarker = null

    try {
      landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { ...baseOptions, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numHands: 2,
      })
    } catch (gpuError) {
      console.warn('GPU hand landmark setup failed, retrying with CPU', gpuError)
      landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { ...baseOptions, delegate: 'CPU' },
        runningMode: 'VIDEO',
        numHands: 2,
      })
    }

    try {
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      })
    } catch (poseError) {
      console.warn('Body pose setup failed; continuing with hand tracking', poseError)
    }
    
    // Initialize the ISL gesture classifier
    if (!classifier) {
      classifier = new ISLGestureClassifier()
    }
    
    return { available: true, landmarker, poseLandmarker }
  } catch (error) {
    return { available: false, error }
  }
}

export function detectLandmarks(recognizer, videoElement, timestamp) {
  if (!recognizer || videoElement.readyState < 2) return null
  const hands = recognizer.landmarker.detectForVideo(videoElement, timestamp)
  const pose = recognizer.poseLandmarker?.detectForVideo(videoElement, timestamp)
  return { hands, pose }
}

export function classifyPrototypeGesture(landmarks) {
  // Evaluate the ISL gesture recognition model on the detected landmarks
  if (!classifier || !landmarks || landmarks.length === 0) {
    return { sign: null, confidence: 0, reason: 'no-landmarks' }
  }
  
  // Use the primary hand (first detected hand)
  const primaryHandLandmarks = landmarks[0]?.landmarks || landmarks[0]
  
  if (!primaryHandLandmarks || primaryHandLandmarks.length === 0) {
    return { sign: null, confidence: 0, reason: 'invalid-landmarks' }
  }

  return classifier.addFrameAndPredict(primaryHandLandmarks)
}

export function closeLandmarkRecognizer(recognizer) {
  recognizer?.landmarker?.close()
  recognizer?.poseLandmarker?.close()
  if (classifier) {
    classifier.reset()
  }
}
