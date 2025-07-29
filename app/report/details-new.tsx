import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { ISSUE_TYPES, ISSUE_TYPE_LABELS, IssueType } from '../../constants/Api';
import { useAuth } from '../../hooks/useAuth';
import { useReports } from '../../hooks/useReports';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
}

interface PhotoData {
  uri: string;
  type: string;
  fileName?: string;
}

export default function ReportDetailsScreen() {
  const { problemType } = useLocalSearchParams();
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<PhotoData[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const { createReport } = useReports();
  const { user } = useAuth();

  const getCurrentLocation = async () => {
    if (isLoadingLocation) return;
    
    setIsLoadingLocation(true);
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          'Localização Desabilitada',
          'Por favor, habilite os serviços de localização para usar esta funcionalidade.',
          [{ text: 'OK' }]
        );
        setIsLoadingLocation(false);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Permissão para acessar localização foi negada. Você pode inserir o endereço manualmente.',
          [{ text: 'OK' }]
        );
        setIsLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const locationInfo = reverseGeocode[0];
        const locationData: LocationData = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          address: `${locationInfo.street || ''} ${locationInfo.streetNumber || ''}`.trim(),
          city: locationInfo.city || '',
          state: locationInfo.region || '',
        };

        setLocation(locationData);
        setAddress(locationData.address);
        setCity(locationData.city);
        setState(locationData.state);
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert(
        'Erro',
        'Não foi possível obter sua localização. Você pode inserir o endereço manualmente.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const selectImageSource = () => {
    setShowImageOptions(true);
  };

  const pickImageFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const photo: PhotoData = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          fileName: `photo_${Date.now()}.jpg`,
        };
        setSelectedImages(prev => [...prev, photo]);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    } finally {
      setShowImageOptions(false);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para usar a câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const photo: PhotoData = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          fileName: `photo_${Date.now()}.jpg`,
        };
        setSelectedImages(prev => [...prev, photo]);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    } finally {
      setShowImageOptions(false);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!description.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o problema.');
      return false;
    }

    if (!address.trim()) {
      Alert.alert('Erro', 'Por favor, informe o endereço.');
      return false;
    }

    if (!city.trim()) {
      Alert.alert('Erro', 'Por favor, informe a cidade.');
      return false;
    }

    if (!state.trim()) {
      Alert.alert('Erro', 'Por favor, informe o estado.');
      return false;
    }

    if (state.length !== 2) {
      Alert.alert('Erro', 'Por favor, digite o estado com 2 letras (ex: MG).');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const reportData = {
        type: problemType as IssueType,
        description: description.trim(),
        location: {
          address: address.trim(),
          city: city.trim(),
          state: state.toUpperCase(),
          coordinates: location ? [location.longitude, location.latitude] as [number, number] : undefined,
        },
      };

      await createReport(reportData, selectedImages.length > 0 ? selectedImages : undefined);

      Alert.alert(
        'Sucesso!',
        'Seu relatório foi enviado com sucesso. Você será notificado sobre atualizações.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar relatório. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Relatório</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.problemTypeContainer}>
          <Text style={styles.problemTypeTitle}>Tipo de Problema</Text>
          <Text style={styles.problemTypeName}>
            {ISSUE_TYPE_LABELS[problemType as keyof typeof ISSUE_TYPES] || problemType}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição do Problema *</Text>
          <ThemedTextInput
            style={styles.descriptionInput}
            placeholder="Descreva detalhadamente o problema que você encontrou..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização *</Text>
          
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            <Ionicons 
              name="location" 
              size={20} 
              color={isLoadingLocation ? "#ccc" : "#2d5016"} 
            />
            <Text style={[styles.locationButtonText, isLoadingLocation && styles.locationButtonTextDisabled]}>
              {isLoadingLocation ? 'Obtendo localização...' : 'Usar minha localização atual'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>ou informe manualmente:</Text>

          <ThemedTextInput
            style={styles.input}
            placeholder="Endereço completo"
            value={address}
            onChangeText={setAddress}
          />

          <View style={styles.locationRow}>
            <ThemedTextInput
              style={[styles.input, styles.cityInput]}
              placeholder="Cidade"
              value={city}
              onChangeText={setCity}
            />
            <ThemedTextInput
              style={[styles.input, styles.stateInput]}
              placeholder="UF"
              value={state}
              onChangeText={setState}
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotos (opcional)</Text>
          <Text style={styles.sectionDescription}>
            Adicione fotos para ajudar a ilustrar o problema
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}

            {selectedImages.length < 5 && (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={selectImageSource}
              >
                <Ionicons name="camera" size={32} color="#666" />
                <Text style={styles.addImageText}>Adicionar</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Enviando...' : 'Enviar Relatório'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
              <Ionicons name="camera" size={24} color="#2d5016" />
              <Text style={styles.modalOptionText}>Tirar foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalOption} onPress={pickImageFromLibrary}>
              <Ionicons name="images" size={24} color="#2d5016" />
              <Text style={styles.modalOptionText}>Escolher da galeria</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  problemTypeContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  problemTypeTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  problemTypeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d5016',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#fff',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2d5016',
    fontWeight: '500',
  },
  locationButtonTextDisabled: {
    color: '#ccc',
  },
  orText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 12,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cityInput: {
    flex: 2,
  },
  stateInput: {
    flex: 1,
  },
  imagesContainer: {
    marginTop: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  addImageText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
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
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#000',
  },
  modalCancelButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
});
