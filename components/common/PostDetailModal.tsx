import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { UnifiedPostCard } from './UnifiedPostCard';
import { EnhancedCommentsModal } from '../social/EnhancedCommentsModal';
import { createPostDetailModalStyles } from './styles/postDetailModal';
import type { FeedItem } from '@/types/feedTypes';

export interface PostDetailModalProps {
  visible: boolean;
  post: FeedItem | null;
  onClose: () => void;
  onToggleLike?: (postId: string) => void;
  onPostUpdated?: (updatedPost: FeedItem) => void;
  currentUserId?: string;
  isAnonymousActive?: boolean;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  visible,
  post,
  onClose,
  onToggleLike,
  onPostUpdated,
  currentUserId,
  isAnonymousActive = false,
}) => {
  const styles = useThemedStyles(createPostDetailModalStyles);
  const [activeTab, setActiveTab] = useState<'comments' | 'reactions'>(
    'comments'
  );

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.contentContainer}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Publicación</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Post Content */}
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <UnifiedPostCard
                post={post}
                onToggleLike={onToggleLike}
                onPostUpdated={onPostUpdated}
                currentUserId={currentUserId}
                variant="detailed"
              />

              {/* Tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === 'comments' && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab('comments')}
                >
                  <FontAwesome
                    name="comment"
                    size={16}
                    color={activeTab === 'comments' ? '#FF6B35' : '#888'}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'comments' && styles.tabTextActive,
                    ]}
                  >
                    Comentarios ({post.commentsCount || 0})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === 'reactions' && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab('reactions')}
                >
                  <FontAwesome
                    name="heart"
                    size={16}
                    color={activeTab === 'reactions' ? '#FF6B35' : '#888'}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'reactions' && styles.tabTextActive,
                    ]}
                  >
                    Reacciones ({post.likesCount || 0})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab Content */}
              <View style={styles.tabContent}>
                {activeTab === 'comments' ? (
                  <View style={styles.commentsWrapper}>
                    {/* TODO: Integrar EnhancedCommentsModal content */}
                    <Text style={styles.placeholderText}>
                      Comentarios próximamente
                    </Text>
                  </View>
                ) : (
                  <View style={styles.reactionsWrapper}>
                    <View style={styles.placeholderContainer}>
                      <FontAwesome name="users" size={48} color="#888" />
                      <Text style={styles.placeholderText}>
                        {post.likesCount === 0
                          ? 'No hay reacciones aún'
                          : `${post.likesCount} ${post.likesCount === 1 ? 'persona reaccionó' : 'personas reaccionaron'}`}
                      </Text>
                      <Text style={styles.placeholderSubtext}>
                        Información detallada pendiente (backend)
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Comments Modal (renders as separate modal) */}
      {activeTab === 'comments' && (
        <EnhancedCommentsModal
          visible={false}
          feedId={post.id}
          onClose={() => {}}
          currentUserId={currentUserId}
          isAnonymousActive={isAnonymousActive}
        />
      )}
    </Modal>
  );
};
