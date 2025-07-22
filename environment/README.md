# Environment Configuration

Este proyecto ahora usa archivos `.env` para la configuración del entorno en lugar de archivos TypeScript.

## Configuración

### 1. Copiar el archivo de ejemplo
```bash
cp .env.example .env.local
```

### 2. Configurar las variables
Edita el archivo `.env.local` (o `.env.development`, `.env.production` según sea necesario) y rellena las variables con tus valores reales.

### 3. Variables de entorno disponibles

- `API_BASE_URL`: URL base de la API principal
- `CATALOGS_API_BASE_URL`: URL base de la API de catálogos  
- `ENVIRONMENT`: Entorno actual (local, development, production)
- `DEBUG`: Habilitar modo debug (true/false)
- `API_FUNCTIONS_KEY`: Clave para Azure Functions (catálogos)
- `API_MAIN_FUNCTIONS_KEY`: Clave para la API principal

## Archivos

- `.env.example`: Template con valores de ejemplo
- `.env.local`: Configuración para desarrollo local
- `.env.development`: Configuración para desarrollo
- `.env.production`: Configuración para producción

**Nota:** Los archivos `.env.*` están en `.gitignore` para proteger las claves secretas.

## Uso

El archivo `index.ts` lee automáticamente las variables de entorno y exporta la configuración:

```typescript
import { Environment } from './environment';

console.log(Environment.API_BASE_URL);
```
