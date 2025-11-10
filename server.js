require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const serverless = require('serverless-http');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission: ${subject}`,
            text: `
                Name: ${name}
                Email: ${email}
                
                Message:
                ${message}
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

// API route handler
const handler = require('serverless-http')(app);

// Serve static files from the root directory
app.use(express.static(__dirname));

// Handle SPA routing - return landing.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

// Handle other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path), { root: __dirname }, (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, '404.html'));
        }
    });
});

// Start the server only when not in Vercel environment
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the Vercel handler
module.exports = serverless(app);
