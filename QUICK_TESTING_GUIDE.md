# 🧪 Script de Testing Rápido - AWS Lambda Integration

**Propósito:** Validar que el frontend se conecta correctamente con AWS Lambda

---

## 🚀 Testing Rápido (5 minutos)

### 1. Health Check del Backend

```bash
# Dev Environment
curl https://tzdnb4gelrnlf4qsrxvoznzwia0pcntb.lambda-url.us-east-1.on.aws/api/health

# Staging Environment  
curl https://iligesn2ijnwwdgb3362m7sm7q0pfiwh.lambda-url.us-east-1.on.aws/api/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "timestamp": "2025-10-14T...",
    "environment": "development"
  }
}
```

---

### 2. Verificar Variables de Entorno

```bash
# Ver configuración actual
cat environment/.env.development

# Debe mostrar:
# EXPO_PUBLIC_API_BASE_URL=https://tzdnb4gelrnlf4qsrxvoznzwia0pcntb.lambda-url.us-east-1.on.aws/api
```

---

### 3. Iniciar App

```bash
# Limpiar caché (opcional pero recomendado)
npm run clean

# Iniciar en modo desarrollo
npm run start:dev
```

**Espera ver:**
```
› Metro waiting on exp://192.168.0.16:8081
› Scan the QR code above with Expo Go (Android) or Camera app (iOS)
```

---

### 4. Testing Manual Mínimo

#### ✅ Test 1: Login (2 min)

**Abrir app → Pantalla de Login**

1. Ingresar credenciales de prueba:
   - Email: `test@gymmetry.app` (o tu usuario de prueba)
   - Password: `Test123!`

2. Presionar "Login"

3. **Verificar:**
   - ✅ Loading indicator aparece
   - ✅ Redirige a dashboard/feed
   - ✅ No hay errores en consola

**En DevTools (browser) o Flipper (mobile):**
```
Request: POST https://tzdnb4gelrnlf4qsrxvoznzwia0pcntb...
/api/auth/login
Status: 200 OK
Response: { "success": true, "data": { "token": "eyJ..." } }
```

---

#### ✅ Test 2: Ver Feed (1 min)

**Después de login → Dashboard/Feed**

1. **Verificar:**
   - ✅ Feed se carga
   - ✅ Publicaciones aparecen
   - ✅ Imágenes cargan (puede tardar en primera carga)
   - ✅ Scroll funciona

**En DevTools:**
```
Request: GET https://tzdnb4gelrnlf4qsrxvoznzwia0pcntb...
/api/feed/paged?page=1&pageSize=20
Status: 200 OK
```

---

#### ✅ Test 3: Cold Start (2 min)

**Simular cold start de Lambda:**

1. Cerrar app completamente
2. Esperar 5 minutos ⏱️
3. Abrir app nuevamente
4. Hacer login

**Observar en consola:**
```
⚠️ Cold start detected (attempt 1/2). Retrying in 1000ms...
✅ Retry successful
```

**Verificar:**
- ✅ Primera request tarda ~3-5 segundos (normal)
- ✅ Requests subsecuentes <1 segundo
- ✅ No hay errors 503/504

---

## 🔍 Verificación de Headers

### Usando DevTools (Chrome/Firefox)

1. Abrir DevTools → **Network** tab
2. Filtrar por: `lambda-url`
3. Click en cualquier request
4. Ver **Request Headers**

**Debe mostrar:**
```http
Authorization: Bearer eyJhbGci...
Content-Type: application/json
Accept: application/json
```

**NO debe mostrar:**
```http
x-functions-key: ... ❌ (eliminado)
```

---

## 🚨 Troubleshooting Rápido

### Problema 1: "Network Error"

**Causa:** Backend no responde

**Solución:**
```bash
# Verificar backend health
curl https://tzdnb4gelrnlf4qsrxvoznzwia0pcntb.lambda-url.us-east-1.on.aws/api/health

# Si no responde, contactar equipo backend
```

---

### Problema 2: CORS Error

**Error en consola:**
```
Access to fetch at 'https://...lambda-url...' from origin 'http://localhost:8081' 
has been blocked by CORS policy
```

**Solución:**
- Backend debe agregar tu origen a whitelist
- En dev: `localhost:8081` ya debe estar permitido
- Contactar equipo backend si persiste

---

### Problema 3: "401 Unauthorized"

**Causa:** Token JWT no se envía o está mal formado

**Verificar:**
```typescript
// En DevTools → Application → Local Storage (web)
// O AsyncStorage (mobile)
authToken: "eyJhbGci..." // Debe existir

// En Network → Headers de request:
Authorization: Bearer eyJhbGci... // Debe estar presente
```

**Solución:**
- Hacer logout y login nuevamente
- Verificar que authService guarda token correctamente

---

### Problema 4: Imágenes no cargan

**Causa:** URLs de S3 cambiaron

**Verificar:**
```bash
# Ver URL de imagen en response
# Debe ser tipo:
https://gymmetry-dev-storage.s3.amazonaws.com/...
# O presigned URL de S3
```

**Solución:**
- Backend debe retornar URLs de S3 válidas
- Ver sección "Archivos y Media" en FRONTEND_INTEGRATION_GUIDE.md

---

## ✅ Checklist Rápido

| Test | Status | Tiempo | Notas |
|------|--------|--------|-------|
| Backend health check | ⬜ | 30s | curl comando |
| Login exitoso | ⬜ | 1min | Con usuario prueba |
| Feed carga | ⬜ | 30s | Ver publicaciones |
| Imágenes cargan | ⬜ | 30s | Profile pics, posts |
| No errores CORS | ⬜ | - | Ver consola |
| Headers correctos | ⬜ | 1min | DevTools Network |
| Cold start OK | ⬜ | 2min | Retry automático |
| Performance OK | ⬜ | - | <5s first load |

---

## 📊 Resultados Esperados

### ✅ Todo funciona si:

- Login exitoso en <3 segundos
- Feed carga en <2 segundos (post cold start)
- No hay errores en consola
- Headers no incluyen `x-functions-key`
- Cold start se maneja automáticamente

### ⚠️ Investigar si:

- Timeout constante (>15s)
- CORS errors
- 401/403 en todas las requests
- Imágenes no cargan

---

## 🎯 Siguiente Fase

Si este testing rápido pasa, continuar con:

1. **Testing Completo** (30 min)
   - CRUD operations (crear, editar, eliminar)
   - Upload de imágenes
   - Navegación entre pantallas
   - Manejo de errores

2. **Build de Staging** (15 min)
   ```bash
   eas build --profile staging --platform android
   ```

3. **Testing en Dispositivo Real** (15 min)
   - Instalar APK/IPA
   - Probar flujos completos
   - Validar performance

---

## 📞 Contacto

**Si todo pasa:** ✅ Proceder a fase de testing completo

**Si hay problemas:** 
- Revisar MIGRATION_COMPLETED_SUMMARY.md → Sección Troubleshooting
- Contactar equipo backend si es problema de Lambda
- Abrir issue en GitHub con logs completos

---

**Tiempo total estimado:** 5-10 minutos  
**Prerequisito:** Backend Lambda desplegado y respondiendo  
**Última actualización:** 14 de octubre de 2025
