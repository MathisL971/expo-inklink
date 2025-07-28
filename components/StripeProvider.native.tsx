import { StripeProvider as StripeSDKProvider } from '@stripe/stripe-react-native';
import React from 'react';

// Use environment variable for Stripe key, fallback to test key for development
const STRIPE_PK_TEST = 'pk_test_51RkefMPAJzNpVUT2eJBk8a9E9wNLJwITaM5G2IiNq3GOWPl0hUcwjcvFsq06T0N4F9rjSfrfoQ23nJaDCX0C2aAi00dHGKHQyn';

interface StripeProviderProps {
    children: React.ReactElement | React.ReactElement[];
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
    return (
        <StripeSDKProvider
            publishableKey={STRIPE_PK_TEST}
            merchantIdentifier="merchant.com.expo.inklink"
            urlScheme="expoinklink"
        >
            {children}
        </StripeSDKProvider>
    );
}; 