import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { useI18n } from '../../hooks/useI18n';
import { CustomAlert } from '../common/CustomAlert';
import { userBlockService } from '@/services';
import {
  UserBlock,
  getUserDisplayName,
  getBlockDuration,
} from '@/models/UserBlock';
import { blockedUsersListStyles } from './styles/blockedUsersListStyles';

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  blockedAt: string;
}

interface BlockedUsersListProps {
  onUserUnblocked?: (userId: string) => void;
  showStats?: boolean;
}

export const BlockedUsersList: React.FC<BlockedUsersListProps> = ({
  onUserUnblocked,
  showStats = true,
}) => {
  const { t } = useI18n();
  const colorScheme = useColorScheme();
  const styles = blockedUsersListStyles(colorScheme);

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'error' | 'success',
    onConfirm: undefined as (() => void) | undefined,
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' | 'success' = 'info',
    onConfirm?: () => void
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({
      ...prev,
      visible: false,
      onConfirm: undefined,
    }));
  };

  const loadBlockedUsers = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const response = await userBlockService.getBlockedUsers();

        if (response.Success && response.Data) {
          const users: BlockedUser[] = response.Data.map(
            (block: UserBlock) => ({
              id: block.BlockedUserId,
              name: block.BlockedUser?.name || '',
              username: block.BlockedUser?.username || '',
              avatarUrl: block.BlockedUser?.avatarUrl,
              blockedAt: block.CreatedAt,
            })
          );

          setBlockedUsers(users);
        } else {
          setError(response.Message || t('blockedUsersList.error.loadFailed'));
        }
      } catch (err) {
        setError(t('blockedUsersList.error.networkError'));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [t]
  );

  useEffect(() => {
    loadBlockedUsers();
  }, [loadBlockedUsers]);

  const handleUnblockUser = async (userId: string, userName: string) => {
    try {
      const response = await userBlockService.unblockUser(userId);

      if (response.Success) {
        setBlockedUsers((prev) => prev.filter((user) => user.id !== userId));
        onUserUnblocked?.(userId);
        showAlert(
          t('blockedUsersList.success.unblocked.title'),
          `${t('blockedUsersList.success.unblocked.message')} ${userName}`,
          'success'
        );
      } else {
        showAlert(
          t('blockedUsersList.error.title'),
          response.Message || t('blockedUsersList.error.unblockFailed'),
          'error'
        );
      }
    } catch (error) {
      showAlert(
        t('blockedUsersList.error.title'),
        t('blockedUsersList.error.networkError'),
        'error'
      );
    }
  };

  const confirmUnblock = (userId: string, userName: string) => {
    showAlert(
      t('blockedUsersList.confirm.unblock.title'),
      `${t('blockedUsersList.confirm.unblock.message')} ${userName}?`,
      'warning',
      () => handleUnblockUser(userId, userName)
    );
  };

  const renderBlockedUser = ({ item }: { item: BlockedUser }) => {
    const displayName = getUserDisplayName(item);
    const blockDuration = getBlockDuration(item.blockedAt);

    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            {item.avatarUrl ? (
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons
                  name="person"
                  size={20}
                  color={Colors[colorScheme].textMuted}
                />
              </View>
            )}
          </View>

          <View style={styles.userDetails}>
            <Text style={styles.userName}>{displayName}</Text>
            {item.username && (
              <Text style={styles.userHandle}>@{item.username}</Text>
            )}
            <Text style={styles.blockInfo}>
              {t('blockedUsersList.blockedFor')} {blockDuration}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.unblockButton}
          onPress={() => confirmUnblock(item.id, displayName)}
          accessibilityLabel={`${t('blockedUsersList_accessibility_unblock')} ${displayName}`}
        >
          <Text style={styles.unblockButtonText}>
            {t('blockedUsersList.unblock')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="people-outline"
        size={64}
        color={Colors[colorScheme].textMuted}
      />
      <Text style={styles.emptyTitle}>{t('blockedUsersList.empty.title')}</Text>
      <Text style={styles.emptyMessage}>
        {t('blockedUsersList.empty.message')}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons
        name="alert-circle-outline"
        size={48}
        color={Colors[colorScheme].danger}
      />
      <Text style={styles.errorTitle}>{t('blockedUsersList.error.title')}</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => loadBlockedUsers()}
      >
        <Text style={styles.retryButtonText}>
          {t('blockedUsersList.retry')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        <Text style={styles.loadingText}>{t('blockedUsersList.loading')}</Text>
      </View>
    );
  }

  if (error && !isRefreshing) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      {showStats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {`${t('blockedUsersList_stats')} ${blockedUsers.length}`}
          </Text>
        </View>
      )}

      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderBlockedUser}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadBlockedUsers(true)}
            colors={[Colors[colorScheme].tint]}
            tintColor={Colors[colorScheme].tint}
          />
        }
        contentContainerStyle={
          blockedUsers.length === 0 ? styles.emptyListContainer : undefined
        }
        showsVerticalScrollIndicator={false}
      />

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={hideAlert}
        onConfirm={alertConfig.onConfirm}
        showCancel={!!alertConfig.onConfirm}
      />
    </View>
  );
};
