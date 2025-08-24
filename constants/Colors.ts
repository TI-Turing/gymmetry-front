const tintColorLight = '#ff6300';
const tintColorDark = '#ff6300';

// Paletas base para modo claro y oscuro
// Mantener llaves existentes para compatibilidad.
export default {
  light: {
    text: '#111111',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#8A8A8A',
    tabIconSelected: tintColorLight,
    // Extended tokens
    textMuted: '#6B7280',
    border: '#E5E7EB',
    card: '#FFFFFF',
    danger: '#FF6B6B',
    success: '#4CAF50',
    warning: '#FF9800',
    onTint: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.6)',
    neutral: '#E5E7EB',
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
    // Extended tokens
    textMuted: '#B0B0B0',
    border: '#333333',
    card: '#1D1D1D',
    danger: '#FF6B6B',
    success: '#4CAF50',
    warning: '#FF9800',
    onTint: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.8)',
    neutral: '#333333',
  },
  // Valores planos por defecto (modo claro) para usos no tematizados
  text: '#111111',
  tint: tintColorLight,
  background: '#FFFFFF',
};
