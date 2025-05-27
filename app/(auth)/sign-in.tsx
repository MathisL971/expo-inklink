import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { getColor } from '@/constants/Colors'
import { useColorScheme } from '@/contexts/ColorSchemeContext'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import React from 'react'
import { TextInput, View } from 'react-native'

export default function Page() {
  const { mode } = useColorScheme();
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <ThemedView className='flex-1 flex-col items-center justify-center'>
      <View className='flex flex-col gap-3 items-center'>
        <ThemedText type='title'>Sign in</ThemedText>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          style={{
            backgroundColor: getColor('inputBackground', mode),
            color: getColor('inputText', mode),
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          style={{
            backgroundColor: getColor('inputBackground', mode),
            color: getColor('inputText', mode),
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          onChangeText={(password) => setPassword(password)}
        />
        <ThemedButton title='Continue' action='primary' size='sm' variant='solid' onPress={onSignInPress}>Continue</ThemedButton>
        <ThemedText>{"Don't have an account?"}</ThemedText>
        <ThemedButton title='Sign up' action='secondary' size='sm' variant='solid' onPress={() => router.navigate('/(auth)/sign-up')}>Sign up</ThemedButton>
      </View>
      
    </ThemedView>
  )
}