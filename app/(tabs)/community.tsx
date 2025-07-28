import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CommunityScreen() {
  const [selectedFilter, setSelectedFilter] = useState('Publicação');

  const handleJoinVolunteer = (eventId: string) => {
    router.push(`/community/volunteer-form?eventId=${eventId}` as any);
  };

  const volunteerEvents = [
    {
      id: '1',
      title: 'Fornecendo ajuda para desastre de enchente na Austrália',
      date: '17 Dez',
      type: 'Quarta-feira',
      description: 'Estamos procurando um profissional. O evento voluntário de Fornecimento de Ajuda para Desastre de Enchente na Austrália é uma iniciativa dedicada a apoiar comunidades afetadas por enchentes recentes. Este programa é projetado para fornecer alívio imediato e apoio de longo prazo...',
      target: '3000',
      current: '390',
      location: 'Austrália',
      image: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Ajuda+Enchente',
    },
    {
      id: '2',
      title: 'Mãos Solidárias Apoiando Sobreviventes do Tsunami',
      date: '12-15 Dez',
      type: 'Evento',
      description: 'Junte-se à nossa missão para ajudar comunidades a se recuperarem do tsunami devastador...',
      target: '2000',
      current: '1240',
      location: 'Califórnia, CA',
      image: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Apoio+Tsunami',
    },
    {
      id: '3',
      title: 'Ação de Resposta Rápida para Vítimas de Tornado',
      date: 'Em andamento',
      type: 'Contínuo',
      description: 'Equipe de resposta de emergência fornecendo ajuda imediata para áreas afetadas por tornado...',
      target: '1500',
      current: '890',
      location: 'Oklahoma, EUA',
      image: 'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Ajuda+Tornado',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
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
            style={[styles.filterTab, selectedFilter === 'Publicação' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('Publicação')}
          >
            <Text style={[styles.filterText, selectedFilter === 'Publicação' && styles.activeFilterText]}>
              Publicação
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'Voluntário' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('Voluntário')}
          >
            <Text style={[styles.filterText, selectedFilter === 'Voluntário' && styles.activeFilterText]}>
              Voluntário
            </Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Header */}
        <View style={styles.calendarContainer}>
          <Text style={styles.monthYear}>Dezembro 2024 📅</Text>
          
          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            <View style={styles.weekRow}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <Text key={day} style={styles.dayHeader}>{day}</Text>
              ))}
            </View>
            
            {/* Calendar Days */}
            <View style={styles.weekRow}>
              <Text style={styles.dayNumber}>1</Text>
              <Text style={styles.dayNumber}>2</Text>
              <Text style={styles.dayNumber}>3</Text>
              <Text style={styles.dayNumber}>4</Text>
              <Text style={styles.dayNumber}>5</Text>
              <Text style={styles.dayNumber}>6</Text>
              <Text style={styles.dayNumber}>7</Text>
            </View>
            <View style={styles.weekRow}>
              <Text style={styles.dayNumber}>8</Text>
              <Text style={styles.dayNumber}>9</Text>
              <Text style={styles.dayNumber}>10</Text>
              <Text style={styles.dayNumber}>11</Text>
              <Text style={styles.dayNumber}>12</Text>
              <Text style={[styles.dayNumber, styles.selectedDay]}>13</Text>
              <Text style={styles.dayNumber}>14</Text>
            </View>
            <View style={styles.weekRow}>
              <Text style={styles.dayNumber}>15</Text>
              <Text style={styles.dayNumber}>16</Text>
              <Text style={[styles.dayNumber, styles.highlightedDay]}>17</Text>
              <Text style={styles.dayNumber}>18</Text>
              <Text style={styles.dayNumber}>19</Text>
              <Text style={styles.dayNumber}>20</Text>
              <Text style={styles.dayNumber}>21</Text>
            </View>
          </View>
        </View>

        {/* Events List */}
        <View style={styles.eventsContainer}>
          <Text style={styles.sectionTitle}>Notícias</Text>
          
          {volunteerEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <View style={styles.dateTag}>
                    <Text style={styles.dateText}>{event.date}</Text>
                    <Text style={styles.typeText}>{event.type}</Text>
                  </View>
                  <TouchableOpacity style={styles.volunteerButton} onPress={() => handleJoinVolunteer(event.id)}>
                    <Text style={styles.volunteerButtonText}>Voluntário</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription} numberOfLines={3}>
                  {event.description}
                </Text>
                
                <View style={styles.eventFooter}>
                  <Text style={styles.locationText}>📍 {event.location}</Text>
                  <Text style={styles.targetText}>
                    Meta: {event.target} | Atual: {event.current}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentButton}>
            <Ionicons name="chatbubble" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share" size={20} color="#333" />
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
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  activeFilterTab: {
    backgroundColor: '#2d5016',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  calendarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  calendarGrid: {
    gap: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayHeader: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    flex: 1,
  },
  dayNumber: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  selectedDay: {
    backgroundColor: '#2d5016',
    color: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  highlightedDay: {
    backgroundColor: '#e8f5e8',
    color: '#2d5016',
    borderRadius: 16,
    overflow: 'hidden',
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
});
