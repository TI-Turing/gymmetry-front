import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useColorScheme } from '../useColorScheme';
import { EmojiSelector } from './EmojiSelector';
import type { Reaction } from '../../hooks/useReactions';

// Re-export for convenience
export { useReactions } from '../../hooks/useReactions';
export type {
  Reaction,
  UseReactionsOptions,
  UseReactionsReturn,
} from '../../hooks/useReactions';

export interface ReactionsBarProps {
  reactions: Reaction[];
  onReactionPress: (emoji: string) => void;
  onAddReaction?: (emoji: string) => void;
  totalReactions?: number;
  maxVisible?: number;
  showAddButton?: boolean;
}

export const ReactionsBar: React.FC<ReactionsBarProps> = ({
  reactions,
  onReactionPress,
  onAddReaction,
  totalReactions,
  maxVisible = 6,
  showAddButton = true,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);

  const visibleReactions = showAllReactions
    ? reactions
    : reactions.slice(0, maxVisible);

  const hiddenCount = Math.max(0, reactions.length - maxVisible);

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      onAddReaction?.(emoji);
      setShowEmojiSelector(false);
    },
    [onAddReaction]
  );

  const handleToggleExpand = useCallback(() => {
    setShowAllReactions(!showAllReactions);
  }, [showAllReactions]);

  if (reactions.length === 0 && !showAddButton) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Reacciones existentes */}
        {visibleReactions.map((reaction, index) => (
          <TouchableOpacity
            key={`${reaction.emoji}-${index}`}
            style={[
              styles.reactionButton,
              reaction.userReacted && styles.reactionButtonActive,
            ]}
            onPress={() => onReactionPress(reaction.emoji)}
            activeOpacity={0.7}
          >
            <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
            <Text
              style={[
                styles.reactionCount,
                reaction.userReacted && styles.reactionCountActive,
              ]}
            >
              {reaction.count}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Botón para mostrar más reacciones */}
        {hiddenCount > 0 && !showAllReactions && (
          <TouchableOpacity
            style={styles.moreButton}
            onPress={handleToggleExpand}
            activeOpacity={0.7}
          >
            <Text style={styles.moreText}>+{hiddenCount}</Text>
          </TouchableOpacity>
        )}

        {/* Botón para colapsar reacciones */}
        {showAllReactions && reactions.length > maxVisible && (
          <TouchableOpacity
            style={styles.moreButton}
            onPress={handleToggleExpand}
            activeOpacity={0.7}
          >
            <Text style={styles.moreText}>−</Text>
          </TouchableOpacity>
        )}

        {/* Botón para agregar nueva reacción */}
        {showAddButton && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowEmojiSelector(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Total de reacciones */}
      {totalReactions !== undefined && totalReactions > 0 && (
        <TouchableOpacity style={styles.totalButton} activeOpacity={0.7}>
          <Text style={styles.totalText}>
            {totalReactions} reaccion{totalReactions !== 1 ? 'es' : ''}
          </Text>
        </TouchableOpacity>
      )}

      {/* Selector de emojis */}
      <EmojiSelector
        visible={showEmojiSelector}
        onClose={() => setShowEmojiSelector(false)}
        onSelectEmoji={handleEmojiSelect}
        currentReactions={reactions.map((r) => ({
          emoji: r.emoji,
          name: r.name,
          count: r.count,
          userReacted: r.userReacted,
        }))}
      />
    </View>
  );
};

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      paddingVertical: 8,
    },
    scrollContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    reactionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginRight: 8,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    reactionButtonActive: {
      backgroundColor: isDark ? '#2a1f1a' : '#fff5f0',
      borderColor: '#FF6B35',
    },
    reactionEmoji: {
      fontSize: 16,
      marginRight: 4,
    },
    reactionCount: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#ccc' : '#666',
    },
    reactionCountActive: {
      color: '#FF6B35',
      fontWeight: '600',
    },
    moreButton: {
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginRight: 8,
    },
    moreText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#ccc' : '#666',
    },
    addButton: {
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#e0e0e0',
      borderStyle: 'dashed',
    },
    addButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ccc' : '#666',
    },
    totalButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    totalText: {
      fontSize: 13,
      color: isDark ? '#999' : '#666',
      textAlign: 'right',
    },
  });
};
