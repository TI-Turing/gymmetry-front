import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useColorScheme } from '../useColorScheme';

export interface EmojiReaction {
  emoji: string;
  name: string;
  count: number;
  userReacted: boolean;
}

export interface EmojiSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  currentReactions?: EmojiReaction[];
}

const POPULAR_EMOJIS = [
  { emoji: '❤️', name: 'love', label: 'Me encanta' },
  { emoji: '👍', name: 'like', label: 'Me gusta' },
  { emoji: '💪', name: 'strong', label: 'Fuerte' },
  { emoji: '🔥', name: 'fire', label: 'Genial' },
  { emoji: '👏', name: 'clap', label: 'Aplausos' },
  { emoji: '😍', name: 'love_eyes', label: 'Increíble' },
  { emoji: '💯', name: 'hundred', label: 'Perfecto' },
  { emoji: '⚡', name: 'energy', label: 'Energía' },
];

const ALL_EMOJIS = [
  ...POPULAR_EMOJIS,
  { emoji: '😊', name: 'smile', label: 'Sonrisa' },
  { emoji: '😂', name: 'laugh', label: 'Risa' },
  { emoji: '🤩', name: 'star_eyes', label: 'Asombrado' },
  { emoji: '😎', name: 'cool', label: 'Genial' },
  { emoji: '🤔', name: 'thinking', label: 'Pensativo' },
  { emoji: '👌', name: 'ok', label: 'Perfecto' },
  { emoji: '🙌', name: 'hands_up', label: 'Celebración' },
  { emoji: '💡', name: 'idea', label: 'Buena idea' },
  { emoji: '🎯', name: 'target', label: 'En el blanco' },
  { emoji: '🚀', name: 'rocket', label: 'Increíble' },
  { emoji: '⭐', name: 'star', label: 'Estrella' },
  { emoji: '🏆', name: 'trophy', label: 'Ganador' },
];

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  visible,
  onClose,
  onSelectEmoji,
  currentReactions = [],
}) => {
  const colorScheme = useColorScheme();
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const styles = createStyles(colorScheme);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(0);
      scaleAnim.setValue(0);
      setShowAllEmojis(false);
    }
  }, [visible, slideAnim, scaleAnim]);

  const handleEmojiPress = useCallback(
    (emoji: string) => {
      onSelectEmoji(emoji);
      onClose();
    },
    [onSelectEmoji, onClose]
  );

  const getEmojiCount = useCallback(
    (emoji: string): number => {
      const reaction = currentReactions.find((r) => r.emoji === emoji);
      return reaction?.count || 0;
    },
    [currentReactions]
  );

  const hasUserReacted = useCallback(
    (emoji: string): boolean => {
      const reaction = currentReactions.find((r) => r.emoji === emoji);
      return reaction?.userReacted || false;
    },
    [currentReactions]
  );

  const renderEmojiButton = useCallback(
    (emojiData: (typeof POPULAR_EMOJIS)[0], index: number) => {
      const count = getEmojiCount(emojiData.emoji);
      const userReacted = hasUserReacted(emojiData.emoji);
      const _delay = index * 50;

      return (
        <Animated.View
          key={emojiData.name}
          style={[
            styles.emojiButton,
            userReacted && styles.emojiButtonReacted,
            {
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
              opacity: slideAnim,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleEmojiPress(emojiData.emoji)}
            style={styles.emojiTouchable}
            activeOpacity={0.7}
          >
            <Text style={styles.emojiIcon}>{emojiData.emoji}</Text>
            <Text style={styles.emojiLabel}>{emojiData.label}</Text>
            {count > 0 && (
              <View style={styles.emojiCountBadge}>
                <Text style={styles.emojiCountText}>{count}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [
      styles,
      getEmojiCount,
      hasUserReacted,
      handleEmojiPress,
      scaleAnim,
      slideAnim,
    ]
  );

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Reacciona con un emoji</Text>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowAllEmojis(!showAllEmojis)}
              >
                <Text style={styles.toggleText}>
                  {showAllEmojis ? 'Menos' : 'Más'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Popular emojis */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Populares</Text>
              <View style={styles.emojiGrid}>
                {POPULAR_EMOJIS.map((emojiData, index) =>
                  renderEmojiButton(emojiData, index)
                )}
              </View>
            </View>

            {/* All emojis (expandable) */}
            {showAllEmojis && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Todos los emojis</Text>
                <ScrollView
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.emojiGrid}>
                    {ALL_EMOJIS.map((emojiData, index) =>
                      renderEmojiButton(
                        emojiData,
                        index + POPULAR_EMOJIS.length
                      )
                    )}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
      paddingBottom: 34, // Safe area
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    toggleButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#FF6B35',
      borderRadius: 8,
    },
    toggleText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '500',
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 12,
    },
    emojiGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    emojiButton: {
      position: 'relative',
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    emojiButtonReacted: {
      borderColor: '#FF6B35',
      backgroundColor: isDark ? '#2a1f1a' : '#fff5f0',
    },
    emojiTouchable: {
      padding: 12,
      alignItems: 'center',
      minWidth: 70,
    },
    emojiIcon: {
      fontSize: 24,
      marginBottom: 4,
    },
    emojiLabel: {
      fontSize: 12,
      color: isDark ? '#ccc' : '#666',
      textAlign: 'center',
    },
    emojiCountBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: '#FF6B35',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    emojiCountText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '600',
    },
    scrollContainer: {
      maxHeight: 200,
    },
    closeButton: {
      marginHorizontal: 20,
      marginTop: 16,
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    closeText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#fff' : '#000',
    },
  });
};
