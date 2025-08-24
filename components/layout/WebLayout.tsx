import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ChatComponent from './ChatComponent';
import WebHeader from './WebHeader';
import { useScreenWidth } from './useScreenWidth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeWebLayoutStyles } from './styles/webLayout';

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
    key: 'user-exercise-max',
    icon: 'weight-lifter' as const,
    label: 'RM',
    iconType: 'MaterialCommunityIcons' as const,
  },
  // (Ocultos) Feed y Perfil se retiraron del menú lateral
];

export default function WebLayout({
  children,
  activeTab,
  onTabChange,
}: WebLayoutProps) {
  const screenWidth = useScreenWidth();
  const styles = useThemedStyles(makeWebLayoutStyles);

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
            {menuItems.map((item) => (
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
                    style={[
                      styles.menuIcon,
                      activeTab === item.key
                        ? styles.menuIconActive
                        : styles.menuIconInactive,
                      isCompact && styles.menuIconCompact,
                    ]}
                  />
                ) : (
                  <FontAwesome
                    name={item.icon}
                    size={20}
                    style={[
                      styles.menuIcon,
                      activeTab === item.key
                        ? styles.menuIconActive
                        : styles.menuIconInactive,
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

// styles via makeWebLayoutStyles
