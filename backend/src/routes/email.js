
import express from 'express';
import { Resend } from 'resend';
import { renderEmailTemplate, getAvailableTemplates, validateTemplateProps } from '../emails/services/emailRenderer.js';

const router = express.Router();

// Initialize Resend function (called when needed, not at import time)
function getResendClient() {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY environment variable is required');
    }
    return new Resend(process.env.RESEND_API_KEY);
}

// Health check
router.get('/health', (req, res) => {
    try {
        // Test that we can create Resend client
        const resend = getResendClient();

        res.json({
            status: 'OK',
            service: 'email',
            provider: 'resend',
            react_email: 'enabled',
            available_templates: getAvailableTemplates(),
            resend_api_key_configured: !!process.env.RESEND_API_KEY,
            from_email: process.env.FROM_EMAIL || 'not configured',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: error.message,
            resend_api_key_configured: !!process.env.RESEND_API_KEY
        });
    }
});

// Send Welcome Email
router.post('/send-welcome', async (req, res) => {
    try {
        const { email, firstName, companyName, loginUrl, supportEmail } = req.body;

        if (!email || !firstName || !companyName || !loginUrl) {
            return res.status(400).json({
                error: 'Missing required fields: email, firstName, companyName, loginUrl'
            });
        }

        console.log(`📧 Sending welcome email to: ${email}`);

        // Initialize Resend client
        const resend = getResendClient();

        // Render React Email template using your existing renderer
        const html = await renderEmailTemplate('welcome', {
            firstName,
            companyName,
            loginUrl,
            supportEmail: supportEmail || 'support@company.com'
        });

        // Send via Resend
        const result = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: `Welcome to ${companyName}! 🎉`,
            html: html
        });

        res.json({
            message: 'Welcome email sent successfully',
            email,
            provider: 'resend',
            emailId: result.data?.id,
            success: true
        });

    } catch (error) {
        console.error('Welcome email error:', error);
        res.status(500).json({
            error: 'Failed to send welcome email',
            message: error.message
        });
    }
});

// Send Confirmation Email
router.post('/send-confirmation', async (req, res) => {
    try {
        const { email, firstName, companyName, confirmUrl, expiresIn } = req.body;

        if (!email || !firstName || !companyName || !confirmUrl) {
            return res.status(400).json({
                error: 'Missing required fields: email, firstName, companyName, confirmUrl'
            });
        }

        console.log(`📧 Sending confirmation email to: ${email}`);

        // Initialize Resend client
        const resend = getResendClient();

        // Render React Email template using your existing renderer
        const html = await renderEmailTemplate('confirmation', {
            firstName,
            companyName,
            confirmUrl,
            expiresIn: expiresIn || '24 hours'
        });

        // Send via Resend
        const result = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Please confirm your email address',
            html: html
        });

        res.json({
            message: 'Confirmation email sent successfully',
            email,
            provider: 'resend',
            emailId: result.data?.id,
            success: true
        });

    } catch (error) {
        console.error('Confirmation email error:', error);
        res.status(500).json({
            error: 'Failed to send confirmation email',
            message: error.message
        });
    }
});

// Send Newsletter Email
router.post('/send-newsletter', async (req, res) => {
    try {
        const { email, firstName, companyName, subject, articles, unsubscribeUrl, webViewUrl } = req.body;

        if (!email || !firstName || !companyName || !unsubscribeUrl) {
            return res.status(400).json({
                error: 'Missing required fields: email, firstName, companyName, unsubscribeUrl'
            });
        }

        console.log(`📧 Sending newsletter email to: ${email}`);

        // Initialize Resend client
        const resend = getResendClient();

        // Render React Email template using your existing renderer
        const html = await renderEmailTemplate('newsletter', {
            firstName,
            companyName,
            articles: articles || [],
            unsubscribeUrl,
            webViewUrl
        });

        // Send via Resend
        const result = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: subject || 'Your Weekly Newsletter',
            html: html
        });

        res.json({
            message: 'Newsletter email sent successfully',
            email,
            provider: 'resend',
            emailId: result.data?.id,
            success: true
        });

    } catch (error) {
        console.error('Newsletter email error:', error);
        res.status(500).json({
            error: 'Failed to send newsletter email',
            message: error.message
        });
    }
});

// Send any template (generic endpoint with validation)
router.post('/send-template', async (req, res) => {
    try {
        const { email, template, subject, props } = req.body;

        if (!email || !template || !subject || !props) {
            return res.status(400).json({
                error: 'Missing required fields: email, template, subject, props'
            });
        }

        // Validate template exists
        const availableTemplates = getAvailableTemplates();
        if (!availableTemplates.includes(template)) {
            return res.status(400).json({
                error: 'Invalid template',
                available: availableTemplates
            });
        }

        // Validate template props
        const validation = validateTemplateProps(template, props);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Template validation failed',
                validation_errors: validation.errors
            });
        }

        console.log(`📧 Sending ${template} email to: ${email}`);

        // Initialize Resend client
        const resend = getResendClient();

        // Render template using your existing renderer
        const html = await renderEmailTemplate(template, props);

        // Send via Resend
        const result = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: subject,
            html: html
        });

        res.json({
            message: `${template} email sent successfully`,
            email,
            template,
            provider: 'resend',
            emailId: result.data?.id,
            success: true
        });

    } catch (error) {
        console.error('Template email error:', error);
        res.status(500).json({
            error: 'Failed to send template email',
            message: error.message
        });
    }
});

// List available templates (uses your existing function)
router.get('/templates', (req, res) => {
    const templates = getAvailableTemplates();

    res.json({
        message: 'Available React Email templates',
        templates: templates.map(name => {
            const validation = validateTemplateProps(name, {});
            return {
                name,
                description: getTemplateDescription(name),
                validation_example: validation
            };
        }),
        provider: 'resend',
        success: true
    });
});

// Helper function for template descriptions
function getTemplateDescription(templateName) {
    const descriptions = {
        welcome: 'Welcome email for new users',
        confirmation: 'Email confirmation template',
        newsletter: 'Newsletter with articles'
    };
    return descriptions[templateName] || 'No description available';
}

export default router;
