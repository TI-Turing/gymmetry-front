import { useState, useCallback, useMemo } from 'react';

export interface Reaction {
  emoji: string;
  name: string;
  count: number;
  userReacted: boolean;
}

export interface UseReactionsOptions {
  postId: string;
  initialReactions?: Reaction[];
}

export interface UseReactionsReturn {
  reactions: Reaction[];
  addReaction: (emoji: string) => void;
  removeReaction: (emoji: string) => void;
  totalReactions: number;
  userReactions: string[];
}

export function useReactions({
  postId: _postId,
  initialReactions = [],
}: UseReactionsOptions): UseReactionsReturn {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);

  const addReaction = useCallback((emoji: string) => {
    setReactions((prevReactions) => {
      const existingIndex = prevReactions.findIndex((r) => r.emoji === emoji);

      if (existingIndex >= 0) {
        // Si la reacción ya existe, alternar estado del usuario
        const updatedReactions = [...prevReactions];
        const existingReaction = updatedReactions[existingIndex];

        if (existingReaction.userReacted) {
          // Usuario ya reaccionó, quitar reacción
          updatedReactions[existingIndex] = {
            ...existingReaction,
            count: Math.max(0, existingReaction.count - 1),
            userReacted: false,
          };
        } else {
          // Usuario no había reaccionado, agregar reacción
          updatedReactions[existingIndex] = {
            ...existingReaction,
            count: existingReaction.count + 1,
            userReacted: true,
          };
        }

        return updatedReactions;
      } else {
        // Nueva reacción, agregar al final
        const newReaction: Reaction = {
          emoji,
          name: emoji, // Usar emoji como nombre por defecto
          count: 1,
          userReacted: true,
        };

        return [...prevReactions, newReaction];
      }
    });
  }, []);

  const removeReaction = useCallback((emoji: string) => {
    setReactions((prevReactions) => {
      const existingIndex = prevReactions.findIndex((r) => r.emoji === emoji);

      if (existingIndex >= 0) {
        const updatedReactions = [...prevReactions];
        const existingReaction = updatedReactions[existingIndex];

        if (existingReaction.userReacted && existingReaction.count > 0) {
          updatedReactions[existingIndex] = {
            ...existingReaction,
            count: existingReaction.count - 1,
            userReacted: false,
          };

          // Si el count llega a 0, remover la reacción completamente
          if (updatedReactions[existingIndex].count === 0) {
            return updatedReactions.filter(
              (_, index) => index !== existingIndex
            );
          }

          return updatedReactions;
        }
      }

      return prevReactions;
    });
  }, []);

  const totalReactions = useMemo(() => {
    return reactions.reduce((total, reaction) => total + reaction.count, 0);
  }, [reactions]);

  const userReactions = useMemo(() => {
    return reactions.filter((r) => r.userReacted).map((r) => r.emoji);
  }, [reactions]);

  return {
    reactions,
    addReaction,
    removeReaction,
    totalReactions,
    userReactions,
  };
}
