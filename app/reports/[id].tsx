import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ISSUE_TYPE_LABELS,
    Report,
    STATUS_COLORS,
    STATUS_LABELS
} from '../../constants/Api';
import { useReports } from '../../hooks/useReports';

export default function ReportDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { getReportById } = useReports();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const loadReport = useCallback(async (reportId: string) => {
    try {
      setLoading(true);
      const reportData = await getReportById(reportId);
      setReport(reportData);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      Alert.alert('Erro', 'Não foi possível carregar o relatório');
    } finally {
      setLoading(false);
    }
  }, [getReportById]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadReport(id);
    }
  }, [id, loadReport]);

  const handleVote = async () => {
    if (!report || voting) return;

    try {
      setVoting(true);
      // TODO: Implement vote API call
      // await voteReport(report._id);
      
      // Update local state temporarily
      setReport(prev => prev ? {
        ...prev,
        votes: (prev.votes || 0) + 1
      } : null);
      
      Alert.alert('Sucesso', 'Seu voto foi registrado!');
    } catch (error) {
      console.error('Erro ao votar:', error);
      Alert.alert('Erro', 'Não foi possível registrar seu voto');
    } finally {
      setVoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} min atrás`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carregando...</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2d5016" />
          <Text style={styles.loadingText}>Carregando relatório...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Relatório não encontrado</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorTitle}>Relatório não encontrado</Text>
          <Text style={styles.errorSubtitle}>
            O relatório que você está procurando pode ter sido removido ou não existe.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Detalhes do Relatório</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#2d5016" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Report Header */}
        <View style={styles.reportHeader}>
          <View style={styles.reportTypeContainer}>
            <Text style={styles.reportType}>
              {ISSUE_TYPE_LABELS[report.type] || report.type}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[report.status] }]}>
              <Text style={styles.statusText}>
                {STATUS_LABELS[report.status] || report.status}
              </Text>
            </View>
          </View>
          
          <View style={styles.reportMetadata}>
            <Text style={styles.reportDate}>
              {formatDate(report.createdAt)}
            </Text>
            <Text style={styles.reportRelativeTime}>
              {formatRelativeTime(report.createdAt)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{report.description}</Text>
        </View>

        {/* Photos */}
        {report.photos && report.photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fotos ({report.photos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.photosContainer}>
                {report.photos.map((photo, index) => (
                  <TouchableOpacity key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#ff4444" />
            <View style={styles.locationDetails}>
              <Text style={styles.locationText}>
                {report.location.address && `${report.location.address}, `}
                {report.location.city}, {report.location.state}
              </Text>
              {report.location.coordinates && (
                <Text style={styles.coordinatesText}>
                  Lat: {report.location.coordinates[1].toFixed(6)}, 
                  Lng: {report.location.coordinates[0].toFixed(6)}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{report.votes || 0}</Text>
              <Text style={styles.statLabel}>Votos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{report.views || 0}</Text>
              <Text style={styles.statLabel}>Visualizações</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{report.photos?.length || 0}</Text>
              <Text style={styles.statLabel}>Fotos</Text>
            </View>
          </View>
        </View>

        {/* Note about reporter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <Text style={styles.noteText}>
            Este relatório foi enviado por um cidadão para ajudar a melhorar nossa cidade.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.voteButton, voting && styles.disabledButton]}
          onPress={handleVote}
          disabled={voting}
        >
          <Ionicons name="thumbs-up" size={20} color="#fff" />
          <Text style={styles.voteButtonText}>
            {voting ? 'Votando...' : 'Votar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mapButton}>
          <Ionicons name="map" size={20} color="#2d5016" />
          <Text style={styles.mapButtonText}>Ver no Mapa</Text>
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
  headerRight: {
    width: 32,
  },
  shareButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  reportHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reportTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportType: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d5016',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  reportMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportDate: {
    fontSize: 14,
    color: '#666',
  },
  reportRelativeTime: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  photosContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  photoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDetails: {
    marginLeft: 8,
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d5016',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  voteButton: {
    flex: 1,
    backgroundColor: '#2d5016',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  voteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mapButton: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d5016',
  },
  mapButtonText: {
    color: '#2d5016',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
