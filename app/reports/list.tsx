import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ISSUE_TYPE_LABELS,
    ISSUE_TYPES,
    IssueType,
    Report,
    REPORT_STATUS,
    ReportStatus,
    STATUS_COLORS,
    STATUS_LABELS
} from '../../constants/Api';
import { useReports } from '../../hooks/useReports';

interface FilterState {
  search: string;
  type: IssueType | 'ALL';
  status: ReportStatus | 'ALL';
  city: string;
  state: string;
}

export default function ReportsListScreen() {
  const { reports, loading, pagination, fetchReports } = useReports();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'ALL',
    status: 'ALL',
    city: '',
    state: '',
  });

  const loadReports = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      const filterParams: any = {
        page,
        limit: 10,
      };

      // Add filters if they're not 'ALL' or empty
      if (filters.type !== 'ALL') filterParams.type = filters.type;
      if (filters.status !== 'ALL') filterParams.status = filters.status;
      if (filters.city.trim()) filterParams.city = filters.city.trim();
      if (filters.state.trim()) filterParams.state = filters.state.trim();

      await fetchReports(filterParams);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    }
  }, [filters, fetchReports]);

  // Load initial reports
  useEffect(() => {
    loadReports(1);
  }, [loadReports]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports(1);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!pagination || pagination.currentPage >= pagination.totalPages || loadingMore) {
      return;
    }

    setLoadingMore(true);
    await loadReports(pagination.currentPage + 1, true);
    setLoadingMore(false);
  };

  const applyFilters = () => {
    loadReports(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'ALL',
      status: 'ALL',
      city: '',
      state: '',
    });
  };

  const handleReportPress = (reportId: string) => {
    router.push(`/reports/${reportId}` as any);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
        <Text style={styles.reportStat}>👍 {report.votes || 0}</Text>
        <Text style={styles.reportStat}>👁 {report.views || 0}</Text>
        {report.photos && report.photos.length > 0 && (
          <Text style={styles.reportStat}>📷 {report.photos.length}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterChip = (
    label: string,
    value: string,
    currentValue: string,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        value === currentValue && styles.activeFilterChip
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        value === currentValue && styles.activeFilterChipText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por descrição..."
          value={filters.search}
          onChangeText={(text) => setFilters(prev => ({ ...prev, search: text }))}
        />
      </View>

      {/* Type Filter */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Tipo de Problema</Text>
        <View style={styles.filterChipsContainer}>
          {renderFilterChip('Todos', 'ALL', filters.type, () => 
            setFilters(prev => ({ ...prev, type: 'ALL' }))
          )}
          {Object.entries(ISSUE_TYPES).map(([key, value]) => 
            renderFilterChip(
              ISSUE_TYPE_LABELS[value],
              value,
              filters.type,
              () => setFilters(prev => ({ ...prev, type: value }))
            )
          )}
        </View>
      </View>

      {/* Status Filter */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Status</Text>
        <View style={styles.filterChipsContainer}>
          {renderFilterChip('Todos', 'ALL', filters.status, () => 
            setFilters(prev => ({ ...prev, status: 'ALL' }))
          )}
          {Object.entries(REPORT_STATUS).map(([key, value]) => 
            renderFilterChip(
              STATUS_LABELS[value],
              value,
              filters.status,
              () => setFilters(prev => ({ ...prev, status: value }))
            )
          )}
        </View>
      </View>

      {/* Location Filter */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Localização</Text>
        <View style={styles.locationInputsContainer}>
          <TextInput
            style={[styles.locationInput, { flex: 2 }]}
            placeholder="Cidade"
            value={filters.city}
            onChangeText={(text) => setFilters(prev => ({ ...prev, city: text }))}
          />
          <TextInput
            style={[styles.locationInput, { flex: 1 }]}
            placeholder="UF"
            value={filters.state}
            onChangeText={(text) => setFilters(prev => ({ ...prev, state: text.toUpperCase() }))}
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>
      </View>

      {/* Filter Actions */}
      <View style={styles.filterActionsContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Nenhum relatório encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Tente ajustar os filtros ou seja o primeiro a reportar um problema!
      </Text>
    </View>
  );

  const renderLoadingFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#2d5016" />
        <Text style={styles.loadingFooterText}>Carregando mais...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Todos os Relatórios</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={24} color="#2d5016" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && renderFilters()}

      {/* Reports Count */}
      {pagination && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {pagination.totalReports} relatório{pagination.totalReports !== 1 ? 's' : ''} encontrado{pagination.totalReports !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Reports List */}
      <FlatList
        data={reports}
        renderItem={renderReportCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        ListFooterComponent={renderLoadingFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading */}
      {loading && reports.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2d5016" />
          <Text style={styles.loadingText}>Carregando relatórios...</Text>
        </View>
      )}
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
  filterButton: {
    padding: 4,
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countText: {
    fontSize: 14,
    color: '#666',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 4,
  },
  activeFilterChip: {
    backgroundColor: '#2d5016',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  locationInputsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  filterActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#2d5016',
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  reportCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingFooterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});
