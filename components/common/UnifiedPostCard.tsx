import React, { useState, useCallback, useMemo } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import SmartImage from '@/components/common/SmartImage';
import DynamicImage from '@/components/common/DynamicImage';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useReactions } from '../common/ReactionsBar';
import { ReactionAnimation } from '../common/ReactionAnimation';
import { FloatingReactionsPicker } from '../common/FloatingReactionsPicker';
import { EditPostButton } from '../common/EditPostButton';
import { PostDetailModal } from '../common/PostDetailModal';
import { createUnifiedPostCardStyles } from './styles/unifiedPostCard';
import type { FeedItem } from '@/types/feedTypes';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

export interface UnifiedPostCardProps {
  post: FeedItem;
  onToggleLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onPostUpdated?: (updatedPost: FeedItem) => void;
  isAnonymousActive?: boolean;
  currentUserId?: string;
  showActions?: boolean;
  showEdit?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const UnifiedPostCard: React.FC<UnifiedPostCardProps> = ({
  post,
  onToggleLike,
  onShare,
  onPostUpdated,
  isAnonymousActive = false,
  currentUserId,
  showActions = true,
  showEdit = true,
  variant = 'default',
}) => {
  const themed = useThemedStyles(createUnifiedPostCardStyles) as ReturnType<
    typeof createUnifiedPostCardStyles
  >;
  const { user: authUser } = useAuth();
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReactionsPicker, setShowReactionsPicker] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const likeButtonRef = React.useRef<any>(null);

  // Usar el usuario real del contexto de autenticación
  const realCurrentUserId = currentUserId || authUser?.id;

  // Hook para manejar reacciones
  const { addReaction, totalReactions } = useReactions({
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
    // Verificar si el post es anónimo (IsAnonymous = true en el backend)
    const isPostAnonymous =
      (post as unknown as { IsAnonymous?: boolean; isAnonymous?: boolean })
        .IsAnonymous === true ||
      (post as unknown as { IsAnonymous?: boolean; isAnonymous?: boolean })
        .isAnonymous === true;

    // Si el post es anónimo, mostrar "Anónimo" con icono genérico
    if (isPostAnonymous) {
      return {
        userName: 'Anónimo',
        avatarUrl: require('@/assets/images/icon.png'),
      };
    }

    // Usar datos del autor del post (no del usuario actual)
    const userName =
      post.authorName || post.author?.name || post.userName || 'Anónimo';
    const avatarUrl =
      post.author?.avatar ||
      post.authorAvatar ||
      post.userProfilePicture ||
      null;

    return { userName, avatarUrl };
  }, [post]);

  // Computar fechas
  const timeAgo = useMemo(() => {
    if (!post.createdAt) return 'Sin fecha';

    try {
      const now = new Date();
      
      // Fix timezone: Si la fecha no tiene 'Z' al final, agregarla para parsear como UTC
      let dateString = post.createdAt;
      if (
        dateString.includes('T') &&
        !dateString.endsWith('Z') &&
        !dateString.includes('+') &&
        !dateString.includes('-', 10)
      ) {
        // Formato ISO sin timezone (ej: "2025-10-09T16:51:21.667")
        dateString = dateString + 'Z';
      }
      
      const created = new Date(dateString);

      // Validar que la fecha sea válida
      if (isNaN(created.getTime())) {
        return 'Fecha inválida';
      }

      const diffMs = now.getTime() - created.getTime();

      // Si la diferencia es negativa, la fecha está en el futuro
      if (diffMs < 0) {
        return 'Recién ahora';
      }

      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);

      // Menos de 1 minuto
      if (diffMins < 1) return 'Recién ahora';

      // Menos de 60 minutos
      if (diffMins < 60) return `hace ${diffMins}m`;

      // Menos de 24 horas
      if (diffHours < 24) return `hace ${diffHours}h`;

      // Calcular si es ayer
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday =
        created.getDate() === yesterday.getDate() &&
        created.getMonth() === yesterday.getMonth() &&
        created.getFullYear() === yesterday.getFullYear();

      if (isYesterday) {
        const hours = created.getHours();
        const minutes = created.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `ayer a las ${displayHours}:${displayMinutes} ${ampm}`;
      }

      // Más de un día: mostrar fecha completa
      return created.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year:
          created.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }, [post.createdAt]);

  // Handlers para acciones
  const handleLike = useCallback(() => {
    onToggleLike?.(post.id);
  }, [onToggleLike, post.id]);

  const handleComments = useCallback(() => {
    // Abrir el modal de detalle para mostrar comentarios
    setShowDetailModal(true);
  }, []);

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

  const handleOpenDetail = useCallback(() => {
    setShowDetailModal(true);
  }, []);

  const handleLongPressLike = useCallback(() => {
    if (likeButtonRef.current) {
      likeButtonRef.current.measure(
        (
          _x: number,
          _y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          const PICKER_HEIGHT = 60; // Altura aproximada del picker
          const SPACING = 8; // Espacio entre el botón y el picker

          // Calcular espacio disponible arriba
          const spaceAbove = pageY;
          
          // Preferir mostrar arriba si hay espacio suficiente
          const showAbove = spaceAbove > PICKER_HEIGHT + SPACING;

          const posY = showAbove
            ? pageY - PICKER_HEIGHT - SPACING
            : pageY + height + SPACING;

          setPickerPosition({
            x: pageX,
            y: posY,
          });
          setShowReactionsPicker(true);
        }
      );
    } else {
      setShowReactionsPicker(true);
    }
  }, []);

  const handleReactionSelect = useCallback(
    (emoji: string) => {
      setShowReactionsPicker(false);
      setAnimatingReaction(emoji);
      addReaction(emoji);
    },
    [addReaction]
  );

  const handleReport = useCallback(() => {
    setShowOptionsMenu(false);
    Alert.alert(
      'Reportar publicación',
      '¿Estás seguro de que quieres reportar esta publicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reportar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Reportado', 'Esta publicación ha sido reportada.');
          },
        },
      ]
    );
  }, []);

  const handleHide = useCallback(() => {
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
            // TODO: Implementar lógica de ocultar usuario
          },
        },
      ]
    );
  }, []);

  return (
    <>
      <View style={cardStyle}>
        {/* Animación de reacción */}
        <ReactionAnimation
          emoji={animatingReaction || ''}
          visible={!!animatingReaction}
          onAnimationComplete={() => setAnimatingReaction(null)}
        />

        {/* Touchable content area */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleOpenDetail}
          disabled={variant === 'detailed'}
        >
          {/* Header con usuario */}
          <View style={themed.header}>
            {userInfo.avatarUrl ? (
              <SmartImage
                uri={userInfo.avatarUrl}
                style={themed.avatar}
                deferOnDataSaver={false}
              />
            ) : (
              <View style={[themed.avatar, themed.avatarPlaceholder]}>
                <FontAwesome name="user" size={20} color="#B0B0B0" />
              </View>
            )}

            <View style={themed.userInfo}>
              <Text style={themed.userName}>{userInfo.userName}</Text>
              <Text style={themed.time}>{timeAgo}</Text>
            </View>

            {variant !== 'compact' && (
              <View style={themed.headerActions}>
                {/* Menu button */}
                <TouchableOpacity
                  style={themed.menuButton}
                  onPress={() => setShowOptionsMenu(!showOptionsMenu)}
                >
                  <FontAwesome name="ellipsis-v" size={20} color="#B0B0B0" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Options Menu */}
          {showOptionsMenu && (
            <View style={themed.optionsMenu}>
              <TouchableOpacity
                style={themed.optionItem}
                onPress={handleReport}
              >
                <FontAwesome name="flag" size={18} color="#B0B0B0" />
                <Text style={themed.optionText}>Reportar publicación</Text>
              </TouchableOpacity>
              <View style={themed.optionDivider} />
              <TouchableOpacity style={themed.optionItem} onPress={handleHide}>
                <FontAwesome name="eye-slash" size={18} color="#B0B0B0" />
                <Text style={themed.optionText}>Ocultar</Text>
              </TouchableOpacity>
            </View>
          )}

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

          {/* Media (consolidado: prioriza array, fallback a singular) */}
          {post.mediaUrls && post.mediaUrls.length > 0 ? (
            <View>
              {post.mediaUrls.map((mediaUrl, index) => (
                <DynamicImage
                  key={`${post.id}-media-${index}`}
                  uri={mediaUrl}
                  style={index > 0 ? { marginTop: 8 } : undefined}
                  deferOnDataSaver
                  label="Cargar imagen"
                  maxHeight={variant === 'compact' ? 300 : 400}
                  mediaType={post.mediaType}
                />
              ))}
            </View>
          ) : post.mediaUrl ? (
            <DynamicImage
              uri={post.mediaUrl}
              deferOnDataSaver
              label="Cargar imagen"
              maxHeight={variant === 'compact' ? 300 : 400}
              mediaType={post.mediaType}
            />
          ) : null}

          {/* Placeholder si tiene MediaType pero no URLs (backend pendiente) */}
          {!post.mediaUrl &&
            (!post.mediaUrls || post.mediaUrls.length === 0) &&
            post.mediaType && (
              <View
                style={[
                  themed.media,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                  },
                ]}
              >
                <Text style={{ color: '#888', fontSize: 14 }}>
                  📷 Imagen no disponible
                </Text>
                <Text
                  style={{
                    color: '#888',
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  (Pendiente configuración backend)
                </Text>
              </View>
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
        </TouchableOpacity>

        {/* Floating Reactions Picker */}
        <FloatingReactionsPicker
          visible={showReactionsPicker}
          onReactionSelect={handleReactionSelect}
          onClose={() => setShowReactionsPicker(false)}
          position={pickerPosition || undefined}
        />

        {/* Acciones principales */}
        {showActions && (
          <View style={themed.actions}>
            <TouchableOpacity
              ref={likeButtonRef}
              style={themed.actionButton}
              onPress={handleLike}
              onLongPress={handleLongPressLike}
              delayLongPress={300}
            >
              <FontAwesome
                name={post.isLiked ? 'heart' : 'heart-o'}
                size={20}
                color={post.isLiked ? Colors.light.tint : '#B0B0B0'}
              />
              <Text
                style={[
                  themed.actionText,
                  post.isLiked && { color: Colors.light.tint },
                ]}
              >
                {totalReactions || post.likesCount || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={themed.actionButton}
              onPress={handleComments}
            >
              <FontAwesome name="comment-o" size={20} color="#B0B0B0" />
              <Text style={themed.actionText}>{post.commentsCount || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={themed.actionButton} onPress={handleShare}>
              <FontAwesome name="share" size={20} color="#B0B0B0" />
              <Text style={themed.actionText}>{post.sharesCount || 0}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Acciones de moderación */}
        {showEdit && variant !== 'compact' && (
          <View style={themed.moderationActions}>
            <EditPostButton
              post={post}
              onPostUpdated={onPostUpdated}
              canEdit={post.author?.id === currentUserId}
            />
          </View>
        )}
      </View>

      {/* Post Detail Modal */}
      <PostDetailModal
        visible={showDetailModal}
        post={post}
        onClose={() => setShowDetailModal(false)}
        onToggleLike={onToggleLike}
        onShare={onShare}
        currentUserId={realCurrentUserId}
        isAnonymousActive={isAnonymousActive}
      />
    </>
  );
};

export default UnifiedPostCard;
