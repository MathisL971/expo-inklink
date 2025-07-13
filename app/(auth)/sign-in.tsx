import Container from "@/components/Container";
import { ThemedButton } from "@/components/ThemedButton";
import ThemedHeading from "@/components/ThemedHeading";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/ui/card";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React from "react";
import { Platform, Pressable } from "react-native";

export default function Page() {
  const { mode } = useColorScheme();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError("Sign in failed. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="justify-center">
      <ThemedView className="flex-1 justify-center items-center px-4">
        <VStack className="w-full max-w-md gap-8">
          {/* Header Section */}
          <VStack className="items-center gap-2">
            <ThemedHeading size="3xl" className="text-center">
              Welcome back
            </ThemedHeading>
            <ThemedText semantic="caption" className="text-center">
              Sign in to your account to continue
            </ThemedText>
          </VStack>

          {/* Sign In Form Card */}
          <Card
            size="lg"
            variant="elevated"
            style={{
              backgroundColor: getColor("card", mode),
              borderColor: getColor("cardBorder", mode),
              borderWidth: Platform.OS === "web" ? 1 : 0,
              shadowColor: getColor("shadow", mode),
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <VStack className="gap-6">
              {/* Email Input */}
              <VStack className="gap-2">
                <ThemedText semantic="body" className="font-medium">
                  Email Address
                </ThemedText>
                <Input
                  variant="outline"
                  size="lg"
                  style={{
                    backgroundColor: getColor("inputBackground", mode),
                    borderColor: getColor("inputBorder", mode),
                  }}
                >
                  <InputField
                    placeholder="Enter your email"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    placeholderTextColor={getColor("inputPlaceholder", mode)}
                    style={{
                      color: getColor("inputText", mode),
                    }}
                  />
                </Input>
              </VStack>

              {/* Password Input */}
              <VStack className="gap-2">
                <ThemedText semantic="body" className="font-medium">
                  Password
                </ThemedText>
                <Input
                  variant="outline"
                  size="lg"
                  style={{
                    backgroundColor: getColor("inputBackground", mode),
                    borderColor: getColor("inputBorder", mode),
                  }}
                >
                  <InputField
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="current-password"
                    placeholderTextColor={getColor("inputPlaceholder", mode)}
                    style={{
                      color: getColor("inputText", mode),
                    }}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-2"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={getColor("icon", mode)} />
                    ) : (
                      <Eye size={20} color={getColor("icon", mode)} />
                    )}
                  </Pressable>
                </Input>
              </VStack>

              {/* Error Message */}
              {error && (
                <ThemedText semantic="error" size="sm" className="text-center">
                  {error}
                </ThemedText>
              )}

              {/* Sign In Button */}
              <VStack className="gap-4">
                <ThemedButton
                  title={loading ? "Signing in..." : "Sign In"}
                  action="primary"
                  size="lg"
                  variant="solid"
                  onPress={onSignInPress}
                  disabled={loading || !emailAddress || !password}
                  style={{
                    opacity: loading || !emailAddress || !password ? 0.6 : 1,
                  }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </ThemedButton>
              </VStack>
            </VStack>
          </Card>

          {/* Footer Section */}
          <VStack className="items-center gap-4">
            <ThemedText semantic="caption" className="text-center">
              Don&apos;t have an account?{" "}
              <ThemedText
                semantic="link"
                onPress={() => router.push("/(auth)/sign-up")}
                className="font-medium"
              >
                Sign up
              </ThemedText>
            </ThemedText>
          </VStack>
        </VStack>
      </ThemedView>
    </Container>
  );
}
