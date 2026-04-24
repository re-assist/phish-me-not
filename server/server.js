require('dotenv').config();
const express = require('express');
const cors = require('cors');

const urlRoutes = require('./routes/url');
const textRoutes = require('./routes/text'); 
const emailRoutes = require('./routes/email'); // Un-commented

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Routes
app.use('/api/scan/url', urlRoutes);
app.use('/api/scan/text', textRoutes);
app.use('/api/scan/email', emailRoutes); // Un-commented

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'active', message: 'PhishMeNot API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});