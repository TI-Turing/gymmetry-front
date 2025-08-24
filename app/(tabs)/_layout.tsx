import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle:
          Platform.OS === 'web'
            ? { display: 'none' }
            : {
                backgroundColor: '#1E1E1E',
                borderTopColor: '#333333',
                borderTopWidth: 1,
                height: 80,
                paddingBottom: 20,
                paddingTop: 10,
              },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <TabBarIcon name='home' color={color} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name='gym'
        options={{
          title: 'Gym',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='dumbbell'
              size={28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name='progress'
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='bar-chart' color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
  {/** Estado físico y RM se movieron al menú lateral, no en tabs */}
      <Tabs.Screen
        name='feed'
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <TabBarIcon name='users' color={color} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name='user' color={color} />,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
