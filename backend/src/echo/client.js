import { Echo } from '@novu/echo';
import {
    renderWelcomeEmail,
    renderConfirmationEmail,
    renderNewsletterEmail
} from '../emails/services/emailRenderer.js';

// Initialize Echo client
export const echo = new Echo({
    apiKey: process.env.NOVU_API_KEY,
    devModeBypassAuthentication: process.env.NODE_ENV === 'development',
});

console.log('🔥 Initializing Novu Echo workflows...');

// Welcome Email Workflow
echo.workflow('welcome-email', async ({ step, payload }) => {
    await step.email('send-welcome', async () => {
        return {
            subject: `Welcome to ${payload.companyName}! 🎉`,
            body: renderWelcomeEmail({
                firstName: payload.firstName,
                companyName: payload.companyName,
                loginUrl: payload.loginUrl,
                supportEmail: payload.supportEmail || 'support@company.com'
            })
        };
    });
}, {
    payloadSchema: {
        type: 'object',
        properties: {
            firstName: { type: 'string', description: 'User\'s first name' },
            companyName: { type: 'string', description: 'Company name' },
            loginUrl: { type: 'string', description: 'Login URL for the user' },
            supportEmail: { type: 'string', description: 'Support email address' }
        },
        required: ['firstName', 'companyName', 'loginUrl'],
        additionalProperties: false
    }
});

// Email Confirmation Workflow
echo.workflow('confirmation-email', async ({ step, payload }) => {
    await step.email('send-confirmation', async () => {
        return {
            subject: 'Please confirm your email address',
            body: renderConfirmationEmail({
                firstName: payload.firstName,
                companyName: payload.companyName,
                confirmUrl: payload.confirmUrl,
                expiresIn: payload.expiresIn || '24 hours'
            })
        };
    });
}, {
    payloadSchema: {
        type: 'object',
        properties: {
            firstName: { type: 'string', description: 'User\'s first name' },
            companyName: { type: 'string', description: 'Company name' },
            confirmUrl: { type: 'string', description: 'Email confirmation URL' },
            expiresIn: { type: 'string', description: 'Link expiration time' }
        },
        required: ['firstName', 'companyName', 'confirmUrl'],
        additionalProperties: false
    }
});

// Newsletter Email Workflow
echo.workflow('newsletter-email', async ({ step, payload }) => {
    await step.email('send-newsletter', async () => {
        return {
            subject: payload.subject || 'Your Weekly Newsletter',
            body: renderNewsletterEmail({
                firstName: payload.firstName,
                companyName: payload.companyName,
                articles: payload.articles || [],
                unsubscribeUrl: payload.unsubscribeUrl,
                webViewUrl: payload.webViewUrl
            })
        };
    });
}, {
    payloadSchema: {
        type: 'object',
        properties: {
            firstName: { type: 'string', description: 'User\'s first name' },
            companyName: { type: 'string', description: 'Company name' },
            subject: { type: 'string', description: 'Newsletter subject' },
            articles: {
                type: 'array',
                description: 'Array of newsletter articles',
                items: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        summary: { type: 'string' },
                        readMoreUrl: { type: 'string' },
                        imageUrl: { type: 'string' }
                    }
                }
            },
            unsubscribeUrl: { type: 'string', description: 'Unsubscribe URL' },
            webViewUrl: { type: 'string', description: 'Web view URL' }
        },
        required: ['firstName', 'companyName', 'unsubscribeUrl'],
        additionalProperties: false
    }
});

console.log('✅ Echo workflows initialized: welcome-email, confirmation-email, newsletter-email');

export default echo;