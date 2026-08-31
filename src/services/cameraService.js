export function getCameraErrorMessage(error) {
  if (!error) return 'Camera access is unavailable.'
  if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
    return 'Camera permission was denied. Enable camera access for this site in your browser settings, then try again.'
  }
  if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    return 'No camera was found. Connect a camera and try again.'
  }
  if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
    return 'Your camera is busy in another app. Close that app and try again.'
  }
  if (error.name === 'OverconstrainedError') {
    return 'This camera does not meet the browser requirements for the preview.'
  }
  return 'Camera access could not be started. Check your browser permissions and try again.'
}

export async function requestCamera(videoElement) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('This browser does not support camera access.')
  }
  if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    throw new Error('Camera access requires HTTPS or localhost.')
  }
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
  videoElement.srcObject = stream
  await videoElement.play()
  return stream
}

export function stopCamera(stream, videoElement) {
  stream?.getTracks().forEach((track) => track.stop())
  if (videoElement) {
    videoElement.pause()
    videoElement.srcObject = null
  }
}
