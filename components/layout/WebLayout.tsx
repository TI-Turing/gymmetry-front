import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ChatComponent from './ChatComponent';
import WebHeader from './WebHeader';
import { useScreenWidth } from './useScreenWidth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '@/constants/Colors';

interface WebLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    key: 'index',
    icon: 'home' as const,
    label: 'Inicio',
    iconType: 'FontAwesome' as const,
  },
  {
    key: 'gym',
    icon: 'dumbbell' as const,
    label: 'Gym',
    iconType: 'MaterialCommunityIcons' as const,
  },
  {
    key: 'progress',
    icon: 'bar-chart' as const,
    label: 'Progreso',
    iconType: 'FontAwesome' as const,
  },
  {
    key: 'physical-assessment',
    icon: 'heartbeat' as const,
    label: 'Estado físico',
    iconType: 'FontAwesome' as const,
  },
  {
    key: 'feed',
    icon: 'users' as const,
    label: 'Feed',
    iconType: 'FontAwesome' as const,
  },
  {
    key: 'profile',
    icon: 'user' as const,
    label: 'Perfil',
    iconType: 'FontAwesome' as const,
  },
];

export default function WebLayout({
  children,
  activeTab,
  onTabChange,
}: WebLayoutProps) {
  const screenWidth = useScreenWidth();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // Determinar si mostrar versión compacta basado en el ancho de pantalla
  const isCompact = screenWidth < 1200;
  const leftColumnWidth = isCompact ? 70 : 250;

  return (
    <View style={styles.container}>
      {/* Header */}
      <WebHeader />
      <View style={styles.mainContent}>
        {/* Columna 1: Menú Vertical */}
        <View style={[styles.leftColumn, { width: leftColumnWidth }]}>
          {/* Menú de navegación */}
          <View style={styles.menuContainer}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  activeTab === item.key && styles.activeMenuItem,
                  isCompact && styles.menuItemCompact,
                ]}
                onPress={() => onTabChange(item.key)}
              >
                {item.iconType === 'MaterialCommunityIcons' ? (
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={20}
                    color={
                      activeTab === item.key ? Colors.dark.tint : '#B0B0B0'
                    }
                    style={[
                      styles.menuIcon,
                      isCompact && styles.menuIconCompact,
                    ]}
                  />
                ) : (
                  <FontAwesome
                    name={item.icon}
                    size={20}
                    color={
                      activeTab === item.key ? Colors.dark.tint : '#B0B0B0'
                    }
                    style={[
                      styles.menuIcon,
                      isCompact && styles.menuIconCompact,
                    ]}
                  />
                )}
                {!isCompact && (
                  <Text
                    style={[
                      styles.menuText,
                      activeTab === item.key && styles.activeMenuText,
                    ]}
                  >
                    {item.label}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Columna 2: Contenido Principal */}
        <View style={styles.centerColumn}>{children}</View>

        {/* Columna 3: Chat */}
        <View style={styles.rightColumn}>
          <ChatComponent />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#121212',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    width: 250,
    backgroundColor: '#121212', // Mismo color del fondo principal
    paddingVertical: 20,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  menuItemCompact: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255, 99, 0, 0.1)',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuIconCompact: {
    marginRight: 0,
  },
  menuText: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  activeMenuText: {
    color: Colors.dark.tint,
    fontWeight: '600',
  },
  centerColumn: {
    flex: 1,
    backgroundColor: '#121212',
  },
  rightColumn: {
    width: 300,
    backgroundColor: '#121212', // Mismo color del fondo principal
  },
});
