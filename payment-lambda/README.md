# Payment Lambda Function

This is a dedicated AWS Lambda function for handling payment processing for the expo-inklink application using Stripe.

## Features

- **Payment Intent Creation**: Creates Stripe payment intents for secure payment processing
- **Payment Confirmation**: Confirms and retrieves payment status
- **Webhook Handling**: Processes Stripe webhooks for payment events
- **Error Handling**: Comprehensive error handling for all Stripe error types
- **Security**: Isolated payment processing environment
- **CORS Support**: Proper CORS headers for web requests

## Environment Variables

The following environment variables are required:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here  # Optional, for webhook handling
NODE_ENV=production  # Optional, for error detail handling
```

## API Endpoints

### POST /create-payment-intent
Creates a new payment intent for processing payments.

**Request Body:**
```json
{
  "amount": 2000,  // Amount in cents (required)
  "currency": "usd",  // Currency code (optional, defaults to "usd")
  "metadata": {  // Optional metadata
    "source": "expo-inklink-mobile",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### POST /confirm-payment
Retrieves the status of a payment intent.

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "paymentIntent": {
    "id": "pi_xxx",
    "status": "succeeded",
    "amount": 2000,
    "currency": "usd",
    "metadata": {},
    "created": 1640995200,
    "client_secret": "pi_xxx_secret_xxx"
  }
}
```

### POST /webhook
Handles Stripe webhook events.

**Headers:**
- `stripe-signature`: Webhook signature from Stripe

**Supported Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## Development

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Stripe account with test keys

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your environment variables:
   ```bash
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   NODE_ENV=development
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Testing
You can test the endpoints locally using curl or a tool like Postman:

```bash
# Create payment intent
curl -X POST http://localhost:3000/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000, "currency": "usd"}'

# Confirm payment
curl -X POST http://localhost:3000/confirm-payment \
  -H "Content-Type: application/json" \
  -d '{"paymentIntentId": "pi_xxx"}'
```

## Deployment

### Build
```bash
npm run build
```

### Deploy to AWS Lambda
1. Create a new Lambda function in AWS Console named `expo-inklink-payment-api`
2. Set the environment variables in the Lambda configuration
3. Deploy using the npm script:
   ```bash
   npm run deploy
   ```

### Windows Deployment
```bash
npm run deploy:win
```

## Security Considerations

- **Environment Variables**: Never commit secret keys to version control
- **CORS**: The function includes CORS headers for web requests
- **Input Validation**: All inputs are validated before processing
- **Error Handling**: Sensitive error details are only shown in development
- **Webhook Security**: Webhook signatures are verified using Stripe's signature verification

## Error Handling

The function handles all Stripe error types:

- `StripeCardError`: Invalid card information
- `StripeRateLimitError`: Too many requests
- `StripeInvalidRequestError`: Invalid request parameters
- `StripeAPIError`: Stripe API temporarily unavailable
- `StripeConnectionError`: Network connectivity issues
- `StripeAuthenticationError`: Invalid API keys
- `StripeSignatureVerificationError`: Invalid webhook signatures

## Monitoring

You can monitor the function using:
- AWS CloudWatch Logs
- Stripe Dashboard for payment events
- Lambda function metrics in AWS Console

## Frontend Integration

Update your frontend environment variables to point to the deployed Lambda:

```bash
# Development
EXPO_PUBLIC_PAYMENT_API_URL=http://localhost:3001

# Production
EXPO_PUBLIC_PAYMENT_API_URL=https://your-lambda-api-gateway-url.amazonaws.com
``` 