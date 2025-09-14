import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { BlockedUsersList } from '@/components/social/BlockedUsersList';
import { useI18n } from '../hooks/useI18n';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '@/constants/Colors';

export default function BlockedUsersScreen() {
  const { t } = useI18n();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: t('blockedUsers_title'),
          headerShown: true,
        }}
      />
      <ScreenWrapper>
        <View style={styles.container}>
          <BlockedUsersList />
        </View>
      </ScreenWrapper>
    </>
  );
}
