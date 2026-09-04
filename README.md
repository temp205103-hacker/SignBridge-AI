# SignBridge AI

SignBridge AI is an accessibility-focused learning and communication prototype for **Indian Sign Language (ISL)**. Its guiding idea is simple: Learn. Understand. Communicate.

## Features

- Responsive dashboard with personal learning progress, practice streaks, quiz averages, recent lessons, and daily practice
- 17-sign ISL library with category filters, meanings, examples, hand-shape notes, and motion notes
- AI Sign Translator with consent-first camera access, live preview, hand and pose landmark overlays, confidence results, and detection history
- Practice mode with or without video, target-sign navigation, camera feedback, and accuracy comparison
- Text to Sign phrase sequencing for supported words and common phrases
- Interactive quiz, progress dashboard, profile achievements, settings, and learning-progress reset
- Local sign-in and registration flow with browser-stored accounts and per-user progress
- React Router navigation, responsive mobile drawer, accessible icon labels, and persisted light/dark themes

## Technology

React 19, Vite, JavaScript, CSS, React Router, Lucide React, MediaPipe Tasks Vision, and browser APIs.

## Recognition architecture

The camera and recognition pipeline is separated from the page UI:

```text
AppPages.jsx / PracticePage.jsx
  -> cameraService.js
    -> navigator.mediaDevices.getUserMedia()
    -> video preview, permission handling, and track cleanup
  -> signRecognitionService.js
    -> MediaPipe HandLandmarker and PoseLandmarker (lazy loaded)
    -> hand and pose landmarks
    -> buffered landmark feature extraction
    -> prototype ISL gesture classifier
    -> detected sign and confidence result
```

The classifier currently uses normalized landmark features, hand shape, motion, and a short frame buffer to estimate a fixed prototype vocabulary: Hello, Good Morning, Thank You, Please, Sorry, Yes, No, A, B, One, Two, Water, Food, School, Help, Stop, and Doctor. It is a development prototype, not a trained production ISL translation model.

Camera use is consent-first. The feed is processed in the browser, is not recorded or uploaded by this app, and can be stopped from the translator or practice screen. Camera access requires HTTPS or `localhost`.

## Install and run

```bash
git clone https://github.com/temp205103-hacker/SignBridge-AI.git
npm install
npm run dev
```

Open the local URL printed by Vite. Production validation is available with `npm run build`; linting uses `npm run lint`.

## Project structure

```text
src/
  components/       Shared shell, camera consent dialog, buttons, and UI primitives
  data/             ISL signs, lessons, text dictionary, and frequent phrases
  pages/            Auth, dashboard, learning, translator, practice, quiz, and account views
  services/         Browser auth, camera, and landmark-recognition services
  App.jsx           Browser Router, protected routes, and auth routes
  App.css           Product design system and responsive layout
  index.css         Global reset and typography imports
```

## Storage and prototype limitations

This is a front-end prototype using sample learning content and placeholder sign demonstrations. Accounts, the current session, theme preference, camera consent, recent text queries, and learning progress are stored in the browser with `localStorage`; there is no backend,  cross-device synchronization. The text-to-sign dictionary currently covers selected everyday signs and phrases, while the learning library contains a broader sample vocabulary.

The recognition result is based on heuristic landmark features and should not be treated as authoritative translation, medical or emergency guidance, or a replacement for a qualified interpreter. ISL has regional and signer variation that this prototype does not model. Review all educational content and recognition behavior with Deaf ISL educators before production use.

## Future improvements

- Replace the prototype classifier with an evaluated, educator-reviewed ISL recognition model
- Add robust temporal gesture recognition and support for signer-controlled corrections
- Add educator-reviewed image and video demonstrations
- Add regional variation notes and accessibility testing with Deaf ISL users
- Move authentication and learning history to a secure backend
- Personalize lesson sequencing and synchronize progress across devices
