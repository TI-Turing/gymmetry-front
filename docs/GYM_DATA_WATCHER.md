# Sistema de Observación Global de Datos del Gimnasio

## Descripción

Este sistema proporciona una funcionalidad global que escucha automáticamente los cambios en los datos del gimnasio almacenados en AsyncStorage y consulta automáticamente la información actualizada del gimnasio cuando estos cambian.

## Componentes del Sistema

### 1. AsyncStorageObserver (`services/asyncStorageObserver.ts`)

Un observador genérico que puede escuchar cambios en cualquier clave de AsyncStorage mediante polling.

**Características:**

- ✅ Observa cambios en tiempo real mediante polling (cada 1 segundo)
- ✅ Soporte para múltiples listeners por clave
- ✅ Auto-cleanup cuando no hay listeners activos
- ✅ Manejo de errores robusto
- ✅ API simple para agregar/remover listeners

**Uso básico:**

```typescript
import { asyncStorageObserver } from '@/services/asyncStorageObserver';

// Agregar listener
const removeListener = asyncStorageObserver.addListener(
  '@my_key',
  (newValue, oldValue, key) => {
    console.log(`${key} cambió de ${oldValue} a ${newValue}`);
  }
);

// Remover listener
removeListener();
```

### 2. GymDataWatcher (`services/gymDataWatcher.ts`)

Un servicio especializado que usa AsyncStorageObserver para observar específicamente cambios en `@gym_data` y automáticamente consultar información actualizada del gimnasio.

**Características:**

- ✅ Auto-inicialización global
- ✅ Detección inteligente de cambios (solo consulta cuando el gymId realmente cambia)
- ✅ Integración con authService para caching automático
- ✅ Emisión de eventos personalizados para notificar cambios
- ✅ Manejo silencioso de errores

**Funcionalidad automática:**

```typescript
// Se auto-inicializa al importar el módulo
import '@/services/gymDataWatcher';

// O usando la exportación directa
import { gymDataWatcher } from '@/services/gymDataWatcher';
```

### 3. Hook useAsyncStorageObserver (`hooks/useAsyncStorageObserver.ts`)

Hooks de React que facilitan el uso del sistema de observación en componentes.

**Hooks disponibles:**

- `useAsyncStorageObserver(key, initialValue)`: Hook genérico para cualquier clave
- `useGymDataObserver()`: Hook específico para datos del gimnasio

**Ejemplo de uso:**

```typescript
import { useGymDataObserver } from '@/hooks/useAsyncStorageObserver';

function MyComponent() {
  const { gymData, hasGymData, error } = useGymDataObserver();

  if (error) return <div>Error: {error}</div>;
  if (!hasGymData) return <div>No gym data</div>;

  return <div>Gym: {gymData.gym?.Name}</div>;
}
```

## Flujo de Funcionamiento

### Cuando se crea un gimnasio:

1. **Usuario completa el registro** → `GymRegistrationSteps`
2. **Se llama a `authService.refreshUserData()`** → Actualiza userData con el nuevo gymId
3. **Se llama a `GymService.fetchAndCacheGymData()`** → Consulta y cachea datos del gym
4. **Los datos se guardan en AsyncStorage** → `@gym_data` se actualiza
5. **GymDataWatcher detecta el cambio** → Automáticamente consulta datos actualizados
6. **Se emite evento `gymDataUpdated`** → Otros componentes pueden reaccionar
7. **Componentes con `useGymDataObserver` se actualizan** → UI se actualiza automáticamente

### Detección de cambios inteligente:

```typescript
// Solo consulta cuando el gymId realmente cambia
if (oldGymId !== newGymId) {
  await this.refetchGymData(gymId);
}
```

## Integración en la Aplicación

### 1. Auto-inicialización

El sistema se auto-inicializa al importar en `app/_layout.tsx`:

```typescript
import '@/services/gymDataWatcher';
```

### 2. En componentes que necesiten datos del gym:

```typescript
import { useGymDataObserver } from '@/hooks/useAsyncStorageObserver';

function GymComponent() {
  const { gymData, hasGymData } = useGymDataObserver();

  // El componente se actualiza automáticamente cuando cambian los datos
  return hasGymData ? <GymInfo gym={gymData.gym} /> : <NoGym />;
}
```

### 3. Para escuchar eventos de actualización:

```typescript
useEffect(() => {
  const handleGymUpdate = (event: CustomEvent) => {
    console.log('Gym actualizado:', event.detail.gymId);
  };

  window.addEventListener('gymDataUpdated', handleGymUpdate);
  return () => window.removeEventListener('gymDataUpdated', handleGymUpdate);
}, []);
```

## Beneficios

✅ **Reactivo**: Los componentes se actualizan automáticamente cuando cambian los datos
✅ **Global**: Funciona en toda la aplicación sin configuración adicional
✅ **Eficiente**: Solo consulta cuando realmente cambian los datos importantes
✅ **Robusto**: Manejo silencioso de errores para no interrumpir la aplicación
✅ **Desacoplado**: Los componentes no necesitan saber cuándo o cómo se actualizan los datos
✅ **Consistente**: Garantiza que todos los componentes tengan los datos más actualizados

## Casos de Uso Cubiertos

- ✅ Usuario crea un gimnasio → Todos los componentes se actualizan automáticamente
- ✅ Usuario se asigna a un gimnasio existente → Datos se cargan y propagan automáticamente
- ✅ Datos del gym cambian en el backend → Se detectan y actualizan al consultar
- ✅ Múltiples componentes necesitan datos del gym → Todos se mantienen sincronizados
- ✅ Usuario navega entre pantallas → Los datos persisten y se mantienen actualizados

## Configuración

El sistema funciona con configuración mínima. Solo necesitas importar el watcher:

```typescript
// En tu archivo principal (_layout.tsx o App.tsx)
import '@/services/gymDataWatcher';
```

¡Y eso es todo! El sistema funcionará automáticamente en toda tu aplicación.
