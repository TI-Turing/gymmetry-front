import { useMemo } from 'react';
import { useAdvertisements, useAdConfig } from '@/hooks';
import type { FeedItem } from '@/types/feedTypes';
import { mapAdvertisementToFeedItem } from '@/types/feedTypes';

/**
 * Hook para mezclar posts con anuncios híbridos (propios 40% + AdMob 60%)
 *
 * Algoritmo:
 * 1. Por cada N posts (postsPerAd del backend), inserta un espacio para anuncio
 * 2. En ese espacio, decide si mostrar:
 *    - Anuncio propio (40% según adMixRatio)
 *    - Anuncio AdMob (60% según adMixRatio)
 * 3. Los anuncios propios se rotan circularmente
 * 4. Los anuncios AdMob se identifican con type='admob_ad' e id único
 * 5. Si no hay anuncios propios, todos los espacios serán AdMob
 *
 * @param posts Array de posts del feed
 * @returns Array de FeedItem con posts + anuncios intercalados
 *
 * @example
 * ```typescript
 * function FeedList() {
 *   const { state } = useInfiniteFeedWithTracking();
 *   const feedItems = useMixedAds(state.feeds);
 *
 *   return (
 *     <FlatList
 *       data={feedItems}
 *       renderItem={({ item }) => {
 *         if (item.type === 'admob_ad') {
 *           return <AdMobBanner />;
 *         }
 *         if (item.isAd) {
 *           return <AdCard ad={item.adData!} />;
 *         }
 *         return <UnifiedPostCard post={item} />;
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function useMixedAds(posts: FeedItem[]): FeedItem[] {
  const { ads } = useAdvertisements();
  const config = useAdConfig();

  const feedWithMixedAds = useMemo(() => {
    // Si no hay posts, retornar vacío
    if (!posts.length) {
      return posts;
    }

    const result: FeedItem[] = [];
    let ownAdIndex = 0; // Índice para rotar anuncios propios
    let admobAdCounter = 0; // Contador para IDs únicos de AdMob

    // Convertir admobPercentage a decimal (60% = 0.6)
    const admobRatio = config.admobPercentage / 100;

    posts.forEach((post, index) => {
      // Agregar el post original
      result.push(post);

      // Determinar si toca insertar un anuncio
      // index + 1 porque index es 0-based
      const shouldInsertAd = (index + 1) % config.postsPerAd === 0;

      if (shouldInsertAd) {
        // Decidir: anuncio propio o AdMob usando ratio
        // Si Math.random() < 0.6 → AdMob (60%)
        // Si Math.random() >= 0.6 → Propio (40%)
        const shouldShowAdMob = Math.random() < admobRatio;

        if (shouldShowAdMob) {
          // Insertar anuncio de AdMob
          const admobFeedItem: FeedItem = {
            id: `admob_${admobAdCounter++}`,
            type: 'admob_ad',
            userId: 'system',
            userName: 'Anuncio',
            userProfilePicture: undefined,
            content: '',
            mediaUrls: [],
            createdAt: new Date().toISOString(),
            likesCount: 0,
            commentsCount: 0,
            isLiked: false,
            isAd: true,
            isAdMob: true,
          };
          result.push(admobFeedItem);
        } else if (ads.length > 0) {
          // Insertar anuncio propio (solo si hay disponibles)
          const ad = ads[ownAdIndex];
          const ownAdFeedItem = mapAdvertisementToFeedItem(ad, false);
          result.push(ownAdFeedItem);

          // Rotar al siguiente anuncio propio (circular)
          ownAdIndex = (ownAdIndex + 1) % ads.length;
        } else {
          // Fallback: si no hay ads propios, mostrar AdMob
          const admobFeedItem: FeedItem = {
            id: `admob_${admobAdCounter++}`,
            type: 'admob_ad',
            userId: 'system',
            userName: 'Anuncio',
            userProfilePicture: undefined,
            content: '',
            mediaUrls: [],
            createdAt: new Date().toISOString(),
            likesCount: 0,
            commentsCount: 0,
            isLiked: false,
            isAd: true,
            isAdMob: true,
          };
          result.push(admobFeedItem);
        }
      }
    });

    return result;
  }, [posts, ads, config.postsPerAd, config.admobPercentage]);

  return feedWithMixedAds;
}
