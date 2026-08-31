# SignBridge AI

SignBridge AI is an accessibility-focused learning and communication prototype for **Indian Sign Language (ISL)**. Its guiding idea is simple: Learn. Understand. Communicate.

## Features

- Responsive dashboard with signs learned, streak, quiz score, recent lessons, and daily practice
- ISL learning library with category filters and sign demonstration placeholders
- AI Sign Translator prototype with a camera preview state and confidence result
- Text to Sign phrase sequencing experience
- Practice room, interactive daily quiz, progress tracking, profile achievements, and settings
- React Router navigation across all primary product areas
- Light and dark themes with persisted preference
- Mobile navigation drawer and accessible labels on icon controls
- Camera permission flow, live preview, MediaPipe hand-landmark loading, recognition status, and session history

## Technology

React, Vite, JavaScript, CSS, React Router, Lucide React, and browser APIs where available.

## AI translator architecture

The translator keeps recognition separate from presentation:

```text
Translator.jsx
  -> cameraService.js
    -> navigator.mediaDevices.getUserMedia()
    -> video preview and track cleanup
  -> signRecognitionService.js
    -> MediaPipe HandLandmarker (lazy loaded)
    -> hand landmarks
    -> classifyPrototypeGesture() adapter
    -> detected ISL sign and text output
```

The camera and landmark pipeline is real and handles permission, unavailable-device, model-loading, stopping, and unmount states. `classifyPrototypeGesture` is deliberately conservative and returns no sign until a trained ISL classifier is connected; it never generates random recognition results.

## Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Production validation is available with `npm run build`; linting uses `npm run lint`.

## Project structure

```text
src/
  components/       Shared shell, navigation, cards, buttons, and UI primitives
  data/             Example ISL signs and lesson data
  pages/            Auth and route-level product views
  App.jsx           Browser Router and route map
  App.css           Product design system and responsive layout
  index.css         Global reset and typography imports
```

## Current limitations

This is a front-end prototype using realistic sample data. Sign demonstrations are placeholders, authentication is not connected to a backend, and progress is not synced between accounts. The translator currently loads MediaPipe hand landmarks but does not yet classify them into signs. Its supported vocabulary is limited to Hello, Thank You, Yes, No, Please, Help, Stop, and Water. It does not claim to translate every sign language or replace a qualified interpreter. Camera access requires a secure context such as HTTPS or localhost.

## Future AI improvements

- Connect consent-first browser camera access to an evaluated ISL gesture recognition model
- Add temporal gesture recognition rather than single-frame classification
- Provide confidence explanations, corrections, and signer-controlled feedback
- Add regional variation notes and review from Deaf ISL educators
- Persist learning history and personalize lesson sequencing
