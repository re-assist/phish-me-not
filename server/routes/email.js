const express = require('express');
const router = express.Router();
const { checkEmailBreach } = require('../services/emailService');

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "Email parameter is required" });
        }

        const result = await checkEmailBreach(email);
        res.status(200).json(result);
    } catch (error) {
        console.error("Email Scan Route Error:", error);
        res.status(500).json({ error: "Failed to process email analysis" });
    }
});

module.exports = router;