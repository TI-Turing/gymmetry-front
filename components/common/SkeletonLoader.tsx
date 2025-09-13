import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useColorScheme } from '../useColorScheme';

export interface SkeletonItemProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
}

export const SkeletonItem: React.FC<SkeletonItemProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  marginBottom = 8,
}) => {
  const colorScheme = useColorScheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange:
      colorScheme === 'dark' ? ['#2a2a2a', '#3a3a3a'] : ['#e0e0e0', '#f0f0f0'],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number | 'auto' | `${number}%`,
          height,
          borderRadius,
          marginBottom,
          backgroundColor,
        },
      ]}
    />
  );
};

export interface FeedItemSkeletonProps {
  showAvatar?: boolean;
  showStats?: boolean;
}

export const FeedItemSkeleton: React.FC<FeedItemSkeletonProps> = ({
  showAvatar = true,
  showStats = true,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {showAvatar && (
          <SkeletonItem width={40} height={40} borderRadius={20} />
        )}
        <View style={styles.headerText}>
          <SkeletonItem width="70%" height={16} marginBottom={4} />
          <SkeletonItem width="40%" height={12} />
        </View>
        <SkeletonItem width={60} height={24} borderRadius={12} />
      </View>

      {/* Title */}
      <SkeletonItem width="85%" height={20} marginBottom={12} />

      {/* Content */}
      <SkeletonItem width="100%" height={16} marginBottom={6} />
      <SkeletonItem width="90%" height={16} marginBottom={6} />
      <SkeletonItem width="75%" height={16} marginBottom={16} />

      {/* Stats */}
      {showStats && (
        <View style={styles.stats}>
          <SkeletonItem width={60} height={14} marginBottom={0} />
          <SkeletonItem width={80} height={14} marginBottom={0} />
          <SkeletonItem width={70} height={14} marginBottom={0} />
        </View>
      )}

      {/* Tags */}
      <View style={styles.tags}>
        <SkeletonItem width={50} height={12} marginBottom={0} />
        <SkeletonItem width={65} height={12} marginBottom={0} />
      </View>
    </View>
  );
};

export interface SkeletonListProps {
  count?: number;
  itemType?: 'feed' | 'comment' | 'notification';
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  itemType = 'feed',
}) => {
  const renderSkeletonItem = () => {
    switch (itemType) {
      case 'feed':
        return <FeedItemSkeleton />;
      case 'comment':
        return (
          <View style={{ paddingLeft: 20, marginBottom: 16 }}>
            <FeedItemSkeleton showAvatar={true} showStats={false} />
          </View>
        );
      case 'notification':
        return (
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <SkeletonItem width={24} height={24} borderRadius={12} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <SkeletonItem width="60%" height={14} marginBottom={4} />
              <SkeletonItem width="40%" height={12} />
            </View>
          </View>
        );
      default:
        return <FeedItemSkeleton />;
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <React.Fragment key={`skeleton-${index}`}>
          {renderSkeletonItem()}
        </React.Fragment>
      ))}
    </>
  );
};

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#1A1A1A' : '#FFF',
      padding: 16,
      marginVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#E5E7EB',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    headerText: {
      flex: 1,
      marginLeft: 12,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    tags: {
      flexDirection: 'row',
      gap: 8,
    },
  });
};
