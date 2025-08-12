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
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export interface MenuOption {
  key: string;
  icon: string;
  label: string;
  action: () => void;
}

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  RightComponent?: React.ReactNode;
  hideMenuButton?: boolean; // si RightComponent cubre el menú
  menuOptions?: MenuOption[]; // opciones de menú dinámicas
}

export default function MobileHeader({
  title = 'GYMMETRY',
  subtitle,
  showBackButton = false,
  onPressBack,
  RightComponent,
  hideMenuButton = false,
  menuOptions, // opciones de menú dinámicas
}: MobileHeaderProps) {
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get('window').width)
  );

  const handleMenuOption = (option: string) => {
    closeMenu();
    switch (option) {
      case 'plans':
        router.push('/plans');
        break;
      case 'routines':
        router.push('/routine-templates');
        break;
      case 'theme':
        // Handle theme change
        break;
      case 'settings':
        // Navigate to settings
        break;
      case 'support':
        // Open support contact
        break;
      case 'bug':
        // Report a bug
        break;
      case 'help':
        // Open help section
        break;
      case 'privacy':
        // Show privacy policy
        break;
      case 'logout':
        // Ejecutar logout de manera asíncrona para evitar problemas con useInsertionEffect
        setTimeout(async () => {
          await logout();
        }, 0);
        break;
      default:
        break;
    }
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

  const defaultMenuOptions: MenuOption[] = [
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

  // Usar opciones personalizadas o por defecto
  const currentMenuOptions = menuOptions || defaultMenuOptions;

  return (
    <>
      <View
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === 'ios' ? 4 : 4,
            paddingBottom: 2,
          },
        ]}
      >
        {/* Left slot (back) */}
          <View style={styles.leftSlot}>
            {showBackButton && (
              <TouchableOpacity
                onPress={onPressBack}
                accessibilityLabel='Atrás'
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome name='chevron-left' size={20} color={Colors.dark.text} />
              </TouchableOpacity>
            )}
          </View>

          {/* Center (title / subtitle) */}
          <View style={styles.centerBlock}>
            <Text style={styles.logoText}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

            {/* Right slot (menu or custom) */}
          <View style={styles.rightSlot}>
            {RightComponent ? (
              RightComponent
            ) : !hideMenuButton ? (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={openMenu}
                accessibilityLabel='Abrir menú'
                accessibilityRole='button'
              >
                <FontAwesome name='bars' size={24} color='#FFFFFF' />
              </TouchableOpacity>
            ) : null}
          </View>
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
              {currentMenuOptions.map(option => (
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
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    minHeight: 38,
    overflow: 'hidden', // Evitar elementos decorativos
    zIndex: 1000, // Asegurar que esté por encima de otros elementos
    height: 55
  },
  leftSlot: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightSlot: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.tint,
  },
  subtitle: {
    marginTop: 1,
    fontSize: 10,
    color: '#B0B0B0',
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
  },
  menuButton: {
    padding: 6,
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
