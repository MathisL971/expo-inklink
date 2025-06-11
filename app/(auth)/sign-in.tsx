import Container from "@/components/Container";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { VStack } from "@/components/ui/vstack";
import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { TextInput } from "react-native";

export default function Page() {
  const { mode } = useColorScheme();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Container className="justify-center">
      <VStack className="flex-col w-2/3 sm:w-1/2 md:w-1/3 xl:w-1/4 2xl:w-1/5 self-center gap-4 items-center">
        <ThemedText colorVariant="text" size="3xl" bold>
          Sign in
        </ThemedText>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          className="px-3 py-2 rounded-md w-full"
          style={{
            backgroundColor: getColor("inputBackground", mode),
            color: getColor("inputText", mode),
          }}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          className="px-3 py-2 rounded-md w-full"
          style={{
            backgroundColor: getColor("inputBackground", mode),
            color: getColor("inputText", mode),
          }}
          onChangeText={(password) => setPassword(password)}
        />
        <ThemedButton
          title="Continue"
          action="primary"
          size="sm"
          variant="solid"
          onPress={onSignInPress}
        >
          Continue
        </ThemedButton>
        {/* <ThemedText colorVariant="textSecondary" size="sm">
          {"Don't have an account?"}
        </ThemedText>
        <ThemedButton
          title="Sign up"
          action="secondary"
          size="sm"
          variant="solid"
          onPress={() => router.navigate("/(auth)/sign-up")}
        >
          Sign up
        </ThemedButton> */}
      </VStack>
    </Container>
  );
}
