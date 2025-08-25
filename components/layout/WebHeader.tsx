import React, { useState } from 'react';
import {
  View,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useScreenWidth } from './useScreenWidth';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import SmartImage from '@/components/common/SmartImage';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeWebHeaderStyles } from './styles/webHeader';
import { useColorScheme } from '@/components/useColorScheme';

interface WebHeaderProps {
  userName?: string;
  userAvatar?: string;
}

export default function WebHeader({
  userName = 'Usuario',
  userAvatar,
}: WebHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const screenWidth = useScreenWidth();
  const styles = useThemedStyles(makeWebHeaderStyles);
  const theme = useColorScheme();

  if (Platform.OS !== 'web') {
    return null;
  }

  // Determinar si mostrar versión compacta basado en el ancho de pantalla
  const isCompact = screenWidth < 1200;
  const leftSpacerWidth = isCompact ? 70 : 250;

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleMenuOption = (option: string) => {
    setShowUserMenu(false);

    // Manejar navegación según la opción
    switch (option) {
      case 'plans':
        router.push('/plans');
        break;
      case 'routines':
        router.push('/routine-templates');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'physical-assessment':
        router.push('/physical-assessment');
        break;
      case 'user-exercise-max':
        router.push('/user-exercise-max');
        break;
      case 'support':
        // TODO: Implementar contacto con soporte
        break;
      case 'bug':
        // TODO: Implementar reporte de bugs
        break;
      case 'help':
        // TODO: Implementar ayuda
        break;
      case 'privacy':
        // TODO: Implementar privacidad
        break;
      case 'logout':
        // TODO: Implementar logout
        break;
      default:
        break;
    }
  };

  const userMenuOptions = [
    {
      key: 'routines',
      icon: 'tasks',
      label: 'Rutinas',
      action: () => handleMenuOption('routines'),
    },
    {
      key: 'plans',
      icon: 'star',
      label: 'Planes',
      action: () => handleMenuOption('plans'),
    },
    {
      key: 'physical-assessment',
      icon: 'heartbeat',
      label: 'Estado físico',
      action: () => handleMenuOption('physical-assessment'),
    },
    {
      key: 'user-exercise-max',
      icon: 'line-chart',
      label: 'RM',
      action: () => handleMenuOption('user-exercise-max'),
    },
    {
      key: 'settings',
      icon: 'cog',
      label: 'Ajustes',
      action: () => handleMenuOption('settings'),
    },
    {
      key: 'support',
      icon: 'life-ring',
      label: 'Contactar Soporte',
      action: () => handleMenuOption('support'),
    },
    {
      key: 'bug',
      icon: 'bug',
      label: 'Reportar un problema o bug',
      action: () => handleMenuOption('bug'),
    },
    {
      key: 'logout',
      icon: 'sign-out',
      label: 'Cerrar Sesión',
      action: () => handleMenuOption('logout'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Logo izquierdo */}
      <View style={[styles.logoContainer, { width: leftSpacerWidth }]}>
        <Text style={[styles.logoText, isCompact && styles.logoCompact]}>
          {isCompact ? 'G' : 'GYMMETRY'}
        </Text>
      </View>

      {/* Contenedor central para centrar la barra de búsqueda */}
      <View style={styles.centerContainer}>
        <View
          style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
          ]}
        >
          <FontAwesome
            name="search"
            size={16}
            style={[styles.searchIcon, styles.subtleIcon]}
          />
          <TextInput
            style={styles.searchInput}
            placeholderTextColor={Colors[theme].tabIconDefault}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </View>
      </View>

      {/* Usuario y menú derecho */}
      <View style={styles.userContainer}>
        <TouchableOpacity
          style={styles.userButton}
          onPress={handleUserMenuToggle}
        >
          {userAvatar ? (
            <SmartImage
              uri={userAvatar}
              style={styles.userAvatar}
              deferOnDataSaver={false}
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <FontAwesome
                name="user"
                size={20}
                color={Colors[theme].background}
              />
            </View>
          )}
          <Text style={styles.userName}>{userName}</Text>
          <FontAwesome
            name={showUserMenu ? 'chevron-up' : 'chevron-down'}
            size={12}
            style={styles.subtleIcon}
          />
        </TouchableOpacity>

        {/* Menú desplegable */}
        {showUserMenu && (
          <View style={styles.userMenu}>
            {userMenuOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.menuOption,
                  option.key === 'logout' && styles.logoutOption,
                ]}
                onPress={option.action}
              >
                <FontAwesome
                  name={
                    option.icon as React.ComponentProps<
                      typeof FontAwesome
                    >['name']
                  }
                  size={14}
                  style={[
                    styles.menuIcon,
                    option.key === 'logout'
                      ? styles.logoutIcon
                      : styles.subtleIcon,
                  ]}
                />
                <Text
                  style={[
                    styles.menuText,
                    option.key === 'logout' && styles.logoutText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Overlay para cerrar el menú */}
      {showUserMenu && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowUserMenu(false)}
          activeOpacity={1}
        />
      )}
    </View>
  );
}

// styles via makeWebHeaderStyles
