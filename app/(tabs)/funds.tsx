import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function FundsScreen() {
  const donationCampaigns = [
    {
      id: '1',
      title: 'Australia Flood Relief',
      description: 'Supporting communities affected by recent floods',
      raised: 45000,
      target: 100000,
      donors: 1234,
      urgency: 'High',
    },
    {
      id: '2',
      title: 'Earthquake Recovery Fund',
      description: 'Emergency aid for earthquake victims',
      raised: 78000,
      target: 150000,
      donors: 2156,
      urgency: 'Critical',
    },
    {
      id: '3',
      title: 'Infrastructure Repair',
      description: 'Fixing damaged roads and bridges',
      raised: 32000,
      target: 80000,
      donors: 567,
      urgency: 'Medium',
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return '#ff1744';
      case 'High': return '#ff9800';
      case 'Medium': return '#2196f3';
      default: return '#4caf50';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Funds</Text>
          <TouchableOpacity>
            <Ionicons name="notifications" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Impact</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$2,450</Text>
              <Text style={styles.statLabel}>Total Donated</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Campaigns</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>856</Text>
              <Text style={styles.statLabel}>People Helped</Text>
            </View>
          </View>
        </View>

        {/* Quick Donate */}
        <View style={styles.quickDonateContainer}>
          <Text style={styles.sectionTitle}>Quick Donate</Text>
          <View style={styles.quickAmounts}>
            {['$10', '$25', '$50', '$100'].map((amount) => (
              <TouchableOpacity key={amount} style={styles.quickAmountButton}>
                <Text style={styles.quickAmountText}>{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.customAmountButton}>
            <Text style={styles.customAmountText}>Custom Amount</Text>
          </TouchableOpacity>
        </View>

        {/* Active Campaigns */}
        <View style={styles.campaignsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Campaigns</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {donationCampaigns.map((campaign) => (
            <View key={campaign.id} style={styles.campaignCard}>
              <View style={styles.campaignHeader}>
                <Text style={styles.campaignTitle}>{campaign.title}</Text>
                <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(campaign.urgency) }]}>
                  <Text style={styles.urgencyText}>{campaign.urgency}</Text>
                </View>
              </View>
              
              <Text style={styles.campaignDescription}>{campaign.description}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(campaign.raised / campaign.target) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {formatAmount(campaign.raised)} raised of {formatAmount(campaign.target)}
                </Text>
              </View>
              
              <View style={styles.campaignFooter}>
                <Text style={styles.donorsText}>{campaign.donors} donors</Text>
                <TouchableOpacity style={styles.donateButton}>
                  <Text style={styles.donateButtonText}>Donate Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Donations */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Donations</Text>
          <View style={styles.recentItem}>
            <View style={styles.recentIcon}>
              <Ionicons name="water" size={20} color="#2196f3" />
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>Australia Flood Relief</Text>
              <Text style={styles.recentDate}>2 days ago</Text>
            </View>
            <Text style={styles.recentAmount}>$50</Text>
          </View>
          
          <View style={styles.recentItem}>
            <View style={styles.recentIcon}>
              <Ionicons name="home" size={20} color="#ff9800" />
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>Infrastructure Repair</Text>
              <Text style={styles.recentDate}>1 week ago</Text>
            </View>
            <Text style={styles.recentAmount}>$100</Text>
          </View>
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
  campaignTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
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
    marginBottom: 16,
    lineHeight: 20,
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
  donorsText: {
    fontSize: 12,
    color: '#666',
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
