# Migración CustomAlert

## Cambios Realizados

### 1. **Movido CustomAlert de auth a common**

- **Antes**: `components/auth/CustomAlert.tsx`
- **Después**: `components/common/CustomAlert.tsx`
- **Motivo**: Es un componente para toda la app, no solo para auth

### 2. **Actualizado GymStep1 para usar CustomAlert**

- Reemplazado `Alert.alert()` nativo con `useCustomAlert()`
- Mejor experiencia de usuario con alertas customizadas
- Consistencia visual en toda la app

### 3. **Referencias actualizadas**

- ✅ `components/gym/GymScreen.tsx`
- ✅ `components/gym/NoGymView.tsx`
- ✅ `components/gym/steps/GymStep1.tsx`
- ✅ `app/(tabs)/index.tsx`
- ✅ `components/common/index.ts` - Exporta CustomAlert

### 4. **Archivos de auth**

- Los archivos en `components/auth/` siguen usando import relativo `'./CustomAlert'`
- Se mantiene compatibilidad mientras gradualmente se migra

### 5. **Próximos pasos**

- [ ] Actualizar otros pasos de gym (GymStep2-5) para usar CustomAlert
- [ ] Migrar archivos de auth para usar `@/components/common/CustomAlert`
- [ ] Eliminar `components/auth/CustomAlert.tsx` cuando todos migren

## Uso recomendado

```typescript
import { useCustomAlert } from '@/components/common/CustomAlert';

// En el componente
const { showError, showSuccess, AlertComponent } = useCustomAlert();

// Para mostrar errores
showError('Mensaje de error');

// Para mostrar éxito
showSuccess('Operación exitosa');

// Agregar componente al JSX
return (
  <>
    {/* Tu contenido aquí */}
    <AlertComponent />
  </>
);
```
