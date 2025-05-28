import { render } from '@react-email/render';
import WelcomeEmail from '../templates/WelcomeEmail.js';
import ConfirmationEmail from '../templates/ConfirmationEmail.js';
import NewsletterEmail from '../templates/NewsletterEmail.js';

// Template registry
const templates = {
    welcome: WelcomeEmail,
    confirmation: ConfirmationEmail,
    newsletter: NewsletterEmail,
};

/**
 * Renders an email template to HTML
 * @param {string} templateName - Name of the template (welcome, confirmation, newsletter)
 * @param {object} props - Props to pass to the template
 * @returns {Promise<string>} - Rendered HTML string
 */
export async function renderEmailTemplate(templateName, props = {}) {
    try {
        const Template = templates[templateName];

        if (!Template) {
            throw new Error(`Template "${templateName}" not found. Available templates: ${Object.keys(templates).join(', ')}`);
        }

        console.log(`📧 Rendering email template: ${templateName}`);

        // Render the React component to HTML
        const html = await render(Template(props));

        console.log(`✅ Template rendered successfully. HTML length: ${html.length} characters`);

        // Log first 200 characters for debugging
        console.log(`📝 HTML preview: ${html.substring(0, 200)}...`);

        // Check for potential JSON-breaking characters
        const problematicChars = html.match(/["\\\r\n\t]/g);
        if (problematicChars) {
            console.log(`⚠️  Found ${problematicChars.length} potentially problematic characters for JSON`);
        }

        return html;
    } catch (error) {
        console.error(`Error rendering email template "${templateName}":`, error.message);
        throw error;
    }
}

/**
 * Renders an email template to plain text (for clients that don't support HTML)
 * @param {string} templateName - Name of the template
 * @param {object} props - Props to pass to the template
 * @returns {Promise<string>} - Plain text version
 */
export async function renderEmailTemplateText(templateName, props = {}) {
    try {
        const Template = templates[templateName];

        if (!Template) {
            throw new Error(`Template "${templateName}" not found`);
        }

        // Render to plain text
        const text = await render(Template(props), { plainText: true });

        return text;
    } catch (error) {
        console.error(`Error rendering text email template "${templateName}":`, error.message);
        throw error;
    }
}

/**
 * Get available template names
 * @returns {string[]} - Array of template names
 */
export function getAvailableTemplates() {
    return Object.keys(templates);
}

/**
 * Validate template props
 * @param {string} templateName - Name of the template
 * @param {object} props - Props to validate
 * @returns {object} - Validation result
 */
export function validateTemplateProps(templateName, props) {
    const validation = { isValid: true, errors: [] };

    switch (templateName) {
        case 'welcome':
            if (!props.firstName) validation.errors.push('firstName is required');
            if (!props.loginUrl) validation.errors.push('loginUrl is required');
            break;

        case 'confirmation':
            if (!props.firstName) validation.errors.push('firstName is required');
            if (!props.confirmUrl) validation.errors.push('confirmUrl is required');
            break;

        case 'newsletter':
            if (!props.firstName) validation.errors.push('firstName is required');
            if (props.articles && !Array.isArray(props.articles)) {
                validation.errors.push('articles must be an array');
            }
            break;


        default:
            validation.errors.push(`Unknown template: ${templateName}`);
    }

    validation.isValid = validation.errors.length === 0;
    return validation;
}

/**
 * Render template with validation
 * @param {string} templateName - Name of the template
 * @param {object} props - Props to pass to the template
 * @returns {Promise<object>} - Result with html, text, and validation info
 */
export async function renderTemplateWithValidation(templateName, props = {}) {
    try {
        // Validate props
        const validation = validateTemplateProps(templateName, props);

        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors,
                html: null,
                text: null
            };
        }

        // Render both HTML and text versions
        const [html, text] = await Promise.all([
            renderEmailTemplate(templateName, props),
            renderEmailTemplateText(templateName, props)
        ]);

        return {
            success: true,
            html,
            text,
            templateName,
            props
        };
    } catch (error) {
        return {
            success: false,
            errors: [error.message],
            html: null,
            text: null
        };
    }
}

// Default export for convenience
export default {
    render: renderEmailTemplate,
    renderText: renderEmailTemplateText,
    renderWithValidation: renderTemplateWithValidation,
    getAvailableTemplates,
    validateTemplateProps
};