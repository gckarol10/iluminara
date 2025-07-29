import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar 
        style="dark" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="map" />
        <Stack.Screen name="report" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}