import { Colors } from "@/constants/Colors";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { TouchableOpacity, View } from "react-native";
import { useColorScheme } from "../contexts/ColorSchemeContext";
import { ThemedText } from "./ThemedText";
import { Spinner } from "./ui/spinner";
import { VStack } from "./ui/vstack";

interface CheckoutFormProps {
    totalAmount: number;
    onPaymentSuccess: (paymentIntentId: string) => void;
    onPaymentError: (error: string) => void;
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
}

export default function CheckoutForm({
    totalAmount,
    onPaymentSuccess,
    onPaymentError,
    isProcessing,
    setIsProcessing,
}: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { mode } = useColorScheme();
    const colors = Colors[mode];

    const handlePayment = async () => {
        if (!stripe || !elements) {
            onPaymentError('Stripe not loaded properly');
            return;
        }

        setIsProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin,
                },
                redirect: 'if_required'
            });

            if (error) {
                onPaymentError(error.message || 'Payment failed');
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onPaymentSuccess(paymentIntent.id);
            } else {
                onPaymentError('Payment was not completed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            onPaymentError('An unexpected error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <VStack space="lg">
            <View style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.borderLight,
            }}>
                <PaymentElement
                    options={{
                        layout: 'tabs',
                        fields: {
                            billingDetails: 'auto'
                        }
                    }}
                />
            </View>

            <TouchableOpacity
                onPress={handlePayment}
                disabled={isProcessing || !stripe || !elements}
                className='flex-row items-center justify-center gap-2'
                style={{
                    backgroundColor: colors.primary,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    opacity: (isProcessing || !stripe || !elements) ? 0.6 : 1,
                    shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.4)",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 6,
                }}
            >
                {isProcessing && <Spinner size="small" color={colors.primaryText} />}
                <ThemedText style={{
                    color: colors.primaryText,
                    fontSize: 18,
                    fontWeight: '600',
                    textAlign: 'center'
                }}>
                    {isProcessing ? 'Processing payment...' : `Pay $${totalAmount.toFixed(2)}`}
                </ThemedText>
            </TouchableOpacity>
        </VStack>
    );
};