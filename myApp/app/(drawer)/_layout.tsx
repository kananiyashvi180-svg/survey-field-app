import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Text, Pressable } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isDashboardActive = pathname.includes('Dashboard');
  const isSurveyActive = pathname.includes('Survey');
  const isCameraActive = pathname.includes('Camera');
  const isContactsActive = pathname.includes('Contacts');
  const isLocationActive = pathname.includes('Location');
  const isClipboardActive = pathname.includes('Clipboard');
  const isSettingsActive = pathname.includes('Settings');

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Dashboard"
        focused={isDashboardActive}
        activeTintColor="#f97316"
        inactiveTintColor="#9ca3af"
        icon={() => <Text style={{ fontSize: 20 }}>🏠</Text>}
        onPress={() => router.push('/(drawer)/(tabs)/Dashboard')}
      />
      <DrawerItem
        label="Survey"
        focused={isSurveyActive}
        activeTintColor="#f97316"
        inactiveTintColor="#9ca3af"
        icon={() => <Text style={{ fontSize: 20 }}>📋</Text>}
        onPress={() => router.push('/(drawer)/(tabs)/Survey')}
      />
      <DrawerItem
        label="Camera"
        focused={isCameraActive}
        activeTintColor="#f97316"
        inactiveTintColor="#9ca3af"
        icon={() => <Text style={{ fontSize: 20 }}>📷</Text>}
        onPress={() => router.push('/(drawer)/(tabs)/Camera')}
      />
      <DrawerItem
        label="Contacts"
        focused={isContactsActive}
        activeTintColor="#f97316"
        inactiveTintColor="#9ca3af"
        icon={() => <Text style={{ fontSize: 20 }}>👥</Text>}
        onPress={() => router.push('/(drawer)/(tabs)/Contacts')}
      />
      <DrawerItem
        label="Location"
        focused={isLocationActive}
        activeTintColor="#f97316"
        inactiveTintColor="#9ca3af"
        icon={() => <Text style={{ fontSize: 20 }}>📍</Text>}
        onPress={() => router.push('/(drawer)/(tabs)/Location')}
      />
      <DrawerItem
        label="Clipboard"
        focused={isClipboardActive}
        activeTintColor="#f97316"
        inactiveTintColor="#9ca3af"
        icon={() => <Text style={{ fontSize: 20 }}>📋</Text>}
        onPress={() => router.push('/(drawer)/(tabs)/Clipboard')}
      />
      <DrawerItem
        label="Settings"
        focused={isSettingsActive}
        activeTintColor="#f97316"
        inactiveTintColor="#9ca3af"
        icon={() => <Text style={{ fontSize: 20 }}>⚙️</Text>}
        onPress={() => router.push('/(drawer)/(tabs)/Settings')}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#1ca1d1ff' },
        headerTintColor: '#edf5fcff',
        headerTitleStyle: { fontWeight: '700' },
        headerTitleAlign: 'center',
        drawerActiveTintColor: '#f97316',
        drawerInactiveTintColor: '#9ca3af',
        drawerStyle: { backgroundColor: '#fff' },
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={{ marginLeft: 16 }}
          >
            <Text style={{ fontSize: 24, color: '#f1f5f9' }}>☰</Text>
          </Pressable>
        ),
      })}
    >
      <Drawer.Screen name="(tabs)" options={{ title: 'Smart Field Survey' }} />
    </Drawer>
  );
}
