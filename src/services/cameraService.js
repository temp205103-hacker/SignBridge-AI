const CONSENT_STORAGE_KEY = 'signbridge-camera-consent'

export function getCameraErrorMessage(error) {
  if (!error) return 'Camera access is unavailable.'
  
  const message = error.message || error.toString()
  
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
  if (message.includes('Video element is not available')) {
    return 'Video element is not ready. Please refresh and try again.'
  }
  if (message.includes('timeout')) {
    return 'Camera took too long to respond. Check if it is connected and not in use, then try again.'
  }
  if (message.includes('play')) {
    return 'Could not start camera playback. Your browser may not support this camera.'
  }
  
  return message || 'Camera access could not be started. Check your browser permissions and try again.'
}

export function hasUserConsent() {
  try {
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY)
    return consent === 'accepted'
  } catch {
    return false
  }
}

export function setUserConsent(accepted) {
  try {
    if (accepted) {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted')
    } else {
      localStorage.removeItem(CONSENT_STORAGE_KEY)
    }
  } catch {
    console.warn('Could not save camera consent to localStorage')
  }
}

export async function requestCamera(videoElement) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('This browser does not support camera access.')
  }
  if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    throw new Error('Camera access requires HTTPS or localhost.')
  }
  
  // Ensure video element is ready
  if (!videoElement) {
    throw new Error('Video element is not available.')
  }
  
  // Check if element is in DOM
  if (!document.contains(videoElement)) {
    throw new Error('Video element is not mounted in the document.')
  }
  
  // Set video element attributes
  videoElement.autoplay = true
  videoElement.muted = true
  videoElement.playsInline = true
  
  try {
    // Try with ideal constraints first
    const constraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    }
    
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
      // Fallback to basic video constraints if ideal constraints fail
      console.warn('Could not get camera with ideal constraints, trying basic constraints', error)
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
    }
    
    // Attach stream to video element
    videoElement.srcObject = stream
    
    // Wait for video to load and play with multiple fallback approaches
    return new Promise((resolve, reject) => {
      let settled = false
      
      const handleSuccess = () => {
        if (!settled) {
          settled = true
          clearTimeout(timeout)
          clearTimeout(fallbackTimeout)
          resolve(stream)
        }
      }
      
      const handleCanPlay = async () => {
        try {
          videoElement.removeEventListener('canplay', handleCanPlay)
          await videoElement.play().catch(() => {
            // Play might fail, but video might still work
          })
          handleSuccess()
        } catch (playError) {
          // Continue anyway, video might be playing
          handleSuccess()
        }
      }
      
      const handleLoadedMetadata = () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
        // Try to play immediately
        videoElement.play().then(() => {
          handleSuccess()
        }).catch(() => {
          // Wait for canplay event
          videoElement.addEventListener('canplay', handleCanPlay)
        })
      }
      
      // Timeout protection - resolve after 2 seconds regardless
      const timeout = setTimeout(() => {
        if (!settled) {
          settled = true
          videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
          videoElement.removeEventListener('canplay', handleCanPlay)
          // Resolve anyway - video is likely working
          resolve(stream)
        }
      }, 2000)
      
      // Fallback timer - try play after 500ms if nothing happened
      const fallbackTimeout = setTimeout(async () => {
        if (!settled) {
          try {
            await videoElement.play()
            handleSuccess()
          } catch (e) {
            // Continue waiting
          }
        }
      }, 500)
      
      // Listen for metadata
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true })
      
      // Also try immediate play
      const immediatePlay = async () => {
        try {
          await videoElement.play()
          handleSuccess()
        } catch (e) {
          // Ignore, wait for events
        }
      }
      
      immediatePlay()
    })
  } catch (error) {
    // Clean up on error
    try {
      if (videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        videoElement.srcObject = null
      }
    } catch (e) {
      console.warn('Error cleaning up after camera error:', e)
    }
    throw error
  }
}

export function stopCamera(stream, videoElement) {
  try {
    // Stop all tracks in the stream
    if (stream && stream.getTracks) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop()
        } catch (e) {
          console.warn('Error stopping track:', e)
        }
      })
    }
    
    // Clean up video element
    if (videoElement) {
      try {
        videoElement.pause()
      } catch (e) {
        console.warn('Error pausing video:', e)
      }
      
      videoElement.srcObject = null
    }
  } catch (error) {
    console.warn('Error in stopCamera:', error)
  }
}
