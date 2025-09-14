import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { useI18n } from '../../hooks/useI18n';
import { CustomAlert } from '../common/CustomAlert';
import { userBlockService } from '@/services';
import { blockButtonStyles } from './styles/blockButtonStyles';
import { useBlockRateLimit } from '../../hooks/useBlockRateLimit';

interface BlockButtonProps {
  userId: string;
  userName?: string;
  initialBlockedState?: boolean;
  style?: 'icon' | 'text' | 'compact';
  size?: 'small' | 'medium' | 'large';
  onBlockStatusChanged?: (isBlocked: boolean) => void;
  disabled?: boolean;
  showConfirmation?: boolean;
  showRateLimit?: boolean;
}

export const BlockButton: React.FC<BlockButtonProps> = ({
  userId,
  userName = 'usuario',
  initialBlockedState = false,
  style = 'icon',
  size = 'medium',
  onBlockStatusChanged,
  disabled = false,
  showConfirmation = true,
  showRateLimit = false,
}) => {
  const { t } = useI18n();
  const colorScheme = useColorScheme();
  const styles = blockButtonStyles(colorScheme, size);
  const { rateLimit, decrementBlockCount } = useBlockRateLimit();

  const [isBlocked, setIsBlocked] = useState(initialBlockedState);
  const [isLoading, setIsLoading] = useState(false);
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

  const checkBlockStatus = useCallback(async () => {
    try {
      const response = await userBlockService.checkBlockStatus(userId);
      if (response.Success && response.Data) {
        setIsBlocked(response.Data.IsBlocked);
      }
    } catch (error) {
      // Silently handle error - assume not blocked
      setIsBlocked(false);
    }
  }, [userId]);

  useEffect(() => {
    // Check initial block status if not provided
    if (initialBlockedState === undefined) {
      checkBlockStatus();
    }
  }, [userId, checkBlockStatus, initialBlockedState]);

  const handleBlockUser = async () => {
    // Check rate limit before attempting to block
    if (rateLimit.isLimitReached) {
      showAlert(
        t('blockButton_error_title'),
        `Has alcanzado el límite diario de bloqueos. Quedan ${rateLimit.remainingBlocks} de 20 para hoy.`,
        'warning'
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await userBlockService.blockUser({
        BlockedUserId: userId,
      });

      if (response.Success) {
        setIsBlocked(true);
        onBlockStatusChanged?.(true);
        decrementBlockCount(); // Update rate limit counter
        showAlert(
          t('blockButton_success_blocked_title'),
          `${t('blockButton_success_blocked_message')} ${userName}`,
          'success'
        );
      } else {
        // Use specific error handling
        const blockError = userBlockService.parseBlockError(response);
        showAlert(
          t('blockButton_error_title'),
          blockError.userFriendlyMessage,
          'error'
        );
      }
    } catch (error) {
      showAlert(
        t('blockButton_error_title'),
        t('blockButton_error_networkError'),
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    setIsLoading(true);
    try {
      const response = await userBlockService.unblockUser(userId);

      if (response.Success) {
        setIsBlocked(false);
        onBlockStatusChanged?.(false);
        showAlert(
          t('blockButton_success_unblocked_title'),
          `${t('blockButton_success_unblocked_message')} ${userName}`,
          'success'
        );
      } else {
        showAlert(
          t('blockButton_error_title'),
          response.Message || t('blockButton_error_defaultMessage'),
          'error'
        );
      }
    } catch (error) {
      showAlert(
        t('blockButton_error_title'),
        t('blockButton_error_networkError'),
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = () => {
    if (disabled || isLoading) return;

    if (isBlocked) {
      // Unblock user
      if (showConfirmation) {
        showAlert(
          t('blockButton_confirm_unblock_title'),
          `${t('blockButton_confirm_unblock_message')} ${userName}`,
          'warning',
          handleUnblockUser
        );
      } else {
        handleUnblockUser();
      }
    } else {
      // Block user
      if (showConfirmation) {
        showAlert(
          t('blockButton_confirm_block_title'),
          `${t('blockButton_confirm_block_message')} ${userName}`,
          'warning',
          handleBlockUser
        );
      } else {
        handleBlockUser();
      }
    }
  };

  const renderIcon = () => {
    const iconName = isBlocked ? 'person-remove' : 'person-remove-outline';
    const iconColor = disabled
      ? Colors[colorScheme].textMuted
      : isBlocked
        ? Colors[colorScheme].danger
        : Colors[colorScheme].text;

    return (
      <Ionicons name={iconName} size={styles.icon.fontSize} color={iconColor} />
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator size="small" color={Colors[colorScheme].tint} />
      );
    }

    const buttonText = isBlocked
      ? t('blockButton_unblock')
      : t('blockButton_block');

    switch (style) {
      case 'text':
        return (
          <Text
            style={[
              styles.text,
              disabled && styles.textDisabled,
              isBlocked && styles.textBlocked,
            ]}
          >
            {buttonText}
          </Text>
        );

      case 'compact':
        return (
          <View style={styles.compactContent}>
            {renderIcon()}
            <Text
              style={[
                styles.compactText,
                disabled && styles.textDisabled,
                isBlocked && styles.textBlocked,
              ]}
            >
              {buttonText}
            </Text>
          </View>
        );

      case 'icon':
      default:
        return renderIcon();
    }
  };

  const renderRateLimitIndicator = () => {
    if (showRateLimit && !isBlocked) {
      return (
        <View style={styles.rateLimitContainer}>
          <Text style={styles.rateLimitText}>
            {t('blockButton_remaining')}: {rateLimit.remainingBlocks}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          disabled && styles.containerDisabled,
          isBlocked && styles.containerBlocked,
        ]}
        onPress={handlePress}
        disabled={
          disabled || isLoading || (!isBlocked && rateLimit.isLimitReached)
        }
        activeOpacity={0.7}
        accessibilityLabel={
          isBlocked
            ? `${t('blockButton_accessibility_unblock')} ${userName}`
            : `${t('blockButton_accessibility_block')} ${userName}`
        }
        accessibilityHint={
          isBlocked
            ? t('blockButton_accessibility_unblockHint')
            : t('blockButton_accessibility_blockHint')
        }
        accessibilityRole="button"
      >
        {renderContent()}
      </TouchableOpacity>

      {renderRateLimitIndicator()}

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={hideAlert}
        onConfirm={alertConfig.onConfirm}
        showCancel={!!alertConfig.onConfirm}
      />
    </>
  );
};
