import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { SPACING, BORDER_RADIUS } from '@/constants/Theme';

interface FeedSkeletonProps {
  count?: number;
}

const SkeletonItem = ({ isDark }: { isDark: boolean }) => (
  <View style={[styles.card, { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }]}>
    {/* Header skeleton */}
    <View style={styles.header}>
      <View
        style={[
          styles.avatar,
          { backgroundColor: isDark ? '#333' : '#E5E7EB' },
        ]}
      />
      <View style={styles.userInfo}>
        <View
          style={[
            styles.userNameSkeleton,
            { backgroundColor: isDark ? '#333' : '#E5E7EB' },
          ]}
        />
        <View
          style={[
            styles.timeSkeleton,
            { backgroundColor: isDark ? '#333' : '#E5E7EB' },
          ]}
        />
      </View>
    </View>

    {/* Content skeleton */}
    <View
      style={[
        styles.contentLine,
        { backgroundColor: isDark ? '#333' : '#E5E7EB' },
      ]}
    />
    <View
      style={[
        styles.contentLine,
        styles.contentLineShort,
        { backgroundColor: isDark ? '#333' : '#E5E7EB' },
      ]}
    />

    {/* Media skeleton */}
    <View
      style={[
        styles.mediaSkeleton,
        { backgroundColor: isDark ? '#333' : '#E5E7EB' },
      ]}
    />

    {/* Actions skeleton */}
    <View style={styles.actions}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.actionButton,
            { backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8' },
          ]}
        />
      ))}
    </View>
  </View>
);

export const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ count = 3 }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} isDark={isDark} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  userNameSkeleton: {
    width: 120,
    height: 16,
    borderRadius: 4,
    marginBottom: 6,
  },
  timeSkeleton: {
    width: 80,
    height: 12,
    borderRadius: 4,
  },
  contentLine: {
    height: 14,
    borderRadius: 4,
    marginBottom: 8,
  },
  contentLineShort: {
    width: '70%',
    marginBottom: SPACING.md,
  },
  mediaSkeleton: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: SPACING.sm,
  },
  actionButton: {
    width: 60,
    height: 28,
    borderRadius: BORDER_RADIUS.md,
  },
});

export default FeedSkeleton;
