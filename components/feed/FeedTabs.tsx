import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import FeedList from './FeedList';
import {
  useFeedPagedAdapter,
  useFeedTrendingAdapter,
} from '../../hooks/useFeedAdapter';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';
import { mapFeedToFeedItem } from '@/types/feedTypes';
import { EnhancedTabBar, TabItem } from '../common/EnhancedTabBar';

const TABS = ['Feed', 'Trending'] as const;
type TabKey = (typeof TABS)[number];

const FeedTabs: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('Feed');
  const themed = useThemedStyles(styles);
  const paged = useFeedPagedAdapter();
  const trending = useFeedTrendingAdapter();

  // Configuración de tabs para EnhancedTabBar
  const tabs: TabItem[] = useMemo(
    () => [
      {
        id: 'Feed',
        label: 'Feed',
        icon: 'home',
        badgeCount: paged.data?.items?.length,
      },
      {
        id: 'Trending',
        label: 'Trending',
        icon: 'fire',
        badgeCount: trending.items?.length,
      },
    ],
    [paged.data?.items?.length, trending.items?.length]
  );

  // Mapear datos del backend a la estructura del frontend
  const feedItems = useMemo(() => {
    return (paged.data?.items || []).map(mapFeedToFeedItem);
  }, [paged.data?.items]);

  const trendingItems = useMemo(() => {
    return (trending.items || []).map(mapFeedToFeedItem);
  }, [trending.items]);

  const handleTabPress = (tabId: string) => {
    setTab(tabId as TabKey);
  };

  return (
    <View style={themed.container}>
      <EnhancedTabBar
        tabs={tabs}
        selectedTabId={tab}
        onTabPress={handleTabPress}
        variant="underline"
        showLabels={true}
        animated={true}
        iconSize={20}
      />

      {tab === 'Feed' && (
        <FeedList
          items={feedItems}
          loading={paged.loading}
          error={paged.error}
          refetch={paged.refetch}
        />
      )}
      {tab === 'Trending' && (
        <FeedList
          items={trendingItems}
          loading={trending.loading}
          error={trending.error}
          refetch={trending.refetch}
        />
      )}
    </View>
  );
};

export default FeedTabs;
