import React, { useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import SmartImage from '@/components/common/SmartImage';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePostCardStyles } from './styles/postCard';

export interface PostCardProps {
  post: {
    Id: string;
    Content?: string | null;
    MediaUrl?: string | null;
    User?: {
      Name?: string | null;
      UserName?: string | null;
      ProfileImageUrl?: string | null;
      Id?: string | null;
    } | null;
    Likes?: { UserId?: string | null }[];
    Comments?: {
      Id: string;
      Content?: string | null;
      User?: { UserName?: string | null } | null;
    }[];
  };
  onToggleLike: (postId: string) => void;
  onOpenComments: (postId: string) => void;
  isAnonymousActive?: boolean;
  currentUserId?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onToggleLike,
  onOpenComments,
  isAnonymousActive = false,
  currentUserId,
}) => {
  const likesCount = post.Likes?.length ?? 0;
  const commentsCount = post.Comments?.length ?? 0;
  const [liked, setLiked] = useState(false);
  const styles = useThemedStyles(makePostCardStyles);

  const userName = useMemo(() => {
    const fallback = 'Usuario';
    if (
      isAnonymousActive &&
      (!post.User?.Id || post.User?.Id === currentUserId)
    )
      return 'Anónimo';
    return post.User?.Name || post.User?.UserName || fallback;
  }, [post, isAnonymousActive, currentUserId]);
  const avatarUrl = useMemo(() => {
    if (
      isAnonymousActive &&
      (!post.User?.Id || post.User?.Id === currentUserId)
    )
      return require('@/assets/images/icon.png');
    return post.User?.ProfileImageUrl || require('@/assets/images/icon.png');
  }, [post, isAnonymousActive, currentUserId]);

  const onPressLike = () => {
    setLiked((prev) => !prev);
    onToggleLike(post.Id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <SmartImage
          uri={avatarUrl}
          style={styles.avatar}
          deferOnDataSaver={false}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.time}>hace 2h</Text>
        </View>
        <TouchableOpacity style={styles.menu}>
          <FontAwesome
            name="ellipsis-h"
            size={16}
            color={styles.colors.muted}
          />
        </TouchableOpacity>
      </View>

      {post.Content ? <Text style={styles.content}>{post.Content}</Text> : null}
      {post.MediaUrl ? (
        <SmartImage
          uri={post.MediaUrl}
          style={styles.image}
          deferOnDataSaver
          label="Cargar imagen"
        />
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onPressLike}>
          <FontAwesome
            name={liked ? 'heart' : 'heart-o'}
            size={20}
            color={liked ? styles.colors.like : styles.colors.muted}
          />
          <Text style={styles.actionText}>{likesCount + (liked ? 1 : 0)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onOpenComments(post.Id)}
        >
          <FontAwesome name="comment-o" size={20} color={styles.colors.muted} />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <FontAwesome name="share" size={20} color={styles.colors.muted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;
