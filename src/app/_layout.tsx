
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = () => {
	return (
	<SafeAreaProvider>
		
			<RootNavigation />
			<StatusBar style="auto"/>
			{/* <Text>Ceci est un texte</Text> */}
		
	</SafeAreaProvider>
	)
}

const RootNavigation = () => {
	return (
	<Stack>
		<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
	</Stack>
	)
}

export default App