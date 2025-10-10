# Estado Global del Plan del Usuario

## 📊 Situación Actual

Actualmente **NO existe un estado global centralizado** para el plan del usuario. Cada componente que necesita información del plan hace su propia llamada al servicio:

```tsx
// Patrón actual (repetido en múltiples componentes):
await planService.findPlansByFields({
  fields: { UserId: userId, IsActive: true }
});
```

### Componentes afectados:
- `components/plan/PlanView.tsx` - Estado local
- `app/plans.tsx` - Estado local
- Cualquier otro componente que necesite saber el plan del usuario

---

## ✅ Solución Implementada

### 1. **DTO actualizado** (`AppStateOverviewResponse.ts`)

Se agregaron campos adicionales a `PlanInfoDto`:

```typescript
export interface PlanInfoDto {
  PlanId: string;
  PlanTypeId: string;        // ✨ NUEVO
  PlanTypeName: string;
  StartDate: string;
  EndDate: string;
  IsActive: boolean;
  IsFallbackFreePlan: boolean;  // ✨ NUEVO - Indica si es el plan gratis por defecto
  Price: number;             // ✨ NUEVO
  ProgressPercentage: number;
  DaysRemaining: number;
}
```

### 2. **Hook personalizado** (`AppStateContext.tsx`)

Se creó un hook específico para acceder al plan:

```typescript
export const usePlanState = () => {
  const { appStateData } = useAppState();
  return appStateData?.Home?.PlanInfo || null;
};
```

---

## 🚀 Cómo Usar

### **Opción 1: Hook específico (Recomendado)**

```tsx
import { usePlanState } from '@/contexts/AppStateContext';

const MyComponent = () => {
  const planInfo = usePlanState();
  
  // Verificar si tiene plan activo
  const hasActivePlan = planInfo?.IsActive && !planInfo?.IsFallbackFreePlan;
  
  // Verificar si es plan gratuito
  const isFreePlan = planInfo?.IsFallbackFreePlan || planInfo?.Price === 0;
  
  // Verificar si es plan premium
  const isPremium = planInfo?.Price && planInfo.Price > 0;
  
  return (
    <View>
      {hasActivePlan ? (
        <Text>Plan activo: {planInfo.PlanTypeName}</Text>
      ) : (
        <Text>Sin plan activo o usando plan gratis</Text>
      )}
    </View>
  );
};
```

### **Opción 2: Desde AppStateContext completo**

```tsx
import { useAppState } from '@/contexts/AppStateContext';

const MyComponent = () => {
  const { appStateData } = useAppState();
  const planInfo = appStateData?.Home?.PlanInfo;
  
  // Mismo uso que arriba
};
```

---

## 📋 Casos de Uso Comunes

### **1. Mostrar mensaje según tipo de plan**

```tsx
const DisciplineSection = () => {
  const planInfo = usePlanState();
  
  if (planInfo?.IsFallbackFreePlan) {
    return (
      <View>
        <Text>Mejora a un plan premium para ver estadísticas detalladas</Text>
        <Button title="Ver Planes" onPress={() => router.push('/plans')} />
      </View>
    );
  }
  
  return <DetailedDisciplineStats />;
};
```

### **2. Restringir funcionalidades por plan**

```tsx
const AdvancedFeature = () => {
  const planInfo = usePlanState();
  const isPremium = planInfo?.Price && planInfo.Price >= 15000;
  
  if (!isPremium) {
    return (
      <LockedFeatureCard 
        title="Función Premium"
        requiredPlan="Premium"
      />
    );
  }
  
  return <AdvancedFeatureContent />;
};
```

### **3. Badge del plan actual**

```tsx
const UserProfileHeader = () => {
  const planInfo = usePlanState();
  
  const getPlanBadge = () => {
    if (!planInfo) return { text: 'Sin Plan', color: '#999' };
    if (planInfo.IsFallbackFreePlan) return { text: 'Gratis', color: '#666' };
    if (planInfo.Price === 0) return { text: 'Gratuito', color: '#4CAF50' };
    if (planInfo.Price >= 15000) return { text: 'Premium', color: '#FFD700' };
    return { text: 'Básico', color: '#2196F3' };
  };
  
  const badge = getPlanBadge();
  
  return (
    <View>
      <Text style={{ color: badge.color }}>{badge.text}</Text>
    </View>
  );
};
```

---

## ⚠️ Importante: Sincronización con Backend

### **Prompt para Backend (.NET 9)**

```markdown
# Agregar información del plan al endpoint app-state/overview

## Contexto
El frontend necesita información del plan activo del usuario en el endpoint agregador `app-state/overview` para evitar múltiples llamadas al servicio de planes.

## Modificaciones Requeridas

### 1. Actualizar `PlanInfoDto` en Application Layer:

```csharp
public class PlanInfoDto
{
    public string PlanId { get; set; }
    public string PlanTypeId { get; set; }        // NUEVO
    public string PlanTypeName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    public bool IsFallbackFreePlan { get; set; }  // NUEVO
    public decimal Price { get; set; }            // NUEVO
    public double ProgressPercentage { get; set; }
    public int DaysRemaining { get; set; }
}
```

### 2. Lógica en `AppStateService` (Application Layer):

- Buscar plan activo del usuario con `PlanRepository.FindByFields({ UserId, IsActive: true })`
- Si no existe plan activo, crear `PlanInfoDto` con:
  - `IsFallbackFreePlan = true`
  - `PlanTypeId = "4aa8380c-8479-4334-8236-3909be9c842b"` (plan gratis)
  - `PlanTypeName = "Gratis"`
  - `Price = 0`
  - `StartDate = DateTime.Now`
  - `EndDate = DateTime.Now.AddYears(100)` (sin expiración)
  - `DaysRemaining = int.MaxValue`
  - `ProgressPercentage = 0`
- Si existe plan activo:
  - Cargar `PlanType` relacionado para obtener `Price`
  - `IsFallbackFreePlan = false`
  - Calcular `DaysRemaining` y `ProgressPercentage` como ya lo haces

### 3. Incluir en `HomeStateDto`:

El `PlanInfo` ya está incluido en `HomeStateDto`, solo asegúrate de popularlo con la nueva lógica.
```

---

## 🔄 Próximos Pasos

1. **Backend:** Implementar cambios en endpoint `app-state/overview`
2. **Frontend:** Una vez el backend esté listo:
   - Reemplazar estado local en `PlanView.tsx` con `usePlanState()`
   - Reemplazar estado local en `app/plans.tsx` con `usePlanState()`
   - Usar el hook en componentes que necesiten validar el plan

---

## 📌 Constantes Útiles

```typescript
// En constants/Plans.ts (crear si no existe)
export const PLAN_TYPE_IDS = {
  FREE: '4aa8380c-8479-4334-8236-3909be9c842b',
  BASIC: 'plan-basico-001',
  PREMIUM: 'plan-premium-001',
  FAMILY: 'plan-familiar-001',
} as const;

export const PLAN_PRICES = {
  FREE: 0,
  BASIC: 5000,
  PREMIUM: 15000,
  FAMILY: 25000,
} as const;

// Helper functions
export const isPremiumPlan = (planInfo: PlanInfoDto | null): boolean => {
  return planInfo?.Price !== undefined && planInfo.Price >= PLAN_PRICES.PREMIUM;
};

export const isFreePlan = (planInfo: PlanInfoDto | null): boolean => {
  return planInfo?.IsFallbackFreePlan || planInfo?.Price === 0;
};

export const hasActivePlan = (planInfo: PlanInfoDto | null): boolean => {
  return planInfo?.IsActive && !planInfo?.IsFallbackFreePlan;
};
```

---

## 🎯 Beneficios

✅ **Una sola fuente de verdad** para el plan del usuario  
✅ **Menos llamadas al backend** (se obtiene en el bootstrap de `appStateService`)  
✅ **Código más limpio** sin repetición de lógica  
✅ **Mejor UX** con información siempre actualizada  
✅ **Fácil de testear** con estado centralizado
