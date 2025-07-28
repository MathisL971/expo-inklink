import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { TicketSelection, TicketTier } from '@/types';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedButton } from './ThemedButton';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogHeader } from './ui/alert-dialog';
import { Badge, BadgeText } from './ui/badge';
import { Button, ButtonText } from './ui/button';
import { Card } from './ui/card';
import { Heading } from './ui/heading';
import { HStack } from './ui/hstack';
import { Icon } from './ui/icon';
import { Text } from './ui/text';
import { VStack } from './ui/vstack';

interface TicketSelectionComponentProps {
    ticketTiers: TicketTier[];
    onContinueToPayment: (selectedTickets: TicketSelection[]) => void;
    onFreePurchase: (selectedTickets: TicketSelection[]) => void;
    isLoading: boolean;
}

const TicketSelectionComponent: React.FC<TicketSelectionComponentProps> = ({
    ticketTiers,
    onContinueToPayment,
    onFreePurchase,
    isLoading
}) => {
    const { isSignedIn } = useAuth();
    const { mode } = useColorScheme();
    const colors = Colors[mode];

    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [selectedTickets, setSelectedTickets] = useState<TicketSelection[]>([]);

    // Calculate total price and quantity
    const totalPrice = selectedTickets.reduce((sum, ticket) => sum + (ticket.quantity * ticket.unitPrice), 0);
    const totalQuantity = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);

    const handleClose = () => setShowAlertDialog(false)

    // Handle quantity change for a ticket tier
    const handleQuantityChange = (tierId: string, change: number) => {
        const tier = ticketTiers.find(t => t.id === tierId);
        if (!tier) return;

        setSelectedTickets(prev => {
            const existing = prev.find(t => t.tierId === tierId);

            if (existing) {
                const newQuantity = Math.max(0, Math.min(tier.available, existing.quantity + change));
                if (newQuantity === 0) {
                    return prev.filter(t => t.tierId !== tierId);
                }
                return prev.map(t =>
                    t.tierId === tierId ? { ...t, quantity: newQuantity } : t
                );
            } else if (change > 0) {
                // Only add if there are tickets available
                if (tier.available > 0) {
                    return [...prev, {
                        tierId: tierId,
                        quantity: 1,
                        unitPrice: tier.price,
                        name: tier.name
                    }];
                }
            }
            return prev;
        });
    };

    // Handle proceed to payment
    const handleProceedToPayment = () => {
        if (!isSignedIn) {
            setShowAlertDialog(true);
            return;
        }

        // If all tickets are free, handle directly
        if (totalPrice === 0) {
            onFreePurchase(selectedTickets);
            return;
        }

        onContinueToPayment(selectedTickets);
    };

    return (
        <ThemedView className="flex-1">
            <VStack space="lg">
                <ThemedText style={{
                    fontSize: 20,
                    fontWeight: '700',
                    letterSpacing: 0.3,
                    color: colors.text
                }}>
                    Select Tickets
                </ThemedText>

                <VStack space="md">
                    {ticketTiers.map((tier) => {
                        const selection = selectedTickets.find(s => s.tierId === tier.id);
                        const quantity = selection?.quantity || 0;

                        return (
                            <Card
                                key={tier.id}
                                style={{
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
                                }}
                            >
                                <VStack space="lg">
                                    <HStack className="justify-between items-start">
                                        <VStack className="flex-1" style={{ marginRight: 16 }}>
                                            <ThemedText style={{
                                                fontSize: 18,
                                                fontWeight: '600',
                                                color: colors.text,
                                                marginBottom: 4
                                            }}>
                                                {tier.name}
                                            </ThemedText>
                                            {tier.description && (
                                                <ThemedText style={{
                                                    fontSize: 14,
                                                    color: colors.textSecondary,
                                                    lineHeight: 20
                                                }}>
                                                    {tier.description}
                                                </ThemedText>
                                            )}
                                        </VStack>
                                        <VStack className="items-end">
                                            <ThemedText style={{
                                                fontSize: 20,
                                                fontWeight: '700',
                                                color: tier.price === 0 ? colors.success : colors.primary,
                                                marginBottom: 4
                                            }}>
                                                {tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}`}
                                            </ThemedText>
                                            <Badge
                                                size="sm"
                                                variant="outline"
                                                action={tier.available > 10 ? "success" : tier.available > 0 ? "warning" : "error"}
                                                style={{
                                                    backgroundColor: tier.available > 10
                                                        ? (mode === "light" ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.2)")
                                                        : tier.available > 0
                                                            ? (mode === "light" ? "rgba(245, 158, 11, 0.1)" : "rgba(251, 191, 36, 0.2)")
                                                            : (mode === "light" ? "rgba(239, 68, 68, 0.1)" : "rgba(248, 113, 113, 0.2)"),
                                                    borderColor: tier.available > 10
                                                        ? (mode === "light" ? "rgba(34, 197, 94, 0.5)" : "rgba(34, 197, 94, 0.5)")
                                                        : tier.available > 0
                                                            ? (mode === "light" ? "rgba(245, 158, 11, 0.5)" : "rgba(251, 191, 36, 0.5)")
                                                            : (mode === "light" ? "rgba(239, 68, 68, 0.5)" : "rgba(248, 113, 113, 0.5)"),
                                                    borderRadius: 12,
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 4,
                                                }}
                                            >
                                                <BadgeText style={{ fontSize: 12, fontWeight: "600" }}>
                                                    {tier.available - (selectedTickets.find(s => s.tierId === tier.id)?.quantity || 0)} available
                                                </BadgeText>
                                            </Badge>
                                        </VStack>
                                    </HStack>

                                    {tier.available > 0 && (
                                        <VStack space="md">
                                            <View style={{
                                                height: 1,
                                                backgroundColor: colors.borderLight,
                                                marginVertical: 4
                                            }} />

                                            <HStack className="justify-between items-center">
                                                <VStack>
                                                    <ThemedText style={{
                                                        fontSize: 14,
                                                        fontWeight: '500',
                                                        color: colors.textSecondary,
                                                        marginBottom: 4
                                                    }}>
                                                        Quantity
                                                    </ThemedText>
                                                    <HStack className="items-center" space="md">
                                                        <TouchableOpacity
                                                            onPress={() => handleQuantityChange(tier.id, -1)}
                                                            disabled={quantity === 0}
                                                            style={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 18,
                                                                backgroundColor: quantity === 0 ? colors.surface : colors.primary,
                                                                opacity: quantity === 0 ? 0.5 : 1,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                shadowColor: quantity === 0 ? 'transparent' : (mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)"),
                                                                shadowOffset: { width: 0, height: 2 },
                                                                shadowOpacity: 0.1,
                                                                shadowRadius: 4,
                                                                elevation: quantity === 0 ? 0 : 2,
                                                            }}
                                                        >
                                                            <Icon as={Minus} size="sm" color={quantity === 0 ? colors.textTertiary : colors.primaryText} />
                                                        </TouchableOpacity>

                                                        <View style={{
                                                            minWidth: 60,
                                                            paddingHorizontal: 16,
                                                            paddingVertical: 8,
                                                            borderRadius: 12,
                                                            backgroundColor: colors.surface,
                                                            borderWidth: 1,
                                                            borderColor: colors.borderLight,
                                                            alignItems: 'center'
                                                        }}>
                                                            <ThemedText style={{
                                                                fontSize: 18,
                                                                fontWeight: '600',
                                                                color: colors.text
                                                            }}>
                                                                {quantity}
                                                            </ThemedText>
                                                        </View>

                                                        <TouchableOpacity
                                                            onPress={() => handleQuantityChange(tier.id, 1)}
                                                            disabled={quantity >= tier.available}
                                                            style={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 18,
                                                                backgroundColor: quantity >= tier.available ? colors.surface : colors.primary,
                                                                opacity: quantity >= tier.available ? 0.5 : 1,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                shadowColor: quantity >= tier.available ? 'transparent' : (mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)"),
                                                                shadowOffset: { width: 0, height: 2 },
                                                                shadowOpacity: 0.1,
                                                                shadowRadius: 4,
                                                                elevation: quantity >= tier.available ? 0 : 2,
                                                            }}
                                                        >
                                                            <Icon as={Plus} size="sm" color={quantity >= tier.available ? colors.textTertiary : colors.primaryText} />
                                                        </TouchableOpacity>
                                                    </HStack>
                                                </VStack>

                                                {quantity > 0 && (
                                                    <VStack className="items-end">
                                                        <ThemedText style={{
                                                            fontSize: 14,
                                                            fontWeight: '500',
                                                            color: colors.textSecondary,
                                                            marginBottom: 4
                                                        }}>
                                                            Subtotal
                                                        </ThemedText>
                                                        <ThemedText style={{
                                                            fontSize: 20,
                                                            fontWeight: '700',
                                                            color: colors.primary
                                                        }}>
                                                            ${(tier.price * quantity).toFixed(2)}
                                                        </ThemedText>
                                                    </VStack>
                                                )}
                                            </HStack>
                                        </VStack>
                                    )}

                                    {tier.available === 0 && (
                                        <Badge
                                            size="md"
                                            variant="outline"
                                            action="error"
                                            className="self-center"
                                            style={{
                                                backgroundColor: mode === "light" ? "rgba(239, 68, 68, 0.1)" : "rgba(248, 113, 113, 0.2)",
                                                borderColor: mode === "light" ? "rgba(239, 68, 68, 0.5)" : "rgba(248, 113, 113, 0.5)",
                                                borderRadius: 12,
                                                paddingHorizontal: 16,
                                                paddingVertical: 8,
                                            }}
                                        >
                                            <BadgeText style={{ fontSize: 14, fontWeight: "600" }}>Sold Out</BadgeText>
                                        </Badge>
                                    )}
                                </VStack>
                            </Card>
                        );
                    })}
                </VStack>

                {/* Summary and Continue Button */}
                {totalQuantity > 0 && (
                    <Card style={{
                        backgroundColor: colors.cardElevated,
                        shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.4)",
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.2,
                        shadowRadius: 16,
                        elevation: 12,
                        borderWidth: 1,
                        borderColor: colors.primary,
                        borderRadius: 16,
                        padding: 20,
                    }}>
                        <VStack space="lg">
                            <VStack space="md">
                                <HStack className="justify-between items-center">
                                    <ThemedText style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: colors.textSecondary
                                    }}>
                                        Total Tickets:
                                    </ThemedText>
                                    <ThemedText style={{
                                        fontSize: 18,
                                        fontWeight: '700',
                                        color: colors.text
                                    }}>
                                        {totalQuantity}
                                    </ThemedText>
                                </HStack>
                                <HStack className="justify-between items-center">
                                    <ThemedText style={{
                                        fontSize: 18,
                                        fontWeight: '600',
                                        color: colors.text
                                    }}>
                                        Total Price:
                                    </ThemedText>
                                    <ThemedText style={{
                                        fontSize: 24,
                                        fontWeight: '700',
                                        color: totalPrice === 0 ? colors.success : colors.primary
                                    }}>
                                        {totalPrice === 0 ? 'Free' : `$${totalPrice.toFixed(2)}`}
                                    </ThemedText>
                                </HStack>
                            </VStack>

                            <View style={{
                                height: 1,
                                backgroundColor: colors.borderLight,
                                marginVertical: 4
                            }} />

                            <ThemedButton
                                disabled={isLoading}
                                title={isLoading ? 'Loading...' : totalPrice === 0 ? '🎫 Reserve Free Tickets' : '💳 Continue to Payment'}
                                onPress={handleProceedToPayment}
                                style={{
                                    backgroundColor: colors.primary,
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.4)",
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 8,
                                    elevation: 6,
                                }}
                            />
                        </VStack>
                    </Card>
                )}
            </VStack>
            <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading size="md">
                            Please sign in to continue
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>                        
                        <Text size='sm' className='mb-4'>
                            You must be signed in to purchase tickets.
                        </Text>
                        <Button size="sm" onPress={() => {
                            handleClose();
                            router.push('/sign-in');
                        }}>
                            <ButtonText>Sign in</ButtonText>
                        </Button>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </ThemedView>
    );
};

export default TicketSelectionComponent; 