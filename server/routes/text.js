const express = require('express');
const router = express.Router();
const { analyzeTextContent } = require('../services/textService');

router.post('/', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: "Text parameter is required" });
        }

        const result = await analyzeTextContent(text);
        res.status(200).json(result);
    } catch (error) {
        console.error("Text Scan Route Error:", error);
        res.status(500).json({ error: "Failed to process text analysis" });
    }
});

module.exports = router;