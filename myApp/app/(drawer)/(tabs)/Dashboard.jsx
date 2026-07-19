import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
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
    { id: 'survey', label: 'New Survey', route: '/Survey' },
    { id: 'camera', label: 'Camera Access', route: '/Camera' },
    { id: 'location', label: 'Location GPS', route: '/Location' },
    { id: 'contacts', label: 'Contacts Sync', route: '/Contacts' },
    { id: 'clipboard', label: 'Clipboard', route: '/Clipboard' },
    { id: 'preview', label: 'Preview', route: '/Preview' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Field Surveyor</Text>
        <Text style={styles.text}>Smart Field Survey App</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.text}>Student Details</Text>
          <Text style={styles.text}>{student.name}</Text>
          <Text style={styles.text}>{student.rollNo}</Text>
          <Text style={styles.text}>{student.assignment}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.text}>{"Today's Work"}</Text>
          <Text style={styles.title}>{todayCount}</Text>
          <Text style={styles.text}>Completed</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.row}>
        <ScrollView horizontal style={styles.horizontalScroll}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              style={styles.btn}
              onPress={() => router.push(action.route)}
            >
              <Text style={styles.btnText}>{action.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>Recent Surveys</Text>
      <View style={styles.card}>
        {recentSurveys.map((survey) => (
          <View key={survey.id} style={styles.row}>
            <View>
              <Text style={styles.text}>{survey.title}</Text>
              <Text style={styles.text}>{survey.date}</Text>
            </View>
            <View>
              <Text style={styles.text}>{survey.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    padding: 15,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    margin: 5,
  },
  title: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  card: {
    backgroundColor: '#1c1f2b',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 12,
    margin: 5,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
});
