import { Colors } from "@/constants/Colors";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useColorScheme } from "../contexts/ColorSchemeContext";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe('pk_test_51RkefMPAJzNpVUT2eJBk8a9E9wNLJwITaM5G2IiNq3GOWPl0hUcwjcvFsq06T0N4F9rjSfrfoQ23nJaDCX0C2aAi00dHGKHQyn');

interface WebStripePaymentFormProps {
    totalAmount: number;
    onPaymentSuccess: (paymentIntentId: string) => void;
    onPaymentError: (error: string) => void;
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
    clientSecret: string;
}

export default function WebStripePaymentForm({
    totalAmount,
    onPaymentSuccess,
    onPaymentError,
    isProcessing,
    setIsProcessing,
    clientSecret
}: WebStripePaymentFormProps) {
    const { mode } = useColorScheme();
    const colors = Colors[mode];

    const options = {
        clientSecret,
        appearance: {
            theme: (mode === 'dark' ? 'night' : 'stripe') as 'night' | 'stripe',
            variables: {
                colorPrimary: colors.primary,
                colorBackground: colors.surface,
                colorText: colors.text,
                colorDanger: '#df1b41',
                fontFamily: 'system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
                totalAmount={totalAmount}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
            />
        </Elements>
    );
};