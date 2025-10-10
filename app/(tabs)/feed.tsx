import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import FeedTabs from '@/components/feed/FeedTabs';
import FloatingCreateButton from '@/components/common/FloatingCreateButton';
import CreatePostScreen from '@/components/post/CreatePostScreenSimple';
import { useAppState } from '@/contexts/AppStateContext';

function FeedScreen() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const { refreshAll } = useAppState();

  const handleOpenCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
  };

  const handlePostCreated = async () => {
    // Refrescar los datos del feed después de crear un post
    await refreshAll();
  };

  const handleScrollDirectionChange = (isScrollingDown: boolean) => {
    setShowFloatingButton(!isScrollingDown);
  };

  return (
    <ScreenWrapper headerTitle="Feed" showBackButton={false}>
      <View style={{ flex: 1 }}>
        <FeedTabs
          onCreatePost={handleOpenCreatePost}
          onScrollDirectionChange={handleScrollDirectionChange}
        />
        <FloatingCreateButton
          onPress={handleOpenCreatePost}
          visible={showFloatingButton}
        />

        <Modal
          visible={showCreatePost}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCloseCreatePost}
        >
          <CreatePostScreen
            onClose={handleCloseCreatePost}
            onPostCreated={handlePostCreated}
          />
        </Modal>
      </View>
    </ScreenWrapper>
  );
}

export default withWebLayout(FeedScreen, { defaultTab: 'feed' });
