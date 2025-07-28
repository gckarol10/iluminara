import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProblemType {
  id: string;
  icon: string;
  title: string;
  color: string;
  description: string;
}

export default function ProblemTypeScreen() {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const problemTypes: ProblemType[] = [
    {
      id: 'electricity',
      icon: 'flash',
      title: 'Eletricidade',
      color: '#ffeb3b',
      description: 'Falta de energia, fios danificados, postes de luz',
    },
    {
      id: 'water',
      icon: 'water',
      title: 'Problemas de Água',
      color: '#2196f3',
      description: 'Vazamentos, canos quebrados, qualidade da água',
    },
    {
      id: 'roads',
      icon: 'car',
      title: 'Problemas na Estrada',
      color: '#607d8b',
      description: 'Buracos, estradas danificadas, placas de trânsito',
    },
    {
      id: 'waste',
      icon: 'trash',
      title: 'Gestão de Resíduos',
      color: '#4caf50',
      description: 'Coleta de lixo, descarte irregular',
    },
    {
      id: 'safety',
      icon: 'shield',
      title: 'Segurança Pública',
      color: '#f44336',
      description: 'Áreas perigosas, cercas quebradas, riscos',
    },
    {
      id: 'parks',
      icon: 'leaf',
      title: 'Parques e Recreação',
      color: '#8bc34a',
      description: 'Equipamentos danificados, problemas de manutenção',
    },
  ];

  const emergencyTypes = [
    {
      id: 'ambulance',
      icon: 'medical',
      title: 'Ambulância',
      color: '#f44336',
    },
    {
      id: 'police',
      icon: 'shield-checkmark',
      title: 'Polícia',
      color: '#2196f3',
    },
    {
      id: 'fire',
      icon: 'flame',
      title: 'Bombeiros',
      color: '#ff5722',
    },
    {
      id: 'hospital',
      icon: 'medical-outline',
      title: 'Hospital',
      color: '#9c27b0',
    },
  ];

  const handleProblemSelect = (problemId: string) => {
    setSelectedProblem(problemId);
  };

  const handleContinue = () => {
    if (selectedProblem) {
      router.push({
        pathname: '/report/details',
        params: { problemType: selectedProblem },
      } as any);
    }
  };

  const handleEmergencyCall = (emergencyType: string) => {
    router.push({
      pathname: '/report/emergency',
      params: { type: emergencyType },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reportar Problema</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Problem Types */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Que tipo de problema você está reportando?</Text>
          
          <View style={styles.problemGrid}>
            {problemTypes.map((problem) => (
              <TouchableOpacity
                key={problem.id}
                style={[
                  styles.problemCard,
                  selectedProblem === problem.id && styles.selectedProblemCard,
                ]}
                onPress={() => handleProblemSelect(problem.id)}
              >
                <View style={[styles.problemIcon, { backgroundColor: problem.color }]}>
                  <Ionicons name={problem.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.problemTitle}>{problem.title}</Text>
                <Text style={styles.problemDescription}>{problem.description}</Text>
                
                {selectedProblem === problem.id && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color="#2d5016" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Section */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyIconContainer}>
              <Ionicons name="warning" size={24} color="#f44336" />
            </View>
            <Text style={styles.emergencyTitle}>Encontre Várias Chamadas de Emergência</Text>
          </View>
          
          <Text style={styles.emergencySubtitle}>🏥🚨 Chamada de Emergência</Text>
          
          <View style={styles.emergencyGrid}>
            {emergencyTypes.map((emergency) => (
              <TouchableOpacity
                key={emergency.id}
                style={styles.emergencyCard}
                onPress={() => handleEmergencyCall(emergency.id)}
              >
                <View style={[styles.emergencyIcon, { backgroundColor: emergency.color }]}>
                  <Ionicons name={emergency.icon as any} size={32} color="#fff" />
                </View>
                <Text style={styles.emergencyCardTitle}>{emergency.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        {selectedProblem && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continuar com o Relato</Text>
            </TouchableOpacity>
          </View>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 24,
    lineHeight: 28,
  },
  problemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  problemCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedProblemCard: {
    borderColor: '#2d5016',
    backgroundColor: '#f8fef8',
  },
  problemIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  problemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  problemDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  emergencySection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emergencyCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
  },
  emergencyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyCardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  continueButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
