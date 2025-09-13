import React, { useState, useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import SmartImage from '@/components/common/SmartImage';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { ReactionsBar, useReactions } from '../common/ReactionsBar';
import { ReactionAnimation } from '../common/ReactionAnimation';
import { EditPostButton } from '../common/EditPostButton';
import { ReportButton } from '../common/ReportButton';
import { createUnifiedPostCardStyles } from './styles/unifiedPostCard';
import type { FeedItem } from '@/types/feedTypes';
import { useAuth } from '@/contexts/AuthContext';

export interface UnifiedPostCardProps {
  post: FeedItem;
  onToggleLike?: (postId: string) => void;
  onOpenComments?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onPostUpdated?: (updatedPost: FeedItem) => void;
  isAnonymousActive?: boolean;
  currentUserId?: string;
  showActions?: boolean;
  showEdit?: boolean;
  showReport?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const UnifiedPostCard: React.FC<UnifiedPostCardProps> = ({
  post,
  onToggleLike,
  onOpenComments,
  onShare,
  onPostUpdated,
  isAnonymousActive = false,
  currentUserId,
  showActions = true,
  showEdit = true,
  showReport = true,
  variant = 'default',
}) => {
  const themed = useThemedStyles(createUnifiedPostCardStyles) as ReturnType<
    typeof createUnifiedPostCardStyles
  >;
  const { user: authUser } = useAuth();
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(
    null
  );

  // Usar el usuario real del contexto de autenticación
  const realCurrentUserId = currentUserId || authUser?.id;

  // Hook para manejar reacciones
  const { reactions, addReaction, totalReactions } = useReactions({
    postId: post.id,
    initialReactions: [
      {
        emoji: '❤️',
        name: 'love',
        count: post.likesCount || 0,
        userReacted: false,
      },
      {
        emoji: '👍',
        name: 'like',
        count: Math.floor((post.likesCount || 0) * 0.3),
        userReacted: false,
      },
      {
        emoji: '💪',
        name: 'strong',
        count: Math.floor((post.likesCount || 0) * 0.2),
        userReacted: false,
      },
      {
        emoji: '🔥',
        name: 'fire',
        count: Math.floor((post.likesCount || 0) * 0.15),
        userReacted: false,
      },
    ],
  });

  // Computar información del usuario con datos reales del contexto
  const userInfo = useMemo(() => {
    const fallback = authUser?.userName || authUser?.email || 'Usuario';
    let userName = post.authorName || post.author?.name || fallback;
    let avatarUrl = post.author?.avatar || 'https://via.placeholder.com/40';

    if (
      isAnonymousActive &&
      (!post.author?.id || post.author?.id === realCurrentUserId)
    ) {
      userName = 'Anónimo';
      avatarUrl = 'https://via.placeholder.com/40?text=Anon';
    }

    return { userName, avatarUrl };
  }, [post, isAnonymousActive, realCurrentUserId, authUser]);

  // Computar fechas
  const timeAgo = useMemo(() => {
    if (!post.createdAt) return 'Sin fecha';

    const now = new Date();
    const created = new Date(post.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    return created.toLocaleDateString();
  }, [post.createdAt]);

  // Handlers para acciones
  const handleReactionPress = useCallback(
    (emoji: string) => {
      setAnimatingReaction(emoji);
      addReaction(emoji);
    },
    [addReaction]
  );

  const handleAddReaction = useCallback(
    (emoji: string) => {
      setAnimatingReaction(emoji);
      addReaction(emoji);
    },
    [addReaction]
  );

  const handleLike = useCallback(() => {
    onToggleLike?.(post.id);
  }, [onToggleLike, post.id]);

  const handleComments = useCallback(() => {
    onOpenComments?.(post.id);
  }, [onOpenComments, post.id]);

  const handleShare = useCallback(() => {
    onShare?.(post.id);
  }, [onShare, post.id]);

  // Determinar estilos según variante
  const cardStyle = [
    themed.card,
    variant === 'compact' && themed.cardCompact,
    variant === 'detailed' && themed.cardDetailed,
  ];

  const contentStyle = [
    themed.content,
    variant === 'compact' && themed.contentCompact,
  ];

  return (
    <View style={cardStyle}>
      {/* Animación de reacción */}
      <ReactionAnimation
        emoji={animatingReaction || ''}
        visible={!!animatingReaction}
        onAnimationComplete={() => setAnimatingReaction(null)}
      />

      {/* Header con usuario */}
      <View style={themed.header}>
        <SmartImage
          uri={userInfo.avatarUrl}
          style={themed.avatar}
          deferOnDataSaver={false}
        />

        <View style={themed.userInfo}>
          <Text style={themed.userName}>{userInfo.userName}</Text>
          <Text style={themed.time}>{timeAgo}</Text>
        </View>

        {variant !== 'compact' && (
          <View style={themed.headerActions}>
            {/* Status indicator */}
            <View
              style={[
                themed.statusBadge,
                post.isPublic ? themed.statusPublic : themed.statusPrivate,
              ]}
            >
              <Text style={themed.statusText}>
                {post.isPublic ? '🌍' : '🔒'}
              </Text>
            </View>

            {/* Menu button */}
            <TouchableOpacity style={themed.menuButton}>
              <FontAwesome name="ellipsis-h" size={16} color="#B0B0B0" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Título (si existe) */}
      {post.title && variant !== 'compact' && (
        <Text style={themed.title}>{post.title}</Text>
      )}

      {/* Contenido */}
      {post.content && (
        <Text
          style={contentStyle}
          numberOfLines={variant === 'compact' ? 3 : undefined}
        >
          {post.content}
        </Text>
      )}

      {/* Media (si existe) */}
      {post.mediaUrl && (
        <SmartImage
          uri={post.mediaUrl}
          style={[themed.media, variant === 'compact' && themed.mediaCompact]}
          deferOnDataSaver
          label="Cargar imagen"
        />
      )}

      {/* Tags */}
      {post.tags && variant !== 'compact' && (
        <View style={themed.tagsContainer}>
          <Text style={themed.tags}>
            #
            {Array.isArray(post.tags)
              ? post.tags.join(' #')
              : post.tags.replace(/,/g, ' #')}
          </Text>
        </View>
      )}

      {/* Barra de reacciones */}
      <ReactionsBar
        reactions={reactions}
        onReactionPress={handleReactionPress}
        onAddReaction={handleAddReaction}
        totalReactions={totalReactions}
        maxVisible={variant === 'compact' ? 3 : 5}
        showAddButton={variant !== 'compact'}
      />

      {/* Acciones principales */}
      {showActions && (
        <View style={themed.actions}>
          <TouchableOpacity style={themed.actionButton} onPress={handleLike}>
            <FontAwesome name="heart-o" size={18} color="#B0B0B0" />
            <Text style={themed.actionText}>{post.likesCount || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={themed.actionButton}
            onPress={handleComments}
          >
            <FontAwesome name="comment-o" size={18} color="#B0B0B0" />
            <Text style={themed.actionText}>{post.commentsCount || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={themed.actionButton} onPress={handleShare}>
            <FontAwesome name="share" size={18} color="#B0B0B0" />
            <Text style={themed.actionText}>{post.sharesCount || 0}</Text>
          </TouchableOpacity>

          {/* Total de reacciones */}
          {totalReactions > 0 && (
            <View style={themed.totalReactions}>
              <Text style={themed.totalReactionsText}>
                {totalReactions} reacciones
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Acciones de moderación */}
      {(showEdit || showReport) && variant !== 'compact' && (
        <View style={themed.moderationActions}>
          {showEdit && (
            <EditPostButton
              post={post}
              onPostUpdated={onPostUpdated}
              canEdit={post.author?.id === currentUserId}
            />
          )}

          {showReport && (
            <ReportButton
              contentId={post.id}
              contentType="post"
              size="small"
              showText={false}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default UnifiedPostCard;
