import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

export interface NoDataProps {
  message?: string;
  debugInfo?: string;
}

const NoData: React.FC<NoDataProps> = ({ message, debugInfo }) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          color: Colors[colorScheme ?? 'light'].text,
          fontSize: 16,
          textAlign: 'center',
        }}
      >
        {message || t('progress_dashboard_no_data')}
      </Text>
      {!!debugInfo && __DEV__ && (
        <Text
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            fontSize: 12,
            marginTop: 10,
            fontStyle: 'italic',
          }}
        >
          {debugInfo}
        </Text>
      )}
    </View>
  );
};

export default NoData;
