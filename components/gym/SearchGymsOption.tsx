import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymOptionCardStyles } from './styles/optionCard';
import { useI18n } from '@/i18n';

interface SearchGymsOptionProps {
  onPress: () => void;
}

export default function SearchGymsOption({ onPress }: SearchGymsOptionProps) {
  const { styles, colors } = useThemedStyles(makeGymOptionCardStyles);
  const { t } = useI18n();
  return (
    <TouchableOpacity style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionIcon}>
        <FontAwesome name="search" size={32} color={colors.success} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{t('search_gyms_title')}</Text>
        <Text style={styles.optionSubtitle}>{t('search_gyms_subtitle')}</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color={colors.chevron} />
    </TouchableOpacity>
  );
}
