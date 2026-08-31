const PROTOTYPE_VOCABULARY = ['Hello', 'Thank You', 'Yes', 'No', 'Please', 'Help', 'Stop', 'Water']

export function getPrototypeVocabulary() {
  return [...PROTOTYPE_VOCABULARY]
}

export async function createLandmarkRecognizer() {
  try {
    const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
    const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm')
    const landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: 'GPU' },
      runningMode: 'VIDEO',
      numHands: 2,
    })
    return { available: true, landmarker }
  } catch (error) {
    return { available: false, error }
  }
}

export function detectLandmarks(recognizer, videoElement, timestamp) {
  if (!recognizer || videoElement.readyState < 2) return null
  return recognizer.detectForVideo(videoElement, timestamp)
}

export function classifyPrototypeGesture() {
  // No label is returned until a trained ISL classifier is connected.
  return { sign: null, confidence: 0, reason: 'landmarks-only' }
}

export function closeLandmarkRecognizer(recognizer) {
  recognizer?.close()
}
