import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISSUE_TYPE_LABELS, Report, STATUS_COLORS, STATUS_LABELS } from '../../constants/Api';
import { useAuth } from '../../hooks/useAuth';
import { useReports } from '../../hooks/useReports';

export default function HomeScreen() {
  const { user } = useAuth();
  const { reports, loading, fetchReports } = useReports();
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      await fetchReports({ 
        page: 1,
        limit: 5 
      }); // Carrega apenas os 5 mais recentes
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    }
  }, [fetchReports]);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const formatUserLocation = () => {
    if (!user?.location) {
      return 'Localização não definida';
    }
    
    const { address, city, state } = user.location;
    if (address && address.trim()) {
      return `${address}, ${city}, ${state}`;
    }
    return `${city}, ${state}`;
  };

  const getLocationSubtext = () => {
    if (!user?.location) {
      return 'Toque para definir sua localização';
    }
    if (!user.location.address || !user.location.address.trim()) {
      return 'Toque para adicionar endereço completo';
    }
    return 'Toque para ver no mapa';
  };

  const formatCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleReportProblem = () => {
    router.push('/report/problem-type' as any);
  };

  const handleEmergencyCall = () => {
    router.push('/report/emergency' as any);
  };

  const handleLocationPicker = () => {
    router.push('/map/location-picker' as any);
  };

  const handleViewAllReports = () => {
    router.push('/reports/list' as any);
  };

  const handleReportPress = (reportId: string) => {
    router.push(`/reports/${reportId}` as any);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderReportCard = ({ item: report }: { item: Report }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => handleReportPress(report._id)}
    >
      <View style={styles.reportHeader}>
        <Text style={styles.reportType}>
          {ISSUE_TYPE_LABELS[report.type] || report.type}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[report.status] }]}>
          <Text style={styles.statusText}>
            {STATUS_LABELS[report.status] || report.status}
          </Text>
        </View>
      </View>
      <Text style={styles.reportDescription} numberOfLines={3}>
        {report.description}
      </Text>
      <View style={styles.reportFooter}>
        <Text style={styles.reportLocation}>
          📍 {report.location.city}, {report.location.state}
        </Text>
        <Text style={styles.reportDate}>
          {formatDate(report.createdAt)}
        </Text>
      </View>
      <View style={styles.reportStats}>
        <Text style={styles.reportStat}>👍 {report.votes}</Text>
        <Text style={styles.reportStat}>👁 {report.views}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#666" />
            </View>
            <View>
              <Text style={styles.greeting}>Olá, Bem-vindo 👋</Text>
              <Text style={styles.username}>{user?.name || 'Usuário'}</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications" size={24} color="#333" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroContainer}>
            <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=350&h=150&fit=crop' }}
            style={styles.heroBanner}
            imageStyle={styles.heroImage}
            >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Juntos construímos{'\n'}uma cidade melhor{'\n'}para todos</Text>
              <TouchableOpacity style={styles.donationButton}>
              <Text style={styles.donationButtonText}>Ver Registros</Text>
              </TouchableOpacity>
            </View>
            </ImageBackground>
        </View>

        {/* Disaster Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Relatórios Recentes 📍</Text>
            <TouchableOpacity onPress={handleViewAllReports}>
              <Text style={styles.seeAllText}>Ver Todos</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando relatórios...</Text>
            </View>
          ) : reports.length > 0 ? (
            <View>
              <FlatList
                data={reports}
                renderItem={renderReportCard}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.reportsContainer}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                snapToInterval={292} // width (280) + separator (12)
                decelerationRate="fast"
              />
              {reports.length >= 5 && (
                <Text style={styles.moreReportsHint}>
                  Deslize para ver mais → 
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Nenhum relatório encontrado</Text>
              <Text style={styles.emptySubtext}>Seja o primeiro a reportar um problema!</Text>
            </View>
          )}

          {/* Map Preview */}
          <TouchableOpacity style={styles.mapContainer} onPress={handleLocationPicker}>
            <View style={styles.mapPlaceholder}>
              <Ionicons 
                name={user?.location ? "location" : "location-outline"} 
                size={40} 
                color={user?.location ? "#ff4444" : "#999"} 
              />
              <Text style={[
                styles.mapTitle, 
                !user?.location && styles.mapTitleNoLocation
              ]}>
                {formatUserLocation()}
              </Text>
              <Text style={styles.mapDate}>📅 {formatCurrentDate()}  🕒 Agora</Text>
              <Text style={styles.mapSubtext}>{getLocationSubtext()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.reportButton} onPress={handleReportProblem}>
            <Ionicons name="warning" size={24} color="#fff" />
            <Text style={styles.reportButtonText}>Reportar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
            <Ionicons name="call" size={24} color="#fff" />
            <Text style={styles.emergencyButtonText}>Emergência</Text>
          </TouchableOpacity>
        </View>

        {/* Live News
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notícias ao Vivo</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver Todos</Text>
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
        </View> */}
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
    paddingVertical: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    backgroundColor: '#b0ec70', 
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
    backgroundColor: '#edf3ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginTop: 12,
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
  mapTitleNoLocation: {
    color: '#999',
    fontStyle: 'italic',
  },
  mapDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
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
  // Report styles
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  reportsContainer: {
    paddingLeft: 16,
    paddingRight: 4, // Reduced padding for last item
  },
  moreReportsHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  reportCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: 280,
    minHeight: 140,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5016',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  reportDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportLocation: {
    fontSize: 12,
    color: '#666',
  },
  reportDate: {
    fontSize: 12,
    color: '#666',
  },
  reportStats: {
    flexDirection: 'row',
    gap: 16,
  },
  reportStat: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
});
