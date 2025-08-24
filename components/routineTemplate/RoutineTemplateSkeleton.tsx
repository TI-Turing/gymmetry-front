import React from 'react';
import {
  View,
  Animated,
  Easing,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SPACING } from '@/constants/Theme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeRoutineTemplateStyles } from './styles.themed';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const styles = useThemedStyles(makeRoutineTemplateStyles);
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
          width: width as ViewStyle['width'],
          height,
          borderRadius,
          backgroundColor: styles.colors.skeleton,
          opacity,
        } as ViewStyle,
        style,
      ]}
    />
  );
};

interface RoutineTemplateSkeletonProps {
  count?: number;
}

export const RoutineTemplateSkeleton: React.FC<
  RoutineTemplateSkeletonProps
> = ({ count = 3 }) => {
  const styles = useThemedStyles(makeRoutineTemplateStyles);
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          {/* Título de la rutina */}
          <Skeleton
            width="85%"
            height={18}
            borderRadius={4}
            style={{ marginBottom: SPACING.xs }}
          />

          {/* Comentarios (simulando 1-3 líneas de texto, a veces sin comentarios) */}
          {index % 3 !== 0 && (
            <View style={{ marginBottom: SPACING.sm }}>
              <Skeleton
                width="100%"
                height={14}
                borderRadius={4}
                style={{ marginBottom: SPACING.xs / 2 }}
              />
              {index % 2 === 0 && (
                <>
                  <Skeleton
                    width="80%"
                    height={14}
                    borderRadius={4}
                    style={{ marginBottom: SPACING.xs / 2 }}
                  />
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
