# 🔄 Plan de Adaptación Frontend - Migración Azure → AWS
**Proyecto:** Gymmetry Frontend (React Native + Expo)  
**Fecha:** 11 de octubre de 2025  
**Versión:** 1.0

---

## 📋 Resumen Ejecutivo

Este documento detalla los **cambios mínimos necesarios** en el frontend de Gymmetry para garantizar compatibilidad completa con la nueva infraestructura AWS, que reemplazará los servicios Azure actuales.

### Objetivo
Migración **sin impacto visual ni de flujo** para los usuarios finales, manteniendo todas las funcionalidades existentes.

### Alcance de la Migración

| Servicio Azure | Servicio AWS Equivalente | Estado |
|---------------|--------------------------|---------|
| Azure Functions (API Principal) | AWS Lambda + API Gateway | 🔄 Requiere cambio de URL |
| Azure Functions (Catálogos) | AWS Lambda + API Gateway | 🔄 Requiere cambio de URL |
| Azure Blob Storage | Amazon S3 | 🔄 Cambio de URLs + presigned URLs |
| Azure SendGrid/Twilio (Email/SMS) | Amazon SES + SNS | ✅ Backend maneja (sin cambios frontend) |
| Azure App Insights (Logging) | CloudWatch | ✅ Transparente para frontend |
| Azure SignalR (Real-time) | - | ✅ No implementado (stubs) |

**Resumen de Impacto:**
- ✅ **0 cambios en UI/UX**
- ✅ **0 cambios en lógica de negocio**
- 🔄 **3 cambios de configuración** (URLs de API y storage)
- 🔄 **1 ajuste en upload de media** (presigned URLs)
- 🔄 **1 validación CORS** (API Gateway)

---

## 🗺️ Mapeo de Endpoints: Azure → AWS

### 1. API Principal (Backend Core)

#### **Actual (Azure):**
```
https://fn-p-app-gymmetry-ebfbamfnarcae9ew.eastus2-01.azurewebsites.net/api
```

#### **Nuevo (AWS API Gateway):**
```
https://api.gymmetry.app/v1
```
*O alternativamente:*
```
https://[api-gateway-id].execute-api.us-east-1.amazonaws.com/prod
```

**Endpoints afectados:**
- `/auth/login` → Login de usuarios
- `/auth/refresh-token` → Refresh JWT
- `/feed` → CRUD de publicaciones
- `/feed/create-with-media` → Upload con multimedia
- `/user` → Gestión de usuarios
- `/plan` → Planes de entrenamiento
- `/gym` → Gestión de gimnasios
- `/daily` → Rutinas diarias
- `/advertisement` → Anuncios propios

---

### 2. API de Catálogos (Datos Estáticos)

#### **Actual (Azure):**
```
https://fn-p-commonapi-cabbh3dfc3fxg7cu.eastus2-01.azurewebsites.net/api
```

#### **Nuevo (AWS API Gateway - Catálogos):**
```
https://api-catalogs.gymmetry.app/v1
```
*O alternativamente:*
```
https://[catalog-api-id].execute-api.us-east-1.amazonaws.com/prod
```

**Endpoints afectados:**
- `/exercise` → Catálogo de ejercicios
- `/equipment` → Equipamiento de gimnasio
- `/muscle` → Grupos musculares
- `/category` → Categorías de ejercicios
- `/brand` → Marcas de equipamiento

---

### 3. Storage de Media (Imágenes y Videos)

#### **Actual (Azure Blob Storage):**
```
https://[storage-account].blob.core.windows.net/media/[file]
```

#### **Nuevo (Amazon S3 con CloudFront):**

**Opción A: S3 Direct URLs (temporal)**
```
https://gymmetry-media.s3.amazonaws.com/media/[file]
```

**Opción B: CloudFront CDN (recomendado para producción)**
```
https://cdn.gymmetry.app/media/[file]
```

**Cambio crítico:** S3 Presigned URLs para uploads
```typescript
// Antes (Azure Blob SAS token):
POST /feed/upload-media
Body: FormData con archivo

// Después (S3 Presigned URL):
1. GET /media/upload-url → Retorna { presignedUrl, key }
2. PUT [presignedUrl] con archivo directo
3. POST /feed/create con { mediaKey } en lugar de archivo
```

---

## 🔧 Cambios Requeridos en el Código

### 1. Variables de Entorno

#### **Archivos a actualizar:**

**`environment/.env.local`**
```bash
# Antes (Azure)
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.16:7160/api
EXPO_PUBLIC_CATALOGS_API_BASE_URL=http://192.168.0.16:7071/api
EXPO_PUBLIC_API_FUNCTIONS_KEY=local-functions-key
EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY=local-main-functions-key

# Después (AWS - desarrollo local con tunneling)
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.16:3000/v1
EXPO_PUBLIC_CATALOGS_API_BASE_URL=http://192.168.0.16:3001/v1
# AWS API Gateway no usa function keys (usa API Keys en headers si necesario)
EXPO_PUBLIC_AWS_API_KEY=local-api-key
```

**`environment/.env.development`**
```bash
# Antes (Azure)
EXPO_PUBLIC_API_BASE_URL=https://fn-d-app-gymmetry.eastus2-01.azurewebsites.net/api
EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://fn-d-commonapi.eastus2-01.azurewebsites.net/api

# Después (AWS)
EXPO_PUBLIC_API_BASE_URL=https://dev-api.gymmetry.app/v1
EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://dev-api-catalogs.gymmetry.app/v1
EXPO_PUBLIC_AWS_API_KEY=dev-api-key-xxxxx
EXPO_PUBLIC_CDN_BASE_URL=https://dev-cdn.gymmetry.app
```

**`environment/.env.production`**
```bash
# Antes (Azure)
EXPO_PUBLIC_API_BASE_URL=https://fn-p-app-gymmetry-ebfbamfnarcae9ew.eastus2-01.azurewebsites.net/api
EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://fn-p-commonapi-cabbh3dfc3fxg7cu.eastus2-01.azurewebsites.net/api
EXPO_PUBLIC_API_FUNCTIONS_KEY=PLACEHOLDER_CATALOGS_KEY
EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY=PLACEHOLDER_API_KEY

# Después (AWS)
EXPO_PUBLIC_API_BASE_URL=https://api.gymmetry.app/v1
EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://api-catalogs.gymmetry.app/v1
EXPO_PUBLIC_AWS_API_KEY=prod-api-key-xxxxx
EXPO_PUBLIC_CDN_BASE_URL=https://cdn.gymmetry.app
EXPO_PUBLIC_S3_BUCKET=gymmetry-media
EXPO_PUBLIC_S3_REGION=us-east-1
```

**`eas.json`** (Build de producción)
```json
{
  "build": {
    "production": {
      "env": {
        "NODE_ENV": "production",
        "EXPO_PUBLIC_API_BASE_URL": "https://api.gymmetry.app/v1",
        "EXPO_PUBLIC_CATALOGS_API_BASE_URL": "https://api-catalogs.gymmetry.app/v1",
        "EXPO_PUBLIC_AWS_API_KEY": "prod-api-key-xxxxx",
        "EXPO_PUBLIC_CDN_BASE_URL": "https://cdn.gymmetry.app",
        "EXPO_PUBLIC_ENVIRONMENT": "production"
      }
    }
  }
}
```

---

### 2. Actualización de `environment/index.ts`

**Archivo:** `environment/index.ts`

**Cambios:**
```typescript
const createConfig = () => {
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    'http://localhost:3000/v1'; // ⬅️ Cambio de puerto y path

  const catalogsApiBaseUrl =
    process.env.EXPO_PUBLIC_CATALOGS_API_BASE_URL ||
    process.env.CATALOGS_API_BASE_URL ||
    'http://localhost:3001/v1'; // ⬅️ Nuevo endpoint catálogos

  const environment =
    process.env.EXPO_PUBLIC_ENVIRONMENT || process.env.ENVIRONMENT || 'local';

  const debug = (process.env.EXPO_PUBLIC_DEBUG || process.env.DEBUG) === 'true';

  // ❌ Eliminar (Azure-specific)
  // const apiFunctionsKey =
  //   process.env.EXPO_PUBLIC_API_FUNCTIONS_KEY ||
  //   process.env.API_FUNCTIONS_KEY ||
  //   '';
  // const apiMainFunctionsKey =
  //   process.env.EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY ||
  //   process.env.API_MAIN_FUNCTIONS_KEY ||
  //   '';

  // ✅ Agregar (AWS-specific)
  const awsApiKey =
    process.env.EXPO_PUBLIC_AWS_API_KEY ||
    process.env.AWS_API_KEY ||
    '';

  const cdnBaseUrl =
    process.env.EXPO_PUBLIC_CDN_BASE_URL ||
    process.env.CDN_BASE_URL ||
    'https://cdn.gymmetry.app';

  const s3Bucket =
    process.env.EXPO_PUBLIC_S3_BUCKET ||
    process.env.S3_BUCKET ||
    'gymmetry-media';

  const s3Region =
    process.env.EXPO_PUBLIC_S3_REGION ||
    process.env.S3_REGION ||
    'us-east-1';

  const payCardInApp =
    (process.env.EXPO_PUBLIC_PAY_CARD_INAPP || 'true') === 'true';

  const mpPublicKey = process.env.EXPO_PUBLIC_MP_PUBLIC_KEY || '';

  return {
    API_BASE_URL: apiBaseUrl,
    CATALOGS_API_BASE_URL: catalogsApiBaseUrl,
    ENVIRONMENT: environment,
    DEBUG: debug,
    // ❌ API_FUNCTIONS_KEY: apiFunctionsKey,
    // ❌ API_MAIN_FUNCTIONS_KEY: apiMainFunctionsKey,
    // ✅ AWS_API_KEY: awsApiKey,
    AWS_API_KEY: awsApiKey,
    CDN_BASE_URL: cdnBaseUrl,
    S3_BUCKET: s3Bucket,
    S3_REGION: s3Region,
    PAY_CARD_INAPP: payCardInApp,
    MP_PUBLIC_KEY: mpPublicKey,
  };
};

// Create and export the configuration
const config = createConfig();

export const Environment = config;

// Tipo para las configuraciones
export interface Config {
  API_BASE_URL: string;
  CATALOGS_API_BASE_URL: string;
  ENVIRONMENT: string;
  DEBUG: boolean;
  // ❌ API_FUNCTIONS_KEY: string;
  // ❌ API_MAIN_FUNCTIONS_KEY: string;
  AWS_API_KEY: string; // ✅
  CDN_BASE_URL: string; // ✅
  S3_BUCKET: string; // ✅
  S3_REGION: string; // ✅
  PAY_CARD_INAPP: boolean;
  MP_PUBLIC_KEY: string;
}
```

---

### 3. Actualización de `services/apiService.ts`

**Archivo:** `services/apiService.ts`

**Cambios en el constructor:**

```typescript
constructor() {
  this.axiosInstance = axios.create({
    baseURL: Environment.API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'User-Agent': 'ExpoApp/1.0.0',
      // ❌ Azure Functions (API principal)
      // ❌ 'x-functions-key': Environment.API_MAIN_FUNCTIONS_KEY,
      // ✅ AWS API Gateway API Key (si se requiere autenticación de API)
      'x-api-key': Environment.AWS_API_KEY, // ⬅️ Cambio de header
    },
  });

  this.axiosInstance.interceptors.request.use(
    async (config) => {
      if (config.headers) {
        // ... código existente ...

        // ❌ Asegurar la clave de funciones para el API principal
        // if (!config.headers['x-functions-key']) {
        //   config.headers['x-functions-key'] =
        //     Environment.API_MAIN_FUNCTIONS_KEY;
        // }

        // ✅ Asegurar AWS API Key (solo si el endpoint lo requiere)
        if (Environment.AWS_API_KEY && !config.headers['x-api-key']) {
          config.headers['x-api-key'] = Environment.AWS_API_KEY;
        }

        // ... resto del código ...
      }
      // ... resto del código ...
    }
  );
}
```

**Cambios en el método `buildUrlWithFunctionKey`:**

```typescript
// ❌ Eliminar completamente (Azure-specific)
// Helper: agregar el parámetro code con la Azure Functions key al endpoint
// private buildUrlWithFunctionKey(url: string, functionKey?: string): string {
//   const key = functionKey || Environment.API_FUNCTIONS_KEY;
//   if (!key) return url;
//   const separator = url.includes('?') ? '&' : '?';
//   return `${url}${separator}code=${key}`;
// }

// ✅ AWS API Gateway no requiere query params para autenticación
// La autenticación se maneja por headers (x-api-key) o JWT (Authorization)
```

**Eliminar referencias a `buildUrlWithFunctionKey` en los métodos:**
```typescript
// Buscar y reemplazar todas las llamadas como:
// const finalUrl = this.buildUrlWithFunctionKey(endpoint, functionKey);
// Por:
// const finalUrl = endpoint;
```

---

### 4. Actualización de Upload de Media con S3 Presigned URLs

**Archivo:** `services/feedService.ts`

**Nuevo método para obtener presigned URL:**

```typescript
export const feedService = {
  // ... métodos existentes ...

  /**
   * ✅ NUEVO: Obtiene una presigned URL de S3 para upload directo
   * @param fileName Nombre del archivo
   * @param contentType MIME type (ej: image/jpeg, video/mp4)
   * @returns { presignedUrl, key, expiresIn }
   */
  async getUploadPresignedUrl(
    fileName: string,
    contentType: string
  ): Promise<ApiResponse<{
    presignedUrl: string;
    key: string;
    expiresIn: number;
  }>> {
    return apiService.post<{
      presignedUrl: string;
      key: string;
      expiresIn: number;
    }>(`/media/upload-url`, {
      fileName,
      contentType,
    });
  },

  /**
   * ✅ ACTUALIZADO: Crea un feed con referencias a archivos ya subidos a S3
   * @param request Incluye mediaKeys (S3 keys) en lugar de FormData
   */
  async createFeedWithMediaKeys(request: {
    userId: string;
    description: string;
    mediaKeys: string[]; // ⬅️ S3 keys de archivos ya subidos
    isAnonymous: boolean;
  }): Promise<ApiResponse<unknown>> {
    return apiService.post<unknown>(`/feed/create`, request);
  },

  /**
   * ⚠️ DEPRECADO: Mantener por compatibilidad temporal
   * Este método será removido cuando el backend elimine el endpoint
   */
  async createFeedWithMedia(formData: FormData): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/feed/create-with-media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  },

  // ... resto de métodos ...
};
```

---

**Archivo:** `services/mediaUploadService.ts` (NUEVO)

```typescript
import axios from 'axios';
import { feedService } from './feedService';
import { Environment } from '@/environment';

export interface UploadToS3Result {
  key: string;
  url: string;
}

export class MediaUploadService {
  /**
   * Sube un archivo directamente a S3 usando presigned URL
   * @param file Archivo a subir (File o Blob)
   * @param fileName Nombre del archivo
   * @param contentType MIME type
   * @param onProgress Callback de progreso (0-100)
   */
  async uploadToS3(
    file: File | Blob,
    fileName: string,
    contentType: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadToS3Result> {
    // 1. Obtener presigned URL del backend
    const urlResponse = await feedService.getUploadPresignedUrl(
      fileName,
      contentType
    );

    if (!urlResponse.Success || !urlResponse.Data) {
      throw new Error(urlResponse.Message || 'Failed to get upload URL');
    }

    const { presignedUrl, key } = urlResponse.Data;

    // 2. Subir archivo directamente a S3 con PUT
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      // PUT directo a S3 (no usar FormData, enviar raw file)
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(file);
    });

    // 3. Construir URL final del archivo (CDN o S3 directo)
    const fileUrl = `${Environment.CDN_BASE_URL}/${key}`;

    return { key, url: fileUrl };
  }

  /**
   * Sube múltiples archivos en paralelo
   */
  async uploadMultiple(
    files: Array<{ file: File | Blob; fileName: string; contentType: string }>,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<UploadToS3Result[]> {
    const uploads = files.map((item, index) =>
      this.uploadToS3(
        item.file,
        item.fileName,
        item.contentType,
        onProgress ? (progress) => onProgress(index, progress) : undefined
      )
    );

    return Promise.all(uploads);
  }
}

export const mediaUploadService = new MediaUploadService();
```

---

**Archivo:** `components/post/CreatePostScreenSimple.tsx`

**Actualizar método `handlePublish`:**

```typescript
const handlePublish = async () => {
  if (!isValidPost) return;

  setIsLoading(true);
  try {
    const userData = await authService.getUserData();
    if (!userData?.id) {
      showCustomAlert('error', 'Error', 'No se pudo obtener la información del usuario');
      return;
    }

    let response;

    // Si NO hay archivos multimedia
    if (selectedMedia.length === 0) {
      const requestData = {
        UserId: userData.id,
        Title: null,
        Description: content.trim(),
        Media: null,
        MediaType: null,
        FileName: null,
        Id: '',
        FeedId: '',
        ContentType: null,
        Hashtag: null,
        IsAnonymous: false,
      };
      response = await feedService.createFeed(requestData);
    } else {
      // ✅ NUEVO FLUJO: Upload a S3 con presigned URLs

      // 1. Validar archivos
      const mediaForValidation = selectedMedia.map((media) => ({
        type: media.type === 'video' ? ('video' as const) : ('image' as const),
        mimeType: media.mimeType,
        fileSize: media.fileSize,
        fileName: media.fileName || undefined,
        uri: media.uri,
      }));

      const validation = await validateMultipleMediaFiles(mediaForValidation);
      if (!validation.isValid) {
        showCustomAlert('error', 'Archivos no válidos', validation.errors.join('\n'));
        return;
      }

      // 2. Comprimir y preparar archivos
      const processedFiles: Array<{
        file: Blob;
        fileName: string;
        contentType: string;
      }> = [];

      for (let i = 0; i < selectedMedia.length; i++) {
        const media = selectedMedia[i];

        if (media.type === 'image') {
          try {
            // Comprimir imagen a 500KB
            const compressedImage = await compressImageToMaxSize(
              media.uri,
              MAX_IMAGE_SIZE_BYTES
            );

            // Convertir URI a Blob
            const response = await fetch(compressedImage.uri);
            const blob = await response.blob();

            processedFiles.push({
              file: blob,
              fileName: media.fileName || `image_${i}.jpg`,
              contentType: media.mimeType || 'image/jpeg',
            });
          } catch (error) {
            showCustomAlert(
              'error',
              'Error de archivo',
              `No se pudo procesar la imagen ${media.fileName}`
            );
            return;
          }
        } else {
          // Videos sin compresión
          try {
            const response = await fetch(media.uri);
            const blob = await response.blob();

            processedFiles.push({
              file: blob,
              fileName: media.fileName || `video_${i}.mp4`,
              contentType: media.mimeType || 'video/mp4',
            });
          } catch (error) {
            showCustomAlert(
              'error',
              'Error de archivo',
              `No se pudo procesar el video ${media.fileName}`
            );
            return;
          }
        }
      }

      // 3. Subir archivos a S3 con presigned URLs
      const uploadResults = await mediaUploadService.uploadMultiple(
        processedFiles,
        (fileIndex, progress) => {
          console.log(`[Upload] Archivo ${fileIndex + 1}: ${progress}%`);
          // TODO: Mostrar progress UI
        }
      );

      // 4. Crear feed con S3 keys
      const mediaKeys = uploadResults.map((result) => result.key);

      response = await feedService.createFeedWithMediaKeys({
        userId: userData.id,
        description: content.trim(),
        mediaKeys,
        isAnonymous: false,
      });
    }

    if (response?.Success) {
      if (onPostCreated) {
        onPostCreated();
      }
      showCustomAlert('success', '¡Publicado!', 'Tu publicación se ha creado exitosamente');
      onClose?.();
    } else {
      showCustomAlert(
        'error',
        'Error al publicar',
        response?.Message || 'No se pudo crear la publicación'
      );
    }
  } catch (error) {
    console.error('[CreatePost] Error:', error);
    showCustomAlert(
      'error',
      'Error',
      'Ocurrió un error al publicar. Por favor intenta de nuevo.'
    );
  } finally {
    setIsLoading(false);
  }
};
```

---

### 5. Actualización de URLs de Media en Responses

**Archivo:** `utils/mediaUtils.ts`

**Actualizar función `fixLocalMediaUrl`:**

```typescript
/**
 * Convierte URLs relativas o locales en URLs absolutas para consumo del frontend.
 *
 * Casos:
 * - http(s):// → Devuelve tal cual (ya es absoluta)
 * - /media/... → Prefija con CDN base URL
 * - file:// o localhost → Devuelve tal cual (desarrollo local)
 *
 * @example
 * fixLocalMediaUrl('/media/posts/abc123.jpg')
 * // → 'https://cdn.gymmetry.app/media/posts/abc123.jpg'
 *
 * fixLocalMediaUrl('https://cdn.gymmetry.app/media/posts/abc123.jpg')
 * // → 'https://cdn.gymmetry.app/media/posts/abc123.jpg' (sin cambios)
 */
export function fixLocalMediaUrl(url: string | null | undefined): string {
  if (!url) return '';

  // Si ya es una URL completa (http/https), devolverla tal cual
  if (/^https?:\/\//.test(url)) {
    return url;
  }

  // Si es una URL local de desarrollo (file:// o localhost), devolverla tal cual
  if (url.startsWith('file://') || url.includes('localhost')) {
    return url;
  }

  // ✅ ACTUALIZADO: Si es una ruta relativa, prefijar con CDN base URL
  const apiBaseUrl = process.env.EXPO_PUBLIC_CDN_BASE_URL || 'https://cdn.gymmetry.app';

  // Asegurar que apiBaseUrl no termina en / y url no comienza con /
  const cleanBase = apiBaseUrl.replace(/\/$/, '');
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return `${cleanBase}${cleanUrl}`;
}
```

---

### 6. Validación de CORS en API Gateway

**Responsabilidad:** Backend (AWS)

**Validación frontend:** Verificar que las siguientes cabeceras estén presentes en las respuestas:

```http
Access-Control-Allow-Origin: https://gymmetry.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, x-api-key, Accept, Accept-Encoding
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

**Testing con curl:**
```bash
curl -X OPTIONS https://api.gymmetry.app/v1/feed \
  -H "Origin: https://gymmetry.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v
```

**Verificar en código (opcional):**
```typescript
// En apiService.ts, agregar validación de CORS en interceptor de respuesta
this.axiosInstance.interceptors.response.use(
  (response) => {
    // Validar CORS en desarrollo
    if (Environment.DEBUG) {
      const corsHeader = response.headers['access-control-allow-origin'];
      if (!corsHeader) {
        logger.warn('⚠️ Response sin header CORS. API Gateway debe configurar CORS.');
      }
    }
    return response;
  },
  (error) => {
    // ... manejo de errores existente ...
  }
);
```

---

### 7. Actualización de Headers en Requests

**Cambios globales en `apiService.ts`:**

```typescript
// Headers comunes para todos los requests
const commonHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
  'User-Agent': 'Gymmetry/1.0.0',
  // ✅ AWS API Key (si se requiere)
  'x-api-key': Environment.AWS_API_KEY,
};

// Para uploads a S3 presigned URLs (sin headers adicionales)
const s3UploadHeaders = {
  'Content-Type': contentType, // Debe coincidir con el presigned URL
  // NO incluir Authorization ni x-api-key (S3 usa firma en URL)
};
```

---

## 🧪 Estrategia de Testing Post-Migración

### Fase 1: Testing Local (Backend en AWS, Frontend en local)

**Setup:**
1. Backend desplegado en AWS (dev environment)
2. Frontend ejecutándose localmente con `.env.development`

**Tests a ejecutar:**

#### ✅ Test 1: Conectividad Básica
```bash
# Verificar que API Gateway responde
curl https://dev-api.gymmetry.app/v1/health -v

# Verificar CORS
curl -X OPTIONS https://dev-api.gymmetry.app/v1/auth/login \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

#### ✅ Test 2: Autenticación (Login/Refresh)
```typescript
// En debug console del frontend
import { authService } from '@/services';

const testLogin = async () => {
  const resp = await authService.login({
    Email: 'test@gymmetry.app',
    Password: 'Test123!',
  });
  console.log('Login response:', resp);
};

testLogin();
```

**Validar:**
- ✅ Status 200
- ✅ JWT token recibido
- ✅ Token almacenado en AsyncStorage
- ✅ Refresh token funciona

---

#### ✅ Test 3: Upload de Imágenes (S3 Presigned URLs)
```typescript
// En CreatePostScreen
const testUpload = async () => {
  // 1. Seleccionar imagen de prueba
  const testImage = {
    uri: 'file:///path/to/test.jpg',
    type: 'image',
    fileName: 'test.jpg',
    mimeType: 'image/jpeg',
    fileSize: 500000,
  };

  // 2. Obtener presigned URL
  const urlResp = await feedService.getUploadPresignedUrl('test.jpg', 'image/jpeg');
  console.log('Presigned URL:', urlResp);

  // 3. Upload directo a S3
  const blob = await fetch(testImage.uri).then(r => r.blob());
  const uploadResp = await fetch(urlResp.Data.presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    body: blob,
  });

  console.log('S3 upload status:', uploadResp.status);

  // 4. Verificar URL final
  const finalUrl = `${Environment.CDN_BASE_URL}/${urlResp.Data.key}`;
  console.log('Final URL:', finalUrl);

  // 5. Crear post con S3 key
  const postResp = await feedService.createFeedWithMediaKeys({
    userId: 'test-user-id',
    description: 'Test post con S3',
    mediaKeys: [urlResp.Data.key],
    isAnonymous: false,
  });

  console.log('Post creado:', postResp);
};

testUpload();
```

**Validar:**
- ✅ Presigned URL recibida correctamente
- ✅ Upload a S3 exitoso (status 200)
- ✅ Archivo accesible desde CDN URL
- ✅ Post creado con mediaKey correcto

---

#### ✅ Test 4: Feed Loading (Paginación)
```typescript
const testFeed = async () => {
  const resp = await feedService.getFeedsPaged(1, 20);
  console.log('Feed response:', resp);

  if (resp.Success && resp.Data) {
    const feeds = resp.Data.Items || [];
    feeds.forEach((feed, idx) => {
      console.log(`Feed ${idx + 1}:`, {
        id: feed.Id,
        description: feed.Description,
        mediaUrl: feed.MediaUrl, // Debe ser CDN URL
        likesCount: feed.LikesCount,
      });
    });
  }
};

testFeed();
```

**Validar:**
- ✅ Feeds retornados correctamente
- ✅ MediaUrls apuntan a CDN (no a S3 directo)
- ✅ Imágenes cargan sin errores CORS
- ✅ Paginación funciona (page=2, 3, etc.)

---

#### ✅ Test 5: Likes y Comentarios
```typescript
const testInteractions = async () => {
  const feedId = 'test-feed-id';

  // Like
  const likeResp = await feedService.like(feedId);
  console.log('Like response:', likeResp);

  // Unlike
  const unlikeResp = await feedService.unlike(feedId);
  console.log('Unlike response:', unlikeResp);

  // Comentar
  const commentResp = await feedService.addComment(feedId, {
    content: 'Test comment desde AWS',
    isAnonymous: false,
  });
  console.log('Comment response:', commentResp);
};

testInteractions();
```

**Validar:**
- ✅ Like/unlike actualiza contador
- ✅ Comentarios se guardan y aparecen en lista
- ✅ Notificaciones push enviadas (si aplica)

---

### Fase 2: Testing en APK/IPA (Staging)

**Build con environment staging:**
```bash
# Android
eas build --platform android --profile staging

# iOS
eas build --platform ios --profile staging
```

**Tests a ejecutar:**

1. ✅ **Login con credenciales reales**
   - Email + Password
   - Social login (si está implementado)

2. ✅ **Navegación completa del app**
   - Feed scroll
   - Perfil de usuario
   - Crear post con imágenes/videos
   - Ver detalles de post
   - Like, comentar, compartir

3. ✅ **Upload de media desde galería**
   - Seleccionar múltiples imágenes
   - Subir video largo (max 60s)
   - Verificar compresión funciona

4. ✅ **Performance y UX**
   - Tiempo de carga inicial
   - Smooth scroll del feed
   - Imágenes lazy load correctamente
   - No hay crashes ni ANRs

5. ✅ **Offline behavior**
   - Desconectar red → Mostrar mensaje apropiado
   - Reconectar → App recupera funcionalidad

---

### Fase 3: Testing en Producción (Post-Deploy)

**Checklist pre-lanzamiento:**

- [ ] Todas las variables de entorno actualizadas a producción
- [ ] EAS build de producción generado y firmado
- [ ] APK/IPA subido a Play Store/App Store (beta track)
- [ ] Backend AWS en producción estable
- [ ] CloudFront caché configurado y testeado
- [ ] Monitoreo de errores activo (Sentry o similar)

**Tests críticos:**

1. ✅ **Smoke test end-to-end**
   - Instalar app desde store
   - Registrarse como usuario nuevo
   - Crear primer post con imagen
   - Ver feed de otros usuarios
   - Interactuar (like, comentar)
   - Cerrar sesión y volver a entrar

2. ✅ **Performance monitoring (primeras 48h)**
   - Tiempo de respuesta API (<500ms p95)
   - Tasa de errores (<0.1%)
   - Crashes (<0.01%)
   - Usuarios activos sin issues

3. ✅ **Feedback de beta testers**
   - Encuesta de satisfacción
   - Reporte de bugs encontrados
   - Métricas de uso (analytics)

---

## ⚠️ Riesgos y Mitigaciones

### Riesgo 1: URLs de Media Antiguas (Azure Blob)

**Problema:** Posts antiguos tienen URLs de Azure Blob Storage que ya no funcionarán.

**Ejemplo:**
```
https://gymmetrystorage.blob.core.windows.net/media/posts/abc123.jpg
```

**Mitigación:**

**Opción A: Migración de datos (recomendado)**
```bash
# Script de migración (ejecutar en backend o como job)
# 1. Listar todos los posts con MediaUrl antigua
# 2. Descargar archivo de Azure Blob
# 3. Subir a S3 con mismo nombre
# 4. Actualizar MediaUrl en BD a S3/CloudFront URL

# Ejemplo con AWS CLI y Azure CLI
for post in $(get_posts_with_azure_urls); do
  OLD_URL=$(echo $post | jq -r '.MediaUrl')
  FILE_NAME=$(basename $OLD_URL)
  
  # Download from Azure
  az storage blob download \
    --account-name gymmetrystorage \
    --container-name media \
    --name $FILE_NAME \
    --file /tmp/$FILE_NAME
  
  # Upload to S3
  aws s3 cp /tmp/$FILE_NAME s3://gymmetry-media/media/$FILE_NAME
  
  # Update DB
  NEW_URL="https://cdn.gymmetry.app/media/$FILE_NAME"
  update_post_media_url $POST_ID $NEW_URL
done
```

**Opción B: Proxy fallback (temporal)**
```typescript
// En mediaUtils.ts
export function fixLocalMediaUrl(url: string | null | undefined): string {
  if (!url) return '';

  // Si es URL de Azure Blob, convertir a proxy endpoint que descarga y redirecciona
  if (url.includes('blob.core.windows.net')) {
    // Backend tiene endpoint /media/proxy?url=...
    return `${Environment.API_BASE_URL}/media/proxy?url=${encodeURIComponent(url)}`;
  }

  // ... resto del código ...
}
```

---

### Riesgo 2: Rate Limiting en API Gateway

**Problema:** API Gateway tiene límites de requests por segundo (10,000 por defecto).

**Mitigación:**

1. **Configurar límites apropiados en AWS:**
```yaml
# API Gateway Usage Plan
BurstLimit: 5000
RateLimit: 2000  # requests/sec
```

2. **Implementar retry con exponential backoff en frontend:**
```typescript
// En apiService.ts
this.axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Si es 429 (Too Many Requests), reintentar
    if (error.response?.status === 429 && !config._retry) {
      config._retry = true;
      const retryAfter = error.response.headers['retry-after'] || 1;
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      return this.axiosInstance.request(config);
    }

    return Promise.reject(error);
  }
);
```

---

### Riesgo 3: Latencia de API Gateway vs Azure Functions

**Problema:** API Gateway + Lambda puede tener cold starts (~1-2s primera invocación).

**Mitigación:**

1. **Provisioned Concurrency en Lambdas críticas:**
```yaml
# Para funciones de login, feed, etc.
ProvisionedConcurrencyConfig:
  ProvisionedConcurrentExecutions: 5
```

2. **Warming automático:**
```javascript
// Lambda warmer (ejecutar cada 5 minutos con EventBridge)
exports.handler = async () => {
  const functions = [
    'auth-login',
    'feed-get-paged',
    'user-get-profile',
  ];

  await Promise.all(
    functions.map(fn =>
      lambda.invoke({
        FunctionName: fn,
        InvocationType: 'Event',
        Payload: JSON.stringify({ warming: true }),
      }).promise()
    )
  );
};
```

3. **Loading states apropiados en UI:**
```typescript
// En componentes de feed
{isLoading && (
  <ActivityIndicator size="large" color={Colors.light.tint} />
)}
```

---

### Riesgo 4: Cambios en Formato de Respuestas

**Problema:** AWS Lambda puede retornar respuestas con estructura diferente a Azure Functions.

**Mitigación:**

1. **Normalización en apiService:**
```typescript
private normalizeResponse<T>(response: AxiosResponse): ApiResponse<T> {
  // Azure Functions format
  if (response.data.Success !== undefined) {
    return response.data as ApiResponse<T>;
  }

  // AWS Lambda format (puede ser diferente)
  if (response.data.statusCode) {
    return {
      Success: response.data.statusCode >= 200 && response.data.statusCode < 300,
      Message: response.data.message || '',
      Data: response.data.data || response.data.body,
      StatusCode: response.data.statusCode,
    };
  }

  // Formato desconocido, asumir exitoso
  return {
    Success: true,
    Message: 'OK',
    Data: response.data as T,
    StatusCode: response.status,
  };
}
```

2. **Contract testing:**
```typescript
// __tests__/api-contracts.test.ts
describe('API Response Contracts', () => {
  it('should return standardized ApiResponse format', async () => {
    const response = await feedService.getFeedsPaged(1, 20);

    expect(response).toHaveProperty('Success');
    expect(response).toHaveProperty('Message');
    expect(response).toHaveProperty('Data');
    expect(response).toHaveProperty('StatusCode');
  });
});
```

---

### Riesgo 5: Credenciales en Código

**Problema:** AWS API Keys hardcodeadas o expuestas en repositorio.

**Mitigación:**

1. **Nunca commitear `.env*` files:**
```bash
# .gitignore (ya existe)
.env
.env.*
!.env.example
```

2. **Usar secrets en CI/CD:**
```yaml
# GitHub Actions
env:
  EXPO_PUBLIC_AWS_API_KEY: ${{ secrets.AWS_API_KEY }}
  EXPO_PUBLIC_API_BASE_URL: ${{ secrets.API_BASE_URL }}
```

3. **Rotación de API Keys:**
- Rotar cada 90 días
- Tener sistema de versiones (key-v1, key-v2)
- Backend acepta ambas durante transición

---

## 📋 Checklist de Migración Frontend

### Pre-Migración

- [ ] Backup de código actual (tag en Git)
- [ ] Documentar endpoints actuales de Azure
- [ ] Crear `.env.aws-migration` para testing
- [ ] Informar a usuarios de mantenimiento programado

### Cambios de Configuración

- [ ] Actualizar `environment/.env.local` con URLs AWS
- [ ] Actualizar `environment/.env.development` con URLs AWS
- [ ] Actualizar `environment/.env.production` con URLs AWS
- [ ] Actualizar `eas.json` con env vars AWS
- [ ] Actualizar `environment/index.ts` (eliminar Azure-specific vars)

### Cambios de Código

- [ ] Actualizar `services/apiService.ts` (headers, eliminar x-functions-key)
- [ ] Crear `services/mediaUploadService.ts` (S3 presigned URLs)
- [ ] Actualizar `services/feedService.ts` (nuevos métodos de upload)
- [ ] Actualizar `components/post/CreatePostScreenSimple.tsx` (flujo de upload)
- [ ] Actualizar `utils/mediaUtils.ts` (fixLocalMediaUrl con CDN)
- [ ] Eliminar referencias a `buildUrlWithFunctionKey` en apiService

### Testing

- [ ] Test 1: Conectividad básica (curl a API Gateway)
- [ ] Test 2: Login y refresh token
- [ ] Test 3: Upload de imágenes con presigned URLs
- [ ] Test 4: Feed loading con paginación
- [ ] Test 5: Likes y comentarios
- [ ] Test 6: Profile update con imagen
- [ ] Test 7: Video upload (si aplica)
- [ ] Test 8: Notificaciones push (si aplica)

### Build y Deploy

- [ ] Generar APK staging: `eas build --profile staging --platform android`
- [ ] Generar IPA staging: `eas build --profile staging --platform ios`
- [ ] Testing en dispositivos reales (3+ testers)
- [ ] Validar performance y UX
- [ ] Generar APK producción: `eas build --profile production --platform android`
- [ ] Generar IPA producción: `eas build --profile production --platform ios`
- [ ] Subir a Play Store (internal testing)
- [ ] Subir a App Store (TestFlight)

### Post-Deploy

- [ ] Monitorear errores en Sentry/Crashlytics (primeras 24h)
- [ ] Revisar métricas de performance (latencia, carga)
- [ ] Recopilar feedback de usuarios beta
- [ ] Migrar datos antiguos de Azure Blob a S3 (si aplica)
- [ ] Deshabilitar endpoints antiguos de Azure (tras confirmar estabilidad)
- [ ] Actualizar documentación del proyecto
- [ ] Celebrar lanzamiento exitoso 🎉

---

## 🔗 Referencias y Recursos

### Documentación AWS

- [API Gateway REST API](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-http.html)
- [S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [CloudFront CDN](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [Lambda Cold Starts](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/)

### Herramientas de Testing

- [Postman Collection](https://www.postman.com/)
- [k6 Load Testing](https://k6.io/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

### Contactos del Equipo

- **Backend Lead:** [Nombre] - Coordinar cambios en API Gateway
- **DevOps:** [Nombre] - Configuración de CloudFront y S3
- **QA Lead:** [Nombre] - Plan de testing post-migración

---

## 📝 Notas Finales

### Tiempo Estimado de Migración

| Fase | Tiempo | Responsable |
|------|--------|-------------|
| Cambios de configuración | 2 horas | Frontend Dev |
| Cambios de código | 8 horas | Frontend Dev |
| Testing local | 4 horas | Frontend Dev |
| Build staging | 2 horas | DevOps |
| Testing staging | 8 horas | QA Team |
| Build producción | 2 horas | DevOps |
| Deploy + monitoreo | 4 horas | Equipo completo |
| **TOTAL** | **30 horas** | **~4 días hábiles** |

### Ventana de Mantenimiento Recomendada

**Fecha sugerida:** Fin de semana (sábado-domingo)  
**Duración:** 4 horas (08:00 - 12:00 AM)  
**Plan de rollback:** Mantener Azure activo por 48h adicionales

---

**Documento generado:** 11 de octubre de 2025  
**Última actualización:** -  
**Versión:** 1.0  
**Estado:** ✅ Listo para revisión

---

**¿Preguntas o sugerencias?**  
Contactar al equipo de desarrollo frontend o abrir un issue en el repositorio.

---

**FIN DEL DOCUMENTO**
