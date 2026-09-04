# SignBridge AI

---

## Repository Information

**GitHub Repository Link:** https://github.com/temp205103-hacker/SignBridge-AI

---

## 📋 Project Overview

**SignBridge AI** is an innovative accessibility-focused learning and communication platform designed specifically for **Indian Sign Language (ISL)**. The platform bridges the gap between hearing and deaf communities by providing comprehensive tools for learning, understanding, and communicating through sign language.

### Core Philosophy
Learn. Understand. Communicate.

---

## 👥 Contributors

### Development Team

1. **Anirudh Neela**
   - Role: Lead Developer & Project Architect

2. **Mugula Arjun Reddy**
   - Role: Co-Developer & Technical Implementation

---

## ✨ Key Features

### 📚 Learning Dashboard
- Personal learning progress tracking
- Practice streaks and streak milestones
- Quiz performance averages
- Recent lessons overview
- Daily practice recommendations

### 🖐️ ISL Sign Library
- Comprehensive 17-sign ISL vocabulary
- Category-based filtering system
- Detailed meanings and usage examples
- Hand-shape reference notes
- Motion pattern documentation

### 🤖 AI Sign Translator
- Real-time sign recognition using MediaPipe
- Consent-first camera access with privacy controls
- Live video preview with landmark overlays
- Confidence scoring for recognized signs
- Detection history and logs

### 🎯 Practice Mode
- Video-enabled and video-free practice options
- Target-sign navigation system
- Real-time camera feedback
- Accuracy comparison tools
- Performance analytics

### 📝 Text to Sign Conversion
- Phrase sequencing for supported words
- Common phrase library support
- Interactive translation assistance

### 🎓 Additional Features
- Interactive quiz functionality
- Comprehensive progress dashboard
- User profile with achievement badges
- Customizable settings and preferences
- Secure learning progress tracking
- Local authentication system
- Light/Dark theme support

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 19** | Frontend framework |
| **Vite** | Build tool and dev server |
| **JavaScript** | Primary programming language (89.3%) |
| **CSS** | Styling and responsive design (6.5%) |
| **TypeScript** | Type safety (3.3%) |
| **HTML** | Markup (0.9%) |
| **React Router** | Navigation and routing |
| **Lucide React** | UI icon library |
| **MediaPipe Tasks Vision** | Hand and pose landmark detection |
| **Browser APIs** | Camera and storage functionality |

---

## 🏗️ Architecture Overview

### Recognition Pipeline

The application separates camera operations from UI logic:

```
User Interface (AppPages.jsx / PracticePage.jsx)
        ↓
Camera Service (cameraService.js)
        ↓
Sign Recognition Service (signRecognitionService.js)
        ↓
MediaPipe Landmarks (Hand & Pose Detection)
        ↓
ISL Gesture Classifier
        ↓
Recognition Results & Confidence Scoring
```

### Key Components

**signRecognitionService.js** includes:
- MediaPipe HandLandmarker integration
- MediaPipe PoseLandmarker integration
- Landmark feature extraction with buffering
- Prototype ISL gesture classification
- Confidence scoring mechanism

**Current Vocabulary Support:**
Hello, Good Morning, Thank You, Please, Sorry, and more...

---

## 📁 Project Structure

```
src/
├── components/          Shared UI components, dialogs, and primitives
├── data/               ISL signs, lessons, text dictionary, phrases
├── pages/              Auth, dashboard, learning, translator, practice, quiz
├── services/           Authentication, camera, recognition services
├── App.jsx             React Router setup and protected routes
├── App.css             Design system and responsive layouts
└── index.css           Global styles and typography
```

---

## 🚀 Getting Started

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/temp205103-hacker/SignBridge-AI.git

# Navigate to project directory
cd SignBridge-AI

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Create production build |
| `npm run lint` | Run code linting checks |

### Accessing the Application
Open the local URL provided by Vite in your browser (typically `http://localhost:5173`)

---

## 📊 Privacy & Data Storage

### Data Handling
- All account data stored locally in browser
- Camera feed processed entirely in-browser
- No recording or external upload of video data
- User consent required for camera access
- HTTPS required for camera functionality

### Stored Information
- User authentication credentials
- Session data
- Learning progress and statistics
- Theme preferences
- Camera consent status
- Recent translation queries

---

## ⚠️ Current Limitations & Disclaimer

### Important Notes

This is a **front-end prototype** with the following limitations:

- Uses sample learning content and placeholder sign demonstrations
- Recognition is based on heuristic landmark features
- **Should NOT be used for:**
  - Authoritative sign language translation
  - Medical or emergency communications
  - Replacement for qualified sign language interpreters
- Requires educator review for production use
- Regional ISL variations not yet documented

---

## 🔮 Future Roadmap

### Planned Improvements

- ✅ Replace prototype classifier with evaluated, educator-reviewed ISL model
- ✅ Implement robust temporal gesture recognition
- ✅ Add signer-controlled correction features
- ✅ Include educator-reviewed image and video demonstrations
- ✅ Document regional ISL variations
- ✅ Accessibility testing with Deaf ISL community
- ✅ Migrate to secure backend authentication
- ✅ Implement cloud-based progress synchronization
- ✅ Personalized lesson sequencing

---

## 📧 Support & Contributions

For questions, issues, or contributions, please visit the GitHub repository:
**https://github.com/temp205103-hacker/SignBridge-AI**

---

## 📄 Document Information

**Document Title:** Design Championship Coding Documentation  
**Project:** SignBridge AI  
**Contributors:** Anirudh Neela, Mugula Arjun Reddy  
**Repository:** https://github.com/temp205103-hacker/SignBridge-AI  
**Last Updated:** 2026-09-04

---

*This document provides a comprehensive overview of the SignBridge AI project, its features, technology stack, and implementation details. Feel free to edit and customize this document as needed.*