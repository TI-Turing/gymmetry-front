import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeTabsLayoutStyles } from './styles/tabsLayout';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const styles = useThemedStyles(makeTabsLayoutStyles);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: styles.tabBarActiveTintColor,
        headerShown: false,
        tabBarStyle:
          Platform.OS === 'web'
            ? { display: 'none' }
            : {
                ...styles.tabBarStyleNative,
              },
        tabBarLabelStyle: styles.tabBarLabelStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="gym"
        options={{
          title: 'Gym',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="dumbbell"
              size={28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="bar-chart" color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          tabBarShowLabel: false,
        }}
      />
      {/* Ocultar rutas que existen dentro de (tabs) pero no deben mostrarse como pestañas */}
      <Tabs.Screen name="physical-assessment" options={{ href: null }} />
      <Tabs.Screen name="user-exercise-max" options={{ href: null }} />
    </Tabs>
  );
}
