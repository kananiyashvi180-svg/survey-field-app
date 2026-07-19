import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { surveyStore } from './Survey';
import { profileStore } from './Profile';

export default function Dashboard() {
  const router = useRouter();
  const [surveys, setSurveys] = useState([]);
  const [student, setStudent] = useState(profileStore);

  useEffect(() => {
    setSurveys([...surveyStore]);
    setStudent({ ...profileStore });
  }, []);

  const completedCount = surveys.filter(s => s.status === 'Submitted').length;

  const quickActions = [
    {
      id: 'survey',
      label: 'New Survey',
      desc: 'Fill survey details',
      icon: '📝',
      iconBg: '#38bdf822',
      iconColor: '#38bdf8',
      route: '/Survey'
    },
    {
      id: 'camera',
      label: 'Camera Access',
      desc: 'Capture site photos',
      icon: '📷',
      iconBg: '#22c55e22',
      iconColor: '#22c55e',
      route: '/Camera'
    },
    {
      id: 'location',
      label: 'Location GPS',
      desc: 'Pinpoint locations',
      icon: '📍',
      iconBg: '#f9731622',
      iconColor: '#f97316',
      route: '/Location'
    },
    {
      id: 'contacts',
      label: 'Contacts Sync',
      desc: 'Link client contacts',
      icon: '👥',
      iconBg: '#a855f722',
      iconColor: '#a855f7',
      route: '/Contacts'
    },
    {
      id: 'clipboard',
      label: 'Clipboard',
      desc: 'Manage copied data',
      icon: '📋',
      iconBg: '#06b6d422',
      iconColor: '#06b6d4',
      route: '/Clipboard'
    },
    {
      id: 'preview',
      label: 'Preview',
      desc: 'View active survey',
      icon: '👁️',
      iconBg: '#ec489922',
      iconColor: '#ec4899',
      route: '/Preview'
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome Back,</Text>
        <Text style={styles.heroText}>Field Surveyor</Text>
      </View>

      <View style={styles.topGrid}>
        <View style={[styles.card, { flex: 1.2 }]}>
          <Text style={styles.cardHeader}>🎓 Student Details</Text>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentMeta}>Roll No: {student.rollNo}</Text>
          <Text style={styles.studentMeta}>{student.assignment || 'Mini Project Assignment'}</Text>
        </View>

        <View style={[styles.card, { flex: 0.8 }]}>
          <Text style={[styles.cardHeader, { color: '#ec4899' }]}>❓ {"Today's Work"}</Text>
          <Text style={styles.giantNumber}>{completedCount}</Text>
          <Text style={styles.subText}>Surveys Completed</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action, idx) => {
          if (idx % 2 === 0) {
            const nextAction = quickActions[idx + 1];
            return (
              <View key={action.id} style={styles.gridRow}>
                <Pressable
                  style={styles.actionCard}
                  onPress={() => router.push(action.route)}
                >
                  <View style={[styles.iconBox, { backgroundColor: action.iconBg }]}>
                    <Text style={[styles.icon, { color: action.iconColor }]}>{action.icon}</Text>
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                    <Text style={styles.actionDesc}>{action.desc}</Text>
                  </View>
                </Pressable>

                {nextAction ? (
                  <Pressable
                    style={styles.actionCard}
                    onPress={() => router.push(nextAction.route)}
                  >
                    <View style={[styles.iconBox, { backgroundColor: nextAction.iconBg }]}>
                      <Text style={[styles.icon, { color: nextAction.iconColor }]}>{nextAction.icon}</Text>
                    </View>
                    <View style={styles.actionTextContainer}>
                      <Text style={styles.actionLabel}>{nextAction.label}</Text>
                      <Text style={styles.actionDesc}>{nextAction.desc}</Text>
                    </View>
                  </Pressable>
                ) : (
                  <View style={[styles.actionCard, { backgroundColor: 'transparent' }]} />
                )}
              </View>
            );
          }
          return null;
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0d12',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  welcomeSection: {
    marginVertical: 12,
  },
  welcomeText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  heroText: {
    color: '#0ea5e9',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  topGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  cardHeader: {
    color: '#0ea5e9',
    fontSize: 12,
    fontWeight: 'bold',
  },
  studentName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  studentMeta: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  giantNumber: {
    color: '#ec4899',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subText: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  actionsGrid: {
    marginBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    fontSize: 18,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionDesc: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
});
