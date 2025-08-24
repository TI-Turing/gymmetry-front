# ScreenWrapper Component

## Descripción

El `ScreenWrapper` es un componente centralizado que maneja el `SafeAreaView` y `MobileHeader` de manera consistente en toda la aplicación, evitando duplicación de código.

## Uso Básico

### Con Header (Configuración por defecto)

```tsx
import ScreenWrapper from '@/components/layout/ScreenWrapper';

function MyScreen() {
  return <ScreenWrapper>{/* Tu contenido aquí */}</ScreenWrapper>;
}
```

### Con Header Personalizado

```tsx
function MyScreen() {
  const menuOptions = [
    {
      key: 'home',
      icon: 'home',
      label: 'Inicio',
      action: () => router.push('/'),
    },
    // ... más opciones
  ];

  return (
    <ScreenWrapper
      headerTitle="Mi Pantalla"
      headerSubtitle="Subtítulo opcional"
      showBackButton={true}
      onPressBack={() => router.back()}
      menuOptions={menuOptions}
    >
      {/* Tu contenido aquí */}
    </ScreenWrapper>
  );
}
```

### Sin Header (Para pantallas como Login/Register)

```tsx
function LoginScreen() {
  return (
    <ScreenWrapper showHeader={false}>
      {/* Contenido de login sin header */}
    </ScreenWrapper>
  );
}
```

### Sin SafeArea (Para casos especiales)

```tsx
function SpecialScreen() {
  return (
    <ScreenWrapper useSafeArea={false} showHeader={false}>
      {/* Contenido que maneja su propio safe area */}
    </ScreenWrapper>
  );
}
```

## Props

### Header Props

- `showHeader?: boolean` - Si mostrar el header (default: `true`)
- `headerTitle?: string` - Título del header (default: `'GYMMETRY'`)
- `headerSubtitle?: string` - Subtítulo opcional
- `showBackButton?: boolean` - Si mostrar botón de atrás (default: `false`)
- `onPressBack?: () => void` - Callback del botón de atrás
- `headerRightComponent?: React.ReactNode` - Componente personalizado a la derecha
- `hideMenuButton?: boolean` - Ocultar botón de menú (default: `false`)
- `menuOptions?: MenuOption[]` - Opciones de menú personalizadas

### SafeArea Props

- `useSafeArea?: boolean` - Si usar SafeAreaView (default: `true`)
- `backgroundColor?: string` - Color de fondo (default: `'#121212'`)

## Casos de Uso

### 1. Pantalla Principal (Home)

```tsx
<ScreenWrapper>
  <ScrollView>{/* contenido */}</ScrollView>
</ScreenWrapper>
```

### 2. Pantalla con Navegación (Rutinas)

```tsx
<ScreenWrapper
  headerTitle="Rutinas"
  headerSubtitle="Descubre nuevas rutinas"
  showBackButton={true}
  onPressBack={() => router.back()}
  menuOptions={customMenuOptions}
>
  <ScrollView>{/* contenido */}</ScrollView>
</ScreenWrapper>
```

### 3. Pantalla de Autenticación

```tsx
<ScreenWrapper showHeader={false}>
  <AuthForm />
</ScreenWrapper>
```

### 4. Modal o Pantalla Especial

```tsx
<ScreenWrapper useSafeArea={false} showHeader={false}>
  <CustomModal />
</ScreenWrapper>
```

## Beneficios

1. **Consistencia**: Todas las pantallas tienen el mismo manejo de safe area y header
2. **DRY**: No más duplicación de código SafeAreaView y MobileHeader
3. **Flexibilidad**: Fácil personalización para casos especiales
4. **Mantenimiento**: Cambios centralizados en un solo lugar
5. **Performance**: Mejor gestión de recursos

## Migración

Para migrar pantallas existentes:

### Antes

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import MobileHeader from '@/components/layout/MobileHeader';

function MyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      {Platform.OS !== 'web' && (
        <MobileHeader title="Mi Título" showBackButton={true} />
      )}
      {/* contenido */}
    </SafeAreaView>
  );
}
```

### Después

```tsx
import ScreenWrapper from '@/components/layout/ScreenWrapper';

function MyScreen() {
  return (
    <ScreenWrapper headerTitle="Mi Título" showBackButton={true}>
      {/* contenido */}
    </ScreenWrapper>
  );
}
```
