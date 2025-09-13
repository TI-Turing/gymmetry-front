import React from 'react';
import { UnifiedPostCard } from './UnifiedPostCard';
import type { UnifiedPostCardProps } from './UnifiedPostCard';

// Props optimizadas que coinciden exactamente con UnifiedPostCard
interface OptimizedPostCardProps extends UnifiedPostCardProps {}

// Componente optimizado con React.memo
const OptimizedPostCard = React.memo<OptimizedPostCardProps>(
  (props) => {
    return <UnifiedPostCard {...props} />;
  },
  // Función de comparación personalizada para optimizar re-renders
  (prevProps, nextProps) => {
    // Comparación básica de primitivos
    if (
      prevProps.showActions !== nextProps.showActions ||
      prevProps.variant !== nextProps.variant ||
      prevProps.isAnonymousActive !== nextProps.isAnonymousActive ||
      prevProps.currentUserId !== nextProps.currentUserId ||
      prevProps.showEdit !== nextProps.showEdit ||
      prevProps.showReport !== nextProps.showReport ||
      prevProps.post.id !== nextProps.post.id
    ) {
      return false;
    }

    // Comparación profunda del post (solo campos que afectan renderizado)
    const prevPost = prevProps.post;
    const nextPost = nextProps.post;

    if (
      prevPost.content !== nextPost.content ||
      prevPost.likesCount !== nextPost.likesCount ||
      prevPost.commentsCount !== nextPost.commentsCount ||
      prevPost.sharesCount !== nextPost.sharesCount ||
      prevPost.createdAt !== nextPost.createdAt ||
      prevPost.authorName !== nextPost.authorName ||
      prevPost.authorAvatar !== nextPost.authorAvatar ||
      prevPost.author?.name !== nextPost.author?.name ||
      prevPost.author?.avatar !== nextPost.author?.avatar ||
      prevPost.mediaUrl !== nextPost.mediaUrl ||
      prevPost.mediaType !== nextPost.mediaType
    ) {
      return false;
    }

    // Si llegamos aquí, los props son "iguales" para efectos de renderizado
    return true;
  }
);

OptimizedPostCard.displayName = 'OptimizedPostCard';

export { OptimizedPostCard };
export type { OptimizedPostCardProps };
