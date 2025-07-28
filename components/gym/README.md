# Módulo Gym

Este módulo contiene todos los componentes relacionados con la funcionalidad del gimnasio en la aplicación Gymmetry.

## Componentes

### `GymScreen`

Componente principal que maneja el estado de conexión al gimnasio y renderiza la vista apropiada. Ahora también maneja el estado del formulario de registro de gimnasios.

### `NoGymView`

Pantalla que se muestra cuando el usuario no está conectado a ningún gimnasio. Incluye opciones para:

- Escanear código QR
- Buscar gimnasios cercanos
- **NUEVO**: Registrar un gimnasio

### `GymConnectedView`

Pantalla que se muestra cuando el usuario está conectado a un gimnasio. Muestra:

- Información del gimnasio
- Estado de ocupación en tiempo real
- Gráfico de ocupación del día
- Información de contacto y servicios

### `GymRegistrationForm` ✨ NUEVO

Formulario completo para el registro de nuevos gimnasios. Incluye:

#### Información Básica (Campos requeridos)

- **Nombre del Gimnasio** - Nombre comercial del gimnasio
- **NIT** - Número de identificación tributaria
- **Email** - Correo electrónico de contacto
- **Teléfono** - Número de contacto
- **País** - País donde se ubica el gimnasio
- **Slogan** - Frase promocional (opcional)

#### Presencia Digital

- **Sitio Web** - URL del sitio web oficial
- **Instagram** - Handle de Instagram
- **Facebook** - Página de Facebook

#### Campos API (pendientes de implementación)

- `countryId` - GUID del país seleccionado
- `gymPlanSelectedId` - GUID del plan seleccionado
- `gymTypeId` - GUID del tipo de gimnasio

### Componentes Reutilizables

#### `QRScannerOption`

Botón con icono para iniciar el escáner de códigos QR.

#### `SearchGymsOption`

Botón con icono para buscar gimnasios cercanos.

#### `RegisterGymOption` ✨ NUEVO

Botón con icono para acceder al formulario de registro de gimnasios.

#### `OccupancyChart`

Componente de gráfico que muestra la ocupación del gimnasio por horas del día.

## Tipos de Datos

### `GymRegistrationData`

```typescript
interface GymRegistrationData {
  // Campos requeridos por la API
  name: string;
  nit: string;
  email: string;
  countryId: string; // Guid como string
  gymPlanSelectedId: string; // Guid como string
  gymTypeId: string; // Guid como string

  // Campos adicionales del formulario
  instagram: string;
  facebook: string;
  website: string;
  slogan: string;
  phone: string;
  country: string;
}
```

## Uso

```tsx
import { GymScreen } from '@/components/gym';

// El componente ya está configurado con withWebLayout
export default GymScreen;
```

## Estructura de Archivos

```
components/gym/
├── index.ts                 # Exportaciones del módulo
├── types.ts                 # Interfaces y tipos
├── GymScreen.tsx           # Componente principal
├── NoGymView.tsx           # Vista sin gimnasio conectado
├── GymConnectedView.tsx    # Vista con gimnasio conectado
├── GymRegistrationForm.tsx # Formulario de registro ✨ NUEVO
├── QRScannerOption.tsx     # Opción de escáner QR
├── SearchGymsOption.tsx    # Opción de búsqueda
├── RegisterGymOption.tsx   # Opción de registro ✨ NUEVO
├── OccupancyChart.tsx      # Gráfico de ocupación
└── README.md               # Esta documentación
```

## Navegación y Estados

El módulo maneja tres estados principales:

1. **Sin gimnasio conectado** (`NoGymView`)
   - Muestra opciones para conectarse o registrar
   - Incluye el nuevo botón de registro

2. **Formulario de registro** (`GymRegistrationForm`)
   - Formulario completo con validación
   - Campos organizados en secciones
   - Botones de envío y cancelación

3. **Gimnasio conectado** (`GymConnectedView`)
   - Dashboard con información del gimnasio
   - Gráficos de ocupación
   - Información de contacto

## Validaciones

El formulario incluye las siguientes validaciones:

- Campos requeridos: nombre, NIT, email, teléfono, país
- Formato de email válido
- Interfaz de usuario intuitiva con mensajes de error

## Funcionalidades Futuras

- Implementación real del escáner QR
- Integración con API de búsqueda de gimnasios
- **API de registro de gimnasios** con los campos definidos
- Datos en tiempo real de ocupación
- Notificaciones de estado del gimnasio
- Reserva de equipos o clases
- Selección de país desde catálogo
- Selección de plan y tipo de gimnasio
