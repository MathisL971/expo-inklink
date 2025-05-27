import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { getColor } from '@/constants/Colors'
import { useColorScheme } from '@/contexts/ColorSchemeContext'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as React from 'react'
import { TextInput, View } from 'react-native'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const { mode } = useColorScheme();

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log('emailAddress', emailAddress)
    console.log('password', password)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
    <ThemedView className='flex-1 flex-col items-center justify-center'>
        <View className='flex flex-col gap-3 items-center'>
          <ThemedText type='title'>Verify your email</ThemedText>
          <TextInput
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code) => setCode(code)}
            style={{
              backgroundColor: getColor('inputBackground', mode),
              color: getColor('inputText', mode),
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              width: 200
            }}
          />
          <ThemedButton title='Verify' action='primary' size='sm' variant='solid' onPress={onVerifyPress} />
        </View>
      </ThemedView>
    )
  }

  return (
    <ThemedView className='flex-1 flex-col items-center justify-center'>
      <View className='flex flex-col gap-3 items-center'>
        <ThemedText type='title'>Sign up</ThemedText>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
          style={{
            backgroundColor: getColor('inputBackground', mode),
            color: getColor('inputText', mode),
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style={{
            backgroundColor: getColor('inputBackground', mode),
            color: getColor('inputText', mode),
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        />
        <ThemedButton title='Continue' action='primary' size='sm' variant='solid' onPress={onSignUpPress} />
        <ThemedText>Already have an account?</ThemedText>
        <ThemedButton title='Sign in' action='primary' size='sm' variant='solid' onPress={() => router.navigate('/(auth)/sign-in')} />
      </View>
    </ThemedView>
  )
}