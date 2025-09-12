import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';

const ProgressDashboardSimple: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const colorScheme = useColorScheme();

  if (!user?.id) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            fontSize: 16,
            textAlign: 'center',
          }}
        >
          {t('progress_dashboard_login_required')}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          color: Colors[colorScheme ?? 'light'].text,
          fontSize: 18,
          textAlign: 'center',
        }}
      >
        Dashboard Simple - Usuario: {user.id}
      </Text>
      <ActivityIndicator
        size="large"
        color={Colors[colorScheme ?? 'light'].tint}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default ProgressDashboardSimple;
