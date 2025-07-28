import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useUser } from '@clerk/clerk-expo';
import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, TouchableOpacity, View } from 'react-native';
import CountdownTimer from './CountDownTimer';
import { StripePaymentForm } from './StripePaymentForm';
import { ThemedText } from './ThemedText';
import { Card } from './ui/card';
import { HStack } from './ui/hstack';
import { Icon } from './ui/icon';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalHeader } from './ui/modal';
import { VStack } from './ui/vstack';
import WebStripePaymentForm from './WebStripePaymentForm';


// Web-specific Stripe payment form
import stripeService from '@/services/stripe';
import { Reservation } from '@/types';

interface PaymentModalProps {
    onClose: () => void;
    eventId: string;
    reservation: Reservation | null;
    onPurchaseComplete: () => void | Promise<void>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    onClose,
    eventId,
    reservation,
    onPurchaseComplete
}) => {
    const { mode } = useColorScheme();
    const colors = Colors[mode];
    const { user } = useUser();

    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [reservationExpired, setReservationExpired] = useState(false);

    // Create PaymentIntent when modal opens
    useEffect(() => {
        if (reservation) {
            createPaymentIntent();
        }
    }, [reservation]);

    if (!user) {
        return null;
    }

    if (!reservation) {
        return null;
    }

    // Handle reservation expiration
    const handleReservationExpired = () => {
        setReservationExpired(true);
        Alert.alert(
            'Reservation Expired',
            'Your ticket reservation has expired. Please make a new selection.',
            [{ text: 'OK', onPress: handleClose }]
        );
    };

    const createPaymentIntent = async () => {
        try {
            setIsProcessing(true);

            const response = await stripeService.createPaymentIntent({
                amount: Math.round(totalPrice * 100),
                currency: 'usd',
                metadata: {
                    source: 'expo-inklink',
                    eventId: eventId,
                    userId: user?.id,
                    timestamp: new Date().toISOString(),
                },
            });

            const { clientSecret } = response;
            setClientSecret(clientSecret);
        } catch (error) {
            console.error('Error creating payment intent:', error);
            Alert.alert('Error', 'Failed to initialize payment. Please try again.');
            onClose();
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle successful payment
    const handlePaymentSuccess = async () => {
        try {
            await onPurchaseComplete();
        } catch (error) {
            console.error('Error processing tickets after payment:', error);
            Alert.alert('Error', 'Payment was successful but there was an error processing your tickets. Please contact support.');
        }
    };

    // Handle payment error
    const handlePaymentError = (error: string) => {
        Alert.alert('Payment Failed', error);
    };

    // Reset state when modal closes
    const handleClose = () => {
        if (reservationExpired || confirm('Are you sure you want to close the payment modal? You will lose your reservation.')) {
            setClientSecret(null);
            onClose();
        }
    };

    // Calculate total price
    const totalPrice = reservation.tickets.reduce((sum, ticket) => sum + (ticket.quantity * ticket.unitPrice), 0);

    return (
        <Modal isOpen={reservation !== null} onClose={handleClose} size="lg">
            <ModalBackdrop className='pointer-events-auto' />
            <ModalContent className='gap-4' style={{
                backgroundColor: colors.background,
                maxWidth: 600,
                width: '90%',
                maxHeight: '80%',
            }}>
                <ModalHeader style={{
                    backgroundColor: colors.card,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.borderLight,
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.borderLight,
                }}>
                    <HStack className="justify-between items-center flex-grow">
                        <ThemedText style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: colors.text
                        }}>
                            Payment Details
                        </ThemedText>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={{
                                borderRadius: 8,
                                backgroundColor: colors.card
                            }}
                        >
                            <Icon as={X} size="xl" color={colors.textSecondary} />
                        </TouchableOpacity>
                    </HStack>
                </ModalHeader>

                <ModalBody className='m-0'>
                    <VStack space="lg">
                        {/* Order Summary */}
                        <Card style={{
                            backgroundColor: colors.card,
                            shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 8,
                            borderWidth: 1,
                            borderColor: colors.borderLight,
                            borderRadius: 16,
                            padding: 20,
                        }}>
                            <VStack space="md">
                                <ThemedText style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: colors.text,
                                    marginBottom: 8
                                }}>
                                    Order Summary
                                </ThemedText>

                                <VStack space="sm">
                                    {reservation.tickets.map((ticket) => (
                                        <HStack key={ticket.tierId} className="justify-between items-center">
                                            <ThemedText style={{
                                                fontSize: 16,
                                                color: colors.text,
                                                flex: 1
                                            }}>
                                                {ticket.name} x{ticket.quantity}
                                            </ThemedText>
                                            <ThemedText style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: colors.text
                                            }}>
                                                ${(ticket.unitPrice * ticket.quantity).toFixed(2)}
                                            </ThemedText>
                                        </HStack>
                                    ))}
                                </VStack>

                                <View style={{
                                    height: 1,
                                    backgroundColor: colors.borderLight,
                                    marginVertical: 8
                                }} />

                                <HStack className="justify-between items-center">
                                    <ThemedText style={{
                                        fontSize: 18,
                                        fontWeight: '700',
                                        color: colors.text
                                    }}>
                                        Total:
                                    </ThemedText>
                                    <ThemedText style={{
                                        fontSize: 20,
                                        fontWeight: '700',
                                        color: colors.primary
                                    }}>
                                        ${totalPrice.toFixed(2)}
                                    </ThemedText>
                                </HStack>
                            </VStack>
                        </Card>

                        {/* Reservation Countdown Alert */}
                        <Card style={{
                            backgroundColor: reservationExpired ? colors.errorBg : colors.warningBg,
                            shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 8,
                            borderWidth: 1,
                            borderColor: reservationExpired ? (colors.error || '#ef4444') : colors.warningBorder,
                            borderRadius: 16,
                            padding: 20,
                        }}>
                            <CountdownTimer 
                                expiresAt={reservation.expiresAt}
                                onExpired={handleReservationExpired}
                            />
                        </Card>

                        {/* Payment Form */}
                        <Card style={{
                            backgroundColor: colors.card,
                            shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 8,
                            borderWidth: 1,
                            borderColor: colors.borderLight,
                            borderRadius: 16,
                            padding: 20,
                        }}>
                            {!clientSecret || reservationExpired ? (
                                <VStack className="items-center" space="md">
                                    <ThemedText style={{
                                        fontSize: 16,
                                        color: colors.textSecondary,
                                        textAlign: 'center'
                                    }}>
                                        {reservationExpired 
                                            ? 'Payment disabled - reservation expired' 
                                            : isProcessing 
                                                ? 'Preparing payment...' 
                                                : 'Loading payment form...'
                                        }
                                    </ThemedText>
                                </VStack>
                            ) : Platform.OS === 'web' ? (
                                <WebStripePaymentForm
                                    totalAmount={totalPrice}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    onPaymentError={handlePaymentError}
                                    isProcessing={isProcessing}
                                    setIsProcessing={setIsProcessing}
                                    clientSecret={clientSecret}
                                />
                            ) : (
                                <StripePaymentForm
                                    totalAmount={totalPrice}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    onPaymentError={handlePaymentError}
                                    isProcessing={isProcessing}
                                    setIsProcessing={setIsProcessing}
                                />
                            )}
                        </Card>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PaymentModal; 