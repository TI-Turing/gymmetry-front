import React, { useCallback, useRef, useState } from 'react';
import { Text, View } from '@/components/Themed';
import {
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import stylesFn from './styles';
import type { FeedItem, FeedListProps } from '@/types/feedTypes';
import { UnifiedPostCard } from '../common/UnifiedPostCard';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedViewTracking } from '@/hooks/useFeedViewTracking';
import FeedSkeleton from '../common/FeedSkeleton';
import { AdCard, AdMobBanner } from '@/components/ad';
import { useMixedAds } from '@/hooks';

const FeedList: React.FC<FeedListProps> = React.memo(
  ({
    items,
    loading,
    error,
    refetch,
    onCreatePost,
    onEndReached,
    hasMore,
    unviewedCount,
    onFeedItemUpdate,
    onScrollDirectionChange,
  }) => {
    const themed = useThemedStyles(stylesFn);
    const { user: authUser } = useAuth();
    const colorScheme = useColorScheme();
    const lastScrollY = useRef(0);
    const scrollThreshold = 10; // Umbral mínimo de scroll para detectar dirección
    const [visibleAdIds, setVisibleAdIds] = useState<Set<string>>(new Set());

    // Hook de anuncios híbridos (40% propios + 60% AdMob)
    const feedWithAds = useMixedAds(items || []);

    // Colores para RefreshControl
    const refreshTintColor =
      colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;
    const refreshColor =
      colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;

    const handleToggleLike = useCallback(
      async (feedId: string) => {
        if (!authUser?.id) {
          return;
        }

        // Encuentra el feed en la lista actual
        const feed = items?.find((item) => item.id === feedId);
        if (!feed) {
          return;
        }

        // Actualización optimista: actualizar UI inmediatamente
        const wasLiked = feed.isLiked;
        const newLikesCount = wasLiked
          ? (feed.likesCount || 1) - 1
          : (feed.likesCount || 0) + 1;

        if (onFeedItemUpdate) {
          onFeedItemUpdate(feedId, {
            isLiked: !wasLiked,
            likesCount: newLikesCount,
          });
        }

        // Importa el servicio de feeds dinámicamente
        const { feedService } = await import('@/services/feedService');

        try {
          if (wasLiked) {
            // Si ya tiene like, usar el endpoint unlike
            await feedService.unlike(feedId);
          } else {
            // Si no tiene like, usar el endpoint like
            await feedService.like(feedId);
          }
          // No hacer refetch, la UI ya está actualizada
        } catch (error) {
          // Si falla, revertir el cambio optimista
          if (onFeedItemUpdate) {
            onFeedItemUpdate(feedId, {
              isLiked: wasLiked,
              likesCount: feed.likesCount || 0,
            });
          }
          void error;
        }
      },
      [authUser?.id, items, onFeedItemUpdate]
    );

    const handleShare = useCallback((postId: string) => {
      // TODO: Implementar share
      void postId;
    }, []);

    const handlePostUpdated = useCallback((updatedPost: FeedItem) => {
      // TODO: Actualizar post en la lista
      void updatedPost;
    }, []);

    // Hook para tracking de feeds vistos
    const { markFeedVisible } = useFeedViewTracking();

    // Handler para detectar feeds visibles en pantalla
    const handleViewableItemsChanged = useCallback(
      ({ viewableItems }: { viewableItems: unknown[] }) => {
        // Actualizar set de IDs visibles para anuncios
        const newVisibleAdIds = new Set<string>();
        
        viewableItems.forEach((viewable: unknown) => {
          const item = viewable as { isViewable: boolean; item: FeedItem };
          if (item.isViewable && item.item?.id) {
            // Marcar post normal como visible
            if (!item.item.isAd) {
              markFeedVisible(item.item.id);
            } else {
              // Agregar ad al set de visibles
              newVisibleAdIds.add(item.item.id);
            }
          }
        });
        
        // Actualizar state de ads visibles (causa re-render)
        setVisibleAdIds(newVisibleAdIds);
      },
      [markFeedVisible]
    );

    // Configuración de visibilidad: 50% del post visible por al menos 1.5s
    const viewabilityConfig = useCallback(
      () => ({
        itemVisiblePercentThreshold: 50,
        minimumViewTime: 1500,
      }),
      []
    );

    // Handler para detectar dirección del scroll
    const handleScroll = useCallback(
      (event: { nativeEvent: { contentOffset: { y: number } } }) => {
        if (!onScrollDirectionChange) return;

        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        // Solo notificar si el cambio supera el umbral
        if (Math.abs(diff) > scrollThreshold) {
          const isScrollingDown = diff > 0;
          onScrollDirectionChange(isScrollingDown);
          lastScrollY.current = currentScrollY;
        }
      },
      [onScrollDirectionChange, scrollThreshold]
    );

    const renderFeedItem = useCallback(
      ({ item }: { item: FeedItem }) => {
        // Renderizar anuncio de AdMob (60%)
        if (item.type === 'admob_ad' && item.isAdMob) {
          return <AdMobBanner />;
        }

        // Renderizar anuncio propio (40%)
        if (item.isAd && item.adData) {
          const isVisible = visibleAdIds.has(item.id);
          return (
            <AdCard
              ad={{
                Id: item.id.replace('ad_', ''),
                Title: item.adData.title,
                Description: item.content || '',
                ImageUrl: item.mediaUrls?.[0] || '',
                CtaText: item.adData.ctaText,
                TargetUrl: item.adData.targetUrl,
                DisplayPriority: 0,
              }}
              isCurrentlyVisible={isVisible}
            />
          );
        }

        // Renderizar post normal
        return (
          <UnifiedPostCard
            post={item}
            onToggleLike={handleToggleLike}
            onShare={handleShare}
            onPostUpdated={handlePostUpdated}
            currentUserId={authUser?.id}
            showActions={true}
            showEdit={true}
            variant="default"
          />
        );
      },
      [
        handleToggleLike,
        handleShare,
        handlePostUpdated,
        authUser?.id,
        visibleAdIds,
      ]
    );

    const keyExtractor = useCallback((item: FeedItem) => {
      // Para anuncios de AdMob, usar prefijo 'admob_'
      if (item.type === 'admob_ad') {
        return `admob_${item.id}`;
      }
      // Para anuncios propios, usar prefijo 'ad_'
      if (item.isAd) {
        return `ad_${item.id}`;
      }
      // Para posts normales
      return item.id;
    }, []);

    // Footer con indicador de loading o mensaje de fin de feed
    const renderFooter = useCallback(() => {
      if (!hasMore && items && items.length > 0) {
        return (
          <View style={themed.footerContainer}>
            <Text style={themed.footerText}>
              {unviewedCount === 0
                ? 'No hay nada nuevo por ahora'
                : 'No hay más contenido por ahora'}
            </Text>
          </View>
        );
      }

      if (loading && items && items.length > 0) {
        return (
          <View style={themed.footerContainer}>
            <ActivityIndicator size="small" color={Colors.light.tint} />
          </View>
        );
      }

      return null;
    }, [hasMore, items, unviewedCount, loading, themed]);

    if (loading && (!items || items.length === 0)) {
      return (
        <View style={themed.container}>
          <FeedSkeleton count={5} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={themed.container}>
          <Text style={themed.errorText}>Error: {error}</Text>
          {refetch && (
            <Text style={themed.retryButton} onPress={refetch}>
              Reintentar
            </Text>
          )}
        </View>
      );
    }

    if (!items || items.length === 0) {
      return (
        <View style={themed.emptyStateContainer}>
          <View style={themed.emptyIcon}>
            <Text style={themed.emptyIconText}>📡</Text>
          </View>
          <Text style={themed.emptyTitle}>
            ¡Tu feed está esperando contenido!
          </Text>
          <Text style={themed.emptyMessage}>
            Aún no hay publicaciones{'\n'}disponibles
          </Text>
          <Text style={themed.emptySubtext}>
            Sé el primero en compartir algo increíble
          </Text>

          <View style={themed.emptyActions}>
            <TouchableOpacity
              style={themed.uploadButton}
              onPress={onCreatePost}
            >
              <Text style={themed.uploadButtonIcon}>✍️</Text>
              <Text style={themed.uploadButtonText}>Crear Publicación</Text>
            </TouchableOpacity>

            <TouchableOpacity style={themed.refreshButton} onPress={refetch}>
              <Text style={themed.refreshButtonIcon}>🔄</Text>
              <Text style={themed.refreshButtonText}>Actualizar feed</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={themed.container}>
        <FlatList
          data={feedWithAds}
          renderItem={renderFeedItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={themed.listContainer}
          ItemSeparatorComponent={() => <View style={themed.separator} />}
          ListFooterComponent={renderFooter}
          refreshControl={
            refetch ? (
              <RefreshControl
                refreshing={!!loading}
                onRefresh={refetch}
                tintColor={refreshTintColor}
                colors={[refreshColor]}
              />
            ) : undefined
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={21}
          initialNumToRender={20}
        />
      </View>
    );
  }
);

FeedList.displayName = 'FeedList';

export default FeedList;
