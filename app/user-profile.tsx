import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
// import { ScreenWrapper } from '@/components/common/ScreenWrapper';

// Componente temporal mientras se integra ScreenWrapper
const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <View style={{ flex: 1, backgroundColor: '#fff' }}>{children}</View>;

interface UserProfile {
  id: string;
  userName: string;
  fullName?: string;
  email?: string;
  bio?: string;
  joinedDate: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

interface UserPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

const UserProfileScreen: React.FC = () => {
  const { userId, userName } = useLocalSearchParams<{
    userId: string;
    userName: string;
  }>();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);

      // Simulación de carga de perfil de usuario
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockProfile: UserProfile = {
        id: userId || '',
        userName: userName || 'Usuario',
        fullName: `${userName} Apellido`,
        email: `${userName?.toLowerCase()}@example.com`,
        bio: 'Apasionado por el fitness y la vida saludable. Compartiendo mi viaje hacia una mejor versión de mí mismo.',
        joinedDate: '2023-06-15',
        postsCount: 24,
        followersCount: 156,
        followingCount: 89,
        isFollowing: false,
      };

      setProfile(mockProfile);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  }, [userId, userName]);

  const loadUserPosts = useCallback(async () => {
    try {
      // Simulación de carga de posts del usuario
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockPosts: UserPost[] = [
        {
          id: '1',
          title: 'Mi rutina de hoy',
          content: 'Completé una sesión intensa de piernas. ¡Me siento genial!',
          createdAt: '2024-01-15T10:30:00Z',
          likesCount: 12,
          commentsCount: 3,
        },
        {
          id: '2',
          title: 'Progreso semanal',
          content:
            'Esta semana logré aumentar el peso en press de banca. Poco a poco se va notando el progreso.',
          createdAt: '2024-01-12T14:20:00Z',
          likesCount: 8,
          commentsCount: 1,
        },
        {
          id: '3',
          title: 'Consejos de nutrición',
          content:
            'Descubrí que agregar más proteína en el desayuno me da más energía durante el día.',
          createdAt: '2024-01-10T08:15:00Z',
          likesCount: 15,
          commentsCount: 5,
        },
      ];

      setPosts(mockPosts);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las publicaciones');
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
    loadUserPosts();
  }, [loadUserProfile, loadUserPosts]);

  const handleFollowToggle = async () => {
    if (!profile) return;

    try {
      setLoadingFollow(true);

      // Simulación de seguir/no seguir
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProfile({
        ...profile,
        isFollowing: !profile.isFollowing,
        followersCount: profile.isFollowing
          ? profile.followersCount - 1
          : profile.followersCount + 1,
      });

      const action = profile.isFollowing ? 'dejaste de seguir' : 'ahora sigues';
      Alert.alert('Éxito', `${action} a ${profile.userName}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el seguimiento');
    } finally {
      setLoadingFollow(false);
    }
  };

  const handlePostPress = (post: UserPost) => {
    // Navegar al detalle del post
    router.push({
      pathname: '/post-detail',
      params: { postId: post.id },
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'Fecha no disponible';
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!profile) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadUserProfile}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header del perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.userName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.fullName}>{profile.fullName}</Text>
            <Text style={styles.userName}>@{profile.userName}</Text>
            <Text style={styles.joinDate}>
              Miembro desde {formatDate(profile.joinedDate)}
            </Text>
          </View>
        </View>

        {/* Bio */}
        {profile.bio && (
          <View style={styles.bioSection}>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        )}

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.postsCount}</Text>
            <Text style={styles.statLabel}>Publicaciones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.followersCount}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.followingCount}</Text>
            <Text style={styles.statLabel}>Siguiendo</Text>
          </View>
        </View>

        {/* Botón de seguir */}
        <TouchableOpacity
          style={[
            styles.followButton,
            profile.isFollowing && styles.followingButton,
          ]}
          onPress={handleFollowToggle}
          disabled={loadingFollow}
        >
          <Text
            style={[
              styles.followButtonText,
              profile.isFollowing && styles.followingButtonText,
            ]}
          >
            {loadingFollow
              ? 'Actualizando...'
              : profile.isFollowing
                ? 'Siguiendo'
                : 'Seguir'}
          </Text>
        </TouchableOpacity>

        {/* Lista de publicaciones */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Publicaciones</Text>

          {posts.length === 0 ? (
            <View style={styles.emptyPosts}>
              <Text style={styles.emptyText}>No hay publicaciones</Text>
            </View>
          ) : (
            posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.postCard}
                onPress={() => handlePostPress(post)}
              >
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent} numberOfLines={2}>
                  {post.content}
                </Text>
                <View style={styles.postMeta}>
                  <Text style={styles.postDate}>
                    {formatDate(post.createdAt)}
                  </Text>
                  <View style={styles.postStats}>
                    <Text style={styles.postStat}>❤️ {post.likesCount}</Text>
                    <Text style={styles.postStat}>💬 {post.commentsCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
    color: '#888',
  },
  bioSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bio: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  followingButton: {
    backgroundColor: '#e0e0e0',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#333',
  },
  postsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyPosts: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
  postCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 12,
    color: '#888',
  },
  postStats: {
    flexDirection: 'row',
    gap: 12,
  },
  postStat: {
    fontSize: 12,
    color: '#666',
  },
});

export default UserProfileScreen;
