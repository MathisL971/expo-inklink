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
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { CheckCircle, Eye, EyeOff } from "lucide-react-native";
import React from "react";
import { Platform, Pressable } from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { mode } = useColorScheme();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <Container className="justify-center">
        <ThemedView className="flex-1 justify-center items-center px-4">
          <VStack className="w-full max-w-md gap-8">
            {/* Header Section */}
            <VStack className="items-center gap-2">
              <CheckCircle
                size={64}
                color={getColor("success", mode)}
                className="mb-2"
              />
              <ThemedHeading size="3xl" className="text-center">
                Check your email
              </ThemedHeading>
              <ThemedText semantic="caption" className="text-center">
                We sent a verification code to {emailAddress}
              </ThemedText>
            </VStack>

            {/* Verification Form Card */}
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
                {/* Verification Code Input */}
                <VStack className="gap-2">
                  <ThemedText semantic="body" className="font-medium">
                    Verification Code
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
                      placeholder="Enter verification code"
                      value={code}
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      autoComplete="one-time-code"
                      placeholderTextColor={getColor("inputPlaceholder", mode)}
                      style={{
                        color: getColor("inputText", mode),
                        textAlign: "center",
                        fontSize: 18,
                        letterSpacing: 2,
                      }}
                    />
                  </Input>
                </VStack>

                {/* Error Message */}
                {error && (
                  <ThemedText semantic="error" size="sm" className="text-center">
                    {error}
                  </ThemedText>
                )}

                {/* Verify Button */}
                <VStack className="gap-4">
                  <ThemedButton
                    title={loading ? "Verifying..." : "Verify Email"}
                    action="primary"
                    size="lg"
                    variant="solid"
                    onPress={onVerifyPress}
                    disabled={loading || !code}
                    style={{
                      opacity: loading || !code ? 0.6 : 1,
                    }}
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </ThemedButton>
                </VStack>
              </VStack>
            </Card>

            {/* Footer Section */}
            <VStack className="items-center gap-4">
              <ThemedText semantic="caption" className="text-center">
                Didn&apos;t receive the code?{" "}
                <ThemedText
                  semantic="link"
                  onPress={() => {
                    // Resend code logic could go here
                    console.log("Resend code");
                  }}
                  className="font-medium"
                >
                  Resend
                </ThemedText>
              </ThemedText>
            </VStack>
          </VStack>
        </ThemedView>
      </Container>
    );
  }

  return (
    <Container className="justify-center">
      <ThemedView className="flex-1 justify-center items-center px-4">
        <VStack className="w-full max-w-md gap-8">
          {/* Header Section */}
          <VStack className="items-center gap-2">
            <ThemedHeading size="3xl" className="text-center">
              Create your account
            </ThemedHeading>
            <ThemedText semantic="caption" className="text-center">
              Join us to discover and attend amazing events
            </ThemedText>
          </VStack>

          {/* Sign Up Form Card */}
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
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
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

              {/* Sign Up Button */}
              <VStack className="gap-4">
                <ThemedButton
                  title={loading ? "Creating account..." : "Create Account"}
                  action="primary"
                  size="lg"
                  variant="solid"
                  onPress={onSignUpPress}
                  disabled={loading || !emailAddress || !password}
                  style={{
                    opacity: loading || !emailAddress || !password ? 0.6 : 1,
                  }}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </ThemedButton>
              </VStack>
            </VStack>
          </Card>

          {/* Footer Section */}
          <VStack className="items-center gap-4">
            <ThemedText semantic="caption" className="text-center">
              Already have an account?{" "}
              <ThemedText
                semantic="link"
                onPress={() => router.push("/(auth)/sign-in")}
                className="font-medium"
              >
                Sign in
              </ThemedText>
            </ThemedText>
          </VStack>
        </VStack>
      </ThemedView>
    </Container>
  );
}
