import * as ImagePicker from "expo-image-picker";
import { Camera, Upload, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "../constants/Styles";
import { Spinner } from "./ui/spinner";

export type CustomImageUploaderProps = {
  label: string;
  value?: string | { uri: string };
  onChange: (value: string | { uri: string } | "") => void;
  onImageDelete: (image: string | { uri: string }) => Promise<void>;
  onBlur: () => void;
  placeholder: string;
  error?: string;
  colors: any;
};

export default function CustomImageUploader({
  label,
  value,
  onChange,
  onBlur,
  onImageDelete,
  placeholder,
  error,
  colors,
}: CustomImageUploaderProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === "web") {
      return true;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need camera roll permissions to upload images."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    setIsSelecting(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      ...(Platform.OS === "web" && { allowsMultipleSelection: false }),
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0]);
    }
    setIsSelecting(false);
    onBlur();
  };

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      pickImage();
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need camera permissions to take photos."
      );
      return;
    }
    setIsSelecting(true);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0]);
    }
    setIsSelecting(false);
  };

  const showImageOptions = () => {
    if (Platform.OS === "web") {
      pickImage();
    } else {
      Alert.alert("Select Image", "Choose an option to add an image", [
        { text: "Camera", onPress: takePhoto },
        { text: "Photo Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const getPlaceholderText = () => {
    if (Platform.OS === "web") {
      return "Click to select image";
    }
    return "Tap to select from gallery or take photo";
  };

  // Helper to get URI from value
  const getImageUri = (val: string | { uri: string } | undefined) => {
    if (!val) return undefined;
    if (typeof val === "string") return val;
    if (val.uri) return val.uri;
    return undefined;
  };

  return (
    <View style={[styles.inputContainer, { marginBottom: 16 }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.inputBorderError : colors.inputBorder,
            shadowColor: colors.shadow,
            minHeight: value ? 200 : 120,
            padding: 12,
          },
        ]}
      >
        {value ? (
          <View style={{ flex: 1, position: "relative" }}>
            <Image
              source={{ uri: getImageUri(value) }}
              style={{
                width: "100%",
                height: 180,
                borderRadius: 8,
                backgroundColor: colors.inputBackground,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={async () => {
                try {
                  onChange("");
                  await onImageDelete(value);
                } catch (error) {
                  console.log(error);
                  onChange(value);
                }
              }}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: colors.error,
                borderRadius: 16,
                width: 32,
                height: 32,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <X size={16} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              if (isSelecting) return;
              showImageOptions();
            }}
            disabled={isSelecting}
            style={[
              {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.inputBorder,
                borderStyle: "dashed",
                borderRadius: 8,
                minHeight: 96,
              },
              Platform.OS === "web" && {
                cursor: isSelecting ? "auto" : "pointer",
              },
            ]}
          >
            {isSelecting ? (
              <View style={{ alignItems: "center" }}>
                <Spinner size="large" color={colors.primary} />
                <Text
                  style={{
                    color: colors.textSecondary,
                    marginTop: 8,
                    fontSize: 14,
                  }}
                >
                  Selecting...
                </Text>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  <Upload
                    size={24}
                    color={colors.textSecondary}
                    style={{ marginRight: 8 }}
                  />
                  {Platform.OS !== "web" && (
                    <Camera size={24} color={colors.textSecondary} />
                  )}
                </View>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  {placeholder}
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  {getPlaceholderText()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}
