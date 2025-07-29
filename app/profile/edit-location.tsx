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
import { Location } from '../../constants/Api';
import { useAuth } from '../../hooks/useAuth';
import ApiService from '../../services/ApiService';

export default function EditLocationScreen() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Location>({
    address: '',
    city: '',
    state: '',
    coordinates: undefined,
  });

  useEffect(() => {
    if (user?.location) {
      setFormData(user.location);
    }
  }, [user]);

  const handleSave = async () => {
    // Validação básica
    if (!formData.address.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o endereço');
      return;
    }
    if (!formData.city.trim()) {
      Alert.alert('Erro', 'Por favor, preencha a cidade');
      return;
    }
    if (!formData.state.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o estado');
      return;
    }
    if (formData.state.length !== 2) {
      Alert.alert('Erro', 'O estado deve ter exatamente 2 caracteres');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await ApiService.updateProfile({
        location: formData,
      });

      // Atualizar o contexto de autenticação
      updateUser(updatedUser);

      Alert.alert(
        'Sucesso',
        'Localização atualizada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
      Alert.alert(
        'Erro',
        'Não foi possível atualizar a localização. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Localização</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informações de Localização</Text>
          <Text style={styles.sectionSubtitle}>
            Atualize suas informações de endereço para receber relatórios relevantes da sua região.
          </Text>

          {/* Address Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Endereço completo *</Text>
            <ThemedTextInput
              style={styles.input}
              placeholder="Ex: Rua das Flores, 123, Centro"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* City and State Row */}
          <View style={styles.rowContainer}>
            <View style={[styles.fieldContainer, { flex: 2 }]}>
              <Text style={styles.fieldLabel}>Cidade *</Text>
              <ThemedTextInput
                style={styles.input}
                placeholder="Ex: São Paulo"
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.fieldContainer, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.fieldLabel}>UF *</Text>
              <ThemedTextInput
                style={styles.input}
                placeholder="SP"
                value={formData.state}
                onChangeText={(text) => 
                  setFormData({ ...formData, state: text.toUpperCase() })
                }
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#2d5016" />
            <Text style={styles.infoText}>
              Suas informações de localização são usadas para filtrar relatórios relevantes da sua região e não são compartilhadas publicamente.
            </Text>
          </View>

          {/* Coordinates Section (Optional) */}
          {formData.coordinates && formData.coordinates.length === 2 && (
            <View style={styles.coordinatesContainer}>
              <Text style={styles.fieldLabel}>Coordenadas (GPS)</Text>
              <Text style={styles.coordinatesText}>
                Latitude: {formData.coordinates[1].toFixed(6)}
              </Text>
              <Text style={styles.coordinatesText}>
                Longitude: {formData.coordinates[0].toFixed(6)}
              </Text>
              <TouchableOpacity
                style={styles.clearCoordinatesButton}
                onPress={() => setFormData({ ...formData, coordinates: undefined })}
              >
                <Text style={styles.clearCoordinatesText}>Remover coordenadas</Text>
              </TouchableOpacity>
            </View>
          )}
        </ThemedView>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
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
  content: {
    flex: 1,
  },
  formContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f8e8',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#2d5016',
    lineHeight: 16,
    marginLeft: 8,
  },
  coordinatesContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  clearCoordinatesButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearCoordinatesText: {
    fontSize: 12,
    color: '#e74c3c',
    textDecorationLine: 'underline',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
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
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#2d5016',
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
