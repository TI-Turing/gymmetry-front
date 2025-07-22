# 📱 Gymmetry Frontend - Aplicación React Native

Una aplicación móvil moderna construida con React Native y Expo, diseñada para gestión de usuarios y fitness con arquitectura robusta y tecnologías de vanguardia.

## 🚀 Formas de Ejecutar la Aplicación

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo local
npm run start:local

# Ejecutar en modo desarrollo
npm run start:dev

# Ejecutar en modo producción
npm run start:prod

# Limpiar caché y ejecutar
npm run start:clear
```

### Comandos de Metro Bundle
```bash
# Iniciar Metro con configuración específica
npx expo start

# Construir para Android
npx expo run:android

# Construir para iOS
npx expo run:ios
```

## ⚙️ Configuración del Entorno

### Variables de Entorno

El proyecto utiliza archivos de configuración específicos por entorno ubicados en la carpeta `environment/`:

- **`.env.local`** - Desarrollo local
- **`.env.development`** - Entorno de desarrollo  
- **`.env.production`** - Entorno de producción

#### Variables Requeridas:
```env
# Configuración de API Principal
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.16:7160/api
EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY=your-main-api-key

# Configuración de API de Catálogos (Azure Functions)
EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://your-catalogs-api.azurewebsites.net/api
EXPO_PUBLIC_API_FUNCTIONS_KEY=your-azure-functions-key

# Configuración General
EXPO_PUBLIC_ENV=local
EXPO_PUBLIC_DEBUG=true
EXPO_PUBLIC_ENVIRONMENT=local
```

### Configuración de Scripts NPM

El proyecto incluye scripts automatizados que configuran el entorno apropiado:

```json
{
  "start:local": "cross-env NODE_ENV=local node env-loader.js && expo start",
  "start:dev": "cross-env NODE_ENV=development node env-loader.js && expo start",
  "start:prod": "cross-env NODE_ENV=production node env-loader.js && expo start"
}
```

## 🔧 Tecnologías y Librerías

### Core Framework
- **React Native** - Framework móvil multiplataforma
- **Expo** - Plataforma y herramientas de desarrollo
- **TypeScript** - Tipado estático para JavaScript

### Navegación y Routing
- **Expo Router** - Navegación basada en archivos
- **React Navigation** - Navegación nativa

### Gestión de Estado y Datos
- **React Context API** - Gestión de estado global
- **Custom Hooks** - Lógica reutilizable

### HTTP y APIs
- **Axios** - Cliente HTTP con interceptores
- **Azure Functions** - API de catálogos serverless
- **REST API** - API principal personalizada

### Interfaz de Usuario
- **React Native Elements** - Componentes UI
- **Expo Vector Icons** - Iconografía
- **Custom Components** - Componentes personalizados

### Manejo de Imágenes
- **Expo Image Picker** - Selección de imágenes
- **Expo Image Manipulator** - Redimensionamiento y optimización

### Utilidades de Desarrollo
- **cross-env** - Variables de entorno multiplataforma
- **Metro** - Bundler de React Native

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
gymmetry-front/
├── app/                          # Rutas y pantallas principales
│   ├── (tabs)/                   # Navegación por tabs
│   ├── login.tsx                 # Pantalla de login
│   ├── register.tsx              # Pantalla de registro
│   └── _layout.tsx               # Layout principal
├── components/                   # Componentes reutilizables
│   ├── auth/                     # Componentes de autenticación
│   │   ├── Step1.tsx - Step5.tsx # Pasos del registro
│   │   ├── hooks/                # Hooks personalizados
│   │   ├── data/                 # Datos estáticos
│   │   └── utils/                # Utilidades de auth
│   └── home/                     # Componentes del home
├── services/                     # Servicios de API
│   ├── apiService.ts             # Servicio principal de API
│   ├── catalogService.ts         # Servicio de catálogos
│   └── apiExamples.ts            # Ejemplos de uso
├── environment/                  # Configuración de entornos
│   ├── .env.local
│   ├── .env.development
│   ├── .env.production
│   └── index.ts                  # Configuración centralizada
├── dto/                          # Data Transfer Objects
│   ├── auth/                     # DTOs de autenticación
│   ├── user/                     # DTOs de usuario
│   └── common/                   # DTOs comunes
├── types/                        # Definiciones de tipos
├── constants/                    # Constantes globales
└── assets/                       # Recursos estáticos
```

### Patrón de Arquitectura

**Arquitectura en Capas:**
- **Presentación** - Componentes React Native
- **Lógica de Negocio** - Custom Hooks y Context
- **Servicios** - Capa de API y servicios externos
- **Datos** - DTOs y tipado TypeScript

## 🔌 Conexiones y APIs

### API Principal
- **URL Base**: Configurable por entorno
- **Autenticación**: Bearer Token (cuando esté implementado)
- **Timeout**: 10 segundos
- **Headers**: Content-Type, Accept, User-Agent personalizados

### API de Catálogos (Azure Functions)
- **Endpoint**: Azure Functions App
- **Autenticación**: x-functions-key header
- **Funcionalidades**:
  - Consulta de géneros
  - Consulta de países y regiones
  - Consulta de ciudades
  - Consulta de EPS
  - Consulta de tipos de documento

### Debugging de APIs
El proyecto incluye generación automática de comandos cURL (compatible con Windows) para todas las peticiones HTTP, facilitando el debugging manual.

## 📱 Funcionalidades Principales

### Sistema de Autenticación
- **Registro Multi-paso** (5 pasos):
  1. Credenciales básicas (email/password)
  2. Información personal y género
  3. Ubicación geográfica
  4. Información médica y fitness
  5. Foto de perfil

- **Login** - Autenticación de usuarios existentes

### Gestión de Catálogos
- Carga dinámica de catálogos desde Azure Functions
- Ordenamiento alfabético automático
- Manejo de dependencias (países → regiones → ciudades)
- Caché y optimización de consultas

### Manejo de Imágenes
- Selección desde galería
- Captura con cámara
- Redimensionamiento automático a 2MP
- Optimización y compresión

### Validaciones
- Validación de email en tiempo real
- Validación de contraseñas seguras
- Validación de formularios por pasos
- Manejo de errores centralizado

## 🛠️ Cosas a Tener en Cuenta

### Desarrollo
1. **Variables de Entorno**: Asegúrate de que las variables `EXPO_PUBLIC_*` estén configuradas correctamente
2. **Network**: Verifica que la IP del backend (192.168.0.16:7160) sea accesible desde tu dispositivo
3. **Azure Functions Key**: La clave de Azure Functions debe estar activa y tener permisos
4. **TypeScript**: El proyecto usa strict mode, mantén los tipos actualizados

### Deployment
1. **Environment Files**: Los archivos `.env.*` están en `.gitignore` por seguridad
2. **API Keys**: Nunca commits claves de API en el repositorio
3. **Build**: Usa `expo build` para generar builds de producción
4. **Testing**: Prueba en múltiples dispositivos y plataformas

### Performance
1. **Imágenes**: Las imágenes se redimensionan automáticamente a 2MP
2. **API Calls**: Se implementa timeout de 10 segundos
3. **Lazy Loading**: Los catálogos se cargan bajo demanda
4. **Error Boundaries**: Manejo robusto de errores

### Seguridad
1. **HTTPS**: Usa HTTPS en producción
2. **API Keys**: Mantén las claves seguras y rotalas regularmente
3. **Input Validation**: Todas las entradas se validan en cliente y servidor
4. **Headers**: Se incluyen headers de seguridad apropiados

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run start:local     # Entorno local con hot reload
npm run start:dev       # Entorno de desarrollo
npm run start:prod      # Entorno de producción
npm run start:clear     # Limpiar caché y ejecutar

# Utilidades
npm run reset-project   # Reiniciar proyecto completamente
npm run ios            # Ejecutar en iOS
npm run android        # Ejecutar en Android
npm run web            # Ejecutar en web
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

---

⚡ **Desarrollado con React Native + Expo para máximo rendimiento y experiencia de usuario**
