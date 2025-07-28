import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useScreenWidth } from './useScreenWidth';
import Colors from '@/constants/Colors';

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
    // Aquí puedes manejar cada opción del menú
  };

  const userMenuOptions = [
    {
      key: 'theme',
      icon: 'moon-o',
      label: 'Modo Oscuro',
      action: () => handleMenuOption('theme'),
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
      label: 'Reportar Bug',
      action: () => handleMenuOption('bug'),
    },
    {
      key: 'help',
      icon: 'question-circle',
      label: 'Ayuda',
      action: () => handleMenuOption('help'),
    },
    {
      key: 'privacy',
      icon: 'shield',
      label: 'Privacidad',
      action: () => handleMenuOption('privacy'),
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
            name='search'
            size={16}
            color='#B0B0B0'
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Buscar ejercicios, rutinas, usuarios...'
            placeholderTextColor='#B0B0B0'
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
            <Image source={{ uri: userAvatar }} style={styles.userAvatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <FontAwesome name='user' size={20} color='#FFFFFF' />
            </View>
          )}
          <Text style={styles.userName}>{userName}</Text>
          <FontAwesome
            name={showUserMenu ? 'chevron-up' : 'chevron-down'}
            size={12}
            color='#B0B0B0'
          />
        </TouchableOpacity>

        {/* Menú desplegable */}
        {showUserMenu && (
          <View style={styles.userMenu}>
            {userMenuOptions.map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.menuOption,
                  option.key === 'logout' && styles.logoutOption,
                ]}
                onPress={option.action}
              >
                <FontAwesome
                  name={option.icon as any}
                  size={14}
                  color={option.key === 'logout' ? '#FF6B6B' : '#B0B0B0'}
                  style={styles.menuIcon}
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

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  leftSpacer: {
    width: 250, // Mismo ancho que el menú lateral
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.tint,
    textAlign: 'center',
  },
  logoCompact: {
    fontSize: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    width: 400, // Ancho fijo más compacto
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212', // Mismo color del fondo principal
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 0,
    outlineWidth: 0,
    backgroundColor: 'transparent',
  },
  searchContainerFocused: {
    borderWidth: 2,
    borderColor: Colors.dark.tint,
    shadowColor: Colors.dark.tint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userContainer: {
    position: 'relative',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#121212', // Mismo color del fondo principal
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  defaultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  userMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#121212', // Mismo color del fondo principal
    borderRadius: 8,
    marginTop: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1001,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    marginRight: 12,
    width: 16,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  logoutText: {
    color: '#FF6B6B',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
