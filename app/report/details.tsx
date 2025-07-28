import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export default function ReportDetailsScreen() {
  const { problemType } = useLocalSearchParams();
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const problemTypeLabels: { [key: string]: string } = {
    electricity: 'Eletricidade',
    water: 'Problemas de Água',
    roads: 'Problemas na Estrada',
    waste: 'Gestão de Resíduos',
    safety: 'Segurança Pública',
    parks: 'Parques e Recreação',
  };

  const getCurrentLocation = async () => {
    if (isLoadingLocation) return; // Prevenir múltiplas chamadas simultâneas
    
    setIsLoadingLocation(true);
    try {
      // Verificar se os serviços de localização estão habilitados
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          'Serviços de Localização Desabilitados',
          'Por favor, ative os serviços de localização nas configurações do seu dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Configurações', onPress: () => Location.enableNetworkProviderAsync() }
          ]
        );
        return;
      }

      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos da permissão de localização para continuar.');
        return;
      }

      // Obter localização atual com configurações otimizadas
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      // Obter endereço a partir das coordenadas
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const locationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: address[0] 
          ? `${address[0].street || 'Rua não identificada'}, ${address[0].city || 'Cidade não identificada'}` 
          : 'Localização atual',
      };

      setLocation(locationData);
      
      Alert.alert('Sucesso!', 'Localização adicionada com sucesso.');
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert(
        'Erro', 
        'Não foi possível obter sua localização atual. Verifique se o GPS está ativado e tente novamente.',
        [
          { text: 'Tentar Novamente', onPress: getCurrentLocation },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos da permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
    setShowImageOptions(false);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos da permissão para usar a câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
    setShowImageOptions(false);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o problema.');
      return;
    }

    if (!location) {
      Alert.alert('Erro', 'Por favor, adicione a localização do problema.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio do relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Relatório Enviado!',
        'Seu relatório foi enviado com sucesso. Entraremos em contato em breve.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/' as any),
          },
        ]
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar o relatório. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes do Relatório</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Problem Type Info */}
        <View style={styles.problemTypeContainer}>
          <Text style={styles.problemTypeLabel}>Tipo de Problema:</Text>
          <Text style={styles.problemTypeValue}>
            {problemTypeLabels[problemType as string] || 'Problema Geral'}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Descrição do Problema *</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Descreva detalhadamente o problema que você encontrou..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Location */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Localização *</Text>
          {location ? (
            <View style={styles.locationContainer}>
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={20} color="#2d5016" />
                <Text style={styles.locationText}>{location.address}</Text>
              </View>
              <TouchableOpacity onPress={getCurrentLocation}>
                <Text style={styles.changeLocationText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.locationButton, isLoadingLocation && styles.locationButtonDisabled]} 
              onPress={getCurrentLocation}
              disabled={isLoadingLocation}
            >
              <Ionicons name="location-outline" size={20} color="#2d5016" />
              <Text style={styles.locationButtonText}>
                {isLoadingLocation ? 'Obtendo localização...' : 'Adicionar Localização Atual'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Photos */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fotos (Opcional)</Text>
          <Text style={styles.sectionSubtitle}>
            Adicione fotos para ajudar na identificação do problema
          </Text>

          <View style={styles.photosContainer}>
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#f44336" />
                </TouchableOpacity>
              </View>
            ))}

            {selectedImages.length < 3 && (
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={() => setShowImageOptions(true)}
              >
                <Ionicons name="camera" size={32} color="#666" />
                <Text style={styles.addPhotoText}>Adicionar Foto</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Enviando...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Enviar Relatório</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Foto</Text>
            
            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Tirar Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalOption} onPress={pickImageFromLibrary}>
              <Ionicons name="image" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Escolher da Galeria</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  problemTypeContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  problemTypeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  problemTypeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5016',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 120,
  },
  locationContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: '#1a1a1a',
    marginLeft: 8,
    flex: 1,
  },
  changeLocationText: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '500',
  },
  locationButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2d5016',
    borderStyle: 'dashed',
  },
  locationButtonText: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '500',
    marginLeft: 8,
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 16,
  },
  modalCancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '500',
  },
});
