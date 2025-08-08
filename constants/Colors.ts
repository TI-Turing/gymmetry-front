const tintColorLight = '#ff6300';
const tintColorDark = '#ff6300';

// Export por defecto manteniendo esquemas light/dark, y agregando accesos planos
// para compatibilidad con componentes que referencian Colors.text / Colors.tint.
export default {
  light: {
    text: '#fff',
    background: '#121212',
    tint: tintColorLight,
    tabIconDefault: '#666',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
  },
  // Valores planos por defecto (modo claro) para usos no tematizados
  text: '#fff',
  tint: tintColorLight,
};
