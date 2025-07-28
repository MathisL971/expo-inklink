# Expo InkLink - Event Management Platform

A comprehensive event management platform built with Expo React Native, featuring ticket sales, payment processing, and event management capabilities.

## Architecture

This project consists of multiple components:

- **Frontend**: Expo React Native app (mobile & web)
- **Main API**: AWS Lambda function for core event/ticket management (`expo-inklink-api/`)
- **Payment API**: Dedicated AWS Lambda function for payment processing (`payment-lambda/`)
- **Image Processing**: AWS Lambda functions for image handling (`image-processing-lambda/`, `image-upload-lambda/`)

## Features

- 🎫 **Ticket Sales**: Multi-tier ticket system with quantity controls
- 💳 **Payment Processing**: Secure Stripe integration for paid tickets
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🎨 **Modern UI**: Beautiful, responsive design with theme support
- 🔐 **Authentication**: Clerk-based user authentication
- 📊 **Event Management**: Create, edit, and manage events
- 🖼️ **Image Processing**: Automated image optimization and upload

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- AWS CLI configured
- Stripe account

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```bash
# Frontend
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
EXPO_PUBLIC_BACKEND_URL=https://your-main-api.amazonaws.com
EXPO_PUBLIC_PAYMENT_API_URL=https://your-payment-api.amazonaws.com
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Add other required environment variables
```

### 3. Set Up Backend Services

#### Main API
```bash
cd expo-inklink-api
npm install
# Set up your .env with MongoDB connection
npm run build
npm run deploy
```

#### Payment API
```bash
cd payment-lambda
npm install
# Set up your .env with Stripe keys
npm run build
npm run deploy
```

### 4. Start Development
```bash
npx expo start
```

## Payment Processing Setup

The payment system is handled by a dedicated Lambda function for security and isolation:

1. **Create Stripe Account**: Get your test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

2. **Deploy Payment Lambda**: 
   ```bash
   cd payment-lambda
   npm run deploy
   ```

3. **Configure Environment Variables**:
   - Set `STRIPE_SECRET_KEY` in Lambda environment
   - Set `EXPO_PUBLIC_PAYMENT_API_URL` in frontend

4. **Test Payment Flow**:
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

## Project Structure

```
expo-inklink/
├── app/                          # Expo Router pages
├── components/                   # Reusable UI components
├── constants/                    # App constants
├── contexts/                     # React contexts
├── services/                     # API service functions
├── types/                        # TypeScript type definitions
├── utils/                        # Utility functions
├── expo-inklink-api/            # Main API Lambda
├── payment-lambda/              # Payment processing Lambda
├── image-processing-lambda/     # Image processing Lambda
└── image-upload-lambda/         # Image upload Lambda
```

## Key Components

### Ticket Purchase Flow
1. **Selection**: Users select ticket quantities by tier
2. **Free Tickets**: Instant processing for free tickets
3. **Paid Tickets**: Stripe payment processing
4. **Confirmation**: Ticket creation and email confirmation

### Payment Security
- Dedicated Lambda for payment processing
- Stripe-validated card processing
- Webhook support for payment events
- Comprehensive error handling

## Development

### Frontend Development
```bash
npm run web      # Start web development server
npm run ios      # Start iOS development server
npm run android  # Start Android development server
```

### Backend Development
```bash
# Main API
cd expo-inklink-api
npm run dev

# Payment API
cd payment-lambda
npm run dev
```

### Testing
- Use Stripe test cards for payment testing
- Test both free and paid ticket flows
- Verify mobile and web experiences

## Deployment

### Frontend
```bash
# Build for production
npx expo build

# Deploy to Expo hosting
npx expo publish
```

### Backend Services
```bash
# Deploy main API
cd expo-inklink-api && npm run deploy

# Deploy payment API
cd payment-lambda && npm run deploy
```

## Environment Variables

### Frontend (.env)
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_BACKEND_URL=https://api.example.com
EXPO_PUBLIC_PAYMENT_API_URL=https://payment.example.com
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Main API (.env)
```bash
MONGODB_URI=mongodb://...
DATABASE_NAME=expo-inklink
```

### Payment API (.env)
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Security

- Payment processing isolated in dedicated Lambda
- Environment variables for sensitive data
- Stripe signature verification for webhooks
- Input validation on all endpoints
- CORS configuration for web requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check the documentation in each Lambda function's README
- Review environment variable requirements
- Test with Stripe's test mode first
- Check AWS CloudWatch logs for debugging

## License

This project is private and proprietary.
