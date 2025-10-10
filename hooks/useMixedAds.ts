import { useMemo } from 'react';
import { useAdvertisements, useAdConfig } from '@/hooks';
import { usePlanState } from '@/contexts/AppStateContext';
import type { FeedItem } from '@/types/feedTypes';
import { mapAdvertisementToFeedItem } from '@/types/feedTypes';

// ID del plan gratuito por defecto
const FREE_PLAN_ID = '4aa8380c-8479-4334-8236-3909be9c842b';

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
  const planInfo = usePlanState();

  // Verificar si el usuario debe ver anuncios de Google AdMob
  // Se muestran anuncios de AdMob si:
  // 1. No tiene plan activo (planInfo es null O IsActive es false)
  // 2. Está usando el plan gratuito por defecto (IsFallbackFreePlan)
  // 3. Tiene explícitamente el plan gratuito (PlanTypeId === FREE_PLAN_ID)
  const shouldShowAdMobAds =
    !planInfo || // No tiene plan
    !planInfo.IsActive || // Plan expirado/inactivo (comportarse como free)
    planInfo.IsFallbackFreePlan || // Plan gratis por defecto
    planInfo.PlanTypeId?.toLowerCase() === FREE_PLAN_ID.toLowerCase(); // Plan gratis explícito

  const feedWithMixedAds = useMemo(() => {
    // Si no hay posts, retornar vacío
    if (!posts.length) {
      return posts;
    }

    const result: FeedItem[] = [];
    let ownAdIndex = 0; // Índice para rotar anuncios propios
    // Usar timestamp + random para IDs únicos de AdMob en cada render
    const admobIdBase = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
        console.log(`📍 [AdSlot] pos=${index}, shouldShowAdMobAds=${shouldShowAdMobAds}`);
        // Verificar si el usuario debe ver anuncios de AdMob según su plan
        if (!shouldShowAdMobAds) {
          console.log('🔒 [Premium] Usuario con plan de pago, solo anuncios propios');
          // Usuario con plan de pago: solo mostrar anuncios propios
          if (ads.length > 0) {
            const ad = ads[ownAdIndex];
            // Agregar identificador único basado en posición para evitar duplicados
            const instanceId = `pos${index}_${admobIdBase}`;
            const ownAdFeedItem = mapAdvertisementToFeedItem(ad, false, instanceId);
            result.push(ownAdFeedItem);
            ownAdIndex = (ownAdIndex + 1) % ads.length;
          }
          // Si no hay anuncios propios, no mostrar nada (no AdMob)
        } else {
          // Usuario con plan gratuito: mostrar anuncios híbridos (propios + AdMob)
          // Decidir: anuncio propio o AdMob usando ratio
          // Si Math.random() < 0.6 → AdMob (60%)
          // Si Math.random() >= 0.6 → Propio (40%)
          const randomValue = Math.random();
          const shouldShowAdMob = randomValue < admobRatio;
          console.log(`🎲 [Random] pos=${index}, random=${randomValue.toFixed(3)}, ratio=${admobRatio}, shouldShowAdMob=${shouldShowAdMob}`);

          if (shouldShowAdMob) {
            // Insertar anuncio de AdMob con ID único basado en timestamp
            const admobFeedItem: FeedItem = {
              id: `admob_${admobIdBase}_${admobAdCounter++}`,
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
            console.log('🟢 [AdMob] Insertando anuncio AdMob en posición', index, admobFeedItem.id);
            result.push(admobFeedItem);
          } else if (ads.length > 0) {
            // Insertar anuncio propio (solo si hay disponibles)
            const ad = ads[ownAdIndex];
            // Agregar identificador único basado en posición para evitar duplicados
            const instanceId = `pos${index}_${admobIdBase}`;
            const ownAdFeedItem = mapAdvertisementToFeedItem(
              ad,
              false,
              instanceId
            );
            console.log('🔵 [OwnAd] Insertando anuncio propio en posición', index, ownAdFeedItem.id);
            result.push(ownAdFeedItem);

            // Rotar al siguiente anuncio propio (circular)
            ownAdIndex = (ownAdIndex + 1) % ads.length;
          } else {
            // Fallback: si no hay ads propios, mostrar AdMob con ID único
            const admobFeedItem: FeedItem = {
              id: `admob_${admobIdBase}_${admobAdCounter++}`,
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
      }
    });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    posts,
    ads,
    config.postsPerAd,
    config.admobPercentage,
    shouldShowAdMobAds,
    planInfo,
  ]);

  return feedWithMixedAds;
}
