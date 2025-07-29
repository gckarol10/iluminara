import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redireciona para login se não estiver autenticado
      router.replace('/auth/login' as any);
    }
  }, [isAuthenticated, isLoading]);

  // Não renderiza nada enquanto está carregando
  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar 
        style="dark" 
        backgroundColor="#ffffff"
        translucent={Platform.OS === 'ios'}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="map" />
        <Stack.Screen name="report" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaProvider>
  );
}