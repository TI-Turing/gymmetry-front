import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export interface ReactionAnimationProps {
  emoji: string;
  visible: boolean;
  onAnimationComplete?: () => void;
}

export const ReactionAnimation: React.FC<ReactionAnimationProps> = ({
  emoji,
  visible,
  onAnimationComplete,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      translateYAnim.setValue(0);
      rotateAnim.setValue(0);
      opacityAnim.setValue(1);

      // Animate in sequence
      Animated.sequence([
        // Scale up quickly
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Scale back to normal while moving up
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: -20,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        // Fade out
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete?.();
      });
    }
  }, [
    visible,
    scaleAnim,
    translateYAnim,
    rotateAnim,
    opacityAnim,
    onAnimationComplete,
  ]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
            { rotate },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
    </Animated.View>
  );
};

export interface ReactionBurstProps {
  emojis: string[];
  visible: boolean;
  onComplete?: () => void;
}

export const ReactionBurst: React.FC<ReactionBurstProps> = ({
  emojis,
  visible,
  onComplete,
}) => {
  const animations = useRef(
    emojis.map(() => ({
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    if (visible && emojis.length > 0) {
      // Reset all animations
      animations.forEach((anim) => {
        anim.scale.setValue(0);
        anim.translateX.setValue(0);
        anim.translateY.setValue(0);
        anim.opacity.setValue(1);
      });

      // Create burst effect
      const animationPromises = animations.map((anim, index) => {
        const angle = (360 / emojis.length) * index;
        const radius = 40 + Math.random() * 20;
        const finalX = Math.cos((angle * Math.PI) / 180) * radius;
        const finalY = Math.sin((angle * Math.PI) / 180) * radius;

        return Animated.sequence([
          // Slight delay for stagger effect
          Animated.delay(index * 50),
          // Scale up and spread out
          Animated.parallel([
            Animated.spring(anim.scale, {
              toValue: 1,
              tension: 100,
              friction: 6,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateX, {
              toValue: finalX,
              duration: 600,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: finalY,
              duration: 600,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          // Fade out
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.parallel(animationPromises).start(() => {
        onComplete?.();
      });
    }
  }, [visible, emojis, animations, onComplete]);

  if (!visible || emojis.length === 0) return null;

  return (
    <View style={styles.burstContainer}>
      {emojis.map((emoji, index) => (
        <Animated.View
          key={`burst-${index}`}
          style={[
            styles.burstEmoji,
            {
              transform: [
                { scale: animations[index].scale },
                { translateX: animations[index].translateX },
                { translateY: animations[index].translateY },
              ],
              opacity: animations[index].opacity,
            },
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  burstContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    pointerEvents: 'none',
  },
  burstEmoji: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
