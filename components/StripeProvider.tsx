import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

// Use environment variable for Stripe key, fallback to test key for development
const STRIPE_PK_TEST = 'pk_test_51RkefMPAJzNpVUT2eJBk8a9E9wNLJwITaM5G2IiNq3GOWPl0hUcwjcvFsq06T0N4F9rjSfrfoQ23nJaDCX0C2aAi00dHGKHQyn';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PK_TEST);

interface StripeProviderProps {
    children: React.ReactElement | React.ReactElement[];
}

// Web provider component using Stripe Elements
export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
}; 