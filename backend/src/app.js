import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Novu } from '@novu/node';
import logger from './logger.js';

// Import routes
import notificationRoutes from './routes/notifications.js';
import emailRoutes from './routes/email.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        body: req.method === 'POST' ? req.body : undefined,
        ip: req.ip
    });
    next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Novu client (correct @novu/node format)
const novu = new Novu(process.env.NOVU_SECRET_KEY, {
    backendUrl: process.env.NOVU_API_URL,
});



// Store Novu client in app locals
app.locals.novu = novu;

// Root route
app.get('/', (req, res) => {
    const response = {
        message: 'Clean Notifications Backend',
        status: 'running',
        endpoints: {
            email: '/api/email/',
            notifications: '/api/notifications/',
            health: '/api/email/health'
        },
        timestamp: new Date().toISOString()
    };
    logger.info('Health check requested');
    res.json(response);
});

// Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`NOVU_API_URL configured: ${!!process.env.NOVU_API_URL}`);
});

export default app;