import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#1c1f2b',
          borderTopColor: '#2a2d3a',
        },
      }}
    >
      {/* ── Visible Bottom Tabs ── */}
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="Survey"
        options={{
          title: 'New Survey',
          tabBarLabel: 'New Survey',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: 'History',
          tabBarLabel: 'History',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📂</Text>,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />

      {/* ── Hidden Tab Screens (navigated via Drawer or router) ── */}
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="Camera"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="Location"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="Contacts"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="Clipboard"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="Preview"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="Settings"
        options={{ href: null }}
      />
    </Tabs>
  );
}
