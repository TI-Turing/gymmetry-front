import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import FeedList from './FeedList';
import { useFeedTrendingAdapter } from '../../hooks/useFeedAdapter';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';
import { mapFeedToFeedItem, type FeedItem } from '@/types/feedTypes';
import { EnhancedTabBar, TabItem } from '../common/EnhancedTabBar';
import { useInfiniteFeedWithTracking } from '@/hooks/useInfiniteFeedWithTracking';

const TABS = ['Feed', 'Trending'] as const;
type TabKey = (typeof TABS)[number];

interface FeedTabsProps {
  onCreatePost?: () => void;
  onScrollDirectionChange?: (isScrollingDown: boolean) => void;
}

const FeedTabs: React.FC<FeedTabsProps> = ({
  onCreatePost,
  onScrollDirectionChange,
}) => {
  const [tab, setTab] = useState<TabKey>('Feed');
  const themed = useThemedStyles(styles);

  // Nuevo sistema: infinite scroll con tracking de feeds vistos
  const { state: infiniteFeedState, actions: feedActions } =
    useInfiniteFeedWithTracking();

  // Trending sigue usando el sistema anterior (no requiere tracking)
  const trending = useFeedTrendingAdapter();

  // Configuración de tabs para EnhancedTabBar
  const tabs: TabItem[] = useMemo(
    () => [
      {
        id: 'Feed',
        label: 'Feed',
        icon: 'home',
        badgeCount: infiniteFeedState.unviewedCount || undefined,
      },
      {
        id: 'Trending',
        label: 'Trending',
        icon: 'fire',
        badgeCount: trending.items?.length,
      },
    ],
    [infiniteFeedState.unviewedCount, trending.items?.length]
  );

  // Mapear datos del backend a la estructura del frontend
  const feedItems = useMemo(() => {
    return infiniteFeedState.feeds.map(mapFeedToFeedItem);
  }, [infiniteFeedState.feeds]);

  const trendingItems = useMemo(() => {
    return (trending.items || []).map(mapFeedToFeedItem);
  }, [trending.items]);

  const handleTabPress = (tabId: string) => {
    setTab(tabId as TabKey);
  };

  // Wrapper para convertir actualizaciones de FeedItem (camelCase) a Feed (PascalCase)
  const handleFeedItemUpdate = (feedId: string, updates: Partial<FeedItem>) => {
    const backendUpdates: Record<string, unknown> = {};

    if (updates.likesCount !== undefined)
      backendUpdates.LikesCount = updates.likesCount;
    if (updates.isLiked !== undefined) {
      backendUpdates.IsLiked = updates.isLiked;
      backendUpdates.IsLikedByCurrentUser = updates.isLiked; // Alias alternativo
    }
    if (updates.commentsCount !== undefined)
      backendUpdates.CommentsCount = updates.commentsCount;
    if (updates.sharesCount !== undefined)
      backendUpdates.SharesCount = updates.sharesCount;

    feedActions.updateFeedItem(feedId, backendUpdates);
  };

  return (
    <View style={themed.container}>
      <EnhancedTabBar
        tabs={tabs}
        selectedTabId={tab}
        onTabPress={handleTabPress}
        variant="underline"
        showLabels={false}
        animated={true}
        iconSize={20}
      />
      
      {/* Espaciado entre tabs y contenido */}
      <View style={{ height: 16 }} />

      {tab === 'Feed' && (
        <FeedList
          items={feedItems}
          loading={infiniteFeedState.loading}
          error={infiniteFeedState.error}
          refetch={feedActions.refresh}
          onCreatePost={onCreatePost}
          onEndReached={feedActions.loadMore}
          hasMore={infiniteFeedState.hasMore}
          unviewedCount={infiniteFeedState.unviewedCount}
          onFeedItemUpdate={handleFeedItemUpdate}
          onScrollDirectionChange={onScrollDirectionChange}
        />
      )}
      {tab === 'Trending' && (
        <FeedList
          items={trendingItems}
          loading={trending.loading}
          error={trending.error}
          refetch={trending.refetch}
          onCreatePost={onCreatePost}
          onScrollDirectionChange={onScrollDirectionChange}
        />
      )}
    </View>
  );
};

export default FeedTabs;
