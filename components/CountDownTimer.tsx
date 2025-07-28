import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { useColorScheme } from "../contexts/ColorSchemeContext";
import { ThemedText } from "./ThemedText";

// Countdown Timer Component
interface CountdownTimerProps {
    expiresAt: string;
    onExpired: () => void;
}

export default function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
    const { mode } = useColorScheme();
    const colors = Colors[mode];
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const difference = expiry - now;

            if (difference <= 0) {
                setTimeLeft('00:00');
                setIsExpired(true);
                onExpired();
                return;
            }

            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        // Calculate immediately
        calculateTimeLeft();

        // Set up interval to update every second
        const timer = setInterval(calculateTimeLeft, 1000);

        // Cleanup interval on unmount
        return () => clearInterval(timer);
    }, [expiresAt, onExpired]);

    return (
        <ThemedText style={{
            fontSize: 16,
            color: isExpired ? colors.error || '#ef4444' : colors.warning,
            textAlign: 'center',
            fontWeight: isExpired ? '600' : '400'
        }}>
            {isExpired ? 'Reservation has expired' : `Your reservation expires in ${timeLeft}`}
        </ThemedText>
    );
};