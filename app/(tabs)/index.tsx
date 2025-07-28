import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  const handleReportProblem = () => {
    router.push('/report/problem-type' as any);
  };

  const handleEmergencyCall = () => {
    router.push('/report/emergency' as any);
  };

  const handleLocationPicker = () => {
    router.push('/map/location-picker' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#666" />
            </View>
            <View>
              <Text style={styles.greeting}>Hi Welcome 👋</Text>
              <Text style={styles.username}>Bradley Wilkinson</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications" size={24} color="#333" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: 'https://via.placeholder.com/350x150/4CAF50/FFFFFF?text=Community+Support' }}
            style={styles.heroBanner}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Together for{'\n'}Relief, Stronger{'\n'}in Recovery</Text>
              <TouchableOpacity style={styles.donationButton}>
                <Text style={styles.donationButtonText}>See Donation</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Disaster Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Disaster Information 🔥</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            <TouchableOpacity style={[styles.filterChip, styles.activeFilter]}>
              <Text style={styles.activeFilterText}>🕒 Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>🕐 Last week</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>📅 Last month</Text>
            </TouchableOpacity>
          </View>

          {/* Map Preview */}
          <TouchableOpacity style={styles.mapContainer} onPress={handleLocationPicker}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location" size={40} color="#ff4444" />
              <Text style={styles.mapTitle}>Earthquake in New York</Text>
              <Text style={styles.mapDate}>📅 Sun, 11 June 2024  🕒 3 min ago</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Live News */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live News</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.newsContainer}>
              <TouchableOpacity style={styles.newsCard}>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>⭕ 14K</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.newsCard}>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>⭕ 18K</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.newsCard}>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>⭕ 21K</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.reportButton} onPress={handleReportProblem}>
            <Ionicons name="warning" size={24} color="#fff" />
            <Text style={styles.reportButtonText}>Report Problem</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
            <Ionicons name="call" size={24} color="#fff" />
            <Text style={styles.emergencyButtonText}>Emergency Call</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greeting: {
    fontSize: 12,
    color: '#666',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
  heroContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  heroBanner: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 12,
  },
  heroContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 24,
  },
  donationButton: {
    backgroundColor: '#ffeb3b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  donationButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#2d5016',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterText: {
    fontSize: 12,
    color: '#fff',
  },
  mapContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  mapPlaceholder: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 8,
  },
  mapDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  newsContainer: {
    flexDirection: 'row',
  },
  newsCard: {
    width: 120,
    height: 80,
    backgroundColor: '#333',
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'flex-end',
    padding: 8,
  },
  liveBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  liveBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 32,
    gap: 12,
  },
  reportButton: {
    flex: 1,
    backgroundColor: '#2d5016',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
