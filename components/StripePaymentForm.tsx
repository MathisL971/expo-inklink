import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { CreditCard } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { ThemedButton } from './ThemedButton';
import { ThemedText } from './ThemedText';
import { HStack } from './ui/hstack';
import { Icon } from './ui/icon';
import { Spinner } from './ui/spinner';
import { VStack } from './ui/vstack';

// Type declaration for Stripe global object
declare global {
    interface Window {
        Stripe: any;
    }
}

interface StripePaymentFormProps {
    totalAmount: number;
    onPaymentSuccess: (paymentIntentId: string) => void;
    onPaymentError: (error: string) => void;
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
}

// Web implementation with actual Stripe.js
export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
    totalAmount,
    onPaymentSuccess,
    onPaymentError,
    isProcessing,
    setIsProcessing,
}) => {
    const { mode } = useColorScheme();
    const colors = Colors[mode];

    const [cardComplete, setCardComplete] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

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
                        source: 'expo-inklink-web',
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
            throw error;
        }
    };

    const processPaymentWithStripe = async (clientSecret: string) => {
        // This would require @stripe/stripe-js for web
        // For now, we'll simulate the payment process
        // In a real implementation, you'd use Stripe.js here

        if (!window.Stripe) {
            throw new Error('Stripe.js not loaded');
        }

        const stripe = window.Stripe(process.env.STRIPE_PK_TEST || '');

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: {
                    number: cardNumber.replace(/\s/g, ''),
                    exp_month: parseInt(expiry.split('/')[0]),
                    exp_year: parseInt('20' + expiry.split('/')[1]),
                    cvc: cvc,
                },
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        return paymentIntent;
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

            // For web demo, we'll simulate success
            // In production, you'd use the processPaymentWithStripe function above
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate successful payment
            onPaymentSuccess('pi_mock_payment_intent_id_web');

        } catch (error) {
            console.error('Payment error:', error);
            onPaymentError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const validateCard = () => {
        // Simple validation for demo purposes
        const isCardNumberValid = cardNumber.length >= 16;
        const isExpiryValid = expiry.length >= 4;
        const isCvcValid = cvc.length >= 3;

        const complete = isCardNumberValid && isExpiryValid && isCvcValid;
        setCardComplete(complete);
        return complete;
    };

    const formatCardNumber = (value: string) => {
        // Remove all non-digit characters
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

        // Add spaces every 4 digits
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    return (
        <VStack space="md">
            <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>
                Payment Details
            </ThemedText>

            <View style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 16,
                backgroundColor: colors.surface,
            }}>
                <VStack space="md">
                    <VStack space="sm">
                        <ThemedText style={{ fontWeight: '600' }}>Card Number</ThemedText>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 6,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            backgroundColor: colors.background,
                        }}>
                            <Icon as={CreditCard} size="sm" color={colors.text} style={{ marginRight: 8 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: 16,
                                    fontFamily: 'monospace',
                                    color: colors.text,
                                }}
                                placeholder="1234 5678 9012 3456"
                                placeholderTextColor={colors.textSecondary}
                                value={cardNumber}
                                onChangeText={(text: string) => {
                                    const formatted = formatCardNumber(text);
                                    setCardNumber(formatted);
                                    validateCard();
                                }}
                                keyboardType="numeric"
                                maxLength={19}
                            />
                        </View>
                    </VStack>

                    <HStack space="md">
                        <View style={{ flex: 1 }}>
                            <ThemedText style={{ fontWeight: '600' }}>Expiry</ThemedText>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 6,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                backgroundColor: colors.background,
                                marginTop: 4,
                            }}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 16,
                                        fontFamily: 'monospace',
                                        color: colors.text,
                                    }}
                                    placeholder="12/25"
                                    placeholderTextColor={colors.textSecondary}
                                    value={expiry}
                                    onChangeText={(text: string) => {
                                        const formatted = formatExpiry(text);
                                        setExpiry(formatted);
                                        validateCard();
                                    }}
                                    keyboardType="numeric"
                                    maxLength={5}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <ThemedText style={{ fontWeight: '600' }}>CVC</ThemedText>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 6,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                backgroundColor: colors.background,
                                marginTop: 4,
                            }}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 16,
                                        fontFamily: 'monospace',
                                        color: colors.text,
                                    }}
                                    placeholder="123"
                                    placeholderTextColor={colors.textSecondary}
                                    value={cvc}
                                    onChangeText={(text: string) => {
                                        const formatted = text.replace(/[^0-9]/gi, '').substring(0, 4);
                                        setCvc(formatted);
                                        validateCard();
                                    }}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </HStack>
                </VStack>
            </View>

            <ThemedText style={{
                color: colors.textSecondary,
                fontSize: 14,
                fontStyle: 'italic',
                textAlign: 'center',
            }}>
                This is a demo form. Click Complete Payment to simulate a successful payment.
            </ThemedText>

            <ThemedButton
                title={isProcessing ? 'Processing...' : `Complete Payment ($${totalAmount.toFixed(2)})`}
                onPress={handlePayment}
                disabled={!cardComplete || isProcessing}
                style={{
                    opacity: (!cardComplete || isProcessing) ? 0.6 : 1,
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