const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Import your main server logic
require('../server')(app);

// Handle SPA routing - return index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Export the serverless handler
exports.handler = serverless(app);
