import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Comment,
  ISSUE_TYPE_LABELS,
  Report,
  REPORT_STATUS,
  ReportStatus,
  STATUS_COLORS,
  STATUS_LABELS,
  USER_ROLES
} from '../../constants/Api';
import { ENV } from '../../constants/Environment';
import { useAuth } from '../../hooks/useAuth';
import { useReports } from '../../hooks/useReports';

export default function ReportDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { getReportById, voteOnReport, addComment, updateReportStatus } = useReports();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  const onRefresh = useCallback(async () => {
    if (!id || typeof id !== 'string') return;
    
    try {
      setRefreshing(true);
      const reportData = await getReportById(id);
      setReport(reportData);
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
    } finally {
      setRefreshing(false);
    }
  }, [id, getReportById]);

  const formatImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath; // URL completa
    }

    return `${ENV.API_BASE_URL}/uploads/${imagePath.replace(/^\//, '')}`;
  };

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadReport(id);
    }
  }, [id, loadReport]);

  const handleVote = async () => {
    if (!report || voting) return;

    try {
      setVoting(true);
      const response = await voteOnReport(report._id);
      
      // Update local state with new vote count
      setReport(prev => prev ? {
        ...prev,
        votes: response.votes
      } : null);
      
      Alert.alert('Sucesso', 'Seu voto foi registrado!');
    } catch (error) {
      console.error('Erro ao votar:', error);
      Alert.alert('Erro', 'Não foi possível registrar seu voto');
    } finally {
      setVoting(false);
    }
  };

  const handleAddComment = async () => {
    if (!report || !commentText.trim() || addingComment) return;

    try {
      setAddingComment(true);
      await addComment(report._id, commentText.trim());
      
      // Refresh report to get updated comments
      await onRefresh();
      
      // Clear input
      setCommentText('');
      
      Alert.alert('Sucesso', 'Comentário adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o comentário');
    } finally {
      setAddingComment(false);
    }
  };

  const handleUpdateStatus = async (newStatus: ReportStatus) => {
    if (!report || updatingStatus) return;

    try {
      setUpdatingStatus(true);
      await updateReportStatus(report._id, newStatus);
      
      // Update local state
      setReport(prev => prev ? {
        ...prev,
        status: newStatus
      } : null);
      
      Alert.alert('Sucesso', 'Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status');
    } finally {
      setUpdatingStatus(false);
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

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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
                      <Image 
                        source={{ uri: formatImageUrl(photo) }} 
                        style={styles.photo}
                      />
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
                <Text style={styles.statValue}>{report.comments?.length || 0}</Text>
                <Text style={styles.statLabel}>Comentários</Text>
              </View>
            </View>
          </View>

          {/* City Hall Status Management */}
          {user?.role === USER_ROLES.CITY_HALL && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gerenciar Status</Text>
              <Text style={styles.sectionSubtitle}>
                Atualize o status do relatório para informar o cidadão
              </Text>
              <View style={styles.statusButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    report.status === REPORT_STATUS.IN_PROGRESS && styles.statusButtonActive,
                    updatingStatus && styles.disabledButton
                  ]}
                  onPress={() => handleUpdateStatus(REPORT_STATUS.IN_PROGRESS)}
                  disabled={updatingStatus || report.status === REPORT_STATUS.IN_PROGRESS}
                >
                  <Ionicons 
                    name="time" 
                    size={18} 
                    color={report.status === REPORT_STATUS.IN_PROGRESS ? '#fff' : '#3498db'} 
                  />
                  <Text style={[
                    styles.statusButtonText,
                    report.status === REPORT_STATUS.IN_PROGRESS && styles.statusButtonTextActive
                  ]}>
                    Em Andamento
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    report.status === REPORT_STATUS.RESOLVED && styles.statusButtonActive,
                    updatingStatus && styles.disabledButton
                  ]}
                  onPress={() => handleUpdateStatus(REPORT_STATUS.RESOLVED)}
                  disabled={updatingStatus || report.status === REPORT_STATUS.RESOLVED}
                >
                  <Ionicons 
                    name="checkmark-circle" 
                    size={18} 
                    color={report.status === REPORT_STATUS.RESOLVED ? '#fff' : '#27ae60'} 
                  />
                  <Text style={[
                    styles.statusButtonText,
                    report.status === REPORT_STATUS.RESOLVED && styles.statusButtonTextActive
                  ]}>
                    Resolvido
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    report.status === REPORT_STATUS.REJECTED && styles.statusButtonActive,
                    updatingStatus && styles.disabledButton
                  ]}
                  onPress={() => handleUpdateStatus(REPORT_STATUS.REJECTED)}
                  disabled={updatingStatus || report.status === REPORT_STATUS.REJECTED}
                >
                  <Ionicons 
                    name="close-circle" 
                    size={18} 
                    color={report.status === REPORT_STATUS.REJECTED ? '#fff' : '#e74c3c'} 
                  />
                  <Text style={[
                    styles.statusButtonText,
                    report.status === REPORT_STATUS.REJECTED && styles.statusButtonTextActive
                  ]}>
                    Rejeitado
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Comments Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Comunicação ({report.comments?.length || 0})
            </Text>
            
            {report.comments && report.comments.length > 0 ? (
              <View style={styles.commentsContainer}>
                {report.comments.map((comment: Comment, index: number) => (
                  <View key={comment._id || index} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <View style={styles.commentAuthorContainer}>
                        <Ionicons 
                          name={comment.userRole === USER_ROLES.CITY_HALL ? 'briefcase' : 'person'} 
                          size={16} 
                          color={comment.userRole === USER_ROLES.CITY_HALL ? '#2d5016' : '#666'} 
                        />
                        <Text style={styles.commentAuthor}>
                          {comment.userName || 'Usuário'}
                        </Text>
                        {comment.userRole === USER_ROLES.CITY_HALL && (
                          <View style={styles.cityHallBadge}>
                            <Text style={styles.cityHallBadgeText}>Prefeitura</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.commentDate}>
                        {formatRelativeTime(comment.createdAt)}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyComments}>
                <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                <Text style={styles.emptyCommentsText}>
                  Nenhum comentário ainda
                </Text>
                <Text style={styles.emptyCommentsSubtext}>
                  {user?.role === USER_ROLES.CITY_HALL 
                    ? 'Seja o primeiro a comentar e ajudar o cidadão'
                    : 'A prefeitura ainda não respondeu este relatório'}
                </Text>
              </View>
            )}
          </View>

          {/* Add space at bottom for keyboard */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* City Hall Comment Input */}
        {user?.role === USER_ROLES.CITY_HALL && (
          <View style={styles.commentInputContainer}>
            <View style={styles.commentInputWrapper}>
              <TextInput
                style={styles.commentInput}
                placeholder="Adicionar comentário para o cidadão..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!commentText.trim() || addingComment) && styles.disabledButton
                ]}
                onPress={handleAddComment}
                disabled={!commentText.trim() || addingComment}
              >
                {addingComment ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
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
  statusButtonsContainer: {
    gap: 8,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    gap: 8,
  },
  statusButtonActive: {
    backgroundColor: '#2d5016',
    borderColor: '#2d5016',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  commentsContainer: {
    gap: 12,
  },
  commentItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2d5016',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cityHallBadge: {
    backgroundColor: '#2d5016',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  cityHallBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
    textAlign: 'center',
  },
  commentInputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#2d5016',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
