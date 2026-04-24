const axios = require('axios');

const HEURISTIC_KEYWORDS = {
  urgent: ["urgent", "immediately", "action required", "suspended", "blocked"],
  authority: ["bank", "security", "official", "government", "police", "tax"],
  sensitive: ["otp", "password", "pin", "verify", "login", "credentials"],
  threat: ["legal action", "arrest", "lawsuit", "deleted", "expired"]
};

// Switching back to the specialized SMS Spam fine-tuned model using the stable router endpoint
const HF_API_URL = "https://router.huggingface.co/hf-inference/models/mrm8488/bert-tiny-finetuned-sms-spam-detection";

const analyzeTextContent = async (text) => {
    if (!text) throw new Error("Text is required");

    let score = 0;
    const flags = [];
    const lowerText = text.toLowerCase();

    // 1. LOCAL HEURISTICS
    Object.entries(HEURISTIC_KEYWORDS).forEach(([category, words]) => {
        const matches = words.filter(word => lowerText.includes(word));
        if (matches.length > 0) {
            score += 20; 
            flags.push(`${category.toUpperCase()}: Detected suspicious keywords ("${matches[0]}").`);
        }
    });

    // 2. HUGGING FACE AI ANALYSIS
    try {
        console.log("[AI] Requesting classification from Hugging Face...");
        const response = await axios.post(
            HF_API_URL,
            { inputs: text }, // Fine-tuned models just take raw text inputs
            {
                headers: {
                    "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 15000 
            }
        );

        const data = response.data;
        
        // HF Text Classification models typically return an array of arrays: [[{label, score}, {label, score}]]
        const predictions = (Array.isArray(data) && Array.isArray(data[0])) ? data[0] : (Array.isArray(data) ? data : []);

        if (predictions.length > 0) {
            // LABEL_1 is Spam/Phishing in this specific model. LABEL_0 is Safe/Ham.
            const spamPrediction = predictions.find(p => p.label === 'LABEL_1' || p.label === 'spam');
            const safePrediction = predictions.find(p => p.label === 'LABEL_0' || p.label === 'ham');

            // We use > 0.5 because fine-tuned binary classifiers are highly decisive
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
        recommendation: risk === "HIGH" ? "Do not reply or click any links. Delete immediately." : "Verify sender identity if unsure."
    };
};

module.exports = { analyzeTextContent };