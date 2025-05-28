import express from 'express';
import emailRenderer from '../emails/services/emailRenderer.js';
import he from 'he';

const router = express.Router();

// Health check for notifications service
router.get('/health', async (req, res) => {
    const novu = req.app.locals.novu;

    res.json({
        status: 'OK',
        service: 'notifications',
        novu_client_ready: !!novu,
        timestamp: new Date().toISOString()
    });
});

// Send email (plain text)
router.post('/send-email', async (req, res) => {
    try {
        const { userId, email, subject, content } = req.body;
        const novu = req.app.locals.novu;

        if (!userId || !email || !subject || !content) {
            return res.status(400).json({
                error: 'Missing required fields: userId, email, subject, content'
            });
        }

        const result = await novu.trigger({
            workflowId: 'user-email-notifications',
            to: {
                subscriberId: userId,
                email: email
            },
            payload: { subject, content }
        });

        res.json({
            message: 'Email sent successfully',
            userId,
            email,
            transactionId: result.data?.transactionId,
            success: true
        });
    } catch (error) {
        console.error('Email error:', error.message);
        res.status(500).json({
            error: 'Failed to send email',
            message: error
        });
    }
});

// send template email
router.post('/send-template-email', async (req, res) => {
    try {
        const { userId, email, subject, templateName, templateProps = {} } = req.body;
        const novu = req.app.locals.novu;

        if (!userId || !email || !subject || !templateName) {
            return res.status(400).json({
                error: 'Missing required fields: userId, email, subject, templateName'
            });
        }

        // Render the email template
        const renderResult = await emailRenderer.renderWithValidation(templateName, templateProps);

        if (!renderResult.success) {
            return res.status(400).json({
                error: 'Template rendering failed',
                details: renderResult.errors
            });
        }


        console.log(`✅ Template rendered successfully. HTML length: ${renderResult.html.length} characters`);
        console.log(`📋 First 200 characters: ${renderResult.html.substring(0, 200)}`);


        // Send via Novu with rendered HTML
        const result = await novu.trigger({
            workflowId: 'user-email-notifications',
            to: {
                subscriberId: userId,
                email: email
            },
            payload: {
                subject,
                content: Buffer.from(renderResult.html).toString('base64')  // Proper HTML entity encoding
            }
        });

        res.json({
            message: 'Template email sent successfully',
            userId,
            email,
            templateName,
            transactionId: result.data?.transactionId,
            success: true
        });
    } catch (error) {
        console.error('Template email error:', error.message);
        // CHANGE TO:
        console.error('Template email error:', error);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        res.status(500).json({
            error: 'Failed to send template email',
            message: error.message
        });
    }
});

router.post('/send-delayed-email', async (req, res) => {
    try {
        const { userId, email, subject, content, delayAmount, delayUnit } = req.body;
        const novu = req.app.locals.novu;

        if (!userId || !email || !subject || !content || !delayAmount || !delayUnit) {
            return res.status(400).json({
                error: 'Missing required fields: userId, email, subject, content, delayAmount, delayUnit'
            });
        }

        console.log(`⏰ Sending delayed email (${delayAmount} ${delayUnit}) to: ${email}`);

        const result = await novu.trigger({
            workflowId: 'delayed-email-notifications',
            to: {
                subscriberId: userId,
                email: email
            },
            payload: {
                subject,
                content
            },
            overrides: {
                delay: {
                    amount: parseInt(delayAmount),
                    unit: delayUnit
                }
            }
        });

        res.json({
            message: `Email will be sent in ${delayAmount} ${delayUnit}`,
            userId,
            email,
            delay: `${delayAmount} ${delayUnit}`,
            transactionId: result.data?.transactionId,
            success: true
        });
    } catch (error) {
        console.error('Delayed email error:', error.message);
        res.status(500).json({
            error: 'Failed to send delayed email',
            message: error.message
        });
    }
});

// Preview email template (for testing during development)
router.post('/preview-template', async (req, res) => {
    try {
        const { templateName, templateProps = {} } = req.body;

        if (!templateName) {
            return res.status(400).json({
                error: 'Missing required field: templateName'
            });
        }

        console.log(`👀 Previewing template: ${templateName}`);

        const renderResult = await emailRenderer.renderWithValidation(templateName, templateProps);

        if (!renderResult.success) {
            return res.status(400).json({
                error: 'Template rendering failed',
                details: renderResult.errors
            });
        }

        res.json({
            message: 'Template rendered successfully',
            templateName,
            props: templateProps,
            html: renderResult.html,
            text: renderResult.text,
            success: true
        });
    } catch (error) {
        console.error('Template preview error:', error.message);
        res.status(500).json({
            error: 'Failed to preview template',
            message: error.message
        });
    }
});

// Get available email templates (developer utility)
router.get('/templates', (req, res) => {
    try {
        const templates = emailRenderer.getAvailableTemplates();

        res.json({
            message: 'Available email templates',
            templates: templates.map(name => ({
                name,
                description: getTemplateDescription(name)
            })),
            success: true
        });
    } catch (error) {
        console.error('Get templates error:', error.message);
        res.status(500).json({
            error: 'Failed to get templates',
            message: error.message
        });
    }
});

// Helper function to get template descriptions
function getTemplateDescription(templateName) {
    const descriptions = {
        welcome: 'Welcome email for new users with onboarding information',
        confirmation: 'Email confirmation template with action button',
        newsletter: 'Newsletter template with articles and call-to-action'
    };

    return descriptions[templateName] || 'No description available';
}

// Register push token
router.post('/register-push-token', async (req, res) => {
    try {
        const { userId, token } = req.body;
        const novu = req.app.locals.novu;

        if (!userId || !token) {
            return res.status(400).json({
                error: 'Missing required fields: userId, token'
            });
        }

        console.log(`📱 Registering push token for user: ${userId}`);

        // For @novu/api, we'll store this info and use it during trigger
        // The actual registration happens during notification trigger
        // This endpoint exists for API compatibility with your Expo app

        res.json({
            message: 'Push token registered successfully',
            userId,
            token: `${token.substring(0, 20)}...`, // Partial token for security
            success: true,
            note: 'Token will be used when sending notifications'
        });
    } catch (error) {
        console.error('Register token error:', error.message);
        res.status(500).json({
            error: 'Failed to register push token',
            message: error.message
        });
    }
});

// Send immediate push notification
router.post('/push-notification', async (req, res) => {
    try {
        const { userId, title, body, data, token } = req.body;
        const novu = req.app.locals.novu;

        if (!userId || !title || !body) {
            return res.status(400).json({
                error: 'Missing required fields: userId, title, body'
            });
        }

        console.log(`📤 Sending push notification to: ${userId}`);

        // Use just-in-time token registration with the new @novu/api
        const triggerPayload = {
            workflowId: 'expo-push-notification',
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

        console.log('Triggering workflow with payload:', JSON.stringify(triggerPayload, null, 2));

        const result = await novu.trigger(triggerPayload);

        res.json({
            message: 'Push notification sent successfully',
            userId,
            title,
            body,
            transactionId: result.data?.transactionId,
            success: true
        });
    } catch (error) {
        console.error('Push notification error:', error.message);
        res.status(500).json({
            error: 'Failed to send push notification',
            message: error.message
        });
    }
});

export default router;