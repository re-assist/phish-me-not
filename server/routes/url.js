const express = require('express');
const router = express.Router();
const { analyzeURL } = require('../services/urlService');

// POST /api/scan/url
router.post('/', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: "URL parameter is required" });
        }

        const result = await analyzeURL(url);
        res.status(200).json(result);
    } catch (error) {
        console.error("URL Scan Route Error:", error);
        res.status(500).json({ error: "Failed to process URL analysis" });
    }
});

module.exports = router;