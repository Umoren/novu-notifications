# Novu Notifications - Cost-Effective Push & Email Stack

> **Migration from Knock.app to self-hosted stack achieving 98% cost savings**
> 
> From $500/month → $26/month for 10K notifications

## 🎯 Project Overview

This project demonstrates migrating from expensive SaaS notification services to a cost-effective self-hosted stack while maintaining beautiful emails and reliable push notifications.

### 📊 Cost Comparison

| Service | Knock.app (Previous) | Our Stack | Savings |
|---------|---------------------|-----------|---------|
| **10K notifications** | $100-500/month | $6-26/month | **95-98%** |
| **100K notifications** | $500-2000/month | $26-46/month | **95-98%** |
| **Emails (100K)** | $500/month | $20/month | **96%** |
| **Push notifications** | $100/month | $6/month | **94%** |

## 🏗️ Architecture

### ✅ Current Working Stack

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Expo App      │────│   Backend API    │────│  External APIs  │
│                 │    │                  │    │                 │
│ • Push tokens   │    │ • Express.js     │    │ • Resend        │
│ • FCM setup     │    │ • Email routes   │    │ • Novu API      │
│ • Working UI    │    │ • Push routes    │    │ • React Email   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 🎨 **Emails**: React Email + Resend
- ✅ **Status**: Fully implemented and working
- ✅ **Beautiful templates**: Welcome, Confirmation, Newsletter
- ✅ **Cost**: $20/month for 100K emails
- ✅ **Developer experience**: React components, type-safe

### 📱 **Push Notifications**: Novu API (Self-hosted)
- 🔄 **Status**: Needs cleanup (routes exist but bloated)
- ✅ **Integration**: Works with Expo push tokens
- ✅ **Cost**: $6/month self-hosted
- ✅ **Scalable**: Handle millions of notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- Resend account (free tier available)
- Novu self-hosted instance

### 1. Clone and Setup
```bash
git clone <repository-url>
cd novu-notifications

# Backend setup
cd backend
npm install
cp .env.example .env
# Configure your API keys in .env

# Start backend
npm run dev

# Expo app setup  
cd ../expo-app
npm install
npx expo start
```

### 2. Environment Configuration
```bash
# backend/.env
RESEND_API_KEY=re_your_key_here
FROM_EMAIL=onboarding@resend.dev
NOVU_API_KEY=your_novu_key_here
NOVU_API_URL=http://localhost:3000
PORT=3001
```

## 📁 Project Structure

```
novu-notifications/
├── README.md                   # This file
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── app.js             # Main server
│   │   ├── routes/
│   │   │   ├── email.js       # ✅ Email endpoints (working)
│   │   │   └── notifications.js # 🔄 Push endpoints (needs cleanup)
│   │   └── emails/            # ✅ React Email templates
│   ├── package.json
│   └── README.md              # Backend-specific docs
├── expo-app/                  # React Native mobile app
│   ├── App.js
│   ├── components/
│   └── package.json
└── docs/                      # Additional documentation
```

## 🔗 API Endpoints

### ✅ Email API (Working)
```bash
# Health check
GET /api/email/health

# Send emails
POST /api/email/send-welcome
POST /api/email/send-confirmation  
POST /api/email/send-newsletter

# List templates
GET /api/email/templates
```

### 🔄 Push API (Needs Cleanup)
```bash
# Register device
POST /api/notifications/register-push-token

# Send notification
POST /api/notifications/push-notification
```

## 🧪 Testing

### Test Email System
```bash
# Health check
curl http://localhost:3001/api/email/health

# Send welcome email
curl -X POST http://localhost:3001/api/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "companyName": "Demo Co",
    "loginUrl": "https://app.demo.com/login"
  }'
```

### Test Push Notifications
```bash
# Register token
curl -X POST http://localhost:3001/api/notifications/register-push-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "pushToken": "ExponentPushToken[your-token]"
  }'
```

## 🎨 Email Templates

Our React Email templates are production-ready and beautiful:

- **Welcome Email**: Onboarding new users
- **Confirmation Email**: Email verification
- **Newsletter**: Regular updates with articles

All templates are:
- ✅ Mobile responsive
- ✅ Dark mode compatible  
- ✅ Accessible (WCAG compliant)
- ✅ Cross-client tested

## 📱 Mobile App Integration

The Expo app integrates seamlessly:

1. **Push Token Registration**: Automatic on app start
2. **FCM Integration**: Native push notifications
3. **Deep Linking**: Handle notification taps
4. **Badge Management**: Unread count updates

## 🔧 Development

### Adding New Email Templates
1. Create React component in `backend/src/emails/templates/`
2. Add to template registry in `emailRenderer.js`
3. Add validation rules
4. Test with curl commands

### Adding Push Features
1. Update routes in `backend/src/routes/notifications.js`
2. Use current Novu API format
3. Test with Expo app

## 🚀 Deployment

### Backend Deployment
- **Recommended**: Railway, Render, or DigitalOcean
- **Requirements**: Node.js 18+, Environment variables
- **Cost**: $5-10/month

### Novu Self-Hosted
- **Recommended**: Docker on VPS
- **Requirements**: 2GB RAM, Docker
- **Cost**: $6/month

## 🤝 Contributing

1. Focus on simplicity over complexity
2. Test email templates across clients
3. Ensure Expo app compatibility
4. Document API changes

## 📈 Roadmap

- ✅ Email system (Complete)
- 🔄 Push notifications cleanup (In Progress)
- ⏳ Advanced email analytics
- ⏳ A/B testing for templates
- ⏳ Webhook integrations

## 🆘 Troubleshooting

### Common Issues

**Emails not sending?**
- Check `RESEND_API_KEY` in `.env`
- Verify domain configuration in Resend
- Test with health endpoint first

**Push notifications not working?**
- Verify Novu API connection
- Check FCM credentials in Expo
- Test token registration endpoint

**React Email templates broken?**
- Check template syntax
- Verify props validation
- Test with simple template first

## 📄 License

MIT License - Feel free to use this for your own projects!


**Built with ❤️ for developers who want beautiful notifications without breaking the bank**