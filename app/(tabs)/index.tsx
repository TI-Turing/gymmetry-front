import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Svg, { Polygon } from 'react-native-svg';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  /* CÓDIGO ORIGINAL COMENTADO - Con triángulos animados y fondo diagonal
  // Obtener dimensiones de la pantalla
  const { width, height } = Dimensions.get('window');

  // Animaciones independientes para cada triángulo
  const triangle1X = useRef(new Animated.Value(0)).current;
  const triangle1Y = useRef(new Animated.Value(0)).current;
  const triangle2X = useRef(new Animated.Value(0)).current;
  const triangle2Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación para triángulo 1 (gris)
    Animated.loop(
      Animated.sequence([
        Animated.timing(triangle1X, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(triangle1X, {
          toValue: -1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(triangle1X, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(triangle1Y, {
          toValue: -1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(triangle1Y, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(triangle1Y, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación para triángulo 2 (naranja) - diferente timing
    Animated.loop(
      Animated.sequence([
        Animated.timing(triangle2X, {
          toValue: -1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(triangle2X, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(triangle2X, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(triangle2Y, {
          toValue: 1,
          duration: 4500,
          useNativeDriver: true,
        }),
        Animated.timing(triangle2Y, {
          toValue: -1,
          duration: 4500,
          useNativeDriver: true,
        }),
        Animated.timing(triangle2Y, {
          toValue: 0,
          duration: 4500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const triangle1TranslateX = triangle1X.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-7, 0, 7],
  });

  const triangle1TranslateY = triangle1Y.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-7, 0, 7],
  });

  const triangle2TranslateX = triangle2X.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-7, 0, 7],
  });

  const triangle2TranslateY = triangle2Y.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-7, 0, 7],
  });
  */

  const handleLogin = () => {
    router.push('/login' as any);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[colorScheme].tint }]}
    >
      {/* VERSIÓN SIMPLIFICADA - Solo fondo naranja, texto y botón */}

      {/* Texto GYMMETRY */}
      <Text style={[styles.gymmetryText]}>GYMMETRY</Text>

      {/* Botón Ingresar */}
      <TouchableOpacity
        style={[
          styles.loginButton,
          { backgroundColor: Colors[colorScheme].background },
        ]}
        onPress={handleLogin}
      >
        <Text
          style={[styles.loginButtonText, { color: Colors[colorScheme].text }]}
        >
          Ingresar
        </Text>
      </TouchableOpacity>

      {/* JSX ORIGINAL COMENTADO - Con fondo diagonal y triángulos animados
      <Svg 
        height={height} 
        width={width}
        style={styles.svgContainer}
      >
        <Polygon
          points={`${width},0 ${width},${height} 0,${height}`}
          fill="#545454"
        />
      </Svg>

      <Animated.View 
        style={[
          styles.svgContainer,
          { transform: [{ translateX: triangle1TranslateX }, { translateY: triangle1TranslateY }] }
        ]}
      >
        <Svg 
          height={height} 
          width={width}
        >
          <Polygon
            points="120,20 30,150 210,150"
            fill="#545454"
            transform={`translate(${width * -0.01 + 1}, ${height * 0.08})`}
          />
        </Svg>
      </Animated.View>

      <Animated.View 
        style={[
          styles.svgContainer,
          { transform: [{ translateX: triangle2TranslateX }, { translateY: triangle2TranslateY }] }
        ]}
      >
        <Svg 
          height={height} 
          width={width}
        >
          <Polygon
            points="120,150 30,20 210,20"
            fill={Colors[colorScheme].tint}
            transform={`translate(${width * 0.42}, ${height * 0.65})`}
          />
        </Svg>
      </Animated.View>

      <Text style={[styles.gymmetryText]}>
        GYMMETRY
      </Text>

      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: Colors[colorScheme].background }]}
        onPress={handleLogin}
      >
        <Text style={[styles.loginButtonText, { color: Colors[colorScheme].text }]}>
          Ingresar
        </Text>
      </TouchableOpacity>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  /* ESTILOS COMENTADOS - Para triángulos y SVG
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  */
  gymmetryText: {
    fontSize: 64,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 0,
    zIndex: 1,
    textAlign: 'center',
    fontFamily: 'System',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {
      width: 2,
      height: 3,
    },
    textShadowRadius: 4,
    elevation: 5,
  },
  loginButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
    position: 'absolute',
    bottom: 80,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
