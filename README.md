# PhishMeNot

## Overview

PhishMeNot is a web-based tool for detecting phishing URLs and scam messages.  
It uses a combination of threat intelligence, heuristic rules, and optional AI to provide clear, explainable results.

---

## Features

- **URL Detection**
  - Checks against OpenPhish
  - Detects suspicious patterns (typos, long URLs, IP-based links)

- **Text Scam Analyzer**
  - Identifies keywords like OTP, urgent, verify
  - Detects urgency, impersonation, sensitive requests
  - AI classification (Hugging Face)

- **Email Breach Checker (Mocked)**
  - Uses a predefined dataset for demo purposes

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **APIs:** OpenPhish, Hugging Face (optional)

---

## How It Works

Frontend → Backend → APIs → Backend → Frontend

- User submits input (URL or text)
- Backend analyzes using APIs + heuristics
- Returns risk level with explanation

---

## Output Example

Risk Level: HIGH

Reasons:

- Requests OTP
- Uses urgency language

Recommendation:

- Do not share sensitive information
