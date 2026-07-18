import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();

  const [student] = useState({
    name: 'Yashvi Kanani',
    rollNo: 'SUK250054CE037',
    assignment: 'Mini Project Assignment',
  });

  const [todayCount, setTodayCount] = useState(0);
  const [recentSurveys, setRecentSurveys] = useState([]);

  useEffect(() => {
    setTodayCount(2);
    setRecentSurveys([
      { id: '1', title: 'Field Survey – Plot A', date: '18 Jul 2026', status: 'Completed' },
      { id: '2', title: 'Soil Inspection – Zone B', date: '18 Jul 2026', status: 'Pending' },
      { id: '3', title: 'Crop Assessment – Block C', date: '17 Jul 2026', status: 'Completed' },
      { id: '4', title: 'Water Source Check – Sector D', date: '17 Jul 2026', status: 'Pending' },
    ]);
  }, []);

  const quickActions = [
    {
      id: 'survey',
      label: 'New Survey',
      subtitle: 'Fill survey details',
      icon: '📋',
      iconBg: '#1e3a5f',
      route: '/(drawer)/(tabs)/Survey',
    },
    {
      id: 'camera',
      label: 'Camera Access',
      subtitle: 'Capture site photos',
      icon: '📷',
      iconBg: '#1a3d2b',
      route: '/(drawer)/Camera',
    },
    {
      id: 'location',
      label: 'Location GPS',
      subtitle: 'Pinpoint locations',
      icon: '📍',
      iconBg: '#3d2a10',
      route: '/(drawer)/Location',
    },
    {
      id: 'contacts',
      label: 'Contacts Sync',
      subtitle: 'Link client contacts',
      icon: '👥',
      iconBg: '#2e1a4a',
      route: '/(drawer)/Contacts',
    },
    {
      id: 'clipboard',
      label: 'Clipboard',
      subtitle: 'Copy & paste notes',
      icon: '📝',
      iconBg: '#1a3d3d',
      route: '/(drawer)/Clipboard',
    },
    {
      id: 'preview',
      label: 'Preview',
      subtitle: 'View field report',
      icon: '👁️',
      iconBg: '#3d1a1a',
      route: '/(drawer)/Preview',
    },
  ];

  function getStatusColor(status) {
    if (status === 'Completed') return '#22c55e';
    if (status === 'Pending') return '#f97316';
    return '#6b7280';
  }

  function renderSurveyItem({ item, index }) {
    const isLast = index === recentSurveys.length - 1;
    return (
      <View style={[styles.surveyItem, isLast && { borderBottomWidth: 0 }]}>
        <View style={styles.surveyDot} />
        <View style={styles.surveyInfo}>
          <Text style={styles.surveyTitle}>{item.title}</Text>
          <Text style={styles.surveyDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { borderColor: getStatusColor(item.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Welcome Header */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeSmall}>Welcome Back,</Text>
        <Text style={styles.welcomeName}>Field Surveyor</Text>
        <Text style={styles.welcomeSub}>Smart Field Survey &amp; Inspection App</Text>
      </View>

      {/* Top Two Cards Row */}
      <View style={styles.topCardsRow}>
        {/* Student Details Card */}
        <View style={styles.topCard}>
          <View style={styles.topCardHeader}>
            <Text style={styles.topCardIcon}>🎓</Text>
            <Text style={styles.topCardTitle}>Student Details</Text>
          </View>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentMeta}>Roll No: {student.rollNo}</Text>
          <Text style={styles.studentMeta}>{student.assignment}</Text>
        </View>

        {/* Today's Work Card */}
        <View style={styles.topCard}>
          <View style={styles.topCardHeader}>
            <Text style={styles.topCardIcon}>📊</Text>
            <Text style={styles.topCardTitle}>Today's Work</Text>
          </View>
          <Text style={styles.todayCount}>{todayCount}</Text>
          <Text style={styles.todayLabel}>Surveys Completed</Text>
        </View>
      </View>

      {/* Quick Actions Section */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        {quickActions.map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.actionCardPressed,
            ]}
            onPress={() => router.push(action.route)}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: action.iconBg }]}>
              <Text style={styles.actionIconText}>{action.icon}</Text>
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent Surveys Section */}
      <Text style={styles.sectionTitle}>Recent Surveys</Text>
      <View style={styles.recentCard}>
        <FlatList
          data={recentSurveys}
          keyExtractor={(item) => item.id}
          renderItem={renderSurveyItem}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    paddingHorizontal: 14,
  },

  /* Welcome */
  welcomeSection: {
    paddingTop: 22,
    paddingBottom: 18,
  },
  welcomeSmall: {
    fontSize: 15,
    color: '#9ca3af',
    marginBottom: 2,
  },
  welcomeName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f97316',
    marginBottom: 2,
  },
  welcomeSub: {
    fontSize: 12,
    color: '#6b7280',
  },

  /* Top Cards Row */
  topCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  topCard: {
    flex: 1,
    backgroundColor: '#1c1f2b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  topCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  topCardIcon: {
    fontSize: 16,
  },
  topCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  studentMeta: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 17,
  },
  todayCount: {
    fontSize: 44,
    fontWeight: '800',
    color: '#f97316',
    lineHeight: 52,
  },
  todayLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },

  /* Section Title */
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 12,
  },

  /* Quick Actions Grid */
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  actionCard: {
    width: '47.5%',
    backgroundColor: '#1c1f2b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  actionCardPressed: {
    backgroundColor: '#252836',
    borderColor: '#f97316',
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#6b7280',
  },

  /* Recent Surveys */
  recentCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  surveyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2d3a',
    gap: 10,
  },
  surveyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
  },
  surveyInfo: {
    flex: 1,
  },
  surveyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  surveyDate: {
    fontSize: 11,
    color: '#6b7280',
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
