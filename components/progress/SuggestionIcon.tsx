import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SuggestionIconProps {
  title?: string;
}

const iconMap: Record<string, string> = {
  agua: 'cup-water',
  hidrat: 'cup-water',
  sueño: 'sleep',
  dormir: 'sleep',
  descanso: 'bed',
  fuerza: 'arm-flex',
  cardio: 'run',
  comida: 'food-apple',
  dieta: 'food-apple',
  motiv: 'star',
  default: 'lightbulb-on',
};

const SuggestionIcon: React.FC<SuggestionIconProps> = ({ title }) => {
  if (!title)
    return (
      <MaterialCommunityIcons name="lightbulb-on" size={28} color="#FF9800" />
    );
  const key = Object.keys(iconMap).find((k) => title.toLowerCase().includes(k));
  const icon = key ? iconMap[key] : iconMap.default;
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <MaterialCommunityIcons name={icon as any} size={28} color="#FF9800" />
    </>
  );
};

export default SuggestionIcon;
