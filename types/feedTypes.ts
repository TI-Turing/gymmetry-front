import { fixLocalMediaUrl } from '@/utils/mediaUtils';

export type FeedItemType = 'post' | 'media' | 'achievement' | 'workout';

export interface FeedListProps {
  data?: FeedItem[];
  items?: FeedItem[];
  loading?: boolean;
  error?: string;
  refetch?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onCreatePost?: () => void;
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

  console.log('📦 [mapFeedToFeedItem] Datos recibidos:', {
    postId: data.id || data.Id,
    hasMediaFiles: !!(data.FeedMediaFiles || data.feedMediaFiles),
    FeedMediaFiles: data.FeedMediaFiles,
  });

  // Mapear mediaUrls con todas las variaciones posibles
  let mediaUrlsArray: string[] = [];
  const mediaUrlsRaw =
    data.FeedMediaFiles ||
    data.feedMediaFiles ||
    data.mediaUrls ||
    data.MediaUrls ||
    data.mediaUrl ||
    data.MediaUrl ||
    data.media ||
    data.Media ||
    data.feedMedias ||
    data.FeedMedias;

  if (Array.isArray(mediaUrlsRaw)) {
    // Si es un array de objetos con estructura {Url, MediaUrl, url, etc.}
    mediaUrlsArray = mediaUrlsRaw
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          return (
            obj.Url ||
            obj.url ||
            obj.MediaUrl ||
            obj.mediaUrl ||
            obj.FileUrl ||
            obj.fileUrl ||
            ''
          );
        }
        return '';
      })
      .filter((url): url is string => typeof url === 'string' && url.length > 0)
      // Transformar URLs de localhost a IP de desarrollo en entorno local
      .map((url) => fixLocalMediaUrl(url));
  } else if (typeof mediaUrlsRaw === 'string' && mediaUrlsRaw) {
    mediaUrlsArray = [fixLocalMediaUrl(mediaUrlsRaw)];
  }

  console.log('🖼️ [mapFeedToFeedItem] URLs procesadas:', {
    postId: data.id || data.Id,
    mediaUrlsArray,
    count: mediaUrlsArray.length,
  });

  return {
    id: String(data.id || data.Id || ''),
    type: String(data.type || data.Type || 'post') as FeedItemType,
    userId: String(data.userId || data.UserId || ''),
    userName: String(data.userName || data.UserName || 'Usuario'),
    userProfilePicture: data.userProfilePicture
      ? String(data.userProfilePicture)
      : undefined,
    content: String(
      data.content || data.Content || data.description || data.Description || ''
    ),
    mediaUrls: mediaUrlsArray,
    createdAt: String(
      data.createdAt || data.CreatedAt || new Date().toISOString()
    ),
    likesCount: Number(data.likesCount || data.LikesCount || 0),
    commentsCount: Number(data.commentsCount || data.CommentsCount || 0),
    isLiked: Boolean(data.isLiked || data.IsLiked),
    // Campos adicionales
    title:
      data.title || data.Title ? String(data.title || data.Title) : undefined,
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
    mediaUrl:
      mediaUrlsArray.length > 0
        ? mediaUrlsArray[0]
        : data.mediaUrl
          ? String(data.mediaUrl)
          : undefined,
    mediaType: data.mediaType
      ? String(data.mediaType)
      : data.MediaType
        ? String(data.MediaType)
        : undefined,
  };
}
