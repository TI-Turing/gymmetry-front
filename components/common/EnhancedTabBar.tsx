import React, { useCallback, useMemo, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { enhancedTabBarStyles } from './styles/enhancedTabBar';

// Tipos para la configuración de tabs
export interface TabItem {
  id: string;
  label: string;
  icon: string;
  badgeCount?: number;
  badgeText?: string;
  isDisabled?: boolean;
}

export interface EnhancedTabBarProps {
  tabs: TabItem[];
  selectedTabId: string;
  onTabPress: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  showLabels?: boolean;
  animated?: boolean;
  persistState?: boolean;
  storageKey?: string;
  iconSize?: number;
  enableAccessibility?: boolean;
}

// Componente Badge para notificaciones
const TabBadge: React.FC<{
  count?: number;
  text?: string;
  styles: ReturnType<typeof enhancedTabBarStyles>;
}> = ({ count, text, styles }) => {
  if (!count && !text) return null;

  const badgeText =
    text || (count && count > 99 ? '99+' : count?.toString()) || '';

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{badgeText}</Text>
    </View>
  );
};

// Componente Tab Item individual
const TabItemComponent: React.FC<{
  item: TabItem;
  isSelected: boolean;
  onPress: () => void;
  showLabel: boolean;
  iconSize: number;
  styles: ReturnType<typeof enhancedTabBarStyles>;
  variant: 'default' | 'pills' | 'underline';
  enableAccessibility: boolean;
}> = ({
  item,
  isSelected,
  onPress,
  showLabel,
  iconSize,
  styles,
  variant,
  enableAccessibility,
}) => {
  const isDisabled = item.isDisabled || false;

  return (
    <TouchableOpacity
      style={[
        styles.tab,
        variant === 'pills' && styles.pillTab,
        isSelected && styles.selectedTab,
        isSelected && variant === 'pills' && styles.selectedPillTab,
        isDisabled && styles.disabledTab,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole={enableAccessibility ? 'tab' : undefined}
      accessibilityState={
        enableAccessibility
          ? {
              selected: isSelected,
              disabled: isDisabled,
            }
          : undefined
      }
      accessibilityLabel={enableAccessibility ? item.label : undefined}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FontAwesome5
          name={item.icon}
          size={iconSize}
          color={isSelected ? styles.selectedIconColor : styles.iconColor}
        />
        <TabBadge
          count={item.badgeCount}
          text={item.badgeText}
          styles={styles}
        />
      </View>

      {showLabel && (
        <Text
          style={[styles.tabLabel, isSelected && styles.selectedTabLabel]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Componente principal EnhancedTabBar
export const EnhancedTabBar: React.FC<EnhancedTabBarProps> = ({
  tabs,
  selectedTabId,
  onTabPress,
  variant = 'default',
  showLabels = true,
  animated = true,
  persistState: _persistState = false,
  storageKey: _storageKey = 'enhancedTabBar_state',
  iconSize = 24,
  enableAccessibility = true,
}) => {
  const styles = useThemedStyles(enhancedTabBarStyles);

  // Animaciones
  const indicatorAnimation = useMemo(() => new Animated.Value(0), []);
  const screenWidth = Dimensions.get('window').width;

  // Encontrar el índice del tab seleccionado
  const selectedIndex = useMemo(() => {
    return tabs.findIndex((tab) => tab.id === selectedTabId);
  }, [tabs, selectedTabId]);

  // Animar el indicador cuando cambie la selección
  useEffect(() => {
    if (animated && variant === 'underline') {
      const tabWidth = screenWidth / tabs.length;
      const targetPosition = selectedIndex * tabWidth;

      Animated.spring(indicatorAnimation, {
        toValue: targetPosition,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [
    selectedIndex,
    animated,
    variant,
    screenWidth,
    tabs.length,
    indicatorAnimation,
  ]);

  // Manejar la selección de tab
  const handleTabPress = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab && !tab.isDisabled) {
        onTabPress(tabId);
      }
    },
    [tabs, onTabPress]
  );

  // Renderizar el indicador animado
  const renderIndicator = () => {
    if (variant !== 'underline' || !animated) return null;

    const tabWidth = screenWidth / tabs.length;

    return (
      <Animated.View
        style={[
          styles.indicator,
          {
            width: tabWidth,
            transform: [{ translateX: indicatorAnimation }],
          },
        ]}
      />
    );
  };

  return (
    <View
      style={[styles.container, variant === 'pills' && styles.pillsContainer]}
    >
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TabItemComponent
            key={tab.id}
            item={tab}
            isSelected={tab.id === selectedTabId}
            onPress={() => handleTabPress(tab.id)}
            showLabel={showLabels}
            iconSize={iconSize}
            styles={styles}
            variant={variant}
            enableAccessibility={enableAccessibility}
          />
        ))}
        {renderIndicator()}
      </View>
    </View>
  );
};

export default EnhancedTabBar;
