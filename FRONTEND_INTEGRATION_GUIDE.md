# 🔄 Guía de Integración Frontend - Migración Azure → AWS

**Fecha**: Octubre 2025  
**Versión Backend**: v2.0.0 (AWS Lambda)  
**Ambientes**: Dev, Staging, Production (futuro)

---

## 📋 Tabla de Contenidos

- [Resumen de Cambios](#-resumen-de-cambios)
- [Nuevas URLs del Backend](#-nuevas-urls-del-backend)
- [Cambios en Endpoints](#-cambios-en-endpoints)
- [Autenticación y Headers](#-autenticación-y-headers)
- [Manejo de Errores](#-manejo-de-errores)
- [Archivos y Media](#-archivos-y-media)
- [WebSockets/SignalR](#-websocketssignalr)
- [Variables de Entorno](#-variables-de-entorno)
- [Breaking Changes](#-breaking-changes)
- [Pruebas y Validación](#-pruebas-y-validación)
- [Troubleshooting](#-troubleshooting)

---

## 🚨 Resumen de Cambios

### ¿Qué cambió?

El backend de Gymmetry fue **completamente migrado** de Azure Functions a AWS Lambda:

| Aspecto | Antes (Azure) | Ahora (AWS) |
|---------|---------------|-------------|
| **Compute** | Azure Functions | AWS Lambda |
| **Base URL** | `gymmetry-api.azurewebsites.net` | `[id].lambda-url.us-east-1.on.aws` |
| **Protocolo** | HTTPS | HTTPS |
| **Base de Datos** | Azure SQL | Amazon RDS MySQL |
| **Storage** | Azure Blob Storage | Amazon S3 |
| **Autenticación** | JWT (sin cambios) | JWT (sin cambios) |
| **CORS** | Configurado | Configurado |

### ¿Qué NO cambió?

✅ **Estructura de endpoints** - Mismas rutas y métodos HTTP  
✅ **Formato de requests/responses** - Mismo esquema JSON  
✅ **Autenticación JWT** - Mismo flujo y formato de tokens  
✅ **Status codes** - Mismos códigos de respuesta  
✅ **DTOs** - Misma estructura de datos  

---

## 🌐 Nuevas URLs del Backend

### 🔧 Dev (Desarrollo)

```bash
BASE_URL: https://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws
```

**Nota**: La URL específica se obtiene de los outputs de Terraform después del despliegue.

**Cómo obtener la URL**:
```bash
# Desde el repositorio del backend
cd infrastructure/terraform
terraform output lambda_function_url
```

**Características Dev**:
- ✅ CORS habilitado para `localhost:3000`, `localhost:4200`
- ✅ Logs detallados
- ⚠️ Base de datos de prueba (datos pueden reiniciarse)
- ⚠️ Sin rate limiting

### 🧪 Staging (Pre-producción)

```bash
BASE_URL: https://[STAGING_LAMBDA_ID].lambda-url.us-east-1.on.aws
```

**Características Staging**:
- ✅ Datos persistentes
- ✅ CORS configurado para dominio staging
- ✅ Logs con retención 14 días
- ⚠️ Límite de concurrencia Lambda

### 🏭 Production (Futuro)

```bash
BASE_URL: https://api.gymmetry.fit  # Custom domain con Route53
# O directamente: https://[PROD_LAMBDA_ID].lambda-url.us-east-1.on.aws
```

**Características Production**:
- ✅ Dominio custom
- ✅ CloudFront CDN
- ✅ API Gateway (rate limiting)
- ✅ Multi-AZ alta disponibilidad

---

## 🔌 Cambios en Endpoints

### Estructura de URLs

**Antes (Azure)**:
```
https://gymmetry-api.azurewebsites.net/api/{endpoint}
```

**Ahora (AWS)**:
```
https://[LAMBDA_ID].lambda-url.us-east-1.on.aws/api/{endpoint}
```

### Endpoints Disponibles

**✅ TODOS los endpoints mantienen la misma estructura**:

```typescript
// Ejemplo: Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Ejemplo: Obtener usuario
GET /api/user/{id}
Headers: {
  "Authorization": "Bearer {JWT_TOKEN}"
}

// Ejemplo: Crear rutina
POST /api/routine/create
Headers: {
  "Authorization": "Bearer {JWT_TOKEN}"
}
Body: { /* DTO */ }
```

### Endpoints Completos

| Módulo | Métodos | Ruta Base | Cambios |
|--------|---------|-----------|---------|
| **Auth** | POST, GET | `/api/auth/*` | ✅ Sin cambios |
| **User** | GET, POST, PUT, DELETE | `/api/user/*` | ✅ Sin cambios |
| **Gym** | GET, POST, PUT, DELETE | `/api/gym/*` | ✅ Sin cambios |
| **Routine** | GET, POST, PUT, DELETE | `/api/routine/*` | ✅ Sin cambios |
| **Exercise** | GET, POST, PUT, DELETE | `/api/exercise/*` | ✅ Sin cambios |
| **Machine** | GET, POST, PUT, DELETE | `/api/machine/*` | ✅ Sin cambios |
| **Plan** | GET, POST, PUT, DELETE | `/api/plan/*` | ✅ Sin cambios |
| **Payment** | POST, GET | `/api/payment/*` | ✅ Sin cambios |
| **Bill** | GET, POST | `/api/bill/*` | ✅ Sin cambios |
| **Progress** | GET, POST | `/api/progress/*` | ✅ Sin cambios |
| **Statistics** | GET | `/api/statistics/*` | ✅ Sin cambios |
| **OTP** | POST | `/api/otp/*` | ✅ Sin cambios |

---

## 🔐 Autenticación y Headers

### Headers Requeridos

**✅ Sin cambios en la estructura**:

```typescript
// Para endpoints protegidos
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${jwtToken}`,
  // Opcional pero recomendado:
  'X-Client-Version': '1.0.0',
  'X-Platform': 'web' // o 'ios', 'android'
}
```

### Flujo de Autenticación

**1. Login**:
```typescript
const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await loginResponse.json();
// data.success = true
// data.data.token = "eyJhbGci..."
// data.data.user = { id, email, name, ... }
```

**2. Request Autenticado**:
```typescript
const response = await fetch(`${BASE_URL}/api/user/profile`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.data.token}`
  }
});
```

### Token JWT

**Formato**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Payload** (sin cambios):
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1729728000,
  "exp": 1729814400
}
```

**Expiración**: 24 horas (configurable)

**⚠️ Importante**: 
- Renovar token antes de expiración
- Implementar refresh token flow (si está habilitado en backend)

---

## 🚨 Manejo de Errores

### Formato de Respuesta Estándar

**✅ Sin cambios**:

```typescript
// Respuesta exitosa
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* resultado */ },
  "statusCode": 200
}

// Respuesta con error
{
  "success": false,
  "message": "Error message",
  "data": null,
  "statusCode": 400
}
```

### Códigos HTTP

| Código | Significado | Acción Frontend |
|--------|-------------|-----------------|
| `200` | OK | Procesar data normalmente |
| `201` | Created | Recurso creado exitosamente |
| `400` | Bad Request | Mostrar mensaje de error al usuario |
| `401` | Unauthorized | Redirigir a login, limpiar token |
| `403` | Forbidden | Usuario sin permisos |
| `404` | Not Found | Recurso no existe |
| `500` | Internal Error | Error del servidor, reintentar |
| `503` | Service Unavailable | Backend temporalmente no disponible |

### Manejo en Frontend

```typescript
async function apiRequest(endpoint: string, options: RequestInit) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    // ⚠️ IMPORTANTE: Lambda puede devolver 200 con success: false
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
    
  } catch (error) {
    if (error instanceof TypeError) {
      // Error de red (CORS, DNS, timeout)
      console.error('Network error:', error);
      throw new Error('No se pudo conectar con el servidor');
    }
    
    // Error de la API
    throw error;
  }
}
```

### Errores Comunes Post-Migración

#### 1. CORS Error

**Error**:
```
Access to fetch at 'https://[...].lambda-url.us-east-1.on.aws/api/user/profile' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solución**:
- Verificar que el origen está en la whitelist del backend
- Contactar al equipo de backend para agregar el dominio
- En Dev: `localhost:3000` y `localhost:4200` ya están permitidos

#### 2. 503 Cold Start

**Situación**: Primera request después de inactividad puede tardar 2-5 segundos.

**Solución**:
```typescript
// Implementar timeout mayor para primera request
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000); // 10s

try {
  const response = await fetch(url, {
    signal: controller.signal,
    ...options
  });
} catch (error) {
  if (error.name === 'AbortError') {
    // Cold start timeout, reintentar
    return apiRequest(endpoint, options);
  }
}
```

#### 3. 401 Token Expirado

**Solución**:
```typescript
if (response.status === 401) {
  // Limpiar token local
  localStorage.removeItem('jwt_token');
  
  // Redirigir a login
  window.location.href = '/login';
}
```

---

## 📁 Archivos y Media

### URLs de Imágenes

**⚠️ CAMBIO IMPORTANTE**: Las URLs de archivos cambiaron de Azure Blob a S3.

#### Antes (Azure Blob):
```
https://gymmetrystorage.blob.core.windows.net/user-profiles/{userId}.jpg
```

#### Ahora (S3):
```
https://gymmetry-{env}-storage.s3.us-east-1.amazonaws.com/user-profiles/{userId}.jpg
```

**O con presigned URLs** (recomendado para seguridad):
```
https://gymmetry-staging-storage.s3.us-east-1.amazonaws.com/user-profiles/{userId}.jpg?
  X-Amz-Algorithm=AWS4-HMAC-SHA256&
  X-Amz-Credential=...&
  X-Amz-Date=20251014T120000Z&
  X-Amz-Expires=3600&
  X-Amz-SignedHeaders=host&
  X-Amz-Signature=...
```

### Upload de Archivos

**✅ Sin cambios en el flujo**:

```typescript
// 1. Obtener presigned URL del backend
const uploadUrlResponse = await fetch(`${BASE_URL}/api/user/upload-url`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileName: 'profile.jpg',
    fileType: 'image/jpeg'
  })
});

const { uploadUrl, fileKey } = await uploadUrlResponse.json();

// 2. Subir archivo directo a S3
const uploadResponse = await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': 'image/jpeg'
  },
  body: fileBlob
});

// 3. Confirmar upload al backend
await fetch(`${BASE_URL}/api/user/confirm-upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileKey: fileKey
  })
});
```

### Rutas de Storage

| Tipo de Archivo | Ruta en S3 | Ejemplo |
|-----------------|------------|---------|
| **User Profiles** | `user-profiles/{userId}.jpg` | `user-profiles/123e4567-e89b.jpg` |
| **Feed Media** | `feed-media/{feedId}/{filename}` | `feed-media/abc123/photo.jpg` |
| **Gym Images** | `gym-images/{gymId}.jpg` | `gym-images/gym-001.jpg` |
| **Gym Logos** | `gym-logos/{gymId}.png` | `gym-logos/gym-001.png` |
| **Exercise Thumbnails** | `exercise-thumbnails/{exerciseId}.jpg` | `exercise-thumbnails/ex-123.jpg` |

### Handling de Imágenes

```typescript
// Componente React ejemplo
function UserAvatar({ userId }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadImage() {
      try {
        const response = await fetch(
          `${BASE_URL}/api/user/${userId}/avatar-url`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const data = await response.json();
        setImageUrl(data.data.url); // Presigned URL de S3
        
      } catch (error) {
        console.error('Error loading avatar:', error);
        setImageUrl('/default-avatar.png'); // Fallback
      } finally {
        setLoading(false);
      }
    }
    
    loadImage();
  }, [userId]);
  
  return (
    <img 
      src={loading ? '/loading.gif' : imageUrl} 
      alt="User avatar"
      onError={(e) => {
        e.target.src = '/default-avatar.png';
      }}
    />
  );
}
```

---

## 🔌 WebSockets/SignalR

### ⚠️ CAMBIO: Endpoint de SignalR

**Antes (Azure)**:
```
wss://gymmetry-api.azurewebsites.net/hubs/reportcontent
```

**Ahora (AWS Lambda)**:
```
wss://[LAMBDA_ID].lambda-url.us-east-1.on.aws/hubs/reportcontent
```

### Configuración SignalR

```typescript
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${BASE_URL}/hubs/reportcontent`, {
    accessTokenFactory: () => jwtToken,
    transport: signalR.HttpTransportType.WebSockets
  })
  .withAutomaticReconnect({
    nextRetryDelayInMilliseconds: (retryContext) => {
      // Backoff exponencial
      return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
    }
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

// Conectar
await connection.start();

// Escuchar eventos
connection.on('ReceiveReport', (data) => {
  console.log('Report received:', data);
});

// Enviar mensaje
await connection.invoke('SendReport', {
  reportType: 'user',
  targetId: 123,
  reason: 'spam'
});
```

### ⚠️ Consideraciones Lambda

- **Cold start**: Primera conexión WebSocket puede tardar 2-5 segundos
- **Timeout**: Conexión máxima 15 minutos (límite Lambda), implementar reconexión automática
- **Concurrencia**: Límite de conexiones simultáneas por ambiente

---

## ⚙️ Variables de Entorno

### Variables a Actualizar en Frontend

**React (.env)**:
```bash
# Dev
REACT_APP_API_URL=https://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws
REACT_APP_ENVIRONMENT=development

# Staging
REACT_APP_API_URL=https://[STAGING_LAMBDA_ID].lambda-url.us-east-1.on.aws
REACT_APP_ENVIRONMENT=staging

# Production (futuro)
REACT_APP_API_URL=https://api.gymmetry.fit
REACT_APP_ENVIRONMENT=production
```

**Angular (environment.ts)**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws',
  wsUrl: 'wss://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws/hubs',
  environment: 'development'
};
```

**Vue (.env.development)**:
```bash
VUE_APP_API_URL=https://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws
VUE_APP_WS_URL=wss://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws/hubs
VUE_APP_ENV=development
```

### Obtener URLs Actuales

**Contactar al equipo de backend** o ejecutar:

```bash
# Clonar repo backend
git clone https://github.com/TI-Turing/Gymmetry_Back
cd Gymmetry_Back/infrastructure/terraform

# Dev
terraform workspace select dev
terraform output lambda_function_url

# Staging
terraform workspace select staging
terraform output lambda_function_url
```

---

## 💥 Breaking Changes

### 1. ⚠️ Base URL Cambió

**Impacto**: TODAS las requests.

**Acción**: Actualizar variable de entorno `API_URL` en todos los ambientes.

### 2. ⚠️ URLs de Imágenes Cambiaron

**Impacto**: Componentes que muestran imágenes de perfil, fotos de gym, etc.

**Acción**: 
- Usar endpoints del backend para obtener presigned URLs
- No hardcodear URLs de Azure Blob
- Implementar manejo de errores de carga de imágenes

### 3. ⚠️ Cold Start Inicial

**Impacto**: Primera request puede tardar 2-5 segundos.

**Acción**:
- Implementar loading states más largos
- Mostrar skeleton screens
- Implementar retry logic
- Considerar "warm-up" request en app initialization

### 4. ⚠️ Timeout de WebSocket

**Impacto**: Conexiones SignalR tienen límite de 15 minutos.

**Acción**:
- Implementar reconexión automática
- Manejar evento `onclose`
- Mostrar estado de conexión al usuario

### 5. ✅ Headers y Payloads NO Cambiaron

**Impacto**: Ninguno.

**Acción**: No se requiere acción.

---

## ✅ Pruebas y Validación

### Checklist de Testing

#### 1. Autenticación
- [ ] Login exitoso devuelve token
- [ ] Token se persiste correctamente
- [ ] Requests autenticadas incluyen header Authorization
- [ ] 401 redirige a login
- [ ] Logout limpia token

#### 2. CRUD Operations
- [ ] GET obtiene datos correctamente
- [ ] POST crea nuevos recursos
- [ ] PUT actualiza recursos existentes
- [ ] DELETE elimina recursos
- [ ] Validaciones funcionan

#### 3. Archivos y Media
- [ ] Upload de imagen de perfil
- [ ] Carga de imágenes existentes
- [ ] Fallback a imagen por defecto si falla
- [ ] Preview antes de upload

#### 4. WebSockets
- [ ] Conexión SignalR exitosa
- [ ] Recepción de eventos
- [ ] Envío de mensajes
- [ ] Reconexión automática funciona
- [ ] Manejo de desconexión

#### 5. Errores
- [ ] Mensajes de error son claros
- [ ] Network errors se manejan correctamente
- [ ] CORS no bloquea requests
- [ ] Loading states funcionan
- [ ] Retry logic funciona

#### 6. Performance
- [ ] Cold start no bloquea UI
- [ ] Requests concurrentes funcionan
- [ ] Imágenes cargan en tiempo razonable
- [ ] Cache de datos funciona

### Testing en Dev

```bash
# 1. Actualizar URL en .env
REACT_APP_API_URL=https://[DEV_LAMBDA_ID].lambda-url.us-east-1.on.aws

# 2. Reiniciar dev server
npm start

# 3. Probar flujo completo
# - Login
# - Dashboard
# - CRUD operations
# - Upload de imagen
# - Logout
```

### Testing en Staging

```bash
# Build para staging
npm run build:staging

# Deploy a ambiente de staging
# Verificar que las URLs apuntan a staging
```

---

## 🔧 Troubleshooting

### Problema 1: CORS Error

**Síntoma**:
```
Access to fetch blocked by CORS policy
```

**Solución**:
1. Verificar que tu dominio está en la lista de orígenes permitidos
2. Contactar al backend para agregar origen
3. En Dev: asegurarse de usar `http://localhost:3000` o puerto correcto

### Problema 2: 503 Service Unavailable

**Síntoma**: Primera request falla o tarda mucho.

**Solución**:
```typescript
// Implementar retry con backoff
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (response.status === 503 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Problema 3: Imágenes No Cargan

**Síntoma**: 404 o 403 en URLs de imágenes.

**Solución**:
- No usar URLs directas de S3
- Obtener presigned URLs del backend:
  ```typescript
  GET /api/user/{id}/avatar-url
  Response: { success: true, data: { url: "https://..." } }
  ```

### Problema 4: Token JWT Inválido

**Síntoma**: 401 en requests autenticadas.

**Solución**:
1. Verificar que token no expiró
2. Verificar formato: `Bearer {token}`
3. Verificar que token es el correcto (no concatenar múltiples)

### Problema 5: WebSocket No Conecta

**Síntoma**: SignalR falla al conectar.

**Solución**:
1. Verificar URL del hub: `wss://[LAMBDA_ID].../hubs/reportcontent`
2. Verificar token en `accessTokenFactory`
3. Habilitar logging de SignalR para debug:
   ```typescript
   .configureLogging(signalR.LogLevel.Debug)
   ```

### Problema 6: Timeout en Requests

**Síntoma**: Request se cancela después de X segundos.

**Solución**:
```typescript
// Aumentar timeout para cold start
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 15000); // 15s

const response = await fetch(url, {
  signal: controller.signal,
  ...options
});

clearTimeout(timeout);
```

---

## 📞 Contacto y Soporte

### Equipo Backend

- **Repositorio**: [TI-Turing/Gymmetry_Back](https://github.com/TI-Turing/Gymmetry_Back)
- **Issues**: [GitHub Issues](https://github.com/TI-Turing/Gymmetry_Back/issues)

### Obtener URLs Actualizadas

**Método 1**: Consultar al equipo de DevOps  
**Método 2**: Ver outputs de GitHub Actions en la sección de deployment  
**Método 3**: Terraform outputs (requiere acceso al repo backend)

### Reportar Problemas

Al reportar un problema, incluir:
- **Ambiente**: Dev, Staging, Production
- **Endpoint**: Ruta completa
- **Request**: Headers, body, método
- **Response**: Status code, mensaje de error
- **Browser/Platform**: Chrome, Safari, iOS, Android
- **Network tab**: Screenshot o HAR file

---

## 📚 Recursos Adicionales

- **Backend README**: [README.md](./README.md)
- **API Documentation**: (Swagger/OpenAPI - TBD)
- **Postman Collection**: (TBD)
- **Changelog**: Ver commits en GitHub

---

## ✅ Checklist de Migración

### Pre-Migración
- [ ] Documentar todos los endpoints usados actualmente
- [ ] Identificar hardcoded URLs de Azure
- [ ] Revisar manejo de imágenes/archivos
- [ ] Verificar configuración CORS

### Durante Migración
- [ ] Actualizar variables de entorno
- [ ] Actualizar base URLs en código
- [ ] Actualizar URLs de WebSocket
- [ ] Implementar retry logic para cold starts
- [ ] Actualizar manejo de imágenes
- [ ] Testing completo en Dev

### Post-Migración
- [ ] Validar en Staging
- [ ] Monitorear errores en Sentry/LogRocket
- [ ] Documentar cambios en changelog
- [ ] Comunicar a equipo QA
- [ ] Deploy a Production (cuando esté listo)

---

<div align="center">

**Última actualización**: 14 de Octubre 2025  
**Versión**: 2.0.0  
**Mantenido por**: TI-Turing Backend Team

</div>
