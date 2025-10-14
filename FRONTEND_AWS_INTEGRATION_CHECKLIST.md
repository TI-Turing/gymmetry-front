# ✅ Checklist de Integración Frontend - Azure → AWS Lambda

**Fecha de Análisis:** 14 de octubre de 2025  
**Estado Actual:** Backend migrado a AWS Lambda  
**Estado Frontend:** Requiere adaptación

---

## 📊 Resumen Ejecutivo

Después de revisar los archivos `FRONTEND_INTEGRATION_GUIDE.md` y `FRONTEND_SUMMARY.md`, así como el código actual del frontend, estos son los **cambios críticos** que debes realizar:

### 🎯 Cambios Requeridos (Prioridad Alta)

| # | Cambio | Archivo(s) | Impacto | Tiempo Est. |
|---|--------|-----------|---------|-------------|
| 1 | **Eliminar headers Azure Functions** | `services/apiService.ts` | 🔴 Crítico | 15 min |
| 2 | **Actualizar variables de entorno** | `environment/.env.*` | 🔴 Crítico | 10 min |
| 3 | **Implementar retry logic (cold start)** | `services/apiService.ts` | 🟡 Importante | 30 min |
| 4 | **Actualizar timeouts** | `services/apiService.ts` | 🟡 Importante | 10 min |
| 5 | **Deprecar API_FUNCTIONS_KEY** | `environment/index.ts` | 🟢 Limpieza | 10 min |
| 6 | **Testing end-to-end** | Todos | 🔴 Crítico | 2 horas |

**Tiempo Total Estimado:** ~3-4 horas

---

## 🔍 Análisis de Cambios Necesarios

### ✅ Lo que YA funciona (No requiere cambios)

Según la documentación del backend:

- ✅ **Estructura de endpoints**: Mismos paths (`/api/user/{id}`, etc.)
- ✅ **Métodos HTTP**: GET, POST, PUT, DELETE sin cambios
- ✅ **Formato de responses**: Mismo JSON `{ success, message, data, statusCode }`
- ✅ **Autenticación JWT**: Mismo flujo y formato de tokens
- ✅ **DTOs**: Misma estructura de datos
- ✅ **Status codes**: 200, 400, 401, 404, 500 sin cambios

### ⚠️ Lo que DEBE cambiar

#### 1. **Headers Azure Functions** (CRÍTICO)

**Problema actual:**
```typescript
// services/apiService.ts - Líneas 38-39
'x-functions-key': Environment.API_MAIN_FUNCTIONS_KEY,

// Líneas 67-71
if (!config.headers['x-functions-key']) {
  config.headers['x-functions-key'] = Environment.API_MAIN_FUNCTIONS_KEY;
}
```

**Impacto:** AWS Lambda **NO usa `x-functions-key`**. Este header causará que las requests fallen o sean ignoradas.

**Solución:** Eliminar completamente estos headers (AWS Lambda usa autenticación JWT únicamente).

---

#### 2. **Variables de Entorno** (CRÍTICO)

**Estado actual:**
```bash
# environment/.env.local
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.16:7160/api
EXPO_PUBLIC_CATALOGS_API_BASE_URL=http://192.168.0.16:7071/api
EXPO_PUBLIC_API_FUNCTIONS_KEY=local-functions-key

# environment/.env.development
EXPO_PUBLIC_API_BASE_URL=https://api-dev.example.com
EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://catalogs-dev.example.com
EXPO_PUBLIC_API_FUNCTIONS_KEY=dev-functions-key

# environment/.env.production
EXPO_PUBLIC_API_BASE_URL=https://api-prod.example.com
EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://catalogs-prod.example.com
EXPO_PUBLIC_API_FUNCTIONS_KEY=prod-functions-key
```

**Problema:** URLs placeholder no apuntan a AWS Lambda.

**Solución:** Actualizar con URLs reales de Lambda (pendiente obtener del backend).

---

#### 3. **Cold Start** (IMPORTANTE)

**Problema:** Primera request después de inactividad puede tardar **2-5 segundos**.

**Estado actual:**
```typescript
// services/apiService.ts - Línea 28
timeout: 10000, // 10 segundos
```

**Impacto:** El timeout actual de 10s es suficiente, pero no hay retry logic para cold starts.

**Solución:** Implementar retry automático en primer intento.

---

#### 4. **Timeouts más largos** (IMPORTANTE)

**Recomendación del backend:**
- Primera request: **15 segundos** (cold start)
- Requests subsecuentes: **10 segundos** (actual)

**Solución:** Implementar timeout adaptativo.

---

## 🛠️ Plan de Acción Detallado

### Paso 1: Eliminar Azure Functions Headers (15 min)

**Archivo:** `services/apiService.ts`

#### Cambio 1.1: Constructor del servicio (Línea 38)

**Eliminar:**
```typescript
headers: {
  'Content-Type': 'application/json',
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
  'User-Agent': 'ExpoApp/1.0.0',
  // Azure Functions (API principal)    // ⬅️ ELIMINAR ESTA LÍNEA
  'x-functions-key': Environment.API_MAIN_FUNCTIONS_KEY, // ⬅️ ELIMINAR ESTA LÍNEA
},
```

**Reemplazar con:**
```typescript
headers: {
  'Content-Type': 'application/json',
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
  'User-Agent': 'ExpoApp/1.0.0',
},
```

#### Cambio 1.2: Interceptor de request (Líneas 67-71)

**Eliminar:**
```typescript
// Asegurar la clave de funciones para el API principal
if (!config.headers['x-functions-key']) {
  config.headers['x-functions-key'] =
    Environment.API_MAIN_FUNCTIONS_KEY;
}
```

**Resultado:** AWS Lambda autentica únicamente con JWT token en header `Authorization`.

---

### Paso 2: Actualizar Variables de Entorno (10 min)

#### 2.1: Obtener URLs de Lambda

**Primero necesitas las URLs reales del backend:**

```bash
# Opción A: Pedir al equipo backend
# Opción B: Ejecutar desde el repo del backend
cd Gymmetry_Back/infrastructure/terraform

# Dev
terraform workspace select dev
terraform output lambda_function_url

# Staging
terraform workspace select staging
terraform output lambda_function_url
```

**Formato esperado:**
```
https://abcd1234efgh5678ijkl.lambda-url.us-east-1.on.aws
```

#### 2.2: Actualizar `.env.local`

**Archivo:** `environment/.env.local`

```bash
# Backend AWS Lambda (Local development con tunnel o mock)
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.16:7160/api  # ⬅️ Mantener si tienes backend local
# EXPO_PUBLIC_API_BASE_URL=https://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws  # ⬅️ O usar Lambda Dev

# Catálogos (AWS Lambda - mismo endpoint que API principal)
EXPO_PUBLIC_CATALOGS_API_BASE_URL=http://192.168.0.16:7160/api

# ⚠️ ELIMINAR: AWS Lambda no usa function keys
# EXPO_PUBLIC_API_FUNCTIONS_KEY=local-functions-key
# EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY=local-main-functions-key

# Otros (sin cambios)
EXPO_PUBLIC_ENVIRONMENT=local
EXPO_PUBLIC_DEBUG=true
EXPO_PUBLIC_PAY_CARD_INAPP=true
EXPO_PUBLIC_MP_PUBLIC_KEY=TEST-xxxx
EXPO_PUBLIC_ADMOB_USE_TEST_IDS=true
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-3940256099942544~3347511713
```

#### 2.3: Actualizar `.env.development`

**Archivo:** `environment/.env.development`

```bash
# ⚠️ REEMPLAZAR con URL real de Lambda Dev
EXPO_PUBLIC_API_BASE_URL=https://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws

# Catálogos apunta al mismo backend (no más API separada)
EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws

# ⚠️ ELIMINAR: AWS Lambda no usa function keys
# EXPO_PUBLIC_API_FUNCTIONS_KEY=dev-functions-key
# EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY=dev-main-functions-key

# Otros
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_DEBUG=true
EXPO_PUBLIC_PAY_CARD_INAPP=true
EXPO_PUBLIC_MP_PUBLIC_KEY=TEST-xxxx
EXPO_PUBLIC_ADMOB_USE_TEST_IDS=true
```

#### 2.4: Actualizar `.env.production`

**Archivo:** `environment/.env.production`

```bash
# ⚠️ REEMPLAZAR con URL real de Lambda Staging (o Production cuando exista)
EXPO_PUBLIC_API_BASE_URL=https://[STAGING_LAMBDA_ID].lambda-url.us-east-1.on.aws
# EXPO_PUBLIC_API_BASE_URL=https://api.gymmetry.fit  # ⬅️ Cuando tengan dominio custom

# Catálogos apunta al mismo backend
EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://[STAGING_LAMBDA_ID].lambda-url.us-east-1.on.aws

# ⚠️ ELIMINAR: AWS Lambda no usa function keys
# EXPO_PUBLIC_API_FUNCTIONS_KEY=prod-functions-key
# EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY=prod-main-functions-key

# Otros
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_DEBUG=false
EXPO_PUBLIC_PAY_CARD_INAPP=true
EXPO_PUBLIC_MP_PUBLIC_KEY=APP-xxxxxxxx
EXPO_PUBLIC_ADMOB_USE_TEST_IDS=false  # ⬅️ IDs reales en producción
```

---

### Paso 3: Deprecar API_FUNCTIONS_KEY en Config (10 min)

**Archivo:** `environment/index.ts`

**Cambio:**

```typescript
const createConfig = () => {
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    'http://localhost:7160/api';
  
  const catalogsApiBaseUrl =
    process.env.EXPO_PUBLIC_CATALOGS_API_BASE_URL ||
    process.env.CATALOGS_API_BASE_URL ||
    apiBaseUrl; // ⬅️ Fallback al mismo API base (ya no es endpoint separado)
  
  const environment =
    process.env.EXPO_PUBLIC_ENVIRONMENT || process.env.ENVIRONMENT || 'local';
  
  const debug = (process.env.EXPO_PUBLIC_DEBUG || process.env.DEBUG) === 'true';
  
  // ❌ ELIMINAR (deprecated para AWS Lambda)
  // const apiFunctionsKey =
  //   process.env.EXPO_PUBLIC_API_FUNCTIONS_KEY ||
  //   process.env.API_FUNCTIONS_KEY ||
  //   '';
  // const apiMainFunctionsKey =
  //   process.env.EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY ||
  //   process.env.API_MAIN_FUNCTIONS_KEY ||
  //   '';
  
  const payCardInApp =
    (process.env.EXPO_PUBLIC_PAY_CARD_INAPP || 'true') === 'true';
  
  const mpPublicKey = process.env.EXPO_PUBLIC_MP_PUBLIC_KEY || '';

  return {
    API_BASE_URL: apiBaseUrl,
    CATALOGS_API_BASE_URL: catalogsApiBaseUrl,
    ENVIRONMENT: environment,
    DEBUG: debug,
    // ❌ API_FUNCTIONS_KEY: apiFunctionsKey, // DEPRECATED
    // ❌ API_MAIN_FUNCTIONS_KEY: apiMainFunctionsKey, // DEPRECATED
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
  // ❌ API_FUNCTIONS_KEY: string; // DEPRECATED
  // ❌ API_MAIN_FUNCTIONS_KEY: string; // DEPRECATED
  PAY_CARD_INAPP: boolean;
  MP_PUBLIC_KEY: string;
}
```

**Nota:** Si hay otros archivos que usen `Environment.API_FUNCTIONS_KEY`, deberás eliminar esas referencias también.

---

### Paso 4: Implementar Retry Logic para Cold Start (30 min)

**Archivo:** `services/apiService.ts`

**Agregar después del constructor (alrededor de línea 100):**

```typescript
/**
 * Detecta si el error es por cold start de Lambda
 * @param error Error de Axios
 * @returns true si es cold start
 */
private isColdStartError(error: AxiosError): boolean {
  // Timeout o 503 pueden indicar cold start
  if (error.code === 'ECONNABORTED' || error.response?.status === 503) {
    return true;
  }
  
  // Lambda devuelve 502/504 durante cold start a veces
  if (error.response?.status === 502 || error.response?.status === 504) {
    return true;
  }
  
  return false;
}

/**
 * Ejecuta request con retry automático en caso de cold start
 * @param config Configuración de Axios
 * @param retryCount Intentos realizados
 * @returns Response de Axios
 */
private async requestWithRetry(
  config: AxiosRequestConfig,
  retryCount = 0
): Promise<AxiosResponse> {
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 1000; // 1 segundo

  try {
    return await this.axiosInstance.request(config);
  } catch (error) {
    const axiosError = error as AxiosError;

    // Si es cold start y no hemos alcanzado el límite de reintentos
    if (this.isColdStartError(axiosError) && retryCount < MAX_RETRIES) {
      logger.warn(
        `⚠️ Cold start detected (attempt ${retryCount + 1}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY}ms...`
      );

      // Esperar antes de reintentar
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

      // Reintentar con timeout más largo
      const retryConfig: AxiosRequestConfig = {
        ...config,
        timeout: 15000, // 15 segundos para cold start
      };

      return this.requestWithRetry(retryConfig, retryCount + 1);
    }

    // Si no es cold start o ya reintentamos lo suficiente, lanzar error
    throw error;
  }
}
```

**Actualizar métodos de request para usar retry:**

**Buscar los métodos `get`, `post`, `put`, `delete`, `patch` y reemplazar la llamada a `this.axiosInstance.request(config)` por `this.requestWithRetry(config)`.**

**Ejemplo para el método `get` (alrededor de línea 200):**

```typescript
async get<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<BackendApiResponse<T>> {
  return this.request<T>('GET', endpoint, undefined, options);
}

private async request<T>(
  method: HttpMethod,
  endpoint: string,
  data?: unknown,
  options?: RequestOptions
): Promise<BackendApiResponse<T>> {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      data,
      headers: options?.headers,
      timeout: options?.timeout,
      signal: options?.signal,
    };

    // ✅ Usar requestWithRetry en lugar de axiosInstance.request
    const response = await this.requestWithRetry(config);

    return this.normalizeResponse<T>(response);
  } catch (error) {
    return this.handleError(error);
  }
}
```

---

### Paso 5: Actualizar Timeout Adaptativo (10 min)

**Archivo:** `services/apiService.ts`

**Cambio en constructor (línea 28):**

```typescript
constructor() {
  this.axiosInstance = axios.create({
    baseURL: Environment.API_BASE_URL,
    timeout: 12000, // ⬅️ Aumentar de 10s a 12s (balance entre cold start y UX)
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'User-Agent': 'ExpoApp/1.0.0',
    },
  });
  
  // ... resto del código
}
```

**Opcional:** Agregar timeout específico para endpoints lentos (upload de archivos, etc.):

```typescript
// Ejemplo en feedService.ts
async createFeedWithMedia(formData: FormData): Promise<ApiResponse<unknown>> {
  return apiService.post<unknown>(
    `/feed/create-with-media`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // ⬅️ 30 segundos para uploads
    }
  );
}
```

---

### Paso 6: Testing End-to-End (2 horas)

#### 6.1: Testing Local (30 min)

**Prerequisitos:**
- Tener URLs de Lambda Dev del backend
- Actualizar `.env.local` o `.env.development`

**Comandos:**
```bash
# 1. Instalar dependencias (si hubo cambios)
npm install

# 2. Limpiar caché
npm run clean  # o: rm -rf node_modules/.cache

# 3. Iniciar app en modo development
npm run start:dev

# 4. Abrir en browser/emulador
# Web: http://localhost:8081
# Android: Escanear QR con Expo Go
# iOS: Escanear QR con Expo Go
```

**Flujo de prueba:**

1. ✅ **Login**
   - Email: `test@example.com`
   - Password: `Test123!`
   - Verificar: Token JWT almacenado en AsyncStorage

2. ✅ **Dashboard/Feed**
   - Verificar carga de publicaciones
   - Verificar imágenes de perfil cargan
   - Scroll infinito funciona

3. ✅ **Crear Post**
   - Escribir contenido
   - Adjuntar imagen (opcional)
   - Publicar
   - Verificar aparece en feed

4. ✅ **Perfil de Usuario**
   - Ver datos de usuario
   - Editar perfil
   - Subir foto de perfil

5. ✅ **Rutinas/Ejercicios** (si aplica)
   - Ver listado
   - Crear nueva rutina
   - Editar existente
   - Eliminar

6. ✅ **Logout**
   - Cerrar sesión
   - Verificar token eliminado
   - Redirige a login

**Validar en consola:**

```typescript
// Abrir DevTools (web) o Flipper (mobile)
// Verificar requests exitosos:

// ✅ Correcto (AWS Lambda):
POST https://[LAMBDA_ID].lambda-url.us-east-1.on.aws/api/auth/login
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGci..."  // Solo en requests autenticados
}
Response: {
  "success": true,
  "data": { "token": "...", "user": {...} }
}

// ❌ Incorrecto (si ves esto, algo está mal):
POST https://api-dev.example.com/api/auth/login  // URL placeholder
Headers: {
  "x-functions-key": "dev-functions-key"  // Header Azure no debe existir
}
```

#### 6.2: Testing de Errores (30 min)

**Probar manejo de errores:**

1. **Desconectar WiFi** → Verificar mensaje amigable "Sin conexión"
2. **Token expirado** → Manipular token en AsyncStorage → Verificar redirige a login
3. **Datos inválidos** → Formulario con campos vacíos → Verificar validaciones
4. **Cold start simulado** → Primera request del día → Verificar retry automático (revisar logs)
5. **Imagen no carga** → URL inválida → Verificar placeholder/fallback

#### 6.3: Testing de Performance (30 min)

**Métricas a medir:**

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| **First Request (cold start)** | < 5 segundos | DevTools Network |
| **Subsequent Requests** | < 1 segundo | DevTools Network |
| **Image Load** | < 2 segundos | DevTools Network |
| **Feed Scroll** | 60 FPS smooth | React DevTools Profiler |
| **Memory Usage** | < 100MB base | Browser Task Manager |

**Validación:**
```bash
# Abrir DevTools → Network → Preserve log
# Recargar app y medir:

✅ /api/auth/login - 200 OK - 4.2s (cold start aceptable)
✅ /api/feed/paged - 200 OK - 0.8s
✅ /api/user/profile - 200 OK - 0.6s
✅ [S3 Image URL] - 200 OK - 1.5s

# Verificar no hay:
❌ CORS errors
❌ 401 Unauthorized (salvo logout intencional)
❌ 500 Internal Server Error
❌ Timeout errors constantes
```

#### 6.4: Testing en Dispositivo Real (30 min)

**Build de desarrollo:**
```bash
# Android
eas build --profile development --platform android

# iOS (requiere Apple Developer account)
eas build --profile development --platform ios
```

**O usar Expo Go:**
```bash
npm run start:dev
# Escanear QR con Expo Go app
```

**Probar en:**
- ✅ Android (mínimo v8.0)
- ✅ iOS (mínimo v13.0)
- ✅ Conexión WiFi
- ✅ Conexión 4G/5G
- ✅ Modo avión (offline)

---

## 📋 Checklist Final

### Pre-Deploy

- [ ] ✅ Todas las referencias a `x-functions-key` eliminadas
- [ ] ✅ URLs de AWS Lambda actualizadas en `.env.*`
- [ ] ✅ `API_FUNCTIONS_KEY` eliminado de `environment/index.ts`
- [ ] ✅ Retry logic implementado en `apiService.ts`
- [ ] ✅ Timeouts aumentados (12s default, 15s retry)
- [ ] ✅ Tests manuales pasados (login, CRUD, upload)
- [ ] ✅ No hay errores en consola
- [ ] ✅ Build de producción genera correctamente

### Post-Deploy

- [ ] ✅ Usuarios pueden hacer login
- [ ] ✅ Feed carga correctamente
- [ ] ✅ Imágenes se muestran sin errores
- [ ] ✅ CRUD operations funcionan
- [ ] ✅ No hay crashes reportados
- [ ] ✅ Performance aceptable (< 5s first load)
- [ ] ✅ Métricas de errores < 1%

---

## 🚨 Troubleshooting

### Problema 1: "Network Error" o "Request failed"

**Causa:** URL de Lambda incorrecta o backend no desplegado.

**Solución:**
```bash
# Verificar que backend responde
curl https://[LAMBDA_ID].lambda-url.us-east-1.on.aws/api/health

# Debería retornar:
{
  "success": true,
  "message": "API is healthy",
  "data": { "timestamp": "2025-10-14T..." }
}
```

### Problema 2: "401 Unauthorized" en todas las requests

**Causa:** Token JWT no se está enviando correctamente.

**Solución:**
```typescript
// Verificar en apiService.ts que el interceptor inyecta Authorization:

const token = await AsyncStorage.getItem('authToken');
if (token) {
  config.headers['Authorization'] = `Bearer ${token}`;
}

// Verificar en DevTools que el header está presente:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Problema 3: CORS Errors

**Causa:** Origen no whitelisted en backend Lambda.

**Solución:**
```bash
# Contactar al equipo backend para agregar tu dominio/localhost
# Dev ya tiene: localhost:3000, localhost:4200, localhost:8081

# Verificar headers de respuesta:
Access-Control-Allow-Origin: http://localhost:8081
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Problema 4: Imágenes no cargan (404)

**Causa:** URLs de S3 cambiaron o presigned URLs expiraron.

**Solución:**
```typescript
// Las URLs de imágenes deben obtenerse dinámicamente del backend:

const avatarUrl = await fetch(`${API_BASE_URL}/api/user/${userId}/avatar-url`);
// Retorna: { success: true, data: { url: "https://s3.amazonaws.com/..." } }

// NO hardcodear URLs de Azure Blob Storage
❌ const url = "https://gymmetrystorage.blob.core.windows.net/profiles/...";
```

### Problema 5: "Timeout" en primera request

**Causa:** Cold start de Lambda (2-5 segundos).

**Solución:**
```typescript
// Verificar que el retry logic está funcionando:
// Debería aparecer en logs:
⚠️ Cold start detected (attempt 1/2). Retrying in 1000ms...

// Si persiste, aumentar timeout:
timeout: 15000 // en requestWithRetry
```

### Problema 6: Build de producción falla

**Causa:** Variables de entorno no definidas o TypeScript errors.

**Solución:**
```bash
# Verificar variables en eas.json
cat eas.json | grep EXPO_PUBLIC_API_BASE_URL

# Ejecutar type-check
npm run type-check

# Limpiar caché y rebuilding
npm run clean
npm install
eas build --platform android --profile production
```

---

## 📞 Contacto y Soporte

Si después de seguir esta guía encuentras problemas:

1. **Revisar documentación completa:**
   - `FRONTEND_INTEGRATION_GUIDE.md` (868 líneas)
   - `FRONTEND_SUMMARY.md` (360 líneas)

2. **Verificar URLs de Lambda:**
   - Contactar al equipo backend
   - Verificar GitHub Actions del backend

3. **Abrir issue en GitHub:**
   - Repo: `TI-Turing/Gymmetry_Back`
   - Incluir: Request completo, response, screenshots, logs

4. **Revisar troubleshooting del backend:**
   - Ver sección "Troubleshooting" en `FRONTEND_INTEGRATION_GUIDE.md`

---

## ✅ Conclusión

**Cambios mínimos requeridos:**
- ✅ Eliminar headers Azure Functions (2 líneas)
- ✅ Actualizar URLs en `.env.*` (6 variables)
- ✅ Deprecar `API_FUNCTIONS_KEY` (10 líneas)
- ✅ Implementar retry logic (50 líneas)
- ✅ Aumentar timeouts (1 línea)

**Tiempo total estimado:** 3-4 horas (incluyendo testing)

**Impacto en usuarios:** ✅ Ninguno (transparente)

---

**Última actualización:** 14 de octubre de 2025  
**Autor:** GitHub Copilot AI Agent  
**Versión:** 1.0
