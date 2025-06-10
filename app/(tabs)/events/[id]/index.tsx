import Container from "@/components/Container";
import { ExternalLink } from "@/components/ExternalLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Badge, BadgeText } from "@/components/ui/badge";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Colors, getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { fetchEvent } from "@/services/event";
import { useQuery } from "@tanstack/react-query";
import { ExternalPathString, useLocalSearchParams } from "expo-router";
import { Calendar, Clock, ExternalLink as ExternalLinkIcon, MapPin, Tag } from "lucide-react-native";
import { Image, ScrollView, View } from "react-native";

export default function EventScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { mode: colorScheme } = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];

    const { data, isLoading, error } = useQuery({
        queryKey: ["event", id],
        queryFn: () => fetchEvent(id)
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Container>
            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <Spinner size="large" />
                </View>
            ) : error ? (
                <View className="flex-1 justify-center items-center px-4">
                    <ThemedText colorVariant="error" className="text-center">
                        Error: {error.message}
                    </ThemedText>
                </View>
            ) : !data ? (
                <View className="flex-1 justify-center items-center">
                    <ThemedText colorVariant="textTertiary">No event found</ThemedText>
                </View>
            ) : (
                <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Event Image */}
                    {data.image && (
                        <View className="w-full h-64 mb-6">
                            <Image
                                source={{ uri: data.image }}
                                className="w-full h-full"
                                style={{ borderRadius: 12 }}
                                resizeMode="cover"
                            />
                        </View>
                    )}

                    <View className="px-6">
                        {/* Title and Format Badge */}
                        <ThemedView className="mb-4">
                            <HStack className="gap-2 mb-2" style={{ flexWrap: "wrap" }} >
                                <Badge key={data.access} size="lg" variant="solid" className="p-0">
                                    <BadgeText className="px-2 py-1 rounded-md" style={{ color: getColor("accentText", colorScheme), backgroundColor: getColor("tint", colorScheme) }}>{data.access}</BadgeText>
                                </Badge>
                                <Badge key={data.format} size="lg" variant="solid" className="p-0">
                                    <BadgeText className="px-2 py-1 rounded-md" style={{ color: getColor("accentText", colorScheme), backgroundColor: getColor("accent", colorScheme) }}>{data.format}</BadgeText>
                                </Badge>
                            </HStack>
                            
                            <ThemedText className="text-2xl font-bold leading-tight mb-2">
                                {data.title}
                            </ThemedText>
                        </ThemedView>

                        {/* Date and Time */}
                        <ThemedView 
                            className="p-2 rounded-xl mb-2"
                        >
                            <View className="flex-row items-start mb-3">
                                <Calendar size={20} color={colors.primary} style={{ marginTop: 2, marginRight: 12 }} />
                                <View className="flex-1">
                                    <ThemedText className="font-semibold mb-1">
                                        {formatDate(data.startDate)}
                                    </ThemedText>
                                    <View className="flex-row items-center">
                                        <Clock size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
                                        <ThemedText colorVariant="textSecondary" className="text-sm">
                                            {formatTime(data.startDate)} - {formatTime(data.endDate)}
                                        </ThemedText>
                                    </View>
                                    {data.startDate.split('T')[0] !== data.endDate.split('T')[0] && (
                                        <ThemedText colorVariant="textSecondary" className="text-sm mt-1">
                                            Ends: {formatDate(data.endDate)}
                                        </ThemedText>
                                    )}
                                </View>
                            </View>
                        </ThemedView>

                        {/* Location */}
                        <ThemedView 
                            className="p-2 rounded-xl mb-2"
                        >
                            <View className="flex-row items-start">
                                <MapPin size={20} color={colors.primary} style={{ marginTop: 2, marginRight: 12 }} />
                                <View className="flex-1">
                                    <ThemedText className="font-semibold mb-1">Location</ThemedText>
                                    <ThemedText colorVariant="textSecondary">
                                        {data.location}
                                    </ThemedText>
                                </View>
                            </View>
                        </ThemedView>

                        {/* Disciplines */}
                        <ThemedView 
                            className="p-2 rounded-xl mb-2"
                        >
                            <View className="flex-row items-start mb-3">
                                <Tag size={20} color={colors.primary} style={{ marginTop: 2, marginRight: 12 }} />
                                <ThemedText className="font-semibold">Disciplines</ThemedText>
                            </View>
                            <HStack className="gap-2 mb-2" style={{ flexWrap: "wrap" }} >
                                {data.disciplines.map((discipline) => (
                                    <Badge key={discipline} size="lg" variant="solid" className="p-0">
                                        <BadgeText className="px-2 py-1 rounded-md" style={{ color: getColor("info", colorScheme), backgroundColor: getColor("infoBg", colorScheme) }}>{discipline}</BadgeText>
                                    </Badge>
                                ))}
                            </HStack>
                        </ThemedView>

                        {/* Description */}
                        <ThemedView 
                            className="p-2 mb-4"
                        >
                            <ThemedText className="font-semibold mb-3">About this Event</ThemedText>
                            <ThemedText colorVariant="textSecondary">
                                {data.description}
                            </ThemedText>
                        </ThemedView>

                        {/* Additional Note */}
                        {data.note && (
                            <View 
                                className="p-4 rounded-xl mb-4"
                                style={{ 
                                    backgroundColor: colors.infoBg,
                                    borderWidth: 1,
                                    borderColor: colors.infoBorder
                                }}
                            >
                                <ThemedText className="font-semibold mb-2" style={{ color: colors.info }}>
                                    Additional Information
                                </ThemedText>
                                <ThemedText style={{ color: colors.info }}>
                                    {data.note}
                                </ThemedText>
                            </View>
                        )}

                        {/* Source Link */}
                        {data.source && (
                            <ExternalLink
                                href={data.source as ExternalPathString}
                                className="p-2 rounded-xl"
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <ExternalLinkIcon size={20} color={colors.primary} style={{ marginRight: 12 }} />
                                        <View className="flex-1">
                                            <ThemedText className="font-semibold mb-1">
                                                View Original Source
                                            </ThemedText>
                                            <ThemedText 
                                                colorVariant="textSecondary" 
                                                className="text-sm"
                                                numberOfLines={1}
                                            >
                                                {data.source}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>
                            </ExternalLink>
                        )}

                        {/* Metadata */}
                        {(data.createdAt || data.updatedAt) && (
                            <View className="mt-6 pt-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                                {data.createdAt && (
                                    <ThemedText colorVariant="textTertiary" className="text-xs mb-1">
                                        Created: {formatDate(data.createdAt)}
                                    </ThemedText>
                                )}
                                {data.updatedAt && (
                                    <ThemedText colorVariant="textTertiary" className="text-xs">
                                        Last updated: {formatDate(data.updatedAt)}
                                    </ThemedText>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>
            )}
        </Container>
    );
}