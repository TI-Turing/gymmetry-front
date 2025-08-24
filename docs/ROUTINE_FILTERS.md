# Sistema de Filtros de Rutinas - Tiempo Real

## Descripción

Sistema completo de filtros para rutinas que aplica cambios en **tiempo real** sin necesidad de botones "Aplicar". Los filtros se actualizan instantáneamente mientras el usuario los selecciona.

## Componentes

### 1. RoutineFilters.tsx

Modal con interfaz de usuario para configurar filtros:

- **Filtros Booleanos**: Requiere Equipos, Calistenia
- **Filtros de Objetivos**: 25+ objetivos con niveles (bajo, medio, alto)
- **Tiempo Real**: Los filtros se aplican automáticamente
- **Contador de Resultados**: Muestra total de rutinas encontradas

### 2. filterUtils.ts

Funciones utilitarias para aplicar filtros:

- `applyRoutineFilters()`: Aplica filtros a array de rutinas
- `getObjectiveLevel()`: Convierte valores numéricos a niveles
- `parseTagsObjectives()`: Parsea JSON de objetivos de manera segura
- `getActiveFiltersCount()`: Cuenta filtros activos
- `createEmptyFilters()`: Crea estado de filtros vacío

### 3. Integración en RoutineTemplatesScreen

- Estado de filtros con `useState`
- Rutinas filtradas con `useMemo` para optimización
- Botón de filtros en header con badge de conteo
- Modal de filtros con aplicación en tiempo real

## Tipos de Filtros

### Filtros Booleanos

```typescript
{
  requiereEquipos: boolean | null; // null = no filtrar
  calistenia: boolean | null; // true/false = filtrar por valor
}
```

### Filtros de Objetivos

```typescript
{
  objectives: {
    [key: string]: 'bajo' | 'medio' | 'alto' | null;
  }
}
```

**Niveles de Objetivos:**

- **Bajo**: 0.0 - 0.3
- **Medio**: 0.4 - 0.7
- **Alto**: 0.8 - 1.0

## Objetivos Disponibles

### Físicos

- `perdida_peso`: Pérdida de Peso
- `masa_muscular`: Masa Muscular
- `definicion_muscular`: Definición Muscular
- `fuerza`: Fuerza
- `resistencia_fisica`: Resistencia Física
- `tonificacion`: Tonificación

### Movilidad y Postura

- `movilidad`: Movilidad
- `postura`: Postura
- `rehabilitacion`: Rehabilitación

### Salud y Bienestar

- `salud_cardiovascular`: Salud Cardiovascular
- `anti_estres`: Anti Estrés
- `energia`: Energía
- `sueño`: Sueño
- `autoestima`: Autoestima

### Poblaciones Específicas

- `adulto_mayor`: Adulto Mayor
- `enfermedades_cronicas`: Enfermedades Crónicas

### Tipos de Entrenamiento

- `entrenamiento_funcional`: Entrenamiento Funcional
- `deportes_especificos`: Deportes Específicos
- `pruebas_fisicas`: Pruebas Físicas
- `hiit`: HIIT
- `velocidad_agilidad`: Velocidad y Agilidad
- `entrenamiento_pareja`: Entrenamiento en Pareja

### Niveles de Experiencia

- `principiante`: Principiante
- `intermedio`: Intermedio
- `avanzado`: Avanzado

### Duración

- `rutina_corta`: Rutina Corta
- `rutina_larga`: Rutina Larga

## Flujo de Funcionamiento - Tiempo Real

### 1. Carga Inicial

```typescript
// Estado inicial sin filtros
const [filters, setFilters] = useState(createEmptyFilters());
```

### 2. Filtrado en Tiempo Real

```typescript
// useMemo optimiza re-cálculos
const filteredTemplates = useMemo(() => {
  return applyRoutineFilters(templates, filters);
}, [templates, filters]);

// Los filtros se aplican automáticamente en el modal
React.useEffect(() => {
  onFiltersChange(filters); // Callback inmediato
}, [filters, onFiltersChange]);
```

### 3. Sincronización de Estado

```typescript
// Modal sincroniza con estado externo al abrirse
React.useEffect(() => {
  if (visible) {
    setFilters(currentFilters);
  }
}, [visible, currentFilters]);
```

## Optimización de Performance

### 1. useMemo para Filtrado

- Evita re-cálculos innecesarios
- Solo se ejecuta cuando cambian `templates` o `filters`

### 2. Filtrado en Memoria

- Para ~50 rutinas es eficiente
- Se ejecuta en el cliente sin consultas al backend

### 3. useCallback para Funciones

- Evita re-renders de componentes hijos
- Optimiza performance del modal

## Interfaz de Usuario - Tiempo Real

### Botón de Filtros

- Icono de filtro en header
- Badge con número de filtros activos
- Accesible con `accessibilityLabel`

### Modal de Filtros

- Presentación tipo "pageSheet"
- **Aplicación en tiempo real**: Sin botón "Aplicar"
- **Contador de resultados**: Muestra rutinas encontradas
- Scroll vertical para muchas opciones
- Controles: Limpiar, Cerrar

### Feedback Visual en Tiempo Real

- Colores distintivos por nivel (verde/naranja/rojo)
- Estados activos/inactivos claramente diferenciados
- **Contador dinámico**: "X de Y rutinas" en header
- **Total en modal**: "X rutinas encontradas" en footer

### UX Mejorada

- ✅ **Sin esperas**: Cambios instantáneos
- ✅ **Feedback inmediato**: Ve resultados al seleccionar
- ✅ **Contadores múltiples**: Header y modal sincronizados
- ✅ **Estado persistente**: Mantiene filtros al cerrar/abrir modal

## Escalabilidad Futura

### Backend Filtering

Si el número de rutinas crece significativamente:

```typescript
// Implementar filtros en el backend
const fetchFilteredRoutines = async (filters: FilterState) => {
  const response = await routineService.getRoutinesWithFilters(filters);
  return response.data;
};
```

### Filtros Adicionales

Fácil agregar nuevos tipos:

```typescript
// Nuevos filtros de duración, dificultad, etc.
interface ExtendedFilterState extends FilterState {
  duration: 'short' | 'medium' | 'long' | null;
  difficulty: 1 | 2 | 3 | 4 | 5 | null;
}
```

## Ejemplo de Uso

```typescript
// Filtrar rutinas de alta intensidad sin equipos
const filters: FilterState = {
  requiereEquipos: false,
  calistenia: true,
  objectives: {
    hiit: 'alto',
    fuerza: 'medio',
    resistencia_fisica: 'alto',
  },
};

const filtered = applyRoutineFilters(allRoutines, filters);
// Retorna solo rutinas que cumplan TODOS los criterios
```
