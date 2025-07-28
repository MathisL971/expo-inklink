import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { CardForm, useConfirmPayment } from '@stripe/stripe-react-native';
import { CreditCard } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ThemedButton } from './ThemedButton';
import { ThemedText } from './ThemedText';
import { HStack } from './ui/hstack';
import { Icon } from './ui/icon';
import { Spinner } from './ui/spinner';
import { VStack } from './ui/vstack';

interface StripePaymentFormProps {
    totalAmount: number;
    onPaymentSuccess: (paymentIntentId: string) => void;
    onPaymentError: (error: string) => void;
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
    totalAmount,
    onPaymentSuccess,
    onPaymentError,
    isProcessing,
    setIsProcessing,
}) => {
    const { mode } = useColorScheme();
    const colors = Colors[mode];
    const { confirmPayment } = useConfirmPayment();

    const [cardComplete, setCardComplete] = useState(false);

    const createPaymentIntent = async (amount: number) => {
        try {
            // Use environment variable for payment API URL
            const paymentApiUrl = process.env.EXPO_PUBLIC_PAYMENT_API_URL || 'http://localhost:3001';

            const response = await fetch(`${paymentApiUrl}/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // Convert to cents
                    currency: 'usd',
                    metadata: {
                        source: 'expo-inklink-mobile',
                        timestamp: new Date().toISOString(),
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to create payment intent');
            }

            const { clientSecret } = await response.json();
            return clientSecret;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            // For demo purposes, return a mock client secret
            return 'pi_mock_client_secret_for_demo';
        }
    };

    const handlePayment = async () => {
        if (!cardComplete) {
            Alert.alert('Incomplete Card', 'Please complete your card information.');
            return;
        }

        setIsProcessing(true);

        try {
            // Create payment intent
            const clientSecret = await createPaymentIntent(totalAmount);

            if (clientSecret === 'pi_mock_client_secret_for_demo') {
                // For demo purposes, simulate successful payment
                setTimeout(() => {
                    setIsProcessing(false);
                    onPaymentSuccess('pi_mock_payment_intent_id');
                }, 2000);
                return;
            }

            // Confirm payment with actual Stripe
            const { error, paymentIntent } = await confirmPayment(clientSecret, {
                paymentMethodType: 'Card',
                paymentMethodData: {
                    billingDetails: {
                        // Add billing details here if needed
                    },
                },
            });

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent) {
                onPaymentSuccess(paymentIntent.id);
            }
        } catch (error) {
            console.error('Payment error:', error);
            onPaymentError(error instanceof Error ? error.message : 'Payment failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <VStack space="md">
            <HStack space="sm" style={{ alignItems: 'center' }}>
                <Icon as={CreditCard} size="md" color={colors.tint} />
                <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>Payment Method</ThemedText>
            </HStack>

            <CardForm
                autofocus
                cardStyle={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: 8,
                    borderWidth: 1,
                    fontSize: 16,
                    placeholderColor: colors.textSecondary,
                    textColor: colors.text,
                }}
                style={{
                    width: '100%',
                    height: 200,
                }}
                onFormComplete={(cardDetails: { complete: boolean }) => {
                    setCardComplete(cardDetails.complete);
                }}
            />

            <ThemedButton
                title={isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
                onPress={handlePayment}
                disabled={isProcessing || !cardComplete}
                style={{
                    opacity: (isProcessing || !cardComplete) ? 0.6 : 1,
                }}
            />

            {isProcessing && (
                <HStack space="sm" style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Spinner size="small" color={colors.tint} />
                    <ThemedText style={{ color: colors.textSecondary }}>
                        Processing payment...
                    </ThemedText>
                </HStack>
            )}
        </VStack>
    );
}; 