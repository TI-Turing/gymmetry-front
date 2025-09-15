import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import FeedTabs from '@/components/feed/FeedTabs';
import FloatingCreateButton from '@/components/common/FloatingCreateButton';
import CreatePostScreen from '@/components/post/CreatePostScreenSimple';

function FeedScreen() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleOpenCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
  };

  return (
    <ScreenWrapper headerTitle="Feed" showBackButton={false}>
      <View style={{ flex: 1 }}>
        <FeedTabs />
        <FloatingCreateButton onPress={handleOpenCreatePost} />
        
        <Modal
          visible={showCreatePost}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCloseCreatePost}
        >
          <CreatePostScreen onClose={handleCloseCreatePost} />
        </Modal>
      </View>
    </ScreenWrapper>
  );
}

export default withWebLayout(FeedScreen, { defaultTab: 'feed' });
