import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

interface UserProfileLinkProps {
  userId: string;
  userName: string;
  isAnonymous?: boolean;
  style?: object;
  textStyle?: object;
}

const UserProfileLink: React.FC<UserProfileLinkProps> = ({
  userId,
  userName,
  isAnonymous = false,
  style,
  textStyle,
}) => {
  const handlePress = () => {
    if (isAnonymous || !userId) {
      return; // No navegar si es anónimo o sin ID
    }

    // Navegar a la pantalla de perfil del usuario
    router.push({
      pathname: '/user-profile',
      params: { userId, userName },
    });
  };

  const displayName = isAnonymous ? 'Anónimo' : userName || 'Usuario';

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={isAnonymous || !userId}
    >
      <Text
        style={[
          styles.userName,
          textStyle,
          isAnonymous && styles.anonymousText,
          (!userId || isAnonymous) && styles.disabledText,
        ]}
      >
        {displayName}
      </Text>
      {!isAnonymous && userId && <Text style={styles.linkIndicator}>👤</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    textDecorationLine: 'underline',
  },
  anonymousText: {
    color: '#666',
    textDecorationLine: 'none',
    fontStyle: 'italic',
  },
  disabledText: {
    color: '#666',
    textDecorationLine: 'none',
  },
  linkIndicator: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.7,
  },
});

export default UserProfileLink;
