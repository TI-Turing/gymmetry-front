import React from 'react';
import { View } from 'react-native';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import FeedTabs from '@/components/feed/FeedTabs';
import FloatingCreateButton from '@/components/common/FloatingCreateButton';

function FeedScreen() {
  return (
    <ScreenWrapper headerTitle="Feed" showBackButton={false}>
      <View style={{ flex: 1 }}>
        <FeedTabs />
        <FloatingCreateButton />
      </View>
    </ScreenWrapper>
  );
}

export default withWebLayout(FeedScreen, { defaultTab: 'feed' });
