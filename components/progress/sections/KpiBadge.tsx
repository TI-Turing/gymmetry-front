import React from 'react';
import { View, Text } from 'react-native';

export interface KpiBadgeProps {
  label: string;
  value: string;
  color: string;
}

const KpiBadge: React.FC<KpiBadgeProps> = ({ label, value, color }) => {
  return (
    <View style={{ marginRight: 12, marginBottom: 12 }}>
      <View
        style={{
          backgroundColor: color,
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{label}</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export default KpiBadge;
