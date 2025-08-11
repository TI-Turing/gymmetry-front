import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

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
    Comments?: { Id: string; Content?: string | null; User?: { UserName?: string | null } | null }[];
  };
  onToggleLike: (postId: string) => void;
  onOpenComments: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onToggleLike, onOpenComments }) => {
  const likesCount = post.Likes?.length ?? 0;
  const commentsCount = post.Comments?.length ?? 0;
  const [liked, setLiked] = useState(false);

  const userName = useMemo(() => post.User?.Name || post.User?.UserName || 'Usuario', [post]);
  const avatarUrl = useMemo(() => post.User?.ProfileImageUrl || 'https://via.placeholder.com/40', [post]);

  const onPressLike = () => {
    setLiked(prev => !prev);
    onToggleLike(post.Id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.time}>hace 2h</Text>
        </View>
        <TouchableOpacity style={styles.menu}>
          <FontAwesome name="ellipsis-h" size={16} color="#B0B0B0" />
        </TouchableOpacity>
      </View>

      {post.Content ? <Text style={styles.content}>{post.Content}</Text> : null}
      {post.MediaUrl ? (
        <Image source={{ uri: post.MediaUrl }} style={styles.image} />
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onPressLike}>
          <FontAwesome name={liked ? 'heart' : 'heart-o'} size={20} color={liked ? '#FF6B6B' : '#B0B0B0'} />
          <Text style={styles.actionText}>{likesCount + (liked ? 1 : 0)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onOpenComments(post.Id)}>
          <FontAwesome name="comment-o" size={20} color="#B0B0B0" />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <FontAwesome name="share" size={20} color="#B0B0B0" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#1E1E1E', marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  time: { fontSize: 12, color: '#B0B0B0', marginTop: 2 },
  menu: { padding: 4 },
  content: { fontSize: 14, color: '#FFFFFF', lineHeight: 20, marginBottom: 12 },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionText: { color: '#B0B0B0', fontSize: 14 },
});

export default PostCard;
