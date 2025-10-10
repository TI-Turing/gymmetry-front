import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Modal } from 'react-native';
import { Text } from '@/components/Themed';

interface FloatingReactionsPickerProps {
  visible: boolean;
  onReactionSelect: (emoji: string) => void;
  onClose: () => void;
  position?: { x: number; y: number };
}

const REACTIONS = [
  { emoji: '❤️', name: 'love' },
  { emoji: '👍', name: 'like' },
  { emoji: '💪', name: 'strong' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '😂', name: 'haha' },
];

export const FloatingReactionsPicker: React.FC<
  FloatingReactionsPickerProps
> = ({ visible, onReactionSelect, onClose, position }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scaleAnim]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.container,
            position && {
              position: 'absolute',
              left: position.x,
              top: position.y,
            },
            {
              transform: [{ scale: scaleAnim }],
              opacity: scaleAnim,
            },
          ]}
        >
          {REACTIONS.map((reaction) => (
            <TouchableOpacity
              key={reaction.name}
              style={styles.reactionButton}
              onPress={() => onReactionSelect(reaction.emoji)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{reaction.emoji}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  reactionButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  emoji: {
    fontSize: 28,
  },
});

export default FloatingReactionsPicker;
