import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useColorScheme } from '../useColorScheme';

export interface RefreshIndicatorProps {
  isRefreshing: boolean;
  pullDistance: number;
  maxPullDistance: number;
  refreshThreshold: number;
  message?: string;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({
  isRefreshing,
  pullDistance,
  maxPullDistance,
  refreshThreshold,
  message = 'Arrastra para actualizar',
}) => {
  const colorScheme = useColorScheme();
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  const styles = createStyles(colorScheme);

  // Animación de rotación para el spinner
  useEffect(() => {
    if (isRefreshing) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
      return () => spinAnimation.stop();
    } else {
      spinValue.setValue(0);
      return undefined;
    }
  }, [isRefreshing, spinValue]);

  // Animación de escala basada en la distancia de pull
  useEffect(() => {
    const progress = Math.min(pullDistance / refreshThreshold, 1);
    const scale = Math.max(0.1, progress);
    const opacity = Math.min(progress * 1.5, 1);

    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: scale,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: opacity,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pullDistance, refreshThreshold, scaleValue, opacityValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getIndicatorState = () => {
    if (isRefreshing) {
      return {
        icon: '⟳',
        message: 'Actualizando...',
        color: '#FF6B35',
      };
    }

    if (pullDistance >= refreshThreshold) {
      return {
        icon: '↑',
        message: 'Suelta para actualizar',
        color: '#4CAF50',
      };
    }

    const progress = pullDistance / refreshThreshold;
    if (progress > 0.7) {
      return {
        icon: '↓',
        message: 'Casi listo...',
        color: '#FF9800',
      };
    }

    return {
      icon: '↓',
      message,
      color: colorScheme === 'dark' ? '#fff' : '#666',
    };
  };

  const { icon, message: currentMessage, color } = getIndicatorState();

  // Calcular altura basada en el pull distance
  const containerHeight = Math.min((pullDistance / maxPullDistance) * 100, 80);

  if (pullDistance === 0 && !isRefreshing) {
    return null;
  }

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityValue,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: color },
            isRefreshing && {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <Text style={styles.icon}>{icon}</Text>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={[styles.message, { color }]}>{currentMessage}</Text>

          {!isRefreshing && (
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (pullDistance / refreshThreshold) * 100,
                      100
                    )}%`,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
          )}
        </View>
      </Animated.View>

      {/* Indicador de progreso circular */}
      {isRefreshing && (
        <View style={styles.circularProgress}>
          <Animated.View
            style={[
              styles.circularProgressInner,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: isDark ? '#000' : '#fff',
      paddingBottom: 10,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    icon: {
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold',
    },
    textContainer: {
      flex: 1,
    },
    message: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 4,
    },
    progressBar: {
      height: 3,
      backgroundColor: isDark ? '#333' : '#e0e0e0',
      borderRadius: 1.5,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 1.5,
    },
    circularProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -15,
      marginLeft: -15,
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 3,
      borderColor: isDark ? '#333' : '#e0e0e0',
      borderTopColor: '#FF6B35',
    },
    circularProgressInner: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
    },
  });
};
