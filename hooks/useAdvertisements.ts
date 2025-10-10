import { useState, useEffect, useCallback, useMemo } from 'react';
import { advertisementService } from '@/services';
import type { AdvertisementResponseDto } from '@/dto/Advertisement/Response/AdvertisementResponseDto';
import type { FeedItem } from '@/types/feedTypes';
import { mapAdvertisementToFeedItem } from '@/types/feedTypes';

/**
 * Hook para obtener y gestionar anuncios activos
 *
 * Características:
 * - Fetch automático al montar
 * - Estado de loading y error
 * - Función de refetch manual
 * - Cache en memoria durante la sesión
 *
 * @returns ads, loading, error, refetch
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { ads, loading, error, refetch } = useAdvertisements();
 *
 *   if (loading) return <Loader />;
 *   if (error) return <ErrorView message={error} />;
 *
 *   return (
 *     <View>
 *       {ads.map(ad => (
 *         <AdCard key={ad.Id} ad={ad} />
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
export function useAdvertisements() {
  const [ads, setAds] = useState<AdvertisementResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await advertisementService.getActiveAds();

      if (resp?.Success && resp.Data) {
        setAds(resp.Data);
      } else {
        setError(resp?.Message || 'Error al cargar anuncios');
        setAds([]);
      }
    } catch (err) {
      setError('Error de red al cargar anuncios');
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return {
    ads,
    loading,
    error,
    refetch: fetchAds,
  };
}

/**
 * Hook para mezclar anuncios propios con posts del feed
 *
 * Algoritmo:
 * 1. Por cada N posts (postsPerAd), inserta un anuncio
 * 2. Los anuncios se rotan circularmente
 * 3. Si no hay anuncios, retorna solo posts
 *
 * @param posts Array de posts originales
 * @param postsPerAd Cada cuántos posts insertar un anuncio (default: 5)
 * @returns Array de posts + anuncios intercalados
 *
 * @example
 * ```typescript
 * function FeedScreen() {
 *   const { data: posts } = useFeedPaged();
 *   const feedWithAds = useFeedWithAds(posts || [], 5);
 *
 *   return (
 *     <FlatList
 *       data={feedWithAds}
 *       renderItem={({ item }) => {
 *         if (item.isAd) {
 *           return <AdCard adData={item.adData!} />;
 *         }
 *         return <UnifiedPostCard post={item} />;
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function useFeedWithAds(
  posts: FeedItem[],
  postsPerAd: number = 5
): FeedItem[] {
  const { ads } = useAdvertisements();

  const feedWithAds = useMemo(() => {
    // Si no hay posts o anuncios, retornar posts tal cual
    if (!posts.length || !ads.length) {
      return posts;
    }

    const result: FeedItem[] = [];
    let adIndex = 0;

    posts.forEach((post, index) => {
      result.push(post);

      // Insertar anuncio cada N posts
      // index + 1 porque index es 0-based
      const shouldInsertAd = (index + 1) % postsPerAd === 0;

      if (shouldInsertAd && adIndex < ads.length) {
        const ad = ads[adIndex];
        // Agregar identificador único basado en posición para evitar duplicados
        const instanceId = `p${index}`;
        const adFeedItem = mapAdvertisementToFeedItem(ad, false, instanceId);
        result.push(adFeedItem);

        // Rotar al siguiente anuncio (circular)
        adIndex = (adIndex + 1) % ads.length;
      }
    });

    return result;
  }, [posts, ads, postsPerAd]);

  return feedWithAds;
}

/**
 * Hook para obtener la configuración de anuncios desde el backend
 *
 * Configuración incluye:
 * - PostsPerAd: Frecuencia de anuncios
 * - AdMobPercentage: Ratio AdMob vs propios
 *
 * @returns Configuración de anuncios
 *
 * @example
 * ```typescript
 * function FeedScreen() {
 *   const config = useAdConfig();
 *   const feedWithAds = useFeedWithAds(posts, config.postsPerAd);
 *
 *   console.log(`Mostrar anuncio cada ${config.postsPerAd} posts`);
 *   console.log(`${config.admobPercentage}% AdMob`);
 * }
 * ```
 */
export function useAdConfig() {
  const [config, setConfig] = useState({
    postsPerAd: 5,
    admobPercentage: 60,
  });

  useEffect(() => {
    advertisementService.getConfig().then((resp) => {
      if (resp?.Success && resp.Data) {
        setConfig({
          postsPerAd: resp.Data.PostsPerAd,
          admobPercentage: resp.Data.AdMobPercentage,
        });
      }
    });
  }, []);

  return config;
}
