import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface EmergencyContact {
  title: string;
  phone: string;
  description: string;
  icon: string;
  color: string;
}

export default function EmergencyScreen() {
  const { type } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const emergencyContacts: { [key: string]: EmergencyContact } = {
    ambulance: {
      title: 'Ambulância (SAMU)',
      phone: '192',
      description: 'Serviço de Atendimento Móvel de Urgência',
      icon: 'medical',
      color: '#f44336',
    },
    police: {
      title: 'Polícia Militar',
      phone: '190',
      description: 'Emergências e ocorrências policiais',
      icon: 'shield-checkmark',
      color: '#2196f3',
    },
    fire: {
      title: 'Corpo de Bombeiros',
      phone: '193',
      description: 'Incêndios, resgates e emergências',
      icon: 'flame',
      color: '#ff5722',
    },
    hospital: {
      title: 'Defesa Civil',
      phone: '199',
      description: 'Emergências relacionadas a desastres',
      icon: 'medical-outline',
      color: '#9c27b0',
    },
  };

  const contact = emergencyContacts[type as string] || emergencyContacts.ambulance;

  const handleEmergencyCall = async () => {
    setIsLoading(true);
    
    try {
      const phoneUrl = `tel:${contact.phone}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      
      if (canOpen) {
        Alert.alert(
          'Confirmar Chamada de Emergência',
          `Você está prestes a ligar para ${contact.title} (${contact.phone}). Esta é uma emergência real?`,
          [
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => setIsLoading(false),
            },
            {
              text: 'Ligar',
              style: 'destructive',
              onPress: () => {
                Linking.openURL(phoneUrl);
                setIsLoading(false);
              },
            },
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível realizar a chamada.');
        setIsLoading(false);
      }
    } catch {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer a ligação.');
      setIsLoading(false);
    }
  };

  const otherEmergencyNumbers = [
    { name: 'Polícia Civil', number: '197', description: 'Crimes e investigações' },
    { name: 'Disque Denúncia', number: '181', description: 'Denúncias anônimas' },
    { name: 'Ouvidoria da Polícia', number: '0800-024-9181', description: 'Reclamações sobre serviços policiais' },
    { name: 'Centro de Valorização da Vida', number: '188', description: 'Prevenção ao suicídio - 24h' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergência</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Emergency Alert */}
        <View style={styles.alertContainer}>
          <View style={styles.alertIcon}>
            <Ionicons name="warning" size={32} color="#fff" />
          </View>
          <Text style={styles.alertTitle}>APENAS PARA EMERGÊNCIAS REAIS</Text>
          <Text style={styles.alertSubtitle}>
            Use apenas em situações que requerem resposta imediata dos serviços de emergência
          </Text>
        </View>

        {/* Main Emergency Contact */}
        <View style={styles.mainContactContainer}>
          <View style={[styles.emergencyIcon, { backgroundColor: contact.color }]}>
            <Ionicons name={contact.icon as any} size={48} color="#fff" />
          </View>
          
          <Text style={styles.emergencyTitle}>{contact.title}</Text>
          <Text style={styles.emergencyPhone}>{contact.phone}</Text>
          <Text style={styles.emergencyDescription}>{contact.description}</Text>

          <TouchableOpacity
            style={[styles.callButton, { backgroundColor: contact.color }]}
            onPress={handleEmergencyCall}
            disabled={isLoading}
          >
            <Ionicons name="call" size={24} color="#fff" />
            <Text style={styles.callButtonText}>
              {isLoading ? 'Ligando...' : 'Ligar Agora'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Ao ligar, esteja preparado para informar:</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.instructionText}>Sua localização exata</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="person" size={16} color="#666" />
              <Text style={styles.instructionText}>Número de pessoas envolvidas</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="medical" size={16} color="#666" />
              <Text style={styles.instructionText}>Natureza da emergência</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.instructionText}>Quando o incidente ocorreu</Text>
            </View>
          </View>
        </View>

        {/* Other Emergency Numbers */}
        <View style={styles.otherNumbersContainer}>
          <Text style={styles.otherNumbersTitle}>Outros Números Úteis</Text>
          {otherEmergencyNumbers.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.otherNumberItem}
              onPress={() => {
                Alert.alert(
                  item.name,
                  `Ligar para ${item.number}?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Ligar', onPress: () => Linking.openURL(`tel:${item.number}`) },
                  ]
                );
              }}
            >
              <View style={styles.otherNumberInfo}>
                <Text style={styles.otherNumberName}>{item.name}</Text>
                <Text style={styles.otherNumberDescription}>{item.description}</Text>
              </View>
              <Text style={styles.otherNumberPhone}>{item.number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Tips */}
        <View style={styles.safetyTipsContainer}>
          <Text style={styles.safetyTipsTitle}>⚠️ Dicas de Segurança</Text>
          <Text style={styles.safetyTip}>• Mantenha-se calmo e fale claramente</Text>
          <Text style={styles.safetyTip}>• Não desligue até ser orientado a fazê-lo</Text>
          <Text style={styles.safetyTip}>• Siga todas as instruções do operador</Text>
          <Text style={styles.safetyTip}>• Mantenha-se em local seguro sempre que possível</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  alertContainer: {
    backgroundColor: '#ff4444',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  alertIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  alertSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  mainContactContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emergencyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  emergencyPhone: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d5016',
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  otherNumbersContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  otherNumbersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  otherNumberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  otherNumberInfo: {
    flex: 1,
  },
  otherNumberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  otherNumberDescription: {
    fontSize: 12,
    color: '#666',
  },
  otherNumberPhone: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5016',
  },
  safetyTipsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  safetyTipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  safetyTip: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
});
