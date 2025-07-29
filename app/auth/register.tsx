import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !address || !city || !state) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Erro', 'Por favor, aceite os Termos de Serviço e Política de Privacidade');
      return;
    }

    if (state.length !== 2) {
      Alert.alert('Erro', 'Por favor, digite o estado com 2 letras (ex: MG)');
      return;
    }
    
    try {
      await register({
        name: fullName,
        email,
        password,
        location: {
          address,
          city,
          state: state.toUpperCase(),
        }
      });
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      Alert.alert('Erro', errorMessage);
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up');
    // Implement Google authentication
  };

  const handleAppleSignUp = () => {
    console.log('Apple sign up');
    // Implement Apple authentication
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Cadastrar</Text>
              <Text style={styles.subtitle}>Nome completo</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <ThemedTextInput
                  style={styles.input}
                  placeholder="Digite seu nome completo"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <ThemedTextInput
                  style={styles.input}
                  placeholder="Digite seu endereço de email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.passwordContainer}>
                  <ThemedTextInput
                    style={styles.passwordInput}
                    variant="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Endereço</Text>
                <ThemedTextInput
                  style={styles.input}
                  placeholder="Digite seu endereço completo"
                  value={address}
                  onChangeText={setAddress}
                  autoComplete="street-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Cidade</Text>
                <ThemedTextInput
                  style={styles.input}
                  placeholder="Digite sua cidade"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Estado (UF)</Text>
                <ThemedTextInput
                  style={styles.input}
                  placeholder="Ex: MG"
                  value={state}
                  onChangeText={setState}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                >
                  <View style={[styles.checkbox, agreeTerms && styles.checkedBox]}>
                    {agreeTerms && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text style={styles.termsText}>
                    Ao se cadastrar, você concorda com nossos{' '}
                    <Text style={styles.linkText}>Termos de Serviço</Text>
                    {' '}e{' '}
                    <Text style={styles.linkText}>Política de Privacidade</Text>.
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.signUpButton, isLoading && styles.disabledButton]} 
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? 'Criando conta...' : 'Criar conta'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.googleButtonText}>Continuar com Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignUp}>
                <Ionicons name="logo-apple" size={20} color="#000" />
                <Text style={styles.appleButtonText}>Continuar com Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Já tem uma conta?{' '}
                <Text
                  style={styles.signInText}
                  onPress={() => router.push('/auth/login' as any)}
                >
                  Entrar
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    // Styles específicos que sobrescrevem o ThemedTextInput
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#2d5016',
    borderColor: '#2d5016',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  linkText: {
    color: '#2d5016',
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  googleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  appleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  signInText: {
    color: '#2d5016',
    fontWeight: '500',
  },
});
