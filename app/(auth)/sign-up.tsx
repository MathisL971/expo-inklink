import { Redirect } from "expo-router";
import * as React from "react";

export default function SignUpScreen() {
  return <Redirect href="/" />;

  //   const { isLoaded, signUp, setActive } = useSignUp();

  //   const router = useRouter();

  //   const { mode } = useColorScheme();

  //   const [emailAddress, setEmailAddress] = React.useState("");
  //   const [password, setPassword] = React.useState("");
  //   const [pendingVerification, setPendingVerification] = React.useState(false);
  //   const [code, setCode] = React.useState("");

  //   // Handle submission of sign-up form
  //   const onSignUpPress = async () => {
  //     if (!isLoaded) return;

  //     console.log("emailAddress", emailAddress);
  //     console.log("password", password);

  //     // Start sign-up process using email and password provided
  //     try {
  //       await signUp.create({
  //         emailAddress,
  //         password,
  //       });

  //       // Send user an email with verification code
  //       await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

  //       // Set 'pendingVerification' to true to display second form
  //       // and capture OTP code
  //       setPendingVerification(true);
  //     } catch (err) {
  //       // See https://clerk.com/docs/custom-flows/error-handling
  //       // for more info on error handling
  //       console.error(JSON.stringify(err, null, 2));
  //     }
  //   };

  //   // Handle submission of verification form
  //   const onVerifyPress = async () => {
  //     if (!isLoaded) return;

  //     try {
  //       // Use the code the user provided to attempt verification
  //       const signUpAttempt = await signUp.attemptEmailAddressVerification({
  //         code,
  //       });

  //       // If verification was completed, set the session to active
  //       // and redirect the user
  //       if (signUpAttempt.status === "complete") {
  //         await setActive({ session: signUpAttempt.createdSessionId });
  //         router.replace("/");
  //       } else {
  //         // If the status is not complete, check why. User may need to
  //         // complete further steps.
  //         console.error(JSON.stringify(signUpAttempt, null, 2));
  //       }
  //     } catch (err) {
  //       // See https://clerk.com/docs/custom-flows/error-handling
  //       // for more info on error handling
  //       console.error(JSON.stringify(err, null, 2));
  //     }
  //   };

  //   if (pendingVerification) {
  //     return (
  //       <Container className="justify-center">
  //         <VStack className="flex-col w-2/3 sm:w-1/2 md:w-1/3 xl:w-1/4 2xl:w-1/5 self-center gap-4 items-center">
  //           <ThemedText colorVariant="text" size="3xl" bold>
  //             Verify your email
  //           </ThemedText>
  //           <TextInput
  //             value={code}
  //             placeholder="Enter your verification code"
  //             onChangeText={(code) => setCode(code)}
  //             className="px-3 py-2 rounded-md w-full border"
  //             style={{
  //               backgroundColor: getColor("inputBackground", mode),
  //               color: getColor("inputText", mode),
  //             }}
  //           />
  //           <ThemedButton
  //             title="Verify"
  //             action="primary"
  //             size="sm"
  //             variant="solid"
  //             onPress={onVerifyPress}
  //           />
  //         </VStack>
  //       </Container>
  //     );
  //   }

  //   return (
  //     <Container className="justify-center">
  //       <VStack className="flex-col w-2/3 sm:w-1/2 md:w-1/3 xl:w-1/4 2xl:w-1/5 self-center gap-4 items-center">
  //         <ThemedText colorVariant="text" size="3xl" bold>
  //           Sign up
  //         </ThemedText>
  //         <TextInput
  //           autoCapitalize="none"
  //           value={emailAddress}
  //           placeholder="Enter email"
  //           onChangeText={(email) => setEmailAddress(email)}
  //           className="px-3 py-2 rounded-md w-full"
  //           style={{
  //             backgroundColor: getColor("inputBackground", mode),
  //             color: getColor("inputText", mode),
  //           }}
  //         />
  //         <TextInput
  //           value={password}
  //           placeholder="Enter password"
  //           secureTextEntry={true}
  //           onChangeText={(password) => setPassword(password)}
  //           className="px-3 py-2 rounded-md w-full"
  //           style={{
  //             backgroundColor: getColor("inputBackground", mode),
  //             color: getColor("inputText", mode),
  //           }}
  //         />
  //         <ThemedButton
  //           title="Continue"
  //           action="primary"
  //           size="sm"
  //           variant="solid"
  //           onPress={onSignUpPress}
  //         />
  //         <ThemedText colorVariant="textSecondary" size="sm">
  //           Already have an account?
  //         </ThemedText>
  //         <ThemedButton
  //           title="Sign in"
  //           action="primary"
  //           size="sm"
  //           variant="solid"
  //           onPress={() => router.navigate("/(auth)/sign-in")}
  //         />
  //       </VStack>
  //     </Container>
  //   );
}
