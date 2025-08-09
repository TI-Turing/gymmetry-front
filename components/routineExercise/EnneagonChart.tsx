import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Polygon, Circle, Text as SvgText } from 'react-native-svg';
import Colors from '@/constants/Colors';

interface Props {
  objectives: Record<string, number>;
  size?: number;
}

// Utilidad para calcular los puntos del eneágono
function getEnneagonPoints(size: number, values: number[]): { x: number; y: number }[] {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;
  const n = 9;
  return Array.from({ length: n }).map((_, i) => {
    const angle = ((2 * Math.PI) / n) * i - Math.PI / 2;
    // El valor escala el radio
    const value = values[i] ?? 0;
    const scaledR = r * (0.2 + 0.8 * Math.max(0, Math.min(1, value)));
    return {
      x: cx + scaledR * Math.cos(angle),
      y: cy + scaledR * Math.sin(angle),
    };
  });
}

export default function EnneagonChart({ objectives, size = 320 }: Props) {
  const keys = Object.keys(objectives);
  // Si hay menos de 9, rellenar con vacío
  const paddedKeys = [...keys, ...Array(9 - keys.length).fill('')].slice(0, 9);
  const values = paddedKeys.map(k => (k ? objectives[k] ?? 0 : 0));
  const points = getEnneagonPoints(size, values);
  const basePoints = getEnneagonPoints(size, Array(9).fill(1));
  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
  const baseStr = basePoints.map(p => `${p.x},${p.y}`).join(' ');
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={{ alignItems: 'center', marginVertical: 24 }}>
      <Svg width={size} height={size}>
        {/* Base eneágono */}
        <Polygon points={baseStr} fill="#fff2" stroke={Colors.tint} strokeWidth={2} />
        {/* Relleno según valores */}
        <Polygon points={pointsStr} fill={Colors.tint} fillOpacity={0.7} stroke={Colors.tint} strokeWidth={3} />
        {/* Puntos y labels */}
        {basePoints.map((p, i) => (
          <>
            <Circle key={`c${i}`} cx={p.x} cy={p.y} r={8} fill={Colors.tint} />
            {paddedKeys[i] && (
              <SvgText
                key={`t${i}`}
                x={p.x}
                y={p.y - 16}
                fontSize={16}
                fontWeight="bold"
                fill={Colors.tint}
                textAnchor="middle"
              >
                {paddedKeys[i]}
              </SvgText>
            )}
          </>
        ))}
      </Svg>
      <Text style={{ marginTop: 8, fontWeight: 'bold', color: Colors.tint }}>
        Objetivos del ejercicio
      </Text>
    </View>
  );
}
