import { useCallback } from 'react';
import { userBlockService } from '@/services';

/**
 * Hook para filtrar contenido de usuarios bloqueados
 * Proporciona funciones para verificar bloqueos y filtrar listas
 */
export const useBlockedContentFilter = () => {
  /**
   * Verifica si un usuario específico está bloqueado
   */
  const isUserBlocked = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        if (!userId) {
          return false;
        }

        return await userBlockService.isUserBlocked(userId);
      } catch (error) {
        // Silently fail to avoid console spam
        return false;
      }
    },
    []
  );

  /**
   * Obtiene la lista de usuarios bloqueados por el usuario actual
   */
  const getBlockedUserIds = useCallback(async (): Promise<string[]> => {
    try {
      const response = await userBlockService.getBlockedUsers();
      if (response?.Success && response.Data) {
        // Normalizar la respuesta del backend
        const data = Array.isArray(response.Data)
          ? response.Data
          : (response.Data as { $values?: unknown[] })?.$values || [];

        return data
          .map(
            (block: unknown) =>
              (block as { BlockedUserId?: string; blockedUserId?: string })
                .BlockedUserId ||
              (block as { BlockedUserId?: string; blockedUserId?: string })
                .blockedUserId ||
              ''
          )
          .filter(Boolean);
      }

      return [];
    } catch (error) {
      // Silently fail to avoid console spam
      return [];
    }
  }, []);

  /**
   * Filtra una lista de posts removiendo los de usuarios bloqueados
   */
  const filterBlockedPosts = useCallback(
    async <T extends { author?: { id?: string }; authorId?: string }>(
      posts: T[]
    ): Promise<T[]> => {
      try {
        const blockedUserIds = await getBlockedUserIds();
        if (blockedUserIds.length === 0) {
          return posts;
        }

        return posts.filter((post) => {
          const postAuthorId = post.author?.id || post.authorId;
          return postAuthorId && !blockedUserIds.includes(postAuthorId);
        });
      } catch (error) {
        return posts; // En caso de error, devolver todos los posts
      }
    },
    [getBlockedUserIds]
  );

  /**
   * Filtra una lista de comentarios removiendo los de usuarios bloqueados
   */
  const filterBlockedComments = useCallback(
    async <T extends { userId?: string; UserId?: string }>(
      comments: T[]
    ): Promise<T[]> => {
      try {
        const blockedUserIds = await getBlockedUserIds();
        if (blockedUserIds.length === 0) {
          return comments;
        }

        return comments.filter((comment) => {
          const commentUserId = comment.userId || comment.UserId;
          return commentUserId && !blockedUserIds.includes(commentUserId);
        });
      } catch (error) {
        return comments; // En caso de error, devolver todos los comentarios
      }
    },
    [getBlockedUserIds]
  );

  /**
   * Verifica si el contenido debe ocultarse por bloqueo
   */
  const shouldHideContent = useCallback(
    async (authorId: string): Promise<boolean> => {
      if (!authorId) return false;
      return await isUserBlocked(authorId);
    },
    [isUserBlocked]
  );

  /**
   * Crea un filtro de contenido con cache para mejor performance
   */
  const createContentFilter = useCallback(() => {
    let blockedUsersCache: string[] | null = null;
    let cacheExpiry = 0;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    const getBlockedUsersWithCache = async (): Promise<string[]> => {
      const now = Date.now();
      if (blockedUsersCache && now < cacheExpiry) {
        return blockedUsersCache;
      }

      blockedUsersCache = await getBlockedUserIds();
      cacheExpiry = now + CACHE_DURATION;
      return blockedUsersCache;
    };

    const isBlocked = async (userId: string): Promise<boolean> => {
      const blockedUsers = await getBlockedUsersWithCache();
      return blockedUsers.includes(userId);
    };

    const invalidateCache = () => {
      blockedUsersCache = null;
      cacheExpiry = 0;
    };

    return { isBlocked, invalidateCache };
  }, [getBlockedUserIds]);

  return {
    isUserBlocked,
    getBlockedUserIds,
    filterBlockedPosts,
    filterBlockedComments,
    shouldHideContent,
    createContentFilter,
  };
};
