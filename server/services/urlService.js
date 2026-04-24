const axios = require('axios');

// In-memory cache for OpenPhish live feed
let openPhishCache = new Set();
let lastFetchTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const PROTECTED_BRANDS = [
    "google", "microsoft", "apple", "amazon", "paypal", 
    "netflix", "facebook", "instagram", "chase", "bankofamerica"
];

// Levenshtein Distance Algorithm (calculates character edits between two strings)
const getEditDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

const refreshOpenPhishCache = async () => {
    const now = Date.now();
    if (now - lastFetchTime < CACHE_TTL && openPhishCache.size > 0) {
        return; 
    }

    try {
        console.log("[OpenPhish] Fetching latest threat feed...");
        const response = await axios.get('https://raw.githubusercontent.com/openphish/public_feed/refs/heads/main/feed.txt', { timeout: 10000 });
        const urls = response.data.split('\n').filter(url => url.trim() !== '');
        
        openPhishCache.clear();
        urls.forEach(url => openPhishCache.add(url.trim().toLowerCase()));
        lastFetchTime = now;
        console.log(`[OpenPhish] Cache updated with ${openPhishCache.size} active threats.`);
    } catch (error) {
        console.error("[OpenPhish] Failed to update cache:", error.message);
    }
};

const analyzeURL = async (rawUrl) => {
    if (!rawUrl) throw new Error("URL is required");

    await refreshOpenPhishCache();

    let score = 0;
    const flags = [];
    let normalizedUrl = rawUrl.trim().toLowerCase();

    // 1. OPENPHISH OSINT CHECK
    if (openPhishCache.has(normalizedUrl) || openPhishCache.has(normalizedUrl + '/')) {
        return {
            type: 'URL',
            input: rawUrl,
            risk: "HIGH",
            score: 100,
            explanation: ["CRITICAL: URL matches an active threat in the OpenPhish database."],
            recommendation: "Close the page immediately. Do not interact."
        };
    }

    // 2. DOMAIN EXTRACTION FOR HEURISTICS
    let hostname = "";
    try {
        const parsedUrl = new URL(normalizedUrl.startsWith('http') ? normalizedUrl : `http://${normalizedUrl}`);
        hostname = parsedUrl.hostname;
    } catch (e) {
        hostname = normalizedUrl; // Fallback if parsing fails
    }

    // 3. TYPOSQUATTING & HOMOGRAPH DETECTION
    // Strip subdomains/tlds (e.g., "www.rnicrosoft.com" -> "rnicrosoft")
    const domainParts = hostname.replace('www.', '').split('.');
    const mainDomain = domainParts.length > 1 ? domainParts[domainParts.length - 2] : domainParts[0];

    for (const brand of PROTECTED_BRANDS) {
        // Exact match usually implies a sub-page or deep link (handled safely by openphish ideally)
        if (mainDomain === brand) continue; 

        const distance = getEditDistance(mainDomain, brand);
        
        // If distance is 1 (e.g., go0gle, paypal1) OR if distance is 2 for longer strings (rnicrosoft)
        if (distance === 1 || (distance === 2 && mainDomain.length >= 6)) {
            score += 60;
            flags.push(`IMPERSONATION ALERT: Domain "${mainDomain}" is highly similar to protected brand "${brand}". This is likely Typosquatting.`);
            break; // Stop after first major match
        }
    }

    // 4. BASIC HEURISTICS
    if (normalizedUrl.length > 75) {
        score += 20;
        flags.push("HEURISTIC: Unusually long URL (often used to obscure the actual domain).");
    }

    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
    if (ipRegex.test(hostname)) {
        score += 40;
        flags.push("HEURISTIC: URL uses a raw IP address instead of a domain name.");
    }

    // 5. RISK CALCULATION
    const finalScore = Math.min(score, 100);
    const risk = finalScore >= 60 ? "HIGH" : finalScore >= 30 ? "MEDIUM" : "LOW";

    return {
        type: 'URL',
        input: rawUrl,
        risk,
        score: finalScore,
        explanation: flags.length > 0 ? flags : ["No known threat signatures detected."],
        recommendation: risk === "HIGH" ? [
            "Close this browser tab immediately.",
            "Do not enter any credentials or download any files.",
            "Run a quick antivirus scan if you clicked anything on the page."
        ] : [
            "Verify the sender who provided this link.",
            "Ensure the website has a valid HTTPS certificate.",
            "If in doubt, manually type the brand's official URL in a new tab."
        ]
    };
};

module.exports = { analyzeURL };