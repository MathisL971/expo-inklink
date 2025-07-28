# Ticket Purchase Component

A comprehensive two-step ticket purchase component for the InkLink event platform that handles both free and paid tickets with Stripe integration.

## Features

- **Two-step purchase flow**: Ticket selection → Payment processing
- **Multiple ticket tiers**: Supports different pricing tiers with availability tracking
- **Free ticket handling**: Automatically skips payment for free tickets
- **Stripe integration**: Secure payment processing with card validation
- **Real-time availability**: Updates ticket counts after purchases
- **User-friendly interface**: Clean, accessible design with proper error handling

## How it Works

### Step 1: Ticket Selection
- Displays all available ticket tiers with pricing and availability
- Interactive quantity selectors with + and - buttons
- Real-time total calculation
- Prevents selection of more tickets than available
- Shows "Get Tickets" button for free tickets or "Continue to Payment" for paid tickets

### Step 2: Payment Processing
- **For Free Tickets**: Automatically reserves tickets without payment
- **For Paid Tickets**: Shows Stripe payment form with:
  - Order summary
  - Secure card input form
  - Payment processing with loading states
  - Success/error handling

## Usage

### Basic Integration

```tsx
import TicketPurchaseComponent from '@/components/TicketPurchaseComponent';

function EventPage() {
  return (
    <TicketPurchaseComponent
      eventId="your-event-id"
      ticketTiers={event.ticketTiers}
      onPurchaseComplete={() => {
        // Handle successful purchase
        // e.g., refresh event data, show success message
      }}
    />
  );
}
```

### Props

- `eventId`: The ID of the event for which tickets are being purchased
- `ticketTiers`: Array of ticket tier objects with pricing and availability
- `onPurchaseComplete`: Callback function called after successful purchase

### Ticket Tier Structure

```tsx
interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
  description?: string;
}
```

## Setup Requirements

### 1. Stripe Configuration

The component requires Stripe to be properly configured:

```tsx
// App root (app/_layout.tsx)
import { StripeProvider } from '@/components/StripeProvider';

function App() {
  return (
    <StripeProvider>
      <YourApp />
    </StripeProvider>
  );
}
```

### 2. Expo Configuration

Add the Stripe plugin to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": "merchant.com.your-app",
          "enableGooglePay": false
        }
      ]
    ]
  }
}
```

### 3. Backend Integration

For production use, implement a backend endpoint to create payment intents:

```javascript
// POST /create-payment-intent
{
  "amount": 2500, // in cents
  "currency": "usd"
}
```

## Features in Detail

### Free Ticket Handling
- Automatically detects when total price is $0
- Skips payment step entirely
- Directly reserves tickets in the system
- Shows appropriate success message

### Payment Processing
- Uses Stripe's secure CardForm component
- Validates card information before allowing payment
- Handles payment intents and confirmations
- Provides clear error messages for failed payments

### Error Handling
- Network errors during payment
- Insufficient ticket availability
- Invalid card information
- Backend failures

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Proper focus management

## Customization

### Styling
The component uses the app's theme system and can be customized by modifying:
- `Colors.ts` for color scheme
- Component styles through the `colors` object
- Card and button styling

### Behavior
- Modify `handleQuantityChange` for custom quantity limits
- Customize error messages in Alert calls
- Adjust payment processing flow in `StripePaymentForm`

## Testing

### Free Tickets
1. Create an event with free ticket tiers (price: 0)
2. Select quantities and click "Reserve Free Tickets"
3. Verify tickets are reserved without payment

### Paid Tickets
1. Create an event with paid ticket tiers
2. Select quantities and click "Continue to Payment"
3. Use Stripe test card numbers for testing:
   - `4242424242424242` (Visa)
   - `4000000000000002` (Card declined)

## Security Considerations

- Never store card information locally
- Use Stripe's secure card input components
- Validate all inputs on both client and server
- Use HTTPS for all API communications
- Implement proper authentication and authorization

## Error Scenarios

The component handles these error cases:
- No tickets selected
- Insufficient ticket availability
- Authentication required
- Payment card errors
- Network connectivity issues
- Backend service failures

## Future Enhancements

- Support for discount codes
- Multiple payment methods (Apple Pay, Google Pay)
- Saved payment methods
- Bulk ticket purchases
- Group booking features
- Waitlist functionality for sold-out events 