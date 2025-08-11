import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  FlatList,
  ScrollView,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import MobileHeader from '@/components/layout/MobileHeader';
import { withWebLayout } from '@/components/layout/withWebLayout';
import type { Post } from '@/models/Post';
import type { Comment } from '@/models/Comment';
import type { User } from '@/models/User';
import PostComposer from '@/components/social/PostComposer';
import PostCard from '@/components/social/PostCard';
import CommentsModal from '@/components/social/CommentsModal';
import { feedService } from '@/services';
import type { FeedResponseDto } from '@/dto/Feed/Response/FeedResponseDto';
import Skeleton from '@/components/common/Skeleton';

function FeedScreen() {
  const [posts, setPosts] = useState<any[]>(() => {
    const now = new Date().toISOString();
    const userA: User = {
      Id: 'u1', Email: 'u1@mail.com', Password: '', IdEps: null, Name: 'Carlos', LastName: 'Mendoza', UserName: 'carlos.m', IdGender: null,
      BirthDate: null, ProfileImageUrl: 'https://via.placeholder.com/40', DocumentTypeId: null, Phone: null, CountryId: null, Address: null,
      CityId: null, RegionId: null, Rh: null, EmergencyName: null, EmergencyPhone: null, PhysicalExceptions: null, PhysicalExceptionsNotes: null,
      CreatedAt: now, UpdatedAt: now, DeletedAt: null, Ip: null, IsActive: true, UserTypeId: null, PlanId: null, UserFitUserUserId: null,
      UserDietUserId: null, EmployeeRegisterDailyUserUserId: null, ScheduleUserUserId: null, UserEmployeeUserUserId: null, GymId: null,
      RegistrationCompleted: true,
      BillUserSellers: [], BillUsers: [], Dailies: [], DailyHistories: [], Diets: [], EmployeeRegisterDailyUserUser: null, Gym: null,
      LogChanges: [], LogErrors: [], LogLogins: [], LogUninstalls: [], NotificationOptions: [], Notifications: [], Permissions: [],
      PhysicalAssessments: [], Plan: null, RoutineAssigneds: [], RoutineTemplates: [], ScheduleUserUser: null, UserDietUser: null,
      UserEmployeeUser: null, UserFitUser: null, UserType: null, PaymentAttempts: [], Posts: [], Comments: [], Likes: []
    };
    const userB: User = { ...userA, Id: 'u2', Name: 'Ana', LastName: 'García', UserName: 'ana.g', ProfileImageUrl: 'https://via.placeholder.com/40?text=A' };
    const userC: User = { ...userA, Id: 'u3', Name: 'Miguel', LastName: 'Torres', UserName: 'miguel.t', ProfileImageUrl: 'https://via.placeholder.com/40?text=M' };

    const p1: Post = { Id: 'p1', UserId: 'u1', Content: '¡Nuevo PR en peso muerto! 180kg 💪', MediaUrl: 'https://via.placeholder.com/600x400', MediaType: 'image',
      CreatedAt: now, UpdatedAt: null, DeletedAt: null, Ip: null, IsActive: true, IsDeleted: false, User: userA, Comments: [], Likes: [] };
    const p2: Post = { Id: 'p2', UserId: 'u2', Content: 'Completé mi primera rutina de 10K en cinta. ¡Qué sensación tan increíble!', MediaUrl: null, MediaType: null,
      CreatedAt: now, UpdatedAt: null, DeletedAt: null, Ip: null, IsActive: true, IsDeleted: false, User: userB, Comments: [], Likes: [{ Id: 'l1', PostId: 'p2', UserId: 'u1', CreatedAt: now, DeletedAt: null, IsActive: true, IsDeleted: false, Post: {} as any, User: userA }] };
    const p3: Post = { Id: 'p3', UserId: 'u3', Content: 'Día de piernas intenso. Mañana no podré caminar 😅', MediaUrl: 'https://via.placeholder.com/600x400', MediaType: 'image',
      CreatedAt: now, UpdatedAt: null, DeletedAt: null, Ip: null, IsActive: true, IsDeleted: false, User: userC, Comments: [], Likes: [] };

    return [p1, p2, p3];
  });
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [allCache, setAllCache] = useState<any[] | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const endReachedAt = useRef<number>(0);
  const END_REACHED_DEBOUNCE_MS = 800;
  const openPost = useMemo(() => posts.find(p => p.Id === openPostId) || null, [openPostId, posts]);

  const addMockPost = async (content: string) => {
    const now = new Date().toISOString();
    // Crear en backend Feed (si el servicio lo permite) o fallback a mock local
    try {
      const res = await feedService.createFeed({
        UserId: null,
        Title: content.slice(0, 60),
        Description: content,
        Media: null,
        MediaType: null,
        FileName: null,
        Id: '',
        FeedId: '',
        ContentType: null,
        Hashtag: null,
      });
      if (res.Success && res.Data) {
        // Volver a cargar feeds
        await loadFeeds();
        return;
      }
    } catch {}
    const me = posts[0]?.User; // mock fallback
    const newPost = { Id: 'p' + (Math.random() * 100000).toFixed(0), UserId: me?.Id || 'me', Content: content, MediaUrl: null, MediaType: null, CreatedAt: now, UpdatedAt: null, DeletedAt: null, Ip: null, IsActive: true, IsDeleted: false, User: me as User, Comments: [], Likes: [] };
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLike = (postId: string) => {
    // mock: sólo ajusta la lista de Likes localmente
    setPosts(prev => prev.map(p => {
      if (p.Id !== postId) return p;
      const meId = 'me';
      const hasLike = p.Likes?.some((l: any) => l.UserId === meId);
      if (hasLike) {
        return { ...p, Likes: p.Likes.filter((l: any) => l.UserId !== meId) };
      }
      const now = new Date().toISOString();
      const like = { Id: 'l' + Math.random(), PostId: p.Id, UserId: meId, CreatedAt: now, DeletedAt: null, IsActive: true, IsDeleted: false, Post: p as any, User: p.User };
      return { ...p, Likes: [...(p.Likes || []), like] };
    }));
  };

  const addComment = (text: string) => {
    if (!openPost) return;
    const p = openPost;
    const now = new Date().toISOString();
    const me = p.User; // reutilizar mock
    const comment: Comment = { Id: 'c' + Math.random(), PostId: p.Id, UserId: me?.Id || 'me', Content: text, CreatedAt: now, UpdatedAt: null, DeletedAt: null, Ip: null, IsActive: true, IsDeleted: false, Post: p as any, User: me as any };
    setPosts(prev => prev.map(pp => pp.Id === p.Id ? { ...pp, Comments: [...(pp.Comments || []), comment] } : pp));
  };

  const mapFeedToPostCard = (feed: FeedResponseDto): any => {
    return {
      Id: feed.Id,
      Content: feed.Description || feed.Title,
      MediaUrl: feed.MediaUrl,
      User: { UserName: 'Usuario', Name: feed.Title, ProfileImageUrl: 'https://via.placeholder.com/40' },
      Likes: [],
      Comments: [],
    };
  };

  const loadFeeds = async () => {
    setLoading(true);
    try {
      await loadPage(1, false);
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (targetPage: number, append: boolean) => {
    // Intentar paginación desde backend
    try {
      const res = await feedService.searchFeeds({ Page: targetPage, PageSize: pageSize });
      if (res.Success && Array.isArray(res.Data)) {
        const mapped = (res.Data as FeedResponseDto[]).map(mapFeedToPostCard);
        setPosts(prev => (append ? [...prev, ...mapped] : mapped));
        setHasMore(mapped.length >= pageSize);
        setPage(targetPage);
        setAllCache(null);
        return;
      }
    } catch {
      // Ignorar y hacer fallback
    }

    // Fallback: cargar todo y paginar local
    if (!allCache) {
      const resAll = await feedService.getAllFeeds();
      if (resAll.Success && Array.isArray(resAll.Data)) {
        const mappedAll = (resAll.Data as FeedResponseDto[]).map(mapFeedToPostCard);
        setAllCache(mappedAll);
        const end = targetPage * pageSize;
        setPosts(mappedAll.slice(0, end));
        setHasMore(mappedAll.length > end);
        setPage(targetPage);
        return;
      }
      // Si tampoco hay data, deja vacío
      setPosts([]);
      setHasMore(false);
      setPage(1);
      return;
    } else {
      const end = targetPage * pageSize;
      setPosts(allCache.slice(0, end));
      setHasMore(allCache.length > end);
      setPage(targetPage);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  const renderActiveUsers = () => (
    <View style={styles.activeUsersCard}>
      <Text style={styles.activeUsersTitle}>Entrenando Ahora</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.activeUsersList}>
          {[1, 2, 3, 4, 5].map(user => (
            <View key={user} style={styles.activeUser}>
              <View style={styles.activeUserImageContainer}>
                <Image
                  source={{
                    uri: `https://via.placeholder.com/50?text=${user}`,
                  }}
                  style={styles.activeUserImage}
                />
                <View style={styles.onlineIndicator} />
              </View>
              <Text style={styles.activeUserName}>Usuario {user}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <FontAwesome name='bell' size={24} color='#FFFFFF' />
        </TouchableOpacity>
      </View>
      {renderActiveUsers()}
      <PostComposer avatarUrl={posts[0]?.User?.ProfileImageUrl || null} onSubmit={addMockPost} />
      {loading && (
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {[1,2,3].map(i => (
            <View key={i} style={{ backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Skeleton width={40} height={40} borderRadius={20} />
                <View style={{ flex: 1, gap: 6 }}>
                  <Skeleton width={'60%'} height={12} />
                  <Skeleton width={'40%'} height={10} />
                </View>
              </View>
              <Skeleton width={'100%'} height={12} style={{ marginBottom: 8 }} />
              <Skeleton width={'80%'} height={12} style={{ marginBottom: 12 }} />
              <Skeleton width={'100%'} height={160} borderRadius={12} />
            </View>
          ))}
        </View>
      )}
    </>
  );

  const onEndReached = async () => {
  if (loading || loadingMore || !hasMore) return;
  const now = Date.now();
  if (now - endReachedAt.current < END_REACHED_DEBOUNCE_MS) return;
  endReachedAt.current = now;
    setLoadingMore(true);
    try {
      await loadPage(page + 1, true);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS !== 'web' && <MobileHeader />}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => (
          <PostCard post={item} onToggleLike={toggleLike} onOpenComments={setOpenPostId} />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            {loadingMore ? (
              <View style={{ paddingHorizontal: 20, gap: 12 }}>
                {[1, 2].map(i => (
                  <View key={i} style={{ backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <Skeleton width={40} height={40} borderRadius={20} />
                      <View style={{ flex: 1, gap: 6 }}>
                        <Skeleton width={'60%'} height={12} />
                        <Skeleton width={'40%'} height={10} />
                      </View>
                    </View>
                    <Skeleton width={'100%'} height={12} style={{ marginBottom: 8 }} />
                    <Skeleton width={'80%'} height={12} style={{ marginBottom: 12 }} />
                    <Skeleton width={'100%'} height={160} borderRadius={12} />
                  </View>
                ))}
              </View>
            ) : !hasMore ? (
              <Text style={{ color: '#333', textAlign: 'center' }}>No hay más publicaciones</Text>
            ) : null}
          </View>
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          try {
            // Reset y recarga de primera página
            setAllCache(null);
            setHasMore(true);
            await loadPage(1, false);
          } finally {
            setRefreshing(false);
          }
        }}
      />

      <CommentsModal
        visible={!!openPost}
        comments={openPost?.Comments || []}
        onClose={() => setOpenPostId(null)}
        onAddComment={addComment}
      />
    </SafeAreaView>
  );
}

export default withWebLayout(FeedScreen, { defaultTab: 'feed' });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 8,
  },
  activeUsersCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  activeUsersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  activeUsersList: {
    flexDirection: 'row',
    gap: 16,
  },
  activeUser: {
    alignItems: 'center',
  },
  activeUserImageContainer: {
    position: 'relative',
  },
  activeUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1E1E1E',
  },
  activeUserName: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 4,
  },
  // estilos eliminados del composer y post card originales (sustituidos por componentes)
  postsContainer: {
    paddingBottom: 20,
  },
  footer: {
    height: 100,
  },
});
