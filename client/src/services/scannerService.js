/**
 * scannerService.js
 * * This file handles all data fetching and logic for the scanners.
 * * IMPORTANT: Ensure your Express server is running on localhost:5000 
 * before testing the URL scanner.
 */


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

export const checkEmailBreach = async (email) => {
  if (!email) throw new Error("Email is required");

  try {
    const response = await fetch(`${API_BASE_URL}/scan/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error communicating with backend:", error);
    return {
      type: 'Email', input: email, risk: 'ERROR', score: 0,
      explanation: ["Failed to reach the breach database server.", error.message],
      recommendation: "Please ensure the backend server is running."
    };
  }
};