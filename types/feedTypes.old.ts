// Tipos base del sistema de feed
export type FeedItemType = 'post' | 'media' | 'achievement' | 'workout';

// Estado de carga
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Props de listas
export interface FeedListProps {
  data?: FeedItem[];
  onRefresh?: () => void;
  refreshing?: boolean;
  ListHeaderComponent?:
    | React.ComponentType<unknown>
    | React.ReactElement
    | null;
  ListFooterComponent?:
    | React.ComponentType<unknown>
    | React.ReactElement
    | null;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

// Estado del feed
export interface FeedState {
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  refreshing: boolean;
}

// Acciones del feed
export type FeedAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: FeedItem[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'REFRESH_START' }
  | { type: 'REFRESH_SUCCESS'; payload: FeedItem[] }
  | { type: 'LOAD_MORE_SUCCESS'; payload: FeedItem[] }
  | { type: 'RESET' };

// Interfaz principal del FeedItem
export interface FeedItem {
  id: string;
  type: FeedItemType;
  userId: string;
  userName: string;
  userProfilePicture?: string;
  content: string;
  mediaUrls?: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  exerciseId?: string;
  exerciseName?: string;
  workoutId?: string;
  workoutName?: string;
  gymId?: string;
  gymName?: string;
  location?: string;
  tags?: string[];
  privacy?: 'public' | 'friends' | 'private';
  isEdited?: boolean;
  editedAt?: string;
  originalAuthor?: string;
}

// Interface extendida con metadatos
export interface EnhancedFeedItem extends FeedItem {
  metadata?: {
    source: 'feed' | 'profile' | 'search';
    priority: number;
    engagement: number;
    relevanceScore?: number;
  };
  reactions?: {
    like: number;
    love: number;
    laugh: number;
    wow: number;
    sad: number;
    angry: number;
  };
  userReaction?: string;
}

// Respuesta de la API
export interface FeedApiResponse<T = unknown> {
  Success: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filtros de feed
export interface FeedFilters {
  type?: FeedItemType;
  userId?: string;
  gymId?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  privacy?: 'public' | 'friends' | 'private';
}

// Opciones de ordenamiento
export type SortOption = 'recent' | 'popular' | 'trending' | 'relevant';

// Parametros de consulta del feed
export interface FeedQueryParams {
  page?: number;
  pageSize?: number;
  filters?: FeedFilters;
  sort?: SortOption;
  search?: string;
}

// Estados de interaccion
export interface InteractionState {
  loading: boolean;
  error: string | null;
}

// Crear nuevo post
export interface CreatePostRequest {
  content: string;
  type: FeedItemType;
  mediaUrls?: string[];
  exerciseId?: string;
  workoutId?: string;
  gymId?: string;
  location?: string;
  tags?: string[];
  privacy?: 'public' | 'friends' | 'private';
}

// Actualizar post existente
export interface UpdatePostRequest {
  id: string;
  content?: string;
  mediaUrls?: string[];
  tags?: string[];
  privacy?: 'public' | 'friends' | 'private';
}

// Respuesta de creacion/actualizacion
export interface PostResponse {
  post: FeedItem;
  success: boolean;
  message?: string;
}

// Interfaces para comentarios
export interface FeedComment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userProfilePicture?: string;
  itemId: string;
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string;
  replies?: FeedComment[];
  isEdited?: boolean;
}

// Crear comentario
export interface CreateCommentRequest {
  content: string;
  itemId: string;
  parentId?: string;
}

// Respuesta de comentarios
export interface CommentsResponse {
  comments: FeedComment[];
  totalCount: number;
  hasMore: boolean;
}

// Interfaces para likes/reacciones
export interface LikeRequest {
  itemId: string;
  type?: 'post' | 'comment';
}

export interface ReactionRequest {
  itemId: string;
  reaction: string;
  type?: 'post' | 'comment';
}

// Respuesta de interaccion
export interface InteractionResponse {
  success: boolean;
  newCount: number;
  userReaction?: string;
}

// Interfaces para busqueda
export interface SearchQuery {
  term: string;
  filters?: FeedFilters;
  limit?: number;
}

export interface SearchResults {
  posts: FeedItem[];
  users: SearchUser[];
  gyms: SearchGym[];
  exercises: SearchExercise[];
  totalResults: number;
}

export interface SearchUser {
  id: string;
  userName: string;
  profilePicture?: string;
  followersCount: number;
  isFollowing?: boolean;
}

export interface SearchGym {
  id: string;
  name: string;
  location: string;
  rating: number;
  membersCount: number;
}

export interface SearchExercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Utilitarios y helpers
export function mapFeedToFeedItem(apiData: unknown): FeedItem {
  const data = apiData as Record<string, unknown>;

  const getString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' ? value : fallback;

  const getNumber = (value: unknown, fallback = 0): number =>
    typeof value === 'number' ? value : fallback;

  const getBoolean = (value: unknown, fallback = false): boolean =>
    typeof value === 'boolean' ? value : fallback;

  const getStringArray = (value: unknown, fallback: string[] = []): string[] =>
    Array.isArray(value)
      ? value.filter((item) => typeof item === 'string')
      : fallback;

  return {
    id: getString(data.id || data.Id),
    type: getString(data.type || data.Type, 'post') as FeedItemType,
    userId: getString(data.userId || data.UserId),
    userName: getString(data.userName || data.UserName, 'Usuario'),
    userProfilePicture:
      data.userProfilePicture || data.UserProfilePicture
        ? getString(data.userProfilePicture || data.UserProfilePicture)
        : undefined,
    content: getString(data.content || data.Content),
    mediaUrls: getStringArray(data.mediaUrls || data.MediaUrls),
    createdAt: getString(
      data.createdAt || data.CreatedAt,
      new Date().toISOString()
    ),
    likesCount: getNumber(data.likesCount || data.LikesCount),
    commentsCount: getNumber(data.commentsCount || data.CommentsCount),
    isLiked: getBoolean(data.isLiked || data.IsLiked),
    exerciseId:
      data.exerciseId || data.ExerciseId
        ? getString(data.exerciseId || data.ExerciseId)
        : undefined,
    exerciseName:
      data.exerciseName || data.ExerciseName
        ? getString(data.exerciseName || data.ExerciseName)
        : undefined,
    workoutId:
      data.workoutId || data.WorkoutId
        ? getString(data.workoutId || data.WorkoutId)
        : undefined,
    workoutName:
      data.workoutName || data.WorkoutName
        ? getString(data.workoutName || data.WorkoutName)
        : undefined,
    gymId:
      data.gymId || data.GymId
        ? getString(data.gymId || data.GymId)
        : undefined,
    gymName:
      data.gymName || data.GymName
        ? getString(data.gymName || data.GymName)
        : undefined,
    location:
      data.location || data.Location
        ? getString(data.location || data.Location)
        : undefined,
    tags: getStringArray(data.tags || data.Tags),
    privacy: getString(data.privacy || data.Privacy, 'public') as
      | 'public'
      | 'friends'
      | 'private',
    isEdited: getBoolean(data.isEdited || data.IsEdited),
    editedAt:
      data.editedAt || data.EditedAt
        ? getString(data.editedAt || data.EditedAt)
        : undefined,
    originalAuthor:
      data.originalAuthor || data.OriginalAuthor
        ? getString(data.originalAuthor || data.OriginalAuthor)
        : undefined,
  };
}

export function createEmptyFeedState(): FeedState {
  return {
    items: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    refreshing: false,
  };
}

export function isValidFeedItem(item: unknown): item is FeedItem {
  const feedItem = item as FeedItem;
  return !!(
    feedItem &&
    typeof feedItem.id === 'string' &&
    typeof feedItem.type === 'string' &&
    typeof feedItem.userId === 'string' &&
    typeof feedItem.content === 'string'
  );
}
