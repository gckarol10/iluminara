import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISSUE_TYPE_LABELS, ISSUE_TYPES, Report, REPORT_STATUS, STATUS_COLORS, STATUS_LABELS } from '../../constants/Api';
import { useAuth } from '../../hooks/useAuth';
import { useReports } from '../../hooks/useReports';

export default function CommunityScreen() {
  const [selectedFilter, setSelectedFilter] = useState('Recentes');
  const [communityReports, setCommunityReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchReports, voteOnReport } = useReports();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const loadCommunityReports = useCallback(async () => {
    if (!isAuthenticated || !user?.location?.city) {
      setCommunityReports([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch reports filtered by user's city
      const response = await fetchReports({
        city: user.location.city,
        state: user.location.state,
        page: 1,
        limit: 50, // Load more reports for community view
      });
      
      if (response && response.reports) {
        // Store reports without sorting, let filters handle sorting
        setCommunityReports(response.reports);
      } else {
        setCommunityReports([]);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios da comunidade:', error);
      setError('Erro ao carregar relatórios. Tente novamente.');
      setCommunityReports([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.location?.city, user?.location?.state, fetchReports]);

  useEffect(() => {
    if (isAuthenticated && !authLoading && user?.location?.city) {
      loadCommunityReports();
    }
  }, [isAuthenticated, authLoading, user?.location?.city, loadCommunityReports]);

  const filteredReports = useMemo(() => {
    if (selectedFilter === 'Recentes') {
      // Sort by creation date (most recent first)
      return [...communityReports].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (selectedFilter === 'Mais Votados') {
      // Sort by votes (most voted first)
      return [...communityReports].sort((a, b) => b.votes - a.votes);
    } else if (selectedFilter === 'Mais Vistos') {
      // Sort by views (most viewed first)
      return [...communityReports].sort((a, b) => b.views - a.views);
    } else {
      // Default to most recent
      return [...communityReports].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  }, [communityReports, selectedFilter]);

  const handleVoteOnReport = useCallback(async (reportId: string) => {
    if (!isAuthenticated) {
      console.log('User not authenticated');
      return;
    }

    try {
      const response = await voteOnReport(reportId);
      
      // Update the local state to reflect the new vote count
      setCommunityReports(prev => 
        prev.map(report => 
          report._id === reportId 
            ? { ...report, votes: response.votes }
            : report
        )
      );
      
      console.log('Vote successful:', response);
    } catch (error) {
      console.error('Erro ao votar:', error);
    }
  }, [isAuthenticated, voteOnReport]);

  const getStatusColor = (status: keyof typeof REPORT_STATUS) => {
    return STATUS_COLORS[status];
  };

  const getStatusLabel = (status: keyof typeof REPORT_STATUS) => {
    return STATUS_LABELS[status];
  };

  const getTypeLabel = (type: keyof typeof ISSUE_TYPES) => {
    return ISSUE_TYPE_LABELS[type];
  };

  const getTypeIcon = (type: keyof typeof ISSUE_TYPES) => {
    switch (type) {
      case 'STREETLIGHT': return 'bulb';
      case 'POTHOLE': return 'warning';
      case 'GARBAGE': return 'trash';
      case 'TRAFFIC_SIGN': return 'stop';
      case 'SIDEWALK': return 'walk';
      default: return 'alert-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comunidade</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'Recentes' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('Recentes')}
          >
            <Ionicons 
              name="time-outline" 
              size={14} 
              color={selectedFilter === 'Recentes' ? '#fff' : '#666'} 
              style={styles.filterIcon}
            />
            <Text style={[styles.filterText, selectedFilter === 'Recentes' && styles.activeFilterText]}>
              Recentes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'Mais Votados' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('Mais Votados')}
          >
            <Ionicons 
              name="heart-outline" 
              size={14} 
              color={selectedFilter === 'Mais Votados' ? '#fff' : '#666'} 
              style={styles.filterIcon}
            />
            <Text style={[styles.filterText, selectedFilter === 'Mais Votados' && styles.activeFilterText]}>
              Mais Votados
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'Mais Vistos' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('Mais Vistos')}
          >
            <Ionicons 
              name="eye-outline" 
              size={14} 
              color={selectedFilter === 'Mais Vistos' ? '#fff' : '#666'} 
              style={styles.filterIcon}
            />
            <Text style={[styles.filterText, selectedFilter === 'Mais Vistos' && styles.activeFilterText]}>
              Mais Vistos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Info */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            {isAuthenticated && user?.location?.city ? 
              `Mostrando relatórios de ${user.location.city}, ${user.location.state}` :
              'Faça login para ver relatórios da sua comunidade'
            }
          </Text>
          {filteredReports.length > 0 && (
            <Text style={styles.countText}>
              {filteredReports.length} relatório{filteredReports.length !== 1 ? 's' : ''} encontrado{filteredReports.length !== 1 ? 's' : ''} • 
              Ordenado por: {selectedFilter === 'Recentes' ? 'Data de criação' : 
                           selectedFilter === 'Mais Votados' ? 'Número de votos' : 'Visualizações'}
            </Text>
          )}
        </View>

        {/* Reports List */}
        <View style={styles.eventsContainer}>
          <Text style={styles.sectionTitle}>
            Relatórios da Comunidade {user?.location?.city && `- ${user.location.city}`}
            {filteredReports.length > 0 && (
              <Text style={styles.filterIndicator}> ({selectedFilter})</Text>
            )}
          </Text>
          
          {authLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Verificando autenticação...</Text>
            </View>
          ) : !isAuthenticated ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="person-circle-outline" size={48} color="#ccc" />
              <Text style={styles.emptyTitle}>Login necessário</Text>
              <Text style={styles.emptyText}>Faça login para ver relatórios da sua comunidade</Text>
            </View>
          ) : !user?.location?.city ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={48} color="#ccc" />
              <Text style={styles.emptyTitle}>Localização necessária</Text>
              <Text style={styles.emptyText}>Configure sua localização no perfil para ver relatórios da sua comunidade</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={loadCommunityReports} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando relatórios...</Text>
            </View>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <View key={report._id} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <View style={styles.reportTitleContainer}>
                    <Ionicons 
                      name={getTypeIcon(report.type)} 
                      size={20} 
                      color="#2d5016" 
                      style={styles.reportIcon}
                    />
                    <Text style={styles.reportTitle}>{getTypeLabel(report.type)}</Text>
                  </View>
                  <View style={styles.reportMeta}>
                    <Text style={styles.dateText}>{formatDate(report.createdAt)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                      <Text style={styles.statusText}>{getStatusLabel(report.status)}</Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.reportDescription} numberOfLines={3}>
                  {report.description}
                </Text>
                
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.locationText}>{report.location.address}</Text>
                </View>
                
                <View style={styles.reportFooter}>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Ionicons name="heart" size={16} color="#e74c3c" />
                      <Text style={styles.statText}>{report.votes} votos</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="eye" size={16} color="#666" />
                      <Text style={styles.statText}>{report.views} visualizações</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.voteButton} 
                    onPress={() => handleVoteOnReport(report._id)}
                  >
                    <Ionicons name="heart-outline" size={16} color="#2d5016" />
                    <Text style={styles.voteButtonText}>Votar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#ccc" />
              <Text style={styles.emptyTitle}>Nenhum relatório encontrado</Text>
              <Text style={styles.emptyText}>Não há relatórios na sua cidade ainda</Text>
            </View>
          )}
        </View>

        {/* Bottom Actions */}
        {/* <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentButton}>
            <Ionicons name="chatbubble" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share" size={20} color="#333" />
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  activeFilterTab: {
    backgroundColor: '#2d5016',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  countText: {
    fontSize: 12,
    color: '#2d5016',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  eventsContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  filterIndicator: {
    fontSize: 14,
    fontWeight: '400',
    color: '#2d5016',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateTag: {
    backgroundColor: '#2d5016',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  typeText: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
  },
  volunteerButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  volunteerButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 22,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  targetText: {
    fontSize: 12,
    color: '#2d5016',
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 84,
    gap: 16,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2d5016',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Report styles
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffebee',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  reportIcon: {
    marginRight: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  reportMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  voteButtonText: {
    fontSize: 12,
    color: '#2d5016',
    fontWeight: '600',
  },
});
