import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appHeaderStyles as styles } from './styles';
import { useI18n } from '@/i18n';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  RightComponent?: React.ReactNode;
  containerStyle?: any;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onPressBack,
  RightComponent,
  containerStyle,
}) => {
  const { t } = useI18n();
  const Wrapper: any = Platform.OS === 'web' ? View : SafeAreaView;

  return (
    <Wrapper style={styles.safeArea}>
      <View style={[styles.headerContainer, containerStyle]}>
        <View style={styles.leftSlot}>
          {showBackButton && (
            <TouchableOpacity
              accessibilityLabel={t('back')}
              onPress={onPressBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles.backIconWrapper}>
                <View style={styles.backIcon} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.centerBlock}>
          <View style={styles.brandRow}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              resizeMode='contain'
            />
          </View>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.rightSlot}>{RightComponent}</View>
      </View>
    </Wrapper>
  );
};

export default AppHeader;
