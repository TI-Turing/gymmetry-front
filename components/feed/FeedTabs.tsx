import React, { useState } from 'react';
import { View } from 'react-native';
import FeedList from './FeedList';
import { useFeedPaged, useFeedTrending } from '../../hooks/useFeed';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';
import type { FeedItem } from './FeedList';

const TABS = ['Feed', 'Trending'] as const;
type TabKey = (typeof TABS)[number];

const FeedTabs: React.FC = () => {
  const [tab, _setTab] = useState<TabKey>('Feed');
  const themed = useThemedStyles(styles);
  const paged = useFeedPaged();
  const trending = useFeedTrending();

  return (
    <View style={themed.container}>
      {/* Aquí iría un componente de tabs reutilizable, puedes usar el de progreso si lo deseas */}
      {/* <ProgressTabBar tabs={TABS} selected={tab} onSelect={_setTab} /> */}
      {tab === 'Feed' && (
        <FeedList
          items={((paged.data?.items as unknown[]) || []) as FeedItem[]}
          loading={paged.loading}
          error={paged.error}
          refetch={paged.refetch}
        />
      )}
      {tab === 'Trending' && (
        <FeedList
          items={((trending.items as unknown[]) || []) as FeedItem[]}
          loading={trending.loading}
          error={trending.error}
          refetch={trending.refetch}
        />
      )}
    </View>
  );
};

export default FeedTabs;
