import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Novu } from '@novu/api';

// Import routes
import notificationRoutes from './routes/notifications.js';
import emailRoutes from './routes/email.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Novu client (for legacy push notifications)
const novu = new Novu({
    secretKey: process.env.NOVU_API_KEY
});

// Store Novu client in app locals
app.locals.novu = novu;

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Clean Notifications Backend',
        status: 'running',
        features: [
            'React Email templates via Resend',
            'Legacy Novu for push notifications',
            'Simple, cost-effective setup'
        ],
        endpoints: {
            email: '/api/email/',
            notifications: '/api/notifications/',
            health: '/api/email/health'
        },
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Clean notification server running on port ${PORT}`);
    console.log(`✅ Novu client ready (for push notifications)`);
    console.log(`📧 React Email + Resend ready`);
    console.log(`\n📍 Available endpoints:`);
    console.log(`   Email Health: http://localhost:${PORT}/api/email/health`);
    console.log(`   Send Welcome: http://localhost:${PORT}/api/email/send-welcome`);
    console.log(`   Send Confirmation: http://localhost:${PORT}/api/email/send-confirmation`);
    console.log(`   Send Newsletter: http://localhost:${PORT}/api/email/send-newsletter`);
});

export default app;