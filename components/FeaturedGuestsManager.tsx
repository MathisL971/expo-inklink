import { Colors, getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import type { FeaturedGuest } from "@/types";
import { Plus, Trash2, User } from "lucide-react";
import React, { useState } from "react";
import { View } from "react-native";
import CustomImageUploader from "./CustomImageUploader";
import CustomInput from "./CustomInput";
import { ThemedText } from "./ThemedText";
import { Button, ButtonIcon, ButtonText } from "./ui/button";

interface FeaturedGuestsManagerProps {
    value: FeaturedGuest[];
    onChange: (guests: FeaturedGuest[]) => void;
    onImageDelete?: (image: string | { uri: string }) => void;
}

export const FeaturedGuestsManager = ({
    value,
    onChange,
    onImageDelete,
}: FeaturedGuestsManagerProps) => {
    const { mode } = useColorScheme();
    const [editingGuest, setEditingGuest] = useState<string | null>(null);

    const addGuest = () => {
        const newGuest: FeaturedGuest = {
            id: Date.now().toString(),
            name: "",
            title: "",
            bio: "",
            image: "",
            organization: "",
            website: "",
            socialMedia: {
                twitter: "",
                linkedin: "",
                instagram: "",
            },
        };
        onChange([...value, newGuest]);
        setEditingGuest(newGuest.id);
    };

    const updateGuest = (id: string, field: keyof FeaturedGuest, fieldValue: any) => {
        const updatedGuests = value.map((guest) =>
            guest.id === id ? { ...guest, [field]: fieldValue } : guest
        );
        onChange(updatedGuests);
    };

    const updateGuestSocialMedia = (id: string, platform: string, url: string) => {
        const updatedGuests = value.map((guest) =>
            guest.id === id
                ? {
                    ...guest,
                    socialMedia: {
                        ...guest.socialMedia,
                        [platform]: url,
                    },
                }
                : guest
        );
        onChange(updatedGuests);
    };

    const removeGuest = (id: string) => {
        const guestToRemove = value.find((guest) => guest.id === id);
        if (guestToRemove?.image && onImageDelete) {
            onImageDelete(guestToRemove.image);
        }
        onChange(value.filter((guest) => guest.id !== id));
    };

    const toggleEdit = (id: string) => {
        setEditingGuest(editingGuest === id ? null : id);
    };

    return (
        <View style={{ gap: 20 }}>
            <View style={{ gap: 8 }}>
                <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                    Featured Guests
                </ThemedText>

                <ThemedText
                    colorVariant="textSecondary"
                    style={{ fontSize: 14, lineHeight: 20 }}
                >
                    Add speakers, moderators, or other notable guests for your event
                </ThemedText>
            </View>

            {value.length > 0 && (
                <View style={{ gap: 16 }}>
                    {value.map((guest) => (
                        <View
                            key={guest.id}
                            style={{
                                backgroundColor: getColor("backgroundElevated", mode),
                                borderRadius: 12,
                                padding: 20,
                                borderWidth: 1,
                                borderColor: getColor("borderLight", mode),
                                shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(0, 0, 0, 0.2)",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 2,
                                gap: 16,
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                                    {guest.name || "New Guest"}
                                </ThemedText>
                                <View style={{ flexDirection: "row", gap: 8 }}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onPress={() => toggleEdit(guest.id)}
                                        style={{
                                            borderColor: getColor("borderLight", mode),
                                            backgroundColor: getColor("background", mode),
                                        }}
                                    >
                                        <ButtonText style={{ fontSize: 13, fontWeight: "500" }}>
                                            {editingGuest === guest.id ? "Done" : "Edit"}
                                        </ButtonText>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        action="negative"
                                        onPress={() => removeGuest(guest.id)}
                                        style={{ borderColor: getColor("error", mode) }}
                                    >
                                        <ButtonIcon as={Trash2} size="sm" />
                                    </Button>
                                </View>
                            </View>

                            {editingGuest === guest.id && (
                                <View style={{ gap: 16 }}>
                                    <CustomInput
                                        label="Name *"
                                        value={guest.name}
                                        onChangeText={(value) => updateGuest(guest.id, "name", value)}
                                        onBlur={() => { }}
                                        placeholder="Enter guest name"
                                        colors={Colors[mode]}
                                        Icon={User}
                                    />

                                    <CustomInput
                                        label="Title/Position"
                                        value={guest.title || ""}
                                        onChangeText={(value) => updateGuest(guest.id, "title", value)}
                                        onBlur={() => { }}
                                        placeholder="e.g., Professor, CEO, Director"
                                        colors={Colors[mode]}
                                    />

                                    <CustomInput
                                        label="Organization"
                                        value={guest.organization || ""}
                                        onChangeText={(value) => updateGuest(guest.id, "organization", value)}
                                        onBlur={() => { }}
                                        placeholder="e.g., University of California, Tech Corp"
                                        colors={Colors[mode]}
                                    />

                                    <CustomInput
                                        label="Bio"
                                        value={guest.bio || ""}
                                        onChangeText={(value) => updateGuest(guest.id, "bio", value)}
                                        onBlur={() => { }}
                                        placeholder="Brief biography or description"
                                        colors={Colors[mode]}
                                        multiline
                                    />

                                    <CustomImageUploader
                                        label="Guest Photo"
                                        value={guest.image}
                                        placeholder="Upload guest photo"
                                        colors={Colors[mode]}
                                        onChange={(value) => updateGuest(guest.id, "image", value)}
                                        onBlur={() => { }}
                                        onImageDelete={onImageDelete ? async (image) => onImageDelete(image) : async () => { }}
                                    />

                                    <CustomInput
                                        label="Website"
                                        value={guest.website || ""}
                                        onChangeText={(value) => updateGuest(guest.id, "website", value)}
                                        onBlur={() => { }}
                                        placeholder="https://example.com"
                                        colors={Colors[mode]}
                                        keyboardType="url"
                                    />

                                    <View style={{ gap: 12 }}>
                                        <ThemedText style={{ fontSize: 15, fontWeight: "600" }}>
                                            Social Media
                                        </ThemedText>

                                        <View style={{ gap: 12 }}>
                                            <CustomInput
                                                label="Twitter"
                                                value={guest.socialMedia?.twitter || ""}
                                                onChangeText={(value) => updateGuestSocialMedia(guest.id, "twitter", value)}
                                                onBlur={() => { }}
                                                placeholder="https://twitter.com/username"
                                                colors={Colors[mode]}
                                                keyboardType="url"
                                            />

                                            <CustomInput
                                                label="LinkedIn"
                                                value={guest.socialMedia?.linkedin || ""}
                                                onChangeText={(value) => updateGuestSocialMedia(guest.id, "linkedin", value)}
                                                onBlur={() => { }}
                                                placeholder="https://linkedin.com/in/username"
                                                colors={Colors[mode]}
                                                keyboardType="url"
                                            />

                                            <CustomInput
                                                label="Instagram"
                                                value={guest.socialMedia?.instagram || ""}
                                                onChangeText={(value) => updateGuestSocialMedia(guest.id, "instagram", value)}
                                                onBlur={() => { }}
                                                placeholder="https://instagram.com/username"
                                                colors={Colors[mode]}
                                                keyboardType="url"
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                            {editingGuest !== guest.id && (
                                <View style={{ gap: 6 }}>
                                    {guest.title && (
                                        <ThemedText
                                            colorVariant="textSecondary"
                                            style={{ fontSize: 14, fontWeight: "500" }}
                                        >
                                            {guest.title}
                                        </ThemedText>
                                    )}
                                    {guest.organization && (
                                        <ThemedText
                                            colorVariant="textSecondary"
                                            style={{ fontSize: 14 }}
                                        >
                                            {guest.organization}
                                        </ThemedText>
                                    )}
                                    {guest.bio && (
                                        <ThemedText
                                            colorVariant="textTertiary"
                                            style={{ fontSize: 13, lineHeight: 18, marginTop: 4 }}
                                            numberOfLines={3}
                                        >
                                            {guest.bio}
                                        </ThemedText>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}

            <Button
                onPress={addGuest}
                style={{
                    backgroundColor: getColor("backgroundElevated", mode),
                    borderWidth: 1,
                    borderColor: getColor("borderLight", mode),
                    borderRadius: 8,
                    paddingVertical: 12,
                    shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(0, 0, 0, 0.2)",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                }}
            >
                <ButtonIcon as={Plus} size="sm" color={getColor("icon", mode)} />
                <ButtonText style={{ color: getColor("text", mode), fontWeight: "500", fontSize: 14 }}>
                    Add Featured Guest
                </ButtonText>
            </Button>
        </View>
    );
}; 