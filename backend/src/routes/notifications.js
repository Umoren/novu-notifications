import express from 'express';
import logger from '../logger.js';

const router = express.Router();

// Health check for notifications service
router.get('/health', async (req, res) => {
    const novu = req.app.locals.novu;
    const health = {
        status: 'OK',
        service: 'notifications',
        novu_client_ready: !!novu,
        timestamp: new Date().toISOString()
    };

    logger.info('Notifications health check', health);
    res.json(health);
});

// Register push token
router.post('/register-push-token', async (req, res) => {
    try {
        const { userId, token } = req.body;
        const novu = req.app.locals.novu;

        logger.info('Token registration request', { userId, tokenLength: token?.length });

        if (!userId || !token) {
            logger.warn('Missing required fields for token registration', { userId: !!userId, token: !!token });
            return res.status(400).json({
                error: 'Missing required fields: userId, token'
            });
        }

        logger.info(`Registering push token for user: ${userId}`);

        const response = {
            message: 'Push token registered successfully',
            userId,
            token: `${token.substring(0, 20)}...`,
            success: true,
            note: 'Token will be used when sending notifications'
        };

        logger.info('Token registration successful', { userId });
        res.json(response);
    } catch (error) {
        logger.error('Register token error', { error: error.message, stack: error.stack });
        res.status(500).json({
            error: 'Failed to register push token',
            message: error.message
        });
    }
});

// Send immediate push notification
// Send immediate push notification
router.post('/push-notification', async (req, res) => {
    try {
        const { userId, title, body, data, token } = req.body;
        const novu = req.app.locals.novu;

        logger.info('Push notification request', { userId, title, hasToken: !!token });

        if (!userId || !title || !body) {
            logger.warn('Missing required fields for push notification', {
                userId: !!userId,
                title: !!title,
                body: !!body
            });
            return res.status(400).json({
                error: 'Missing required fields: userId, title, body'
            });
        }

        // @novu/node trigger format
        const triggerPayload = {
            to: {
                subscriberId: userId,
                ...(token && {
                    channels: [{
                        providerId: 'expo',
                        credentials: {
                            deviceTokens: [token]
                        }
                    }]
                })
            },
            payload: { title, body, data }
        };

        logger.info('Triggering Novu workflow', { workflowId: 'expo-push-notifications', userId });
        logger.debug('Workflow payload', triggerPayload);

        // Correct @novu/node format: workflowId first, then payload
        const result = await novu.trigger('expo-push-notifications', triggerPayload);

        logger.info('Novu workflow triggered', {
            transactionId: result.data?.transactionId,
            userId
        });

        const response = {
            message: 'Push notification sent successfully',
            userId,
            title,
            body,
            transactionId: result.data?.transactionId,
            success: true
        };

        res.json(response);
    } catch (error) {
        logger.error('Push notification error', {
            error: error.message,
            stack: error.stack,
            userId: req.body.userId
        });
        res.status(500).json({
            error: 'Failed to send push notification',
            message: error.message
        });
    }
});

export default router;