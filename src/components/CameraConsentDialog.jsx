import { Camera, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { Button } from './UI'

export function CameraConsentDialog({ onAccept, onReject, isOpen }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-dialog consent-dialog">
        <div className="modal-header">
          <button className="close-button" onClick={onReject} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content consent-content">
          <div className="consent-icon">
            <Camera size={32} />
          </div>
          
          <h2>Camera Access Required</h2>
          <p className="consent-intro">SignBridge AI Translator needs access to your camera to recognize your hand gestures and help you learn Indian Sign Language.</p>
          
          <div className="consent-details">
            <div className="consent-item">
              <CheckCircle2 size={18} className="check-icon" />
              <div>
                <strong>Your privacy is protected</strong>
                <span>Camera feed stays on your device. No video is recorded or sent anywhere.</span>
              </div>
            </div>
            
            <div className="consent-item">
              <CheckCircle2 size={18} className="check-icon" />
              <div>
                <strong>You control the camera</strong>
                <span>Stop or pause recording at any time. Camera only runs while you're actively using the translator.</span>
              </div>
            </div>
            
            <div className="consent-item">
              <AlertCircle size={18} className="info-icon" />
              <div>
                <strong>Hand landmarks only</strong>
                <span>Only hand position data is analyzed to recognize ISL signs. Your face and identity are not processed.</span>
              </div>
            </div>
          </div>
          
          <div className="consent-footer">
            <p className="consent-note">You can change this permission later in your browser settings or the SignBridge Settings page.</p>
            
            <div className="consent-actions">
              <button className="button button-outline" onClick={onReject}>
                Not Now
              </button>
              <Button onClick={onAccept} icon={Camera}>
                Allow Camera Access
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
