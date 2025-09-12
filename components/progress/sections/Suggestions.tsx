import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

interface SuggestionsProps {
  suggestions: string[];
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions }) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? 'light'].card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: Colors[colorScheme ?? 'light'].text,
          marginBottom: 12,
        }}
      >
        {t('progress_dashboard_suggestions')}
      </Text>
      {suggestions.map((suggestion, idx) => (
        <View
          key={idx}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderRadius: 12,
            marginBottom: 8,
          }}
        >
          {/* Aquí podrías usar SuggestionIcon si lo deseas */}
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors[colorScheme ?? 'light'].text,
                marginBottom: 4,
              }}
            >
              {suggestion || t('progress_dashboard_suggestion')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Suggestions;
