import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { ThemedView } from '../../components/ThemedView';
import { useAuth } from '../../hooks/useAuth';
import ApiService from '../../services/ApiService';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    // Validação básica
    if (!profileData.name.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await ApiService.updateProfile({
        name: profileData.name.trim(),
      });

      // Atualizar o contexto de autenticação
      updateUser(updatedUser);

      Alert.alert(
        'Sucesso',
        'Perfil atualizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert(
        'Erro',
        'Não foi possível atualizar o perfil. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Validações
    if (!passwordData.currentPassword.trim()) {
      Alert.alert('Erro', 'Por favor, informe a senha atual');
      return;
    }
    if (!passwordData.newPassword.trim()) {
      Alert.alert('Erro', 'Por favor, informe a nova senha');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Erro', 'A confirmação da senha não confere');
      return;
    }

    setLoading(true);
    try {
      await ApiService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Limpar formulário
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      Alert.alert(
        'Sucesso',
        'Senha atualizada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => setActiveTab('profile'),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      Alert.alert(
        'Erro',
        'Não foi possível atualizar a senha. Verifique se a senha atual está correta.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderTabButton = (tab: 'profile' | 'password', label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={activeTab === tab ? '#2d5016' : '#666'} 
      />
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.activeTabButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderProfileForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Informações Pessoais</Text>
      <Text style={styles.sectionSubtitle}>
        Atualize suas informações básicas do perfil.
      </Text>

      {/* Name Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Nome completo *</Text>
        <ThemedTextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          value={profileData.name}
          onChangeText={(text) => setProfileData({ ...profileData, name: text })}
          autoCapitalize="words"
        />
      </View>

      {/* Email Field (Read-only) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>E-mail</Text>
        <ThemedTextInput
          style={[styles.input, styles.readOnlyInput]}
          value={user?.email || ''}
          editable={false}
          placeholder="E-mail não disponível"
        />
        <Text style={styles.fieldHint}>
          O e-mail não pode ser alterado
        </Text>
      </View>

      {/* Role Field (Read-only) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Tipo de conta</Text>
        <ThemedTextInput
          style={[styles.input, styles.readOnlyInput]}
          value={user?.role === 'CITY_HALL' ? 'Prefeitura' : 'Cidadão'}
          editable={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderPasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Alterar Senha</Text>
      <Text style={styles.sectionSubtitle}>
        Por segurança, confirme sua senha atual antes de definir uma nova.
      </Text>

      {/* Current Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Senha atual *</Text>
        <View style={styles.passwordContainer}>
          <ThemedTextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Digite sua senha atual"
            value={passwordData.currentPassword}
            onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
            secureTextEntry={!showPasswords.current}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => togglePasswordVisibility('current')}
          >
            <Ionicons 
              name={showPasswords.current ? "eye-off" : "eye"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Nova senha *</Text>
        <View style={styles.passwordContainer}>
          <ThemedTextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Digite sua nova senha"
            value={passwordData.newPassword}
            onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
            secureTextEntry={!showPasswords.new}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => togglePasswordVisibility('new')}
          >
            <Ionicons 
              name={showPasswords.new ? "eye-off" : "eye"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.fieldHint}>
          A senha deve ter pelo menos 6 caracteres
        </Text>
      </View>

      {/* Confirm Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Confirmar nova senha *</Text>
        <View style={styles.passwordContainer}>
          <ThemedTextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Confirme sua nova senha"
            value={passwordData.confirmPassword}
            onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
            secureTextEntry={!showPasswords.confirm}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => togglePasswordVisibility('confirm')}
          >
            <Ionicons 
              name={showPasswords.confirm ? "eye-off" : "eye"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Security Info */}
      <View style={styles.infoBox}>
        <Ionicons name="shield-checkmark" size={20} color="#2d5016" />
        <Text style={styles.infoText}>
          Sua senha será criptografada e mantida em segurança. Recomendamos usar uma senha forte com letras, números e símbolos.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={handleUpdatePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Alterar Senha</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.headerSpace} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {renderTabButton('profile', 'Perfil', 'person-outline')}
        {renderTabButton('password', 'Senha', 'lock-closed-outline')}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.formWrapper}>
          {activeTab === 'profile' ? renderProfileForm() : renderPasswordForm()}
        </ThemedView>
      </ScrollView>

      {/* Cancel Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpace: {
    width: 32,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  activeTabButton: {
    backgroundColor: '#e8f5e8',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  activeTabButtonText: {
    color: '#2d5016',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  formWrapper: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  fieldHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f8e8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#2d5016',
    lineHeight: 16,
    marginLeft: 8,
  },
  saveButton: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#2d5016',
    borderRadius: 8,
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
