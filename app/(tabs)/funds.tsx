import { Ionicons } from '@expo/vector-icons';
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

export default function FundsScreen() {
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchMyReports, fetchTopReported, topReported, topReportedLoading } = useReports();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const loadMyReports = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Você precisa estar logado para ver seus relatórios.');
      setMyReports([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call the real API to get user's reports
      const response = await fetchMyReports(1, 20); // page 1, limit 20
      
      if (response && response.reports) {
        setMyReports(response.reports);
      } else {
        setMyReports([]);
      }
    } catch (error) {
      console.error('Erro ao carregar meus relatórios:', error);
      setError('Erro ao carregar relatórios. Tente novamente.');
      setMyReports([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchMyReports]);

  const loadTopReported = useCallback(async () => {
    try {
      await fetchTopReported({ limit: 3 }); // Get top 3 most reported items
    } catch (error) {
      console.error('Erro ao carregar mais reportados:', error);
    }
  }, [fetchTopReported]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadMyReports();
    }
  }, [isAuthenticated, authLoading, loadMyReports]);

  useEffect(() => {
    // Load top reported items regardless of authentication
    loadTopReported();
  }, [loadTopReported]);

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

  const insights = useMemo(() => {
    if (!myReports.length) {
      return {
        totalViews: 0,
        totalReports: 0,
        resolvedReports: 0,
        totalVotes: 0,
        avgVotesPerReport: 0,
        mostCommonType: 'N/A',
      };
    }

    const totalViews = myReports.reduce((sum, report) => sum + report.views, 0);
    const totalReports = myReports.length;
    const resolvedReports = myReports.filter(report => report.status === 'RESOLVED').length;
    const totalVotes = myReports.reduce((sum, report) => sum + report.votes, 0);
    const avgVotesPerReport = Math.round(totalVotes / totalReports);

    // Find most common report type
    const typeCounts = myReports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonType = Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b
    );

    return {
      totalViews,
      totalReports,
      resolvedReports,
      totalVotes,
      avgVotesPerReport,
      mostCommonType: ISSUE_TYPE_LABELS[mostCommonType as keyof typeof ISSUE_TYPES] || mostCommonType,
    };
  }, [myReports]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Solicitações</Text>
          <TouchableOpacity>
            <Ionicons name="notifications" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Insights</Text>
          {!isAuthenticated ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Faça login para ver suas estatísticas</Text>
            </View>
          ) : myReports.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Crie seu primeiro relatório para ver insights</Text>
            </View>
          ) : (
            <>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{insights.totalReports}</Text>
                  <Text style={styles.statLabel}>Relatórios</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{insights.totalVotes}</Text>
                  <Text style={styles.statLabel}>Votos recebidos</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{insights.totalViews}</Text>
                  <Text style={styles.statLabel}>Visualizações</Text>
                </View>
              </View>
              <View style={styles.insightFooter}>
                <Text style={styles.insightFooterText}>
                  Taxa de resolução: {insights.totalReports > 0 ? Math.round((insights.resolvedReports / insights.totalReports) * 100) : 0}% • 
                  Média de votos: {insights.avgVotesPerReport}
                </Text>
                <Text style={[styles.insightFooterText, { marginTop: 4 }]}>
                  Tipo mais reportado: {insights.mostCommonType}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Quick Donate */}
        {/* <View style={styles.quickDonateContainer}>
          <Text style={styles.sectionTitle}>Doação Rápida</Text>
          <View style={styles.quickAmounts}>
            {['R$ 25', 'R$ 50', 'R$ 100', 'R$ 200'].map((amount) => (
              <TouchableOpacity key={amount} style={styles.quickAmountButton}>
                <Text style={styles.quickAmountText}>{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.customAmountButton}>
            <Text style={styles.customAmountText}>Valor Personalizado</Text>
          </TouchableOpacity>
        </View> */}

        {/* My Reports */}
        <View style={styles.campaignsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Minhas solicitações</Text>
            <TouchableOpacity onPress={loadMyReports}>
              <Text style={styles.viewAllText}>Atualizar</Text>
            </TouchableOpacity>
          </View>

          {authLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Verificando autenticação...</Text>
            </View>
          ) : !isAuthenticated ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="person-circle-outline" size={48} color="#ccc" />
              <Text style={styles.emptyTitle}>Login necessário</Text>
              <Text style={styles.emptyText}>Faça login para ver suas solicitações</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={loadMyReports} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : myReports.length > 0 ? (
            myReports.map((report) => (
              <View key={report._id} style={styles.campaignCard}>
                <View style={styles.campaignHeader}>
                  <View style={styles.reportTitleContainer}>
                    <Ionicons 
                      name={getTypeIcon(report.type)} 
                      size={20} 
                      color="#2d5016" 
                      style={styles.reportIcon}
                    />
                    <Text style={styles.campaignTitle}>{getTypeLabel(report.type)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(report.status)}</Text>
                  </View>
                </View>
                
                <Text style={styles.campaignDescription}>{report.description}</Text>
                
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.locationText}>{report.location.address}</Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${Math.min((report.votes / 50) * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {report.votes} votos de 50 necessários
                  </Text>
                </View>
                
                <View style={styles.campaignFooter}>
                  <Text style={styles.reportDate}>Criado em {formatDate(report.createdAt)}</Text>
                  <View style={styles.reportStats}>
                    <Text style={styles.donorsText}>{report.votes} votos</Text>
                    <Text style={styles.viewsText}>{report.views} visualizações</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#ccc" />
              <Text style={styles.emptyTitle}>Nenhuma solicitação encontrada</Text>
              <Text style={styles.emptyText}>Você ainda não fez nenhum relatório</Text>
            </View>
          )}
        </View>

        {/* Top Reported */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Mais reportados</Text>
          {topReportedLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : topReported.length > 0 ? (
            topReported.map((item, index) => (
              <View key={index} style={styles.recentItem}>
                <View style={styles.recentIcon}>
                  <Ionicons name={getTypeIcon(item.type)} size={20} color="#2196f3" />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle}>{getTypeLabel(item.type)}</Text>
                  <Text style={styles.recentLocation}>{item.city}, {item.state}</Text>
                  <Text style={styles.recentDate}>{item.count} relatórios • {formatDate(item.latestReport.createdAt)}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum dado disponível</Text>
            </View>
          )}
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
    paddingVertical: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  summaryCard: {
    backgroundColor: '#2d5016',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  insightFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  insightFooterText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  noDataContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quickDonateContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5016',
  },
  customAmountButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  customAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  campaignsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '500',
  },
  campaignCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  campaignTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  campaignDescription: {
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
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2d5016',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportDate: {
    fontSize: 12,
    color: '#666',
  },
  reportStats: {
    flexDirection: 'row',
    gap: 12,
  },
  donorsText: {
    fontSize: 12,
    color: '#666',
  },
  viewsText: {
    fontSize: 12,
    color: '#666',
  },
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
  donateButton: {
    backgroundColor: '#2d5016',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  donateButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  recentContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
    paddingBottom: 64,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  recentLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  recentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  recentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5016',
  },
});
