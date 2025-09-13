// Sistema de cache keys inteligente para el módulo de feed
export const feedCacheKeys = {
  // Keys base
  base: 'feed',

  // Feed paginado
  paged: (page: number, size: number) => `feed_paged_${page}_${size}`,

  // Feed trending
  trending: (hours: number, take: number) => `feed_trending_${hours}_${take}`,

  // Feed de usuario específico
  userPaged: (userId: string, page: number, size: number) =>
    `feed_user_${userId}_paged_${page}_${size}`,

  // Feed individual
  single: (feedId: string) => `feed_single_${feedId}`,

  // Búsqueda de feeds
  search: (params: Record<string, unknown>) =>
    `feed_search_${JSON.stringify(params)}`,

  // Comentarios de un feed
  comments: (feedId: string, page: number, size: number) =>
    `feed_comments_${feedId}_${page}_${size}`,

  // Contadores de interacciones
  likesCount: (feedId: string) => `feed_likes_${feedId}`,
  commentsCount: (feedId: string) => `feed_comments_count_${feedId}`,

  // Patrones para invalidación masiva
  patterns: {
    // Todos los feeds
    allFeeds: 'feed_*',

    // Todo lo relacionado con un feed específico
    feedRelated: (feedId: string) => `feed_*_${feedId}*`,

    // Todo lo paginado
    allPaged: 'feed_*_paged_*',

    // Todo lo de un usuario
    userRelated: (userId: string) => `feed_user_${userId}_*`,

    // Todas las búsquedas
    allSearches: 'feed_search_*',

    // Todos los comentarios
    allComments: 'feed_comments_*',

    // Todos los contadores
    allCounts: 'feed_*_count_*',
  },

  // Helpers para invalidación inteligente
  invalidation: {
    // Cuando se crea un feed nuevo
    onFeedCreated: () => [
      feedCacheKeys.patterns.allPaged,
      feedCacheKeys.patterns.allSearches,
      feedCacheKeys.patterns.allFeeds,
    ],

    // Cuando se actualiza un feed
    onFeedUpdated: (feedId: string) => [
      feedCacheKeys.single(feedId),
      feedCacheKeys.patterns.allPaged,
      feedCacheKeys.patterns.allSearches,
      feedCacheKeys.patterns.feedRelated(feedId),
    ],

    // Cuando se elimina un feed
    onFeedDeleted: (feedId: string) => [
      feedCacheKeys.patterns.feedRelated(feedId),
      feedCacheKeys.patterns.allPaged,
      feedCacheKeys.patterns.allSearches,
    ],

    // Cuando se da like/unlike
    onLikeChanged: (feedId: string) => [
      feedCacheKeys.likesCount(feedId),
      feedCacheKeys.single(feedId),
      feedCacheKeys.patterns.allPaged, // Para mostrar contador actualizado en listas
    ],

    // Cuando se agrega/elimina comentario
    onCommentChanged: (feedId: string) => [
      feedCacheKeys.commentsCount(feedId),
      feedCacheKeys.single(feedId),
      feedCacheKeys.patterns.allComments,
      feedCacheKeys.patterns.allPaged, // Para mostrar contador actualizado en listas
    ],
  },
};
