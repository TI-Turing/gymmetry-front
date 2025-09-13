export type FeedItemType = 'post' | 'media' | 'achievement' | 'workout';

export interface FeedListProps {
  data?: FeedItem[];
  items?: FeedItem[];
  loading?: boolean;
  error?: string;
  refetch?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

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
  // Propiedades adicionales usadas en componentes
  title?: string;
  isPublic?: boolean;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  authorName?: string;
  authorAvatar?: string;
  sharesCount?: number;
  tags?: string | string[];
  updatedAt?: string;
  mediaUrl?: string;
  mediaType?: string;
}

export interface FeedApiResponse<T = unknown> {
  Success: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}

export function mapFeedToFeedItem(apiData: unknown): FeedItem {
  const data = apiData as Record<string, unknown>;
  return {
    id: String(data.id || data.Id || ''),
    type: String(data.type || data.Type || 'post') as FeedItemType,
    userId: String(data.userId || data.UserId || ''),
    userName: String(data.userName || data.UserName || 'Usuario'),
    userProfilePicture: data.userProfilePicture
      ? String(data.userProfilePicture)
      : undefined,
    content: String(data.content || data.Content || ''),
    mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls.map(String) : [],
    createdAt: String(
      data.createdAt || data.CreatedAt || new Date().toISOString()
    ),
    likesCount: Number(data.likesCount || data.LikesCount || 0),
    commentsCount: Number(data.commentsCount || data.CommentsCount || 0),
    isLiked: Boolean(data.isLiked || data.IsLiked),
    // Campos adicionales
    title: data.title ? String(data.title) : undefined,
    isPublic: data.isPublic !== undefined ? Boolean(data.isPublic) : undefined,
    author: data.author
      ? {
          id: String((data.author as Record<string, unknown>).id || ''),
          name: String(
            (data.author as Record<string, unknown>).name || 'Usuario'
          ),
          avatar: (data.author as Record<string, unknown>).avatar
            ? String((data.author as Record<string, unknown>).avatar)
            : undefined,
        }
      : undefined,
    authorName: data.authorName ? String(data.authorName) : undefined,
    authorAvatar: data.authorAvatar ? String(data.authorAvatar) : undefined,
    sharesCount: data.sharesCount ? Number(data.sharesCount) : undefined,
    tags: data.tags
      ? Array.isArray(data.tags)
        ? data.tags.map(String)
        : String(data.tags)
      : undefined,
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    mediaUrl: data.mediaUrl ? String(data.mediaUrl) : undefined,
    mediaType: data.mediaType ? String(data.mediaType) : undefined,
  };
}
