# Environment Configuration

Este directorio contiene la configuración de ambiente para la aplicación gymmetry-front.

## Archivos de Configuración

### Archivos .env
- **`.env.example`** - Template con variables de ejemplo (incluido en git)
- **`.env.local`** - Configuración para desarrollo local (ignorado por git)
- **`.env.development`** - Configuración para ambiente de desarrollo (ignorado por git)
- **`.env.production`** - Configuración para ambiente de producción (ignorado por git)

### Archivo de Configuración TypeScript
- **`index.ts`** - Lee las variables de entorno y las expone como configuración tipada

## Cómo Funciona

1. **Scripts de NPM**: Los scripts como `npm run start:local` establecen la variable `NODE_ENV`
2. **env-loader.js**: Lee `NODE_ENV` y copia el archivo `.env` correspondiente a la raíz del proyecto
3. **Metro Config**: Ejecuta automáticamente `env-loader.js` cuando inicia Metro Bundler
4. **Expo**: Carga automáticamente las variables del archivo `.env` en la raíz

## Scripts Disponibles

```bash
# Desarrollo Local
npm run start:local      # Usa .env.local
npm run android:local    # Android con .env.local
npm run ios:local        # iOS con .env.local
npm run web:local        # Web con .env.local

# Desarrollo
npm run start:dev        # Usa .env.development
npm run android:dev      # Android con .env.development
npm run ios:dev          # iOS con .env.development
npm run web:dev          # Web con .env.development

# Producción
npm run start:prod       # Usa .env.production
npm run android:prod     # Android con .env.production
npm run ios:prod         # iOS con .env.production
npm run web:prod         # Web con .env.production
```

## Configuración Inicial

1. Copia `.env.example` a `.env.local`, `.env.development`, y `.env.production`
2. Llena las variables con los valores correctos para cada ambiente
3. Usa los scripts de npm correspondientes

## Variables de Entorno

### API Configuration
- `API_BASE_URL` - URL base de la API principal
- `CATALOGS_API_BASE_URL` - URL base de la API de catálogos
- `API_FUNCTIONS_KEY` - Clave para Azure Functions de catálogos
- `API_MAIN_FUNCTIONS_KEY` - Clave para Azure Functions principales

### Environment
- `ENVIRONMENT` - Nombre del ambiente (local, development, production)
- `DEBUG` - Habilita logs de debug (true/false)

## Seguridad

- ⚠️ **NUNCA** incluyas claves reales en `.env.example`
- ✅ Los archivos `.env.*` están en `.gitignore` excepto `.env.example`
- ✅ El archivo `.env` temporal también está en `.gitignore`
