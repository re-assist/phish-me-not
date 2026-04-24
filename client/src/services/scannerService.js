/**
 * scannerService.js
 * * This file handles all data fetching and logic for the scanners.
 * * IMPORTANT: Ensure your Express server is running on localhost:5000 
 * before testing the URL scanner.
 */

// We keep the mock data here for the Text and Email scanners 
// until we build backend routes for them.
const MOCK_BREACHES = {
  "test@gmail.com": ["LinkedIn (2016)", "Adobe (2013)", "MySpace (2008)"],
  "admin@company.com": ["Canva (2019)", "Dropbox (2012)"],
  "user@example.com": ["Vercel", "SupaBase"]
};

const HEURISTIC_KEYWORDS = {
  urgent: ["urgent", "immediately", "action required", "suspended", "blocked"],
  authority: ["bank", "security", "official", "government", "police", "tax"],
  sensitive: ["otp", "password", "pin", "verify", "login", "credentials"],
  threat: ["legal action", "arrest", "lawsuit", "deleted", "expired"]
};

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Sends the URL to the Express backend for analysis against OpenPhish and server-side heuristics.
 */
export const analyzeURL = async (url) => {
  if (!url) throw new Error("URL is required");

  try {
    const response = await fetch(`${API_BASE_URL}/scan/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error communicating with backend:", error);
    
    // Fallback response if the backend is down during the demo
    return {
      type: 'URL',
      input: url,
      risk: 'ERROR',
      score: 0,
      explanation: ["Failed to reach the threat intelligence server.", error.message],
      recommendation: "Please ensure the backend server is running."
    };
  }
};

/**
 * Sends the text to the Express backend for AI classification and heuristic scanning.
 */
export const analyzeTextContent = async (text) => {
  if (!text) throw new Error("Text is required");

  try {
    const response = await fetch(`${API_BASE_URL}/scan/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error communicating with backend:", error);
    return {
      type: 'Text/SMS',
      input: text.substring(0, 40) + "...",
      risk: 'ERROR',
      score: 0,
      explanation: ["Failed to reach the AI analysis server.", error.message],
      recommendation: "Please ensure the backend server is running."
    };
  }
};

/**
 * Local mock lookup for email breaches (will move to backend later)
 */
export const checkEmailBreach = async (email) => {
  if (!email) throw new Error("Email is required");
  await new Promise(r => setTimeout(r, 500)); 
  
  const breaches = MOCK_BREACHES[email.toLowerCase()] || [];
  return {
    type: 'Email',
    input: email,
    risk: breaches.length > 0 ? "HIGH" : "LOW",
    explanation: breaches.length > 0 
      ? [`Found in ${breaches.length} leaks:`, ...breaches]
      : ["No known leaks found in this dataset."],
    recommendation: breaches.length > 0 ? "Enable 2FA and change passwords." : "Maintain good security hygiene."
  };
};