import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Location {
  id: string;
  name: string;
  address: string;
  distance: string;
  coordinates: { lat: number; lng: number };
}

export default function LocationPickerScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const popularLocations = [
    {
      id: '1',
      name: 'São Paulo',
      address: 'São Paulo, Brasil',
      distance: '3.21KM',
      coordinates: { lat: -23.5505, lng: -46.6333 },
    },
    {
      id: '2',
      name: 'Rio de Janeiro',
      address: 'Rio de Janeiro, RJ, Brasil',
      distance: '2.24KM',
      coordinates: { lat: -22.9068, lng: -43.1729 },
    },
    {
      id: '3',
      name: 'Belo Horizonte',
      address: 'Belo Horizonte, MG, Brasil',
      distance: '2.84KM',
      coordinates: { lat: -19.9167, lng: -43.9345 },
    },
  ];

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      // Navigate to problem type selection with location data
      router.push({
        pathname: '/report/problem-type',
        params: { 
          locationId: selectedLocation.id,
          locationName: selectedLocation.name,
          locationAddress: selectedLocation.address,
        },
      } as any);
    }
  };

  const handleUseCurrentLocation = () => {
    // Here you would implement geolocation
    console.log('Using current location');
    const currentLocation = {
      id: 'current',
      name: 'Localização Atual',
      address: 'São Paulo, SP, Brasil',
      distance: '0KM',
      coordinates: { lat: -23.5505, lng: -46.6333 },
    };
    setSelectedLocation(currentLocation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escolher Localização</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapControlButton}>
              <Ionicons name="add" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapControlButton}>
              <Ionicons name="remove" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          
          {/* Current Location Marker */}
          <View style={styles.currentLocationMarker}>
            <View style={styles.markerPin} />
            <Text style={styles.locationLabel}>Stieg Avi</Text>
          </View>
          
          {/* My Location Button */}
          <TouchableOpacity style={styles.myLocationButton} onPress={handleUseCurrentLocation}>
            <Ionicons name="locate" size={20} color="#2d5016" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="options" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Popular Locations */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Localizações Populares</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {popularLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationItem,
                selectedLocation?.id === location.id && styles.selectedLocationItem
              ]}
              onPress={() => handleLocationSelect(location)}
            >
              <View style={styles.locationIcon}>
                <Ionicons 
                  name="location" 
                  size={20} 
                  color={selectedLocation?.id === location.id ? "#2d5016" : "#666"} 
                />
              </View>
              <View style={styles.locationInfo}>
                <Text style={[
                  styles.locationName,
                  selectedLocation?.id === location.id && styles.selectedLocationName
                ]}>
                  {location.name}
                </Text>
                <Text style={styles.locationAddress}>{location.address}</Text>
              </View>
              <Text style={styles.locationDistance}>{location.distance}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Confirm Button */}
        {selectedLocation && (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
            <Text style={styles.confirmButtonText}>
              Continuar com {selectedLocation.name}
            </Text>
          </TouchableOpacity>
        )}
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
  mapContainer: {
    height: 250,
    backgroundColor: '#e8f5e8',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  mapControlButton: {
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLocationMarker: {
    alignItems: 'center',
  },
  markerPin: {
    width: 32,
    height: 32,
    backgroundColor: '#2d5016',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  locationLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2d5016',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  sortButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedLocationItem: {
    borderWidth: 2,
    borderColor: '#2d5016',
    backgroundColor: '#f8fef8',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  selectedLocationName: {
    color: '#2d5016',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  locationDistance: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
