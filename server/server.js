const express = require('express');
const cors = require('cors');

const urlRoutes = require('./routes/url');
// const textRoutes = require('./routes/text'); // Un-comment later
// const emailRoutes = require('./routes/email'); // Un-comment later

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Allows Express to parse JSON bodies

// Routes
app.use('/api/scan/url', urlRoutes);
// app.use('/api/scan/text', textRoutes);
// app.use('/api/scan/email', emailRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'active', message: 'PhishMeNot API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});