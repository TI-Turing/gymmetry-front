import React from 'react';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import FeedTabs from '@/components/feed/FeedTabs';

function FeedScreen() {
  return (
    <ScreenWrapper headerTitle="Feed" showBackButton={false}>
      <FeedTabs />
    </ScreenWrapper>
  );
}

export default withWebLayout(FeedScreen, { defaultTab: 'feed' });
