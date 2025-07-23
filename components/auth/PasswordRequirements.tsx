import React, { memo } from 'react';
import { Text } from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { commonStyles } from './styles/common';

interface PasswordRequirementsProps {
  validation: {
    length: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
    notEqualToEmail: boolean;
    validChars: boolean;
  };
}

const requirements = [
  { key: 'length', text: 'Entre 8 y 50 caracteres' },
  { key: 'hasLetter', text: 'Al menos una letra' },
  { key: 'hasNumber', text: 'Al menos un número' },
  { key: 'notEqualToEmail', text: 'No puede ser igual al email' },
  { key: 'validChars', text: 'Solo caracteres del alfabeto inglés (sin espacios)' },
] as const;

export const PasswordRequirements = memo<PasswordRequirementsProps>(({ validation }) => {
  const colorScheme = useColorScheme();

  return (
    <>
      {requirements.map(({ key, text }) => (
        <Text
          key={key}
          style={[
            commonStyles.requirement,
            { 
              color: validation[key] 
                ? Colors[colorScheme ?? 'light'].tint 
                : '#666' 
            }
          ]}
        >
          • {text}
        </Text>
      ))}
    </>
  );
});

PasswordRequirements.displayName = 'PasswordRequirements';
