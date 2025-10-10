import { fixLocalMediaUrl } from '@/utils/mediaUtils';

export type FeedItemType =
  | 'post'
  | 'media'
  | 'achievement'
  | 'workout'
  | 'ad' // Anuncio propio
  | 'admob_ad'; // Anuncio de AdMob

// Backend Paged Response con tracking de feeds vistos
export interface PagedFeedResponse<T = unknown> {
  PageNumber: number;
  PageSize: number;
  TotalItems: number;
  TotalPages: number;
  HasMore: boolean;
  UnviewedCount: number;
  Items: T[];
}

export interface FeedListProps {
  data?: FeedItem[];
  items?: FeedItem[];
  loading?: boolean;
  error?: string;
  refetch?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onCreatePost?: () => void;
  onEndReached?: () => void;
  hasMore?: boolean;
  unviewedCount?: number;
  onFeedItemUpdate?: (feedId: string, updates: Partial<FeedItem>) => void;
  onScrollDirectionChange?: (isScrollingDown: boolean) => void;
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

  // Propiedades para anuncios
  isAd?: boolean; // true si es un anuncio (propio o AdMob)
  isAdMob?: boolean; // true si es un anuncio de AdMob
  adData?: {
    title: string;
    ctaText: string;
    targetUrl: string;
  };

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

  // Determinar si el usuario actual dio like a este feed

  // Determinar si el usuario actual dio like buscando en el array FeedLikes
  const feedLikes = data.FeedLikes || data.feedLikes;
  let isLikedByCurrentUser = false;

  if (Array.isArray(feedLikes) && feedLikes.length > 0) {
    // El backend debería enviar solo el like del usuario actual en este array
    // Si hay algún like activo, asumimos que es del usuario actual
    const activeLike = feedLikes.find((like: unknown) => {
      const likeObj = like as { IsActive?: boolean; isActive?: boolean };
      return likeObj.IsActive === true || likeObj.isActive === true;
    });

    isLikedByCurrentUser = !!activeLike;
  }

  // Extraer autor desde FitUser si existe
  const fitUser = data.FitUser || data.fitUser;
  let authorData = data.author;

  if (!authorData && fitUser && typeof fitUser === 'object') {
    const user = fitUser as Record<string, unknown>;
    const userId = user.Id || user.id;
    const userNameVal =
      user.UserName || user.userName || user.Name || user.name;
    const avatarVal =
      user.ProfilePicture || user.profilePicture || user.Avatar || user.avatar;

    authorData = {
      id: userId,
      name: userNameVal,
      avatar: avatarVal,
    };
  }

  // Construir objeto author si existe
  let authorObj;
  if (authorData && typeof authorData === 'object') {
    const authRec = authorData as Record<string, unknown>;
    const authId = String(authRec.id || authRec.Id || '');
    const authName = String(
      authRec.name ||
        authRec.Name ||
        authRec.UserName ||
        authRec.userName ||
        'Usuario'
    );
    const authAvatarRaw =
      authRec.avatar ||
      authRec.Avatar ||
      authRec.ProfilePicture ||
      authRec.profilePicture;
    const authAvatar = authAvatarRaw ? String(authAvatarRaw) : undefined;

    authorObj = {
      id: authId,
      name: authName,
      avatar: authAvatar,
    };
  }

  // AuthorName y AuthorAvatar desde fitUser si no están en data
  const fitUserRec = fitUser as Record<string, unknown>;
  const authNameFallback =
    data.authorName || fitUserRec?.UserName || fitUserRec?.userName;
  const authAvatarFallback =
    data.authorAvatar ||
    fitUserRec?.ProfilePicture ||
    fitUserRec?.profilePicture;

  return {
    id: String(data.id || data.Id || ''),
    type: String(data.type || data.Type || 'post') as FeedItemType,
    userId: String(
      data.userId || data.UserId || data.FitUserId || data.fitUserId || ''
    ),
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
    isLiked: Boolean(
      data.isLiked ||
        data.IsLiked ||
        data.IsLikedByCurrentUser ||
        data.isLikedByCurrentUser ||
        data.LikedByCurrentUser ||
        isLikedByCurrentUser
    ),
    // Campos adicionales
    title:
      data.title || data.Title ? String(data.title || data.Title) : undefined,
    isPublic: data.isPublic !== undefined ? Boolean(data.isPublic) : undefined,
    author: authorObj,
    authorName: authNameFallback ? String(authNameFallback) : undefined,
    authorAvatar: authAvatarFallback ? String(authAvatarFallback) : undefined,
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
  } as FeedItem;
}

/**
 * Convierte un anuncio (AdvertisementResponseDto) a FeedItem
 * para insertarlo en el feed junto con posts normales
 */
export function mapAdvertisementToFeedItem(
  ad: {
    Id: string;
    Title: string;
    Description: string;
    ImageUrl: string;
    CtaText: string;
    TargetUrl: string;
    DisplayPriority?: number;
  },
  isAdMob: boolean = false
): FeedItem {
  return {
    id: `ad_${ad.Id}`,
    type: isAdMob ? 'admob_ad' : 'ad',
    userId: 'system',
    userName: 'Anuncio',
    userProfilePicture: undefined,
    content: ad.Description,
    mediaUrls: [ad.ImageUrl],
    createdAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
    isAd: true,
    isAdMob,
    adData: {
      title: ad.Title,
      ctaText: ad.CtaText,
      targetUrl: ad.TargetUrl,
    },
  };
}
