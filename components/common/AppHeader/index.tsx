import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeAppHeaderStyles } from './styles';
import { useColorScheme } from '@/components/useColorScheme';
import { useI18n } from '@/i18n';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  RightComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
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
  const colorScheme = useColorScheme();
  const styles = makeAppHeaderStyles(colorScheme);
  const Wrapper = (Platform.OS === 'web' ? View : SafeAreaView) as
    | typeof View
    | typeof SafeAreaView;

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
              resizeMode="contain"
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
