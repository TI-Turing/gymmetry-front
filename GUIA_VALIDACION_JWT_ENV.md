# 🛠️ Guía Práctica de Validación - JWT y Variables de Entorno

> **Actualizado:** 15 de septiembre de 2025  
> **Para:** Plan de Testing Gymmetry App

## 🎯 Propósito

Esta guía te explica **exactamente cómo validar** las verificaciones mencionadas en el Plan de Testing, específicamente:
- ✅ **JWT generado correctamente**
- ✅ **Variables de entorno seteadas**
- ✅ **Estado de autenticación consistente**

---

## 🚀 MÉTODO 1: Pantalla de Debug (Recomendado)

### **Acceso Rápido**
```
1. Abrir la app
2. Navegar a: /debug-auth
3. Ver toda la información en tiempo real
```

### **Qué puedes ver:**

#### 📊 **Sección: Estado de Autenticación**
- ✅ Context isAuthenticated: `true/false`
- ✅ Service isAuthenticated: `true/false`  
- ✅ User ID: `uuid-del-usuario`
- ✅ User Email: `email@usuario.com`
- ✅ Gym ID: `uuid-del-gym`
- ✅ Roles: `user, owner`

#### 🔐 **Sección: Validación JWT**
- ✅ Token Válido: `✅/❌`
- ✅ Token Expirado: `✅/❌`
- ✅ Tiempo hasta Expiración: `15m 30s`
- ✅ Usuario en Token: `uuid-del-usuario`
- ✅ Email en Token: `email@usuario.com`
- ✅ Fecha Emisión: `15/09/2025 10:30:45`
- ✅ Fecha Expiración: `15/09/2025 11:30:45`
- ✅ Consistencia Service vs JWT: `✅/❌`

#### 🌍 **Sección: Variables de Entorno**
- ✅ Ambiente Actual: `local/development/production`
- ✅ NODE_ENV: `local`
- ✅ EXPO_PUBLIC_ENV: `local`
- ✅ Configuración Válida: `✅/❌`
- ✅ Variables Requeridas Faltantes: `0`
- ✅ Archivo .env Correcto: `✅/❌`
- ✅ Total Variables EXPO_PUBLIC_*: `5`

#### 💾 **Sección: Storage AsyncStorage**
- ✅ @auth_token: `eyJhbGciOi...✅ Presente`
- ✅ @refresh_token: `eyJhbGciOi...✅ Presente`
- ✅ @user_data: `✅ Presente`

### **Acciones de Testing Disponibles:**
- 🧪 **Test Refresh Token** - Prueba renovación de token
- ⏰ **Simular Token Expirado** - Marca token como expirado
- 🧹 **Limpiar Auth y Ir a Login** - Reset completo

---

## 🖥️ MÉTODO 2: Consola del Navegador (Web)

### **Funciones Globales Disponibles:**

#### **Para JWT:**
```javascript
// Validar JWT completo
await jwtValidation.validateStoredJWT()

// Generar reporte completo
await jwtValidation.generateAuthReport()

// Verificar consistencia
await jwtValidation.validateAuthServiceConsistency()
```

#### **Para Variables de Entorno:**
```javascript
// Validar ambiente actual
envValidation.validateCurrentEnvironment()

// Generar reporte completo
envValidation.generateEnvironmentReport()

// Ver todas las variables EXPO_PUBLIC_*
envValidation.getAllExpoPublicVars()

// Verificar archivo .env correcto
await envValidation.validateEnvFileUsage()
```

#### **Para Testing de Tokens:**
```javascript
// Ver estado actual
await tokenTest.checkTokenStatus()

// Simular token expirado
await tokenTest.simulateExpiredToken()

// Probar refresh manual
await tokenTest.testRefreshToken()

// Limpiar todo
await tokenTest.clearAuthData()
```

---

## 📱 MÉTODO 3: Logs en Consola (Móvil/Web)

### **Activar Logging Detallado:**

1. **Abrir consola de Metro (Terminal)**
2. **Buscar logs con prefijos:**
   - `🔍 JWT:` - Validaciones de token
   - `🌍 ENV:` - Variables de entorno
   - `🔐 AUTH:` - Estado de autenticación

### **Comandos para Forzar Logs:**
```javascript
// En el código, agregar temporalmente:
import { logger } from '@/utils/logger';

// Forzar reporte completo
await jwtValidationUtils.generateAuthReport();
await environmentValidationUtils.generateEnvironmentReport();
```

---

## 🧪 VALIDACIONES ESPECÍFICAS DEL PLAN DE TESTING

### **Test 1: JWT Generado Correctamente**

#### ✅ **Criterios de Éxito:**
```
✓ Token existe en AsyncStorage (@auth_token)
✓ Token tiene estructura válida (3 partes separadas por .)
✓ Payload contiene: sub, email, exp, iat
✓ Token no está expirado (exp > now)
✓ Datos en token coinciden con AuthService
```

#### 🚨 **Señales de Falla:**
```
❌ Token no encontrado en AsyncStorage
❌ Token malformado o no decodificable
❌ Token expirado (exp <= now)
❌ ID de usuario inconsistente entre JWT y AuthService
❌ Email inconsistente entre JWT y AuthService
❌ AuthService dice autenticado pero JWT inválido
```

#### 🔧 **Cómo Verificar:**
1. **Método Visual (Pantalla Debug):** 
   - JWT Validación → Token Válido: `✅`
   - JWT Validación → Consistencia Service vs JWT: `✅`

2. **Método Programático:**
   ```javascript
   const result = await jwtValidation.validateStoredJWT();
   console.log('Token válido:', result.isValid);
   console.log('Errores:', result.errors);
   ```

### **Test 2: Variables de Entorno Seteadas**

#### ✅ **Variables Requeridas por Ambiente:**

**Local:**
```
✓ EXPO_PUBLIC_API_BASE_URL (debe ser URL válida)
✓ EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY (no vacío)
✓ EXPO_PUBLIC_ENV (debe ser "local")
```

**Development:**
```
✓ EXPO_PUBLIC_API_BASE_URL (debe ser HTTPS)
✓ EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY (no vacío)  
✓ EXPO_PUBLIC_ENV (debe ser "development")
```

**Production:**
```
✓ EXPO_PUBLIC_API_BASE_URL (debe ser HTTPS)
✓ EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY (no vacío)
✓ EXPO_PUBLIC_ENV (debe ser "production")
```

#### 🚨 **Señales de Falla:**
```
❌ Variable requerida faltante o vacía
❌ EXPO_PUBLIC_ENV no coincide con NODE_ENV
❌ API_BASE_URL no es una URL válida
❌ Archivo .env incorrecto para el ambiente
❌ Variables en process.env ≠ variables en Environment object
```

#### 🔧 **Cómo Verificar:**
1. **Método Visual (Pantalla Debug):**
   - Variables de Entorno → Configuración Válida: `✅`
   - Variables de Entorno → Variables Requeridas Faltantes: `0`

2. **Método Programático:**
   ```javascript
   const result = envValidation.validateCurrentEnvironment();
   console.log('Config válida:', result.isValid);
   console.log('Faltantes:', result.missingRequired);
   ```

---

## 🔄 FLUJO DE TESTING PASO A PASO

### **Flujo Completo de Validación:**

#### **Paso 1: Preparación**
```bash
# Iniciar en ambiente correcto
npm run start:local  # o :dev, :prod
```

#### **Paso 2: Validación Inicial (Pre-Login)**
1. Ir a `/debug-auth`
2. Verificar:
   - ✅ Variables de Entorno → Configuración Válida
   - ✅ Archivo .env Correcto
   - ❌ Estado Autenticación → Context isAuthenticated: `false`

#### **Paso 3: Realizar Login**
1. Ir a `/login`
2. Hacer login con credenciales válidas
3. Verificar redirección exitosa

#### **Paso 4: Validación Post-Login**
1. Regresar a `/debug-auth` 
2. Pulsar **Refresh** para actualizar datos
3. Verificar:
   - ✅ Estado Autenticación → Context isAuthenticated: `true`
   - ✅ JWT Validación → Token Válido: `✅`
   - ✅ JWT Validación → Token Expirado: `❌` (no expirado)
   - ✅ JWT Validación → Consistencia Service vs JWT: `✅`
   - ✅ Storage AsyncStorage → @auth_token: `✅ Presente`

#### **Paso 5: Validación de Expiración**
1. Pulsar **"⏰ Simular Token Expirado"**
2. Pulsar **Refresh**
3. Verificar:
   - ❌ JWT Validación → Token Expirado: `✅` (sí expirado)
   - ❌ JWT Validación → Token Válido: `❌`

#### **Paso 6: Validación de Refresh**
1. Pulsar **"🧪 Test Refresh Token"**
2. Verificar mensaje de éxito
3. Pulsar **Refresh**
4. Verificar:
   - ✅ JWT Validación → Token Válido: `✅`
   - ✅ JWT Validación → Token Expirado: `❌`

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### **Problema 1: Variables no cargan**
```
Síntoma: Variables de Entorno → Configuración Válida: ❌
Solución: 
1. Verificar que existe .env.local (o .env.development, etc.)
2. Ejecutar: node env-loader.js
3. Reiniciar Metro: npm run clean && npm run start:local
```

### **Problema 2: JWT inválido después de login**
```
Síntoma: JWT Validación → Token Válido: ❌
Posibles causas:
- Backend devolvió token malformado
- Problemas de red durante login
- Error en guardado en AsyncStorage

Solución:
1. Limpiar auth: Pulsar "🧹 Limpiar Auth y Ir a Login"
2. Hacer login nuevamente
3. Verificar logs de consola para errores
```

### **Problema 3: Inconsistencia Service vs JWT**
```
Síntoma: Consistencia Service vs JWT: ❌
Posibles causas:
- AuthService no se actualizó después del login
- Datos corruptos en AsyncStorage
- Error en sincronización

Solución:
1. Forzar refresh del AuthService
2. Si persiste: limpiar auth completamente
```

### **Problema 4: Token expira muy rápido**
```
Síntoma: Tiempo hasta Expiración: < 5 minutos
Posibles causas:
- Configuración del backend incorrecta
- Ambiente de testing con tokens cortos

Solución:
1. Verificar configuración del backend
2. Usar refresh token automático
3. Probar "🧪 Test Refresh Token"
```

---

## 📋 CHECKLIST DE VALIDACIÓN RÁPIDA

### **✅ Pre-Login (Variables de Entorno):**
- [ ] Configuración Válida: `✅`
- [ ] NODE_ENV coincide con EXPO_PUBLIC_ENV
- [ ] API_BASE_URL es URL válida
- [ ] Variables requeridas: 0 faltantes
- [ ] Archivo .env correcto para ambiente

### **✅ Post-Login (JWT y Auth):**
- [ ] Context isAuthenticated: `true`
- [ ] Service isAuthenticated: `true`  
- [ ] Token Válido: `✅`
- [ ] Token Expirado: `❌` (no expirado)
- [ ] Consistencia Service vs JWT: `✅`
- [ ] Usuario ID presente en JWT y AuthService
- [ ] Email presente en JWT y AuthService
- [ ] @auth_token presente en AsyncStorage
- [ ] @refresh_token presente en AsyncStorage

### **✅ Funcionalidad de Refresh:**
- [ ] Test Refresh Token funciona
- [ ] Token se renueva automáticamente cerca de expiración
- [ ] Refresh token válido y no expirado

---

## 🎯 CASOS DE USO ESPECÍFICOS

### **Para QA Manual:**
1. Usar **Pantalla Debug** principalmente
2. Seguir **Flujo de Testing Paso a Paso**
3. Documentar screenshots de cada sección

### **Para Desarrollo:**
1. Usar **Consola del Navegador** para debugging rápido
2. Activar logs detallados en código
3. Usar funciones globales para testing específico

### **Para Testing Automatizado:**
1. Importar utilidades en tests:
   ```javascript
   import { jwtValidationUtils } from '@/utils/jwtValidationUtils';
   import { environmentValidationUtils } from '@/utils/environmentValidationUtils';
   ```
2. Usar métodos de validación en assertions
3. Generar reportes programáticamente

---

## 📞 CONTACTO Y ESCALACIÓN

**Si encuentras problemas con estas validaciones:**

1. **Capturar evidencia:**
   - Screenshot de pantalla debug
   - Logs de consola relevantes
   - Configuración de variables actual

2. **Información requerida:**
   - Ambiente usado (local/dev/prod)
   - Pasos exactos para reproducir
   - Resultado esperado vs obtenido

3. **Escalación inmediata si:**
   - Variables críticas faltantes en producción
   - JWT consistentemente inválido
   - Refresh token no funciona
   - Auth state inconsistente después de login

---

*Documento generado como parte del Plan de Testing Integral - Gymmetry v1.0.0*