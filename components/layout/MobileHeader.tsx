import React, { useState } from 'react';
import {
  View,
  Text,
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
import { useI18n } from '@/i18n';
import { makeMobileHeaderStyles } from './styles/mobileHeader';
import { useColorScheme } from '../useColorScheme';

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
  const { t } = useI18n();
  const { logout } = useAuth();
  const colorScheme = useColorScheme();
  const styles = makeMobileHeaderStyles(colorScheme);
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
      label: t('routines'),
      action: () => handleMenuOption('routines'),
    },
    {
      key: 'plans',
      icon: 'star',
      label: t('plans'),
      action: () => handleMenuOption('plans'),
    },
    {
      key: 'physical-assessment',
      icon: 'heartbeat',
      label: t('physical_assessment'),
      action: () => handleMenuOption('physical-assessment'),
    },
    {
      key: 'user-exercise-max',
      icon: 'line-chart',
      label: t('user_exercise_max_short'),
      action: () => handleMenuOption('user-exercise-max'),
    },
    {
      key: 'settings',
      icon: 'cog',
      label: t('settings_label'),
      action: () => handleMenuOption('settings'),
    },
    {
      key: 'support',
      icon: 'life-ring',
      label: t('support_contact'),
      action: () => handleMenuOption('support'),
    },
    {
      key: 'bug',
      icon: 'bug',
      label: t('report_bug'),
      action: () => handleMenuOption('bug'),
    },
    {
      key: 'logout',
      icon: 'sign-out',
      label: t('logout'),
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
              accessibilityLabel={t('back')}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome
                name="chevron-left"
                size={20}
                color={Colors[colorScheme].text}
              />
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
              accessibilityLabel={t('menu_open')}
              accessibilityRole="button"
            >
              <FontAwesome
                name="bars"
                size={24}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Modal del menú */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="none"
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
              <Text style={styles.menuTitle}>{t('menu_title')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeMenu}
                accessibilityLabel={t('menu_close')}
                accessibilityRole="button"
              >
                <FontAwesome
                  name="times"
                  size={24}
                  color={Colors[colorScheme].text}
                />
              </TouchableOpacity>
            </View>

            {/* Opciones del menú */}
            <View style={styles.menuOptions}>
              {currentMenuOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.menuOption,
                    option.key === 'logout' && styles.logoutOption,
                  ]}
                  onPress={option.action}
                  accessibilityLabel={option.label}
                  accessibilityRole="button"
                >
                  <FontAwesome
                    name={
                      option.icon as React.ComponentProps<
                        typeof FontAwesome
                      >['name']
                    }
                    size={20}
                    color={Colors[colorScheme].text}
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
