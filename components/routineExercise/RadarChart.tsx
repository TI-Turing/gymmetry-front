import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import Colors from '@/constants/Colors';

interface Props {
  objectives: Record<string, number>;
  size?: number;
}

function getRadarPoints(size: number, values: number[]): { x: number; y: number }[] {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = values.length;
  return Array.from({ length: n }).map((_, i) => {
    const angle = ((2 * Math.PI) / n) * i - Math.PI / 2;
    const value = values[i] ?? 0;
    const scaledR = r * Math.max(0, Math.min(1, value));
    return {
      x: cx + scaledR * Math.cos(angle),
      y: cy + scaledR * Math.sin(angle),
    };
  });
}

export default function RadarChart({ objectives, size = 320 }: Props) {
  const keys = Object.keys(objectives);
  const values = keys.map(k => objectives[k] ?? 0);
  const points = getRadarPoints(size, values);
  const basePoints = getRadarPoints(size, Array(keys.length).fill(1));
  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
  const baseStr = basePoints.map(p => `${p.x},${p.y}`).join(' ');
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={{ alignItems: 'center', marginVertical: 24 }}>
      <Svg width={size} height={size}>
        {/* Ejes */}
        {basePoints.map((p, i) => (
          <Line
            key={`axis${i}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#bbb"
            strokeWidth={1}
          />
        ))}
        {/* Polígono base */}
        <Polygon points={baseStr} fill="#fff2" stroke={Colors.tint} strokeWidth={2} />
        {/* Polígono de valores */}
        <Polygon points={pointsStr} fill={Colors.tint} fillOpacity={0.7} stroke={Colors.tint} strokeWidth={3} />
        {/* Puntos y labels */}
        {basePoints.map((p, i) => (
          <>
            <Circle key={`c${i}`} cx={p.x} cy={p.y} r={7} fill={Colors.tint} />
            <SvgText
              key={`t${i}`}
              x={p.x}
              y={p.y - 18}
              fontSize={15}
              fontWeight="bold"
              fill={Colors.tint}
              textAnchor="middle"
            >
              {keys[i]}
            </SvgText>
          </>
        ))}
      </Svg>
      <Text style={{ marginTop: 8, fontWeight: 'bold', color: Colors.tint }}>
        Objetivos del ejercicio (Radar)
      </Text>
    </View>
  );
}
