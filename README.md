# PhishMeNot - Smart Threat Detection System

## Project Overview
PhishMeNot is a full-stack, hybrid threat intelligence dashboard designed to detect and mitigate phishing attacks in real-time. Standard spam filters frequently miss sophisticated, zero-day threats, and average users lack access to enterprise-grade Open Source Intelligence (OSINT) tools.

To bridge this gap, PhishMeNot unifies local regex-based heuristics, fine-tuned artificial intelligence, and live OSINT breach feeds into a single, high-speed API. It provides users with immediate risk assessments (High, Medium, Low) and actionable security recommendations for URLs, SMS/text messages, and email addresses.

---

## Core Features

### URL Scanner (Threat Intelligence)
- Engine: Checks inputs against the live OpenPhish database.
- Mechanism: An in-memory backend cache stores the live threat feed. It implements a 10-minute Time-To-Live (TTL) to prevent IP bans and rate-limiting from the OpenPhish servers.
- Output: Identifies known active threat URLs and outputs a 100-Score CRITICAL alert if a match is found.

---

### Text & SMS Scanner (AI + Heuristics)
- Combines keyword-based heuristics with AI-based classification
- Detects phishing patterns such as OTP scams, urgency, and impersonation
- Includes fallback mechanisms to ensure reliability if AI inference fails
- Outputs risk levels with reasoning

---

### Email Scanner (OSINT Breach Data)

- Engine: LeakCheck.io Public API.
- Mechanism: Queries historical data breach records for the target email.
- Output: Dynamically extracts and displays the specific compromised data fields (e.g., passwords, usernames, IP addresses) and the exact sources of the breach (e.g., Canva, Zynga).

---

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Fetch API

### Backend
- Node.js
- Express.js
- Axios
- Dotenv
- CORS

### External Services
- OpenPhish (URL threat intelligence)
- Hugging Face API (text classification model)

---

## System Architecture

The application follows a clear separation between frontend and backend. All external API calls and detection logic are handled securely on the server.
```
phishmenot/
│
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # UI Components (ResultsCard, UrlScanner, etc.)
│   │   ├── services/           # Frontend API routes (scannerService.js)
│   │   ├── App.jsx             # Main application wrapper
│   │   └── main.jsx            # React entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                     # Node.js + Express Backend
    ├── routes/                 # API Route Definitions
    │   ├── email.js            # POST /api/scan/email
    │   ├── text.js             # POST /api/scan/text
    │   └── url.js              # POST /api/scan/url
    │
    ├── services/               # Core Business Logic & External API Calls
    │   ├── emailService.js     # LeakCheck OSINT integration
    │   ├── textService.js      # Hugging Face AI & Heuristics
    │   └── urlService.js       # OpenPhish Feed & Caching
    │
    ├── .env                    # Environment variables (IGNORED IN GIT)
    ├── server.js               # Express application entry point
    └── package.json

```

## Local Setup & Installation

### Prerequisites
- Node.js (v16+)
- Hugging Face API key

---

### Backend Setup
1.  `cd server`
2.  `npm install`
3. Create a `.env` file in the `server/` directory:
```
HUGGINGFACE_API_KEY=hf_YOUR_ACCESS_TOKEN
PORT=5000
```
4. run backend: `npm run dev`

### Frontend Setup
```
cd client
npm install
npm run dev
```
Access app at: `http://localhost:5173`
