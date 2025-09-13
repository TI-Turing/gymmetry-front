// Tipos unificados para el modulo feed/social
import type { Feed } from '@/models/Feed';
import type { Post } from '@/models/Post';

// Interfaz base para items del feed social
export interface FeedItemBase {
  id: string;
  title?: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  isPublic?: boolean;
  authorName?: string;
  authorAvatar?: string;
  createdAt?: string;
  updatedAt?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  tags?: string;
  // Informacion del autor completa
  author?: {
    id: string;
    name: string;
    avatar?: string;
    username?: string;
  };
}

// Extender para diferentes tipos de contenido
export interface FeedItem extends FeedItemBase {
  type: 'feed' | 'post';
}

export interface PostItem extends FeedItemBase {
  type: 'post';
  content: string; // Required for posts
}

export interface SocialFeedItem extends FeedItemBase {
  type: 'feed';
  title: string; // Required for feeds
}

// Funcion para mapear Feed del backend a FeedItem unificado
export const mapFeedToFeedItem = (feed: Feed): FeedItem => {
  const fullName = [feed.User?.Name, feed.User?.LastName]
    .filter(Boolean)
    .join(' ');
  const authorName =
    fullName || feed.User?.UserName || feed.User?.Email || 'Usuario anonimo';

  return {
    type: 'feed',
    id: feed.Id,
    title: feed.Title,
    content: feed.Description || undefined,
    mediaUrl: feed.MediaUrl || undefined,
    mediaType: feed.MediaType || undefined,
    isPublic: feed.IsActive && !feed.IsDeleted,
    authorName,
    authorAvatar: feed.User?.ProfileImageUrl || undefined,
    createdAt: feed.CreatedAt,
    updatedAt: feed.UpdatedAt || undefined,
    likesCount: feed.LikesCount,
    commentsCount: feed.CommentsCount,
    sharesCount: 0, // No hay sharesCount en el modelo Feed
    tags: feed.MediaType || undefined,
    author: {
      id: feed.UserId,
      name: authorName,
      avatar: feed.User?.ProfileImageUrl || undefined,
      username: feed.User?.UserName || undefined,
    },
  };
};

// Funcion para mapear Post del backend a FeedItem unificado
export const mapPostToFeedItem = (post: Post): FeedItem => {
  const fullName = [post.User?.Name, post.User?.LastName]
    .filter(Boolean)
    .join(' ');
  const authorName =
    fullName || post.User?.UserName || post.User?.Email || 'Usuario anonimo';

  return {
    type: 'post',
    id: post.Id,
    title: undefined, // Posts no tienen titulo
    content: post.Content,
    mediaUrl: post.MediaUrl || undefined,
    mediaType: post.MediaType || undefined,
    isPublic: post.IsActive && !post.IsDeleted,
    authorName,
    authorAvatar: post.User?.ProfileImageUrl || undefined,
    createdAt: post.CreatedAt,
    updatedAt: post.UpdatedAt || undefined,
    likesCount: post.Likes?.length || 0,
    commentsCount: post.Comments?.length || 0,
    sharesCount: 0, // No hay sharesCount en el modelo Post
    tags: post.MediaType || undefined,
    author: {
      id: post.UserId,
      name: authorName,
      avatar: post.User?.ProfileImageUrl || undefined,
      username: post.User?.UserName || undefined,
    },
  };
};

// Interfaces para paginacion
export interface FeedPagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Request para obtener datos del feed
export interface FeedRequest {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  tags?: string[];
  authorId?: string;
  isPublic?: boolean;
  sortBy?: 'createdAt' | 'likesCount' | 'commentsCount';
  sortOrder?: 'asc' | 'desc';
}

// Response del servidor para el feed
export interface FeedResponse {
  success: boolean;
  message?: string;
  data?: {
    items: FeedItem[];
    pagination: FeedPagination;
  };
  errors?: string[];
}

// Props para componentes del feed
export interface FeedListProps {
  items?: FeedItem[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onItemPress?: (item: FeedItem) => void;
  onToggleLike?: (itemId: string) => void;
  onComment?: (itemId: string) => void;
  onShare?: (item: FeedItem) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  emptyMessage?: string;
  refreshing?: boolean;
}

// Interfaces para interacciones del feed
export interface FeedInteraction {
  id: string;
  type: 'like' | 'comment' | 'share';
  userId: string;
  itemId: string;
  createdAt: string;
}

// Interfaces para comentarios
export interface FeedComment {
  id: string;
  content: string;
  userId: string;
  itemId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  isAnonymous?: boolean;
}

// Response unificada para APIs
export interface FeedApiResponse<T = unknown> {
  Success: boolean;
  Message?: string;
  Data?: T;
  StatusCode?: number;
}

// Tipo unificado para items de contenido social
export type ContentItem = FeedItem | PostItem | SocialFeedItem;

// Estado del feed para manejo de estado
export interface FeedState {
  items: FeedItem[];
  pagination: FeedPagination;
}
