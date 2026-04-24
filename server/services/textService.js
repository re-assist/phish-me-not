const axios = require('axios');

const HEURISTIC_KEYWORDS = {
  urgent: ["urgent", "immediately", "action required", "suspended", "blocked","limited time","click here","download now"],
  authority: ["bank", "security", "official", "government", "police", "tax"],
  sensitive: ["otp", "password", "pin", "verify", "login", "credentials"],
  threat: ["legal action", "arrest", "lawsuit", "deleted", "expired"],
  incentive: ["prize", "offer", "claim", "lottery", "award", "credit", "avail", "winner", "gift","win","chance"]
};

const HF_API_URL = "https://router.huggingface.co/hf-inference/models/phishbot/ScamLLM";

const analyzeTextContent = async (text) => {
    if (!text) throw new Error("Text is required");

    let score = 0;
    const flags = [];
    const lowerText = text.toLowerCase();

    // 1. LOCAL HEURISTICS (Bounded Additive Scoring)
    let heuristicScore = 0;
    Object.entries(HEURISTIC_KEYWORDS).forEach(([category, words]) => {
        const matches = words.filter(word => lowerText.includes(word));
        if (matches.length > 0) {
            heuristicScore += (20 * matches.length); 
            const matchedWordsString = matches.join(', ');
            flags.push(`${category.toUpperCase()}: Detected ${matches.length} suspicious keyword(s) ("${matchedWordsString}").`);
        }
    });

    // Cap heuristics at 40. This prevents "keyword stuffing" from reaching the HIGH (60+) threshold without AI verification.
    score += Math.min(heuristicScore, 40);

    // 2. HUGGING FACE AI ANALYSIS
    try {
        console.log("[AI] Requesting classification from Hugging Face...");
        const response = await axios.post(
            HF_API_URL,
            { inputs: text },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 60000 
            }
        );

        const data = response.data;
        const predictions = (Array.isArray(data) && Array.isArray(data[0])) ? data[0] : (Array.isArray(data) ? data : []);

        if (predictions.length > 0) {
            const spamPrediction = predictions.find(p => p.label === 'LABEL_1' || p.label === 'spam');
            const safePrediction = predictions.find(p => p.label === 'LABEL_0' || p.label === 'ham');

            if (spamPrediction && spamPrediction.score > 0.5) {
                const aiRiskBoost = Math.round(spamPrediction.score * 60); 
                score += aiRiskBoost;
                flags.push(`AI MODEL: High confidence (${(spamPrediction.score * 100).toFixed(1)}%) of malicious intent.`);
                console.log(`[AI] Success: Flagged as SPAM (${(spamPrediction.score * 100).toFixed(1)}%)`);
            } else if (safePrediction) {
                flags.push(`AI MODEL: Evaluated text as likely safe (${(safePrediction.score * 100).toFixed(1)}% confidence).`);
                console.log(`[AI] Success: Evaluated as SAFE (${(safePrediction.score * 100).toFixed(1)}%)`);
            }
        } else {
            console.warn("[AI] Unhandled response structure:", JSON.stringify(data));
        }

    } catch (error) {
        const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
        console.warn(`[AI] Inference failed. Details: ${errorMsg}`);
        flags.push("SYSTEM: AI Engine unavailable. Result based strictly on local heuristics.");
    }

    // 3. RISK CALCULATION
    const finalScore = Math.min(score, 100);
    const risk = finalScore >= 60 ? "HIGH" : finalScore >= 30 ? "MEDIUM" : "LOW";

    return {
        type: 'Text/SMS',
        input: text.substring(0, 60) + (text.length > 60 ? "..." : ""),
        risk,
        score: finalScore,
        explanation: flags.length > 0 ? flags : ["No suspicious linguistic patterns detected."],
        recommendation: risk === "HIGH" ? [
            "Do not reply. Replying confirms your number is active to scammers.",
            "Block the sender immediately on your device.",
            "Delete the message to prevent accidental link clicks later."
        ] : [
            "Do not click any embedded links or call provided numbers.",
            "Verify the claim through official channels (e.g., call the bank directly).",
            "Monitor your accounts for unusual activity."
        ]
    };
};

module.exports = { analyzeTextContent };