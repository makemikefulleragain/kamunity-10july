# 🌟 Kamunity - Community begins with one spark

[![Security Status](https://img.shields.io/badge/security-audited-green)](./security-audit-report.json)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Deploy Status](https://img.shields.io/badge/deploy-ready-blue)](#deployment)

**Kamunity** is a modern, secure community platform built with Next.js, TypeScript, and deployed on Netlify. Join us to be part of something bigger - a community-driven platform fostering connection, growth, and positive change.

## ✨ Features

- 🔐 **Security First**: Comprehensive security measures including rate limiting, input validation, and CORS protection
- 📧 **Email Integration**: Automated email capture with SendGrid integration and admin notifications
- 🤖 **Spam Protection**: reCAPTCHA v3 integration to prevent spam and bots
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🎯 **Contact System**: Advanced contact form with device/location tracking
- 📊 **Analytics Ready**: Google Analytics integration and custom event tracking
- 💬 **Live Chat**: Optional Crisp chat widget for customer support
- 🔄 **Real-time Monitoring**: Health checks and error tracking
- 🚀 **Fast Deployment**: Optimized for Netlify with edge functions

## 🏗️ Architecture

```
kamunityAI/
├── 🎨 Frontend (Next.js + TypeScript)
│   ├── src/components/          # Reusable UI components
│   ├── src/pages/               # Next.js pages and API routes
│   ├── src/lib/                 # Utility functions and configurations
│   └── src/styles/              # Global styles and Tailwind CSS
├── ⚡ Backend (API Routes + Netlify Functions)
│   ├── src/pages/api/           # Next.js API routes
│   └── netlify/functions/       # Netlify serverless functions
├── 🔧 Configuration
│   ├── netlify.toml             # Netlify deployment config
│   ├── next.config.js           # Next.js configuration
│   └── tailwind.config.js       # Tailwind CSS config
└── 🛡️ Security
    ├── scripts/security-audit.js # Automated security audit
    └── src/lib/monitoring.ts    # Error tracking and monitoring
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/kamunity.git
   cd kamunity
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run security audit:**
   ```bash
   node scripts/security-audit.js
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🌐 Deployment

### Production Deployment on Netlify

#### Step 1: Environment Setup

1. **SendGrid Configuration:**
   - Sign up at [SendGrid](https://sendgrid.com)
   - Create API key with Full Access
   - Verify your domain
   - Set up sender authentication

2. **reCAPTCHA Configuration:**
   - Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
   - Create new site with reCAPTCHA v3
   - Add your domain
   - Get site key and secret key

#### Step 2: Netlify Deployment

1. **Connect Repository:**
   - Link your GitHub repository to Netlify
   - Set build command: `npm run build && npm run export`
   - Set publish directory: `out`

2. **Environment Variables:**
   Set these in Netlify Dashboard → Site Settings → Environment Variables:
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=hello@kamunity.ai
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   MIKE_FULLER_EMAIL=your_admin_email@example.com
   NEXT_PUBLIC_SITE_URL=https://kamunity.ai
   ```

3. **Domain Configuration:**
   - Add custom domain in Netlify
   - Configure DNS with your domain provider
   - HTTPS is automatic with Netlify

#### Step 3: Security Verification

Run the security audit to ensure everything is properly configured:

```bash
node scripts/security-audit.js
```

## 🔒 Security Features

### Implemented Security Measures

- ✅ **Input Validation**: All user inputs are validated and sanitized
- ✅ **Rate Limiting**: API endpoints protected against abuse
- ✅ **CORS Protection**: Origin validation on all API calls
- ✅ **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- ✅ **reCAPTCHA Protection**: Spam and bot protection
- ✅ **Data Encryption**: HTTPS enforced everywhere
- ✅ **Error Handling**: Secure error messages without information leakage
- ✅ **Dependency Security**: Regular vulnerability scanning

### Security Monitoring

- 📊 **Health Checks**: `/api/health` endpoint for system monitoring
- 🔍 **Error Tracking**: Comprehensive client and server-side error logging
- 📈 **Performance Monitoring**: Web Vitals and API response time tracking
- 🚨 **Security Incident Logging**: Automatic detection and alerting

## 📧 Email System

### Features

- **Subscription Management**: Advanced email capture with device/location tracking
- **Contact Forms**: Professional contact system with admin notifications
- **Thank You Emails**: Automated welcome emails for new subscribers
- **Admin Notifications**: Instant notifications for new contacts and subscribers

### Email Templates

All emails use responsive HTML templates with:
- Professional branding
- Mobile-friendly design
- Proper security headers
- Unsubscribe functionality

## 📊 Analytics & Tracking

### User Interaction Tracking

- Page views and navigation
- Form submissions and conversions
- Device and browser analytics
- Geographic data (privacy-compliant)

### Performance Monitoring

- Core Web Vitals
- API response times
- Error rates and types
- User engagement metrics

## 🛠️ API Endpoints

### Public Endpoints

- `POST /api/subscribe` - Email subscription with device tracking
- `POST /api/contact` - Contact form submission
- `GET /api/health` - System health check

### Netlify Functions

- `/.netlify/functions/subscribe` - Production email subscription
- `/.netlify/functions/contact` - Production contact form

All endpoints include:
- Input validation and sanitization
- Rate limiting protection
- reCAPTCHA verification
- Comprehensive error handling

## 🎨 Styling & Design

### Design System

- **Colors**: Indigo, lavender, peach, and gold palette
- **Typography**: Modern, readable font stack
- **Components**: Consistent, reusable UI components
- **Animations**: Smooth, performant animations with Framer Motion

### Responsive Design

- Mobile-first approach
- Flexible grid system
- Touch-friendly interactions
- Optimized images and assets

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run security     # Run security audit
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run security audit and tests
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Add proper error handling
- Include security considerations
- Update documentation
- Run security audit before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue
- **Security**: Report security issues privately to security@kamunity.ai
- **General**: Contact us through the website contact form

## 🎯 Roadmap

### Phase 1: Foundation (Current)
- ✅ Core platform with security features
- ✅ Email integration and contact system
- ✅ Responsive design and performance optimization
- ✅ Production deployment on Netlify

### Phase 2: Community Features (Next)
- 🔜 User authentication system
- 🔜 Community creation and management
- 🔜 Real-time messaging and notifications
- 🔜 Advanced analytics dashboard

### Phase 3: Advanced Features
- 🔜 ElevenLabs Voice API integration
- 🔜 AI-powered content recommendations
- 🔜 Mobile app development
- 🔜 Enterprise features

---

**Made with ❤️ by the Kamunity team**

*Community begins with one spark* ✨ 