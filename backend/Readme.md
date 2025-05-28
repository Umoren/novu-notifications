# Notifications Backend API

> **Express.js API server for cost-effective notifications**
> 
> Handles emails via React Email + Resend and push notifications via Novu API

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Express App   │
├─────────────────┤
│ • CORS enabled  │
│ • JSON parsing  │
│ • Error handling│
└─────────────────┘
         │
    ┌────┴────┐
    │ Routes  │
    └────┬────┘
         │
  ┌──────┴──────┐
  │             │
┌─▼─┐         ┌─▼─┐
│Email│       │Push│
│     │       │    │
│✅Working│   │🔄Cleanup│
└─────┘       └─────┘
  │             │
┌─▼─┐         ┌─▼─┐
│Resend│     │Novu│
│+React│     │API │
│Email │     │    │
└─────┘     └─────┘
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                     # Express server setup
│   ├── routes/
│   │   ├── email.js              # ✅ React Email + Resend routes
│   │   └── notifications.js      # 🔄 Novu push notification routes
│   ├── emails/
│   │   ├── services/
│   │   │   └── emailRenderer.js  # Email template renderer
│   │   └── templates/
│   │       ├── WelcomeEmail.js   # Welcome email template
│   │       ├── ConfirmationEmail.js # Email confirmation template
│   │       └── NewsletterEmail.js   # Newsletter template
│   └── utils/
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json
└── README.md                     # This file
```

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Configure your `.env`:
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Resend Configuration (for emails)
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=onboarding@resend.dev

# Novu Configuration (for push notifications)
NOVU_API_KEY=your_novu_secret_key
NOVU_API_URL=http://localhost:3000

# Optional: Webhook URLs
WEBHOOK_BASE_URL=http://localhost:3001
```

### 3. Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:3001`

## 📧 Email System (✅ Working)

### Technology Stack
- **React Email**: Beautiful, responsive email templates
- **Resend**: Reliable email delivery service
- **Template Validation**: Type-safe props validation

### Email Routes

#### Health Check
```http
GET /api/email/health
```

**Response:**
```json
{
  "status": "OK",
  "service": "email", 
  "provider": "resend",
  "react_email": "enabled",
  "available_templates": ["welcome", "confirmation", "newsletter"],
  "resend_api_key_configured": true,
  "from_email": "onboarding@resend.dev"
}
```

#### Send Welcome Email
```http
POST /api/email/send-welcome
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "companyName": "Acme Corp",
  "loginUrl": "https://app.acme.com/login", 
  "supportEmail": "support@acme.com"
}
```

#### Send Confirmation Email
```http
POST /api/email/send-confirmation
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "companyName": "Acme Corp", 
  "confirmUrl": "https://app.acme.com/confirm?token=abc123",
  "expiresIn": "24 hours"
}
```

#### Send Newsletter
```http
POST /api/email/send-newsletter
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "companyName": "Acme Corp",
  "subject": "Weekly Update",
  "articles": [
    {
      "title": "New Feature Launch",
      "summary": "We launched an amazing new feature",
      "readMoreUrl": "https://blog.acme.com/new-feature"
    }
  ],
  "unsubscribeUrl": "https://app.acme.com/unsubscribe?token=xyz"
}
```

#### Generic Template Sender
```http
POST /api/email/send-template
Content-Type: application/json

{
  "email": "user@example.com",
  "template": "welcome",
  "subject": "Custom Subject",
  "props": {
    "firstName": "John",
    "companyName": "Acme Corp",
    "loginUrl": "https://app.acme.com/login"
  }
}
```

#### List Available Templates
```http
GET /api/email/templates
```

### Email Template Development

#### Creating New Templates

1. **Create React Component**:
```javascript
// src/emails/templates/MyTemplate.js
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

export default function MyTemplate({ firstName, actionUrl }) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Hello {firstName}!</Text>
          <Button href={actionUrl}>Take Action</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

2. **Register Template**:
```javascript
// src/emails/services/emailRenderer.js
import MyTemplate from '../templates/MyTemplate.js';

const templates = {
  welcome: WelcomeEmail,
  confirmation: ConfirmationEmail,
  newsletter: NewsletterEmail,
  mytemplate: MyTemplate, // Add here
};
```

3. **Add Validation**:
```javascript
// In validateTemplateProps function
case 'mytemplate':
  if (!props.firstName) validation.errors.push('firstName is required');
  if (!props.actionUrl) validation.errors.push('actionUrl is required');
  break;
```

## 📱 Push Notifications (🔄 Needs Cleanup)

### Technology Stack
- **Novu API**: Self-hosted notification infrastructure
- **Expo Push**: Native mobile push notifications

### Current Status
- ✅ Routes exist in `src/routes/notifications.js`
- ❌ **Bloated with unnecessary code** - needs cleanup
- ❌ **May use deprecated packages** - needs update to `@novu/api`

### Target Push Routes

#### Register Push Token
```http
POST /api/notifications/register-push-token
Content-Type: application/json

{
  "userId": "user123",
  "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

#### Send Push Notification
```http
POST /api/notifications/push-notification
Content-Type: application/json

{
  "userId": "user123",
  "title": "Hello!",
  "body": "This is a test notification",
  "data": {
    "screen": "home",
    "id": "123"
  }
}
```

### Novu API Integration (Target)
```javascript
import { Novu } from "@novu/api";

const novu = new Novu({ 
  secretKey: process.env.NOVU_API_KEY 
});

// Send notification
await novu.trigger({
  workflowId: "expo-push-notification",
  to: { subscriberId: userId },
  payload: {
    title: "Hello!",
    body: "This is a test notification"
  }
});
```

## 🔧 Development

### Available Scripts
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test

# Lint code
npm run lint
```

### Adding New Routes

1. **Create route file** in `src/routes/`
2. **Import and mount** in `src/app.js`:
```javascript
import newRoutes from './routes/newRoutes.js';
app.use('/api/new', newRoutes);
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Environment (development/production) |
| `RESEND_API_KEY` | Yes | Resend API key for emails |
| `FROM_EMAIL` | Yes | Default sender email |
| `NOVU_API_KEY` | Yes | Novu secret key |
| `NOVU_API_URL` | No | Novu API URL (default: localhost:3000) |

## 🧪 Testing

### Manual Testing with curl

#### Test Email Health
```bash
curl http://localhost:3001/api/email/health
```

#### Test Welcome Email
```bash
curl -X POST http://localhost:3001/api/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "companyName": "Demo Co", 
    "loginUrl": "https://app.demo.com/login"
  }'
```

#### Test Push Token Registration
```bash
curl -X POST http://localhost:3001/api/notifications/register-push-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "pushToken": "ExponentPushToken[test-token]"
  }'
```

### Testing Email Templates Locally

Use React Email's preview feature:
```bash
# Install React Email CLI
npm install -g @react-email/cli

# Preview templates
cd src/emails
npx react-email preview
```

Opens browser at `http://localhost:3000` to preview templates.

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=3001
RESEND_API_KEY=re_prod_key_here
NOVU_API_KEY=prod_novu_key_here
```

### Deployment Platforms

#### Railway
```bash
# Connect to Railway
railway login
railway link
railway deploy
```

#### Render
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

#### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build: `npm install && npm run build`
3. Configure run: `npm start`

## 📊 Monitoring

### Health Checks
- **Email**: `GET /api/email/health`
- **Push**: `GET /api/notifications/health` (to be implemented)

### Logging
```javascript
// Current logging approach
console.log(`📧 Sending welcome email to: ${email}`);
console.error('Welcome email error:', error);
```

**Recommended**: Add structured logging with Winston or Pino for production.

## 🔒 Security

### Current Security Measures
- ✅ CORS enabled
- ✅ JSON body parsing limits
- ✅ Environment variable validation
- ✅ Input validation for email routes

### Recommended Additions
- Rate limiting (express-rate-limit)
- Input sanitization
- Request validation middleware
- API key authentication

## 🐛 Troubleshooting

### Common Issues

#### Emails Not Sending
1. **Check API key**: Verify `RESEND_API_KEY` in `.env`
2. **Test health endpoint**: `curl http://localhost:3001/api/email/health`
3. **Check domain**: Verify domain configuration in Resend dashboard
4. **Check logs**: Look for error messages in console

#### Push Notifications Not Working
1. **Check Novu connection**: Verify `NOVU_API_KEY` 
2. **Check routes**: May need cleanup from bloated code
3. **Check Expo tokens**: Ensure valid format `ExponentPushToken[...]`

#### Server Won't Start
1. **Check port**: Make sure port 3001 is available
2. **Check dependencies**: Run `npm install`
3. **Check syntax**: Look for JavaScript errors

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Or specific modules
DEBUG=express:* npm run dev
```

### Optimization Opportunities
- Cache rendered templates
- Batch email sending
- Database connection pooling (when database added)
- CDN for static assets

