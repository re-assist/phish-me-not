const axios = require('axios');

// --- CACHE CONFIGURATION ---
let openPhishCache = new Set();
let lastFetchTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const OPENPHISH_URL = "https://raw.githubusercontent.com/openphish/public_feed/refs/heads/main/feed.txt";

const fetchOpenPhishFeed = async () => {
    const now = Date.now();
    
    // Return cached data if it's still fresh
    if (openPhishCache.size > 0 && (now - lastFetchTime < CACHE_TTL)) {
        return;
    }

    try {
        console.log("[OpenPhish] Fetching fresh threat feed...");
        const response = await axios.get(OPENPHISH_URL);
        
        // Split text by newlines, trim whitespace, and ignore empty lines
        const urls = response.data.split('\n').map(url => url.trim()).filter(url => url.length > 0);
        
        openPhishCache = new Set(urls);
        lastFetchTime = now;
        
        console.log(`[OpenPhish] Successfully cached ${openPhishCache.size} known phishing URLs.`);
    } catch (error) {
        console.error("[OpenPhish] Failed to fetch feed:", error.message);
    }
};

const analyzeURL = async (url) => {
    if (!url) throw new Error("URL is required");

    await fetchOpenPhishFeed();

    let score = 0;
    const flags = [];
    const lowerUrl = url.toLowerCase();

    // SMART MATCHING: Check exact, lowercase, and with/without trailing slashes
    const urlWithSlash = lowerUrl.endsWith('/') ? lowerUrl : `${lowerUrl}/`;
    const urlWithoutSlash = lowerUrl.endsWith('/') ? lowerUrl.slice(0, -1) : lowerUrl;

    // 1. OPENPHISH CHECK (Immediate High Risk)
    if (
        openPhishCache.has(url) || 
        openPhishCache.has(lowerUrl) || 
        openPhishCache.has(urlWithSlash) || 
        openPhishCache.has(urlWithoutSlash)
    ) {
        score += 100;
        flags.push("CRITICAL: URL matches known active threat in OpenPhish database.");
    }

    // 2. HEURISTIC CHECKS
    if (url.length > 75) {
        score += 20;
        flags.push("Unusually long URL (often used to hide actual domain).");
    }
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
        score += 40;
        flags.push("IP-based URL detected (legitimate sites use domains).");
    }
    
    const brandCheck = ["google", "paypal", "microsoft", "apple", "amazon", "netflix"];
    brandCheck.forEach(brand => {
        if (lowerUrl.includes(brand) && !url.includes(`${brand}.com`) && !url.includes(`${brand}.org`)) {
            score += 35;
            flags.push(`Suspicious use of '${brand}' in non-official domain string.`);
        }
    });

    // 3. RISK CALCULATION
    const risk = score >= 60 ? "HIGH" : score >= 30 ? "MEDIUM" : "LOW";

    return {
        type: 'URL',
        input: url,
        risk,
        score: Math.min(score, 100), // Cap score at 100
        explanation: flags.length > 0 ? flags : ["No immediate heuristic red flags detected."],
        recommendation: risk === "HIGH" ? "Do not click. Report this link immediately." : "Proceed with caution."
    };
};

// CRITICAL: This line must exist to make the function accessible to routes/url.js
module.exports = { analyzeURL };