const axios = require('axios');

const checkEmailBreach = async (email) => {
    if (!email) throw new Error("Email is required");

    let score = 0;
    const flags = [];
    let risk = "LOW";
    let recommendation = "Maintain good security hygiene.";

    try {
        console.log(`[LeakCheck] Verifying breach status for: ${email}`);
        
        // Encode URI component to handle special characters in emails safely
        const response = await axios.get(`https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`, {
            timeout: 10000
        });

        const data = response.data;

        if (data.success && data.found > 0) {
            score = 100; // Any breach is an immediate critical risk
            risk = "HIGH";
            flags.push(`CRITICAL: Email address found in ${data.found} known data breach databases.`);

            if (data.fields && data.fields.length > 0) {
                flags.push(`COMPROMISED DATA TYPES: ${data.fields.join(', ')}`);
            }

            if (data.sources && data.sources.length > 0) {
                // Map the sources into a readable string: "Evony.com (2016-07), Zynga.com (2019-09)"
                const sourceList = data.sources.map(s => `${s.name} (${s.date})`).join(', ');
                flags.push(`KNOWN BREACH SOURCES: ${sourceList}`);
            }

            recommendation = "Change your passwords immediately. Enable Two-Factor Authentication (2FA) on all accounts associated with this email.";
        } else if (data.success && data.found === 0) {
            flags.push("SAFE: No known breaches found for this email address in the public database.");
        } else {
            console.warn("[LeakCheck] API returned unsuccessful response:", data);
            flags.push("SYSTEM WARNING: Could not verify breach status. The public API may be rate-limited.");
            risk = "MEDIUM"; 
            score = 0;
        }

    } catch (error) {
        console.error("[LeakCheck] API Request failed:", error.message);
        flags.push("SYSTEM ERROR: Breach database is currently unavailable. Please try again later.");
        risk = "MEDIUM";
        score = 0;
    }

    return {
        type: 'Email',
        input: email,
        risk,
        score,
        explanation: flags.length > 0 ? flags : ["No known leaks found."],
        recommendation
    };
};

module.exports = { checkEmailBreach };