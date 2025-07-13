import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import type { FeaturedGuest } from "@/types";
import { Plus, Trash2, User } from "lucide-react";
import React, { useState } from "react";
import { View } from "react-native";
import CustomImageUploader from "./CustomImageUploader";
import CustomInput from "./CustomInput";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
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
        <ThemedView>
            <ThemedText size="xl" bold className="mb-3">
                Featured Guests
            </ThemedText>

            <ThemedText size="sm" className="mb-4 opacity-70">
                Add speakers, moderators, or other notable guests for your event
            </ThemedText>

            {value.map((guest) => (
                <View key={guest.id} className="border rounded-lg p-4 mb-4" style={{ borderColor: Colors[mode].border }}>
                    <View className="flex-row justify-between items-center mb-3">
                        <ThemedText size="md" bold>
                            {guest.name || "New Guest"}
                        </ThemedText>
                        <View className="flex-row gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                action="secondary"
                                onPress={() => toggleEdit(guest.id)}
                            >
                                <ButtonText>{editingGuest === guest.id ? "Done" : "Edit"}</ButtonText>
                            </Button>
                            <Button
                                size="sm"
                                variant="solid"
                                action="negative"
                                onPress={() => removeGuest(guest.id)}
                            >
                                <ButtonIcon as={Trash2} size="xs" color={"white"} />
                            </Button>
                        </View>
                    </View>

                    {editingGuest === guest.id && (
                        <View className="gap-3">
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
                            />

                            <ThemedText size="md" bold className="mt-2">
                                Social Media
                            </ThemedText>

                            <CustomInput
                                label="Twitter"
                                value={guest.socialMedia?.twitter || ""}
                                onChangeText={(value) => updateGuestSocialMedia(guest.id, "twitter", value)}
                                onBlur={() => { }}
                                placeholder="https://twitter.com/username"
                                colors={Colors[mode]}
                            />

                            <CustomInput
                                label="LinkedIn"
                                value={guest.socialMedia?.linkedin || ""}
                                onChangeText={(value) => updateGuestSocialMedia(guest.id, "linkedin", value)}
                                onBlur={() => { }}
                                placeholder="https://linkedin.com/in/username"
                                colors={Colors[mode]}
                            />

                            <CustomInput
                                label="Instagram"
                                value={guest.socialMedia?.instagram || ""}
                                onChangeText={(value) => updateGuestSocialMedia(guest.id, "instagram", value)}
                                onBlur={() => { }}
                                placeholder="https://instagram.com/username"
                                colors={Colors[mode]}
                            />
                        </View>
                    )}

                    {editingGuest !== guest.id && (
                        <View className="gap-2">
                            {guest.title && (
                                <ThemedText size="sm" className="opacity-70">
                                    {guest.title}
                                </ThemedText>
                            )}
                            {guest.organization && (
                                <ThemedText size="sm" className="opacity-70">
                                    {guest.organization}
                                </ThemedText>
                            )}
                            {guest.bio && (
                                <ThemedText size="sm" className="opacity-70">
                                    {guest.bio}
                                </ThemedText>
                            )}
                        </View>
                    )}
                </View>
            ))}

            <Button
                size="sm"
                variant="outline"
                action="primary"
                onPress={addGuest}
            >
                <ButtonIcon as={Plus} size="xs" />
                <ButtonText>Add Featured Guest</ButtonText>
            </Button>
        </ThemedView>
    );
}; 