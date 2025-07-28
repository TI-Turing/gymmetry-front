import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface MobileHeaderProps {
  title?: string;
}

export default function MobileHeader({
  title = 'GYMMETRY',
}: MobileHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get('window').width)
  );

  if (Platform.OS === 'web') {
    return null;
  }

  const handleMenuOption = (option: string) => {
    closeMenu();
    // Aquí puedes manejar cada opción del menú
  };

  const openMenu = () => {
    setShowMenu(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(false);
    });
  };

  const menuOptions = [
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
    <>
      <View style={styles.header}>
        {/* Logo izquierdo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>{title}</Text>
        </View>

        {/* Menú hamburguesa derecho */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openMenu}
          accessibilityLabel='Abrir menú'
          accessibilityRole='button'
        >
          <FontAwesome name='bars' size={24} color='#FFFFFF' />
        </TouchableOpacity>
      </View>

      {/* Modal del menú */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType='none'
        onRequestClose={closeMenu}
      >
        {/* Overlay oscuro */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          {/* Menú deslizable */}
          <Animated.View
            style={[
              styles.menuContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Header del menú */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menú</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeMenu}
                accessibilityLabel='Cerrar menú'
                accessibilityRole='button'
              >
                <FontAwesome name='times' size={24} color='#FFFFFF' />
              </TouchableOpacity>
            </View>

            {/* Opciones del menú */}
            <View style={styles.menuOptions}>
              {menuOptions.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.menuOption,
                    option.key === 'logout' && styles.logoutOption,
                  ]}
                  onPress={option.action}
                  accessibilityLabel={option.label}
                  accessibilityRole='button'
                >
                  <FontAwesome
                    name={option.icon as any}
                    size={20}
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
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 54 : 45, // Más espacio desde la StatusBar
  },
  logoContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6300',
  },
  menuButton: {
    padding: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
  },
  menuHeader: {
    height: 100,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 54 : 30,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  menuOptions: {
    flex: 1,
    paddingTop: 20,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  logoutOption: {
    borderBottomWidth: 0,
    marginTop: 'auto',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  menuIcon: {
    marginRight: 20,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  logoutText: {
    color: '#FF6B6B',
  },
});
