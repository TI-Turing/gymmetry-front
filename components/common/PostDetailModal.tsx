import React, { useState, useRef } from 'react';
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Image,
  Alert,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import type { FeedItem } from '@/types/feedTypes';
import { SmartImage } from './SmartImage';
import { DynamicImage } from './DynamicImage';
import { useFeedComments, useFeedInteractions } from '@/hooks/useFeed';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const CLOSE_THRESHOLD = 100;

export interface PostDetailModalProps {
  visible: boolean;
  post: FeedItem | null;
  onClose: () => void;
  onToggleLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  currentUserId?: string;
  isAnonymousActive?: boolean;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  visible,
  post,
  onClose,
  onToggleLike,
  onShare,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const translateY = useRef(new Animated.Value(0)).current;

  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Solo activar si estamos en la parte superior del scroll y deslizamos hacia abajo
        const isDraggingDown = gestureState.dy > 5;
        const isAtTop = scrollY <= 0;
        return isDraggingDown && isAtTop;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0 && scrollY <= 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > CLOSE_THRESHOLD && scrollY <= 0) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const {
    data: commentsData,
    loading: commentsLoading,
    refetch: refetchComments,
  } = useFeedComments(post?.id || '', 1, 50, { enabled: visible });

  const { addComment } = useFeedInteractions(post?.id || '');

  const comments = (commentsData?.items || []) as unknown[];

  if (!post || !visible) return null;

  const authorName =
    post.author?.name || post.authorName || post.userName || 'Usuario';
  const authorAvatar = post.author?.avatar || post.authorAvatar;
  const mediaUrl =
    post.mediaUrls && post.mediaUrls.length > 0
      ? post.mediaUrls[0]
      : post.mediaUrl;

  const totalReactions = (post.likesCount || 0) + (post.commentsCount || 0) + (post.sharesCount || 0);

  const handleToggleLike = () => {
    if (onToggleLike) {
      onToggleLike(post.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.id);
    } else {
      Alert.alert('Compartir', 'Funcionalidad de compartir próximamente');
    }
  };

  const handleReport = () => {
    setShowOptionsMenu(false);
    Alert.alert(
      'Reportar publicación',
      '¿Estás seguro de que quieres reportar esta publicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reportar', style: 'destructive', onPress: () => {
          Alert.alert('Reportado', 'Esta publicación ha sido reportada.');
        }},
      ]
    );
  };

  const handleHide = () => {
    setShowOptionsMenu(false);
    Alert.alert(
      'Ocultar publicación',
      '¿Quieres dejar de ver publicaciones de este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ocultar',
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar lógica de ocultar usuario en el backend
            onClose();
          },
        },
      ]
    );
  };

  const handleImagePress = () => {
    setImageViewerVisible(true);
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const resp = await addComment(commentText.trim(), false);
      if (resp?.Success) {
        setCommentText('');
        await refetchComments();
        Alert.alert('Éxito', 'Comentario agregado correctamente');
      } else {
        Alert.alert('Error', resp?.Message || 'No se pudo agregar el comentario');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al enviar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComment = ({ item: comment }: { item: any }) => {
    // Los campos vienen en PascalCase del backend .NET
    const commentData = comment as any;
    const userName = commentData.UserName || commentData.userName || 'Anónimo';
    const content = commentData.Content || commentData.content || '';
    const createdAt = commentData.CreatedAt || commentData.createdAt;
    const userAvatar = commentData.UserProfilePicture || commentData.userProfilePicture;

    return (
      <View style={[styles.commentItem, { borderBottomColor: colors.border }]}>
        <View style={styles.commentHeader}>
          {userAvatar ? (
            <SmartImage
              uri={userAvatar}
              style={styles.commentAvatar}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.commentAvatar,
                styles.avatarPlaceholder,
                { backgroundColor: colors.border },
              ]}
            >
              <FontAwesome name="user" size={14} color={colors.textMuted} />
            </View>
          )}
          <View style={styles.commentContent}>
            <Text style={[styles.commentAuthor, { color: colors.text }]}>
              {userName}
            </Text>
            <Text style={[styles.commentText, { color: colors.text }]}>
              {content}
            </Text>
            {createdAt && (
              <Text style={[styles.commentTime, { color: colors.textMuted }]}>
                {new Date(createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <Animated.View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
              { transform: [{ translateY }] },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.dragIndicatorContainer}>
              <View
                style={[
                  styles.dragIndicator,
                  { backgroundColor: colors.border },
                ]}
              />
            </View>

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.authorContainer}>
                {authorAvatar ? (
                  <SmartImage
                    uri={authorAvatar}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      styles.avatarPlaceholder,
                      { backgroundColor: colors.border },
                    ]}
                  >
                    <FontAwesome name="user" size={20} color={colors.textMuted} />
                  </View>
                )}
                <View style={styles.authorInfo}>
                  <Text style={[styles.authorName, { color: colors.text }]}>
                    {authorName}
                  </Text>
                  <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                    {new Date(post.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.optionsButton}
                onPress={() => setShowOptionsMenu(!showOptionsMenu)}
              >
                <FontAwesome name="ellipsis-v" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {showOptionsMenu && (
              <View style={[styles.optionsMenu, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TouchableOpacity style={styles.optionItem} onPress={handleReport}>
                  <FontAwesome name="flag" size={18} color={colors.textMuted} />
                  <Text style={[styles.optionText, { color: colors.text }]}>Reportar publicación</Text>
                </TouchableOpacity>
                <View style={[styles.optionDivider, { backgroundColor: colors.border }]} />
                <TouchableOpacity style={styles.optionItem} onPress={handleHide}>
                  <FontAwesome name="eye-slash" size={18} color={colors.textMuted} />
                  <Text style={[styles.optionText, { color: colors.text }]}>Ocultar</Text>
                </TouchableOpacity>
              </View>
            )}

            <ScrollView
              ref={scrollViewRef}
              style={styles.content}
              showsVerticalScrollIndicator={false}
              onScroll={(event) => {
                setScrollY(event.nativeEvent.contentOffset.y);
              }}
              scrollEventThrottle={16}
            >
              {post.content && (
                <Text style={[styles.postContent, { color: colors.text }]}>
                  {post.content}
                </Text>
              )}

              {mediaUrl && (
                <TouchableOpacity onPress={handleImagePress} activeOpacity={0.9}>
                  <DynamicImage
                    uri={mediaUrl}
                    maxHeight={400}
                    mediaType={post.mediaType}
                  />
                </TouchableOpacity>
              )}

              {totalReactions > 0 && (
                <View style={styles.totalReactionsContainer}>
                  <Text style={[styles.totalReactionsText, { color: colors.textMuted }]}>
                    {totalReactions} {totalReactions === 1 ? 'reacción' : 'reacciones'}
                  </Text>
                </View>
              )}

              <View style={[styles.actionsBar, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleToggleLike}
                >
                  <FontAwesome
                    name={post.isLiked ? 'heart' : 'heart-o'}
                    size={22}
                    color={post.isLiked ? Colors.light.tint : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      {
                        color: post.isLiked
                          ? Colors.light.tint
                          : colors.textMuted,
                      },
                    ]}
                  >
                    {post.likesCount || 0}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesome
                    name="comment-o"
                    size={22}
                    color={colors.textMuted}
                  />
                  <Text style={[styles.actionText, { color: colors.textMuted }]}>
                    {post.commentsCount || 0}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                  <FontAwesome name="share" size={22} color={colors.textMuted} />
                  <Text style={[styles.actionText, { color: colors.textMuted }]}>
                    {post.sharesCount || 0}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.commentsSection}>
                <Text style={[styles.commentsSectionTitle, { color: colors.text }]}>
                  Comentarios ({post.commentsCount || 0})
                </Text>
                
                {commentsLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                      Cargando comentarios...
                    </Text>
                  </View>
                ) : comments.length === 0 ? (
                  <View style={styles.emptyCommentsContainer}>
                    <FontAwesome name="comment-o" size={48} color={colors.border} />
                    <Text style={[styles.emptyCommentsText, { color: colors.textMuted }]}>
                      No hay comentarios aún
                    </Text>
                    <Text style={[styles.emptyCommentsSubtext, { color: colors.textMuted }]}>
                      Sé el primero en comentar
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={comments}
                    renderItem={renderComment}
                    keyExtractor={(item: unknown, index: number) => {
                      const commentItem = item as { Id?: string; id?: string };
                      return commentItem.Id || commentItem.id || `comment-${index}`;
                    }}
                    scrollEnabled={false}
                  />
                )}
              </View>
            </ScrollView>

            {/* Input de comentarios fijo en la parte inferior */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View
                style={[
                  styles.commentInputContainer,
                  { backgroundColor: colors.background, borderTopColor: colors.border },
                ]}
              >
                <TextInput
                  style={[
                    styles.commentInput,
                    { color: colors.text, backgroundColor: colors.card },
                  ]}
                  placeholder="Escribe un comentario..."
                  placeholderTextColor={colors.textMuted}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor:
                        commentText.trim() && !isSubmitting
                          ? Colors.light.tint
                          : colors.border,
                    },
                  ]}
                  onPress={handleSendComment}
                  disabled={!commentText.trim() || isSubmitting}
                >
                  <FontAwesome
                    name="send"
                    size={18}
                    color={commentText.trim() && !isSubmitting ? '#FFF' : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>

      {imageViewerVisible && mediaUrl && (
        <Modal
          visible={imageViewerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setImageViewerVisible(false)}
        >
          <View style={styles.imageViewerContainer}>
            <TouchableOpacity
              style={styles.imageViewerClose}
              onPress={() => setImageViewerVisible(false)}
            >
              <FontAwesome name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <Image
              source={{ uri: mediaUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  dragIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  optionsButton: {
    padding: 8,
  },
  optionsMenu: {
    position: 'absolute',
    top: 70,
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  optionText: {
    fontSize: 15,
  },
  optionDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  postImage: {
    width: '100%',
    height: 400,
  },
  totalReactionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  totalReactionsText: {
    fontSize: 14,
  },
  actionsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  emptyCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  commentItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  commentHeader: {
    flexDirection: 'row',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    marginLeft: 12,
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    fontSize: 12,
    marginTop: 4,
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
