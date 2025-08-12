import React from 'react';
import { View, Animated, Easing } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants/Theme';
import { styles } from './styles';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#333333',
          opacity,
        },
        style,
      ]}
    />
  );
};

interface RoutineTemplateSkeletonProps {
  count?: number;
}

export const RoutineTemplateSkeleton: React.FC<RoutineTemplateSkeletonProps> = ({ 
  count = 3 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          {/* Título de la rutina */}
          <Skeleton width="85%" height={18} borderRadius={4} style={{ marginBottom: SPACING.xs }} />
          
          {/* Comentarios (simulando 1-3 líneas de texto, a veces sin comentarios) */}
          {index % 3 !== 0 && (
            <View style={{ marginBottom: SPACING.sm }}>
              <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: SPACING.xs / 2 }} />
              {index % 2 === 0 && (
                <>
                  <Skeleton width="80%" height={14} borderRadius={4} style={{ marginBottom: SPACING.xs / 2 }} />
                  <Skeleton width="60%" height={14} borderRadius={4} />
                </>
              )}
            </View>
          )}

          {/* Botón de configurar */}
          <View style={{ marginTop: SPACING.sm }}>
            <Skeleton width={100} height={36} borderRadius={8} />
          </View>
        </View>
      ))}
    </>
  );
};
