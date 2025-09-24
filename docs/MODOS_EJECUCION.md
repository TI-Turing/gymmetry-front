# 🚀 Modos de Ejecución de la App

## 📋 Scripts Disponibles

### Desarrollo Normal
```bash
# Modo local (desarrollo personal)
npm run start:local
# Variable: EXPO_PUBLIC_TESTING_MODE=false

# Modo desarrollo (entorno dev)
npm run start:dev
# Variable: EXPO_PUBLIC_TESTING_MODE=false

# Modo producción
npm run start:prod
# Variable: EXPO_PUBLIC_TESTING_MODE=false
```

### Testing y Depuración
```bash
# Solo para testing con herramientas de depuración
npm run test:framework
# Variable: EXPO_PUBLIC_TESTING_MODE=true
# Muestra: Botón flotante de herramientas de testing

# Testing manual (alias del anterior)
npm run test:manual
```

## 🔧 Variables de Entorno por Modo

### `.env.local` (Desarrollo Personal)
- `EXPO_PUBLIC_TESTING_MODE=false` ❌ No herramientas de testing
- `EXPO_PUBLIC_DEBUG=true` ✅ Logs de depuración
- APIs locales en IP 192.168.0.12:7160

### `.env.development` (Entorno Dev)
- `EXPO_PUBLIC_TESTING_MODE=false` ❌ No herramientas de testing  
- `EXPO_PUBLIC_DEBUG=true` ✅ Logs de depuración
- APIs de desarrollo

### `.env.production` (Producción)
- `EXPO_PUBLIC_TESTING_MODE=false` ❌ No herramientas de testing
- `EXPO_PUBLIC_DEBUG=false` ❌ Sin logs de depuración
- APIs de producción

## 🎯 ¿Cuándo Usar Cada Modo?

### ✅ Uso Normal de Desarrollo
```bash
npm run start:local
```
- Para desarrollo diario
- Sin botón flotante de testing
- Con logs de depuración

### 🔬 Solo Para Testing de Framework
```bash
npm run test:framework
```
- Para probar herramientas de testing
- Para validar comportamiento del framework
- Muestra botón flotante con herramientas

## ⚠️ Problema Común

Si ves el botón flotante de testing en modo normal:
1. Verificar que `.env.local` tenga `EXPO_PUBLIC_TESTING_MODE=false`
2. Regenerar `.env` con: `node env-loader.js`
3. Reiniciar la app

## 🔄 Cómo Cambiar de Modo

1. **Parar la app actual** (Ctrl+C)
2. **Ejecutar el script deseado**:
   - `npm run start:local` → Desarrollo normal
   - `npm run test:framework` → Con herramientas de testing
3. **Verificar en UI** si el botón flotante aparece según lo esperado