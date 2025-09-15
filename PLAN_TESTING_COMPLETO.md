# 🧪 Plan de Testing Integral - Gymmetry App

> **Fecha de Creación:** 15 de septiembre de 2025  
> **Versión:** 1.0.0  
> **Aplicación:** React Native + Expo Router con backend .NET 9 + Azure Functions

## 📋 Resumen Ejecutivo

Esta aplicación es una **plataforma integral de gestión de gimnasios** que incluye:
- Sistema de gestión para propietarios de gimnasios
- App móvil/web para usuarios finales (clientes del gimnasio)
- Sistema de rutinas, ejercicios y seguimiento de progreso
- Red social fitness con posts, comentarios y likes
- Sistema de pagos y suscripciones
- Gestión de empleados y ocupación en tiempo real

### 🎯 Objetivos del Testing

1. **Funcionalidad Core:** Verificar todas las funciones críticas del negocio
2. **Experiencia de Usuario:** Garantizar flujos intuitivos y sin fricciones
3. **Rendimiento:** Asegurar tiempos de respuesta aceptables
4. **Seguridad:** Validar protección de datos y autorización
5. **Compatibilidad:** Funcionamiento en iOS, Android y Web
6. **Estabilidad:** Identificar crashes y errores de funcionamiento

---

## 🚀 FASE 1: CONFIGURACIÓN Y AMBIENTE (CRÍTICO)

### 1.1 Configuración de Entornos

#### ✅ **Tests de Configuración Básica**

**Escenarios a probar:**

1. **Inicialización del Proyecto**
   ```bash
   # Test 1: Ambiente Local
   npm run start:local
   # Verificar: Carga correcta de .env.local
   # Verificar: Variables EXPO_PUBLIC_* disponibles
   # Verificar: Metro bundler inicia sin errores
   
   # Test 2: Ambiente Development
   npm run start:dev
   # Verificar: Carga correcta de .env.development
   # Verificar: URLs de API apuntan a desarrollo
   
   # Test 3: Ambiente Production
   npm run start:prod
   # Verificar: Carga correcta de .env.production
   # Verificar: URLs de API apuntan a producción
   ```

2. **Validación de Variables de Entorno**
   - [ ] `EXPO_PUBLIC_API_BASE_URL` cargada correctamente
   - [ ] `EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY` presente
   - [ ] `EXPO_PUBLIC_ENV` coincide con ambiente esperado
   - [ ] Variables Azure Functions configuradas

3. **Compatibilidad de Plataformas**
   ```bash
   # iOS
   npm run ios:local
   
   # Android
   npm run android:local
   
   # Web
   npm run web:local
   ```

**⚠️ Puntos Críticos:**
- **env-loader.js:** Verificar que copia el archivo .env correcto
- **TypeScript:** Ejecutar `npm run type-check` sin errores
- **Metro Config:** Bundling sin warnings críticos

---

## 🔐 FASE 2: AUTENTICACIÓN Y AUTORIZACIÓN (ALTA PRIORIDAD)

### 2.1 Sistema de Login

#### **Escenarios de Login Exitoso**

1. **Login con Email**
   - **Input:** `usuario@test.com` + `password123`
   - **Verificar:** Token JWT almacenado correctamente
   - **Verificar:** Redirección a pantalla principal (tabs)
   - **Verificar:** UserData en AuthContext actualizado

2. **Login con Username**
   - **Input:** `testuser` + `password123`
   - **Verificar:** Mismo comportamiento que email

3. **Persistencia de Sesión**
   - **Test:** Cerrar app completamente y reabrir
   - **Verificar:** Usuario permanece autenticado
   - **Verificar:** No requiere login nuevamente

#### **Escenarios de Error en Login**

4. **Credenciales Incorrectas**
   - **Input:** Email válido + password incorrecto
   - **Verificar:** Mensaje de error claro
   - **Verificar:** No redirección
   - **Verificar:** Campos se mantienen (excepto password)

5. **Formato de Email Inválido**
   - **Input:** `email_invalido` + password válido
   - **Verificar:** Validación frontend
   - **Verificar:** Error antes de enviar request

6. **Campos Vacíos**
   - **Input:** Campos vacíos o solo espacios
   - **Verificar:** Validación requerida
   - **Verificar:** Foco en primer campo vacío

#### **Conectividad y Timeouts**

7. **Sin Conexión a Internet**
   - **Test:** Desactivar WiFi/datos móviles
   - **Verificar:** Mensaje de error de conectividad
   - **Verificar:** Reintento automático o manual

8. **Timeout del Servidor**
   - **Test:** Simular respuesta lenta (>10s)
   - **Verificar:** Loading spinner adecuado
   - **Verificar:** Timeout manejado gracefully

### 2.2 Sistema de Registro

#### **Registro Exitoso**

9. **Registro Usuario Completo**
   - **Campos:** Email, Username, Password, Confirmar Password, País
   - **Verificar:** Validaciones de formato en tiempo real
   - **Verificar:** Registro exitoso y auto-login
   - **Verificar:** Redirección a onboarding/configuración inicial

#### **Validaciones de Registro**

10. **Password Strength**
   - **Test:** Passwords débiles (123, abc, etc.)
   - **Verificar:** Indicador de fortaleza
   - **Verificar:** Requisitos mínimos mostrados

11. **Email Duplicado**
   - **Test:** Intentar registrar email existente
   - **Verificar:** Error específico sobre duplicado
   - **Verificar:** Sugerencia de recuperar cuenta

12. **Username Duplicado**
   - **Test:** Username ya en uso
   - **Verificar:** Verificación en tiempo real
   - **Verificar:** Sugerencias alternativas

### 2.3 Gestión de Tokens

13. **Refresh Token Automático**
   - **Test:** Esperar expiración de token (o simular)
   - **Verificar:** Renovación automática transparente
   - **Verificar:** Continuidad de sesión

14. **Logout**
   - **Test:** Cerrar sesión desde perfil
   - **Verificar:** Token eliminado de storage
   - **Verificar:** Redirección a login
   - **Verificar:** Limpiar cache/datos sensibles

---

## 🏋️‍♂️ FASE 3: FUNCIONALIDADES CORE DEL GIMNASIO (CRÍTICO)

### 3.1 Gestión de Rutinas

#### **Creación de Rutinas**

15. **Crear Rutina desde Template**
   - **Test:** Seleccionar template predefinido
   - **Verificar:** Ejercicios cargados correctamente
   - **Verificar:** Personalización permitida (sets, reps, peso)
   - **Verificar:** Guardado en AsyncStorage local

16. **Rutina Personalizada**
   - **Test:** Crear rutina completamente desde cero
   - **Verificar:** Búsqueda de ejercicios funcional
   - **Verificar:** Filtros por categoría, músculo, equipo
   - **Verificar:** Reordenamiento de ejercicios

#### **Ejecución de Rutinas**

17. **Flujo Completo de Entrenamiento**
   ```
   Pasos del Test:
   1. Iniciar rutina desde home
   2. Completar primer ejercicio (todos los sets)
   3. Usar temporizador de descanso
   4. Completar segundo ejercicio
   5. Finalizar rutina completa
   
   Verificaciones:
   ✓ Timer funciona correctamente
   ✓ Progreso se guarda en cada set
   ✓ Notificaciones de descanso
   ✓ Datos persisten si se cierra app
   ✓ Al finalizar: se crea Daily y DailyExercise
   ```

18. **Temporizador de Ejercicios**
   - **Test:** Ejercicios con tiempo (ej: "30s plancha")
   - **Verificar:** Countdown visual claro
   - **Verificar:** Alertas sonoras/vibración
   - **Verificar:** Pausa/resume funcional

19. **Ejercicios "Por Lado"**
   - **Test:** Ejercicio tipo "30s por lado"
   - **Verificar:** Doble timer (lado derecho/izquierdo)
   - **Verificar:** Fase "PREPÁRATE" entre lados
   - **Verificar:** Total de tiempo correcto

#### **Interrupciones y Recuperación**

20. **Rutina Interrumpida**
   - **Test:** Iniciar rutina, cerrar app a la mitad
   - **Verificar:** Al reabrir, opción de continuar
   - **Verificar:** Progreso exacto restaurado
   - **Verificar:** Timer desde donde se quedó

21. **Cambio de Ejercicio Mid-Set**
   - **Test:** Cambiar ejercicio durante ejecución
   - **Verificar:** Confirmación requerida
   - **Verificar:** Progreso anterior guardado
   - **Verificar:** Nuevo ejercicio inicia limpio

### 3.2 Seguimiento de Progreso

22. **Historial de Entrenamientos**
   - **Test:** Completar varias rutinas en días diferentes
   - **Verificar:** Listado cronológico correcto
   - **Verificar:** Filtros por fecha/tipo de rutina
   - **Verificar:** Detalles de cada sesión

23. **Estadísticas Personales**
   - **Test:** Verificar gráficos de progreso
   - **Verificar:** Peso máximo por ejercicio
   - **Verificar:** Consistencia/racha de entrenamientos
   - **Verificar:** Tiempo total de entrenamiento

### 3.3 Ejercicios y Catálogo

24. **Búsqueda de Ejercicios**
   - **Test:** Buscar por nombre: "flexiones"
   - **Verificar:** Resultados relevantes
   - **Verificar:** Búsqueda tolerante a typos
   - **Verificar:** Filtros combinados (músculo + equipo)

25. **Detalles de Ejercicio**
   - **Test:** Abrir ejercicio individual
   - **Verificar:** Descripción clara
   - **Verificar:** Imágenes/videos si disponible
   - **Verificar:** Músculos trabajados
   - **Verificar:** Equipo requerido

---

## 📱 FASE 4: RED SOCIAL Y COMUNIDAD (MEDIA PRIORIDAD)

### 4.1 Feed Social

26. **Visualización del Feed**
   - **Test:** Abrir tab de Feed
   - **Verificar:** Posts cargan en orden cronológico
   - **Verificar:** Lazy loading funcional
   - **Verificar:** Pull-to-refresh actualiza

27. **Crear Post**
   - **Test:** Crear post con texto e imagen
   - **Verificar:** Selección de imagen funcional
   - **Verificar:** Preview antes de publicar
   - **Verificar:** Post aparece en feed inmediatamente

28. **Interacciones Sociales**
   - **Test:** Like, comment en posts
   - **Verificar:** Contador actualiza en tiempo real
   - **Verificar:** Comentarios se ordenan correctamente
   - **Verificar:** Notificaciones de interacciones

### 4.2 Comentarios

29. **Sistema de Comentarios**
   - **Test:** Comentar en varios posts
   - **Verificar:** Comentarios anidados si aplica
   - **Verificar:** Editar/eliminar comentarios propios
   - **Verificar:** Reportar comentarios inapropiados

---

## 💳 FASE 5: SISTEMA DE PAGOS (ALTA PRIORIDAD)

### 5.1 Suscripciones y Planes

30. **Visualizar Planes Disponibles**
   - **Test:** Navegar a sección de planes
   - **Verificar:** Precios mostrados correctamente
   - **Verificar:** Características de cada plan claras
   - **Verificar:** Plan actual marcado

31. **Proceso de Suscripción**
   - **Test:** Seleccionar plan premium
   - **Verificar:** Integración MercadoPago funcional
   - **Verificar:** Confirmación de pago clara
   - **Verificar:** Actualización inmediata de beneficios

32. **Historial de Pagos**
   - **Test:** Ver facturas y pagos anteriores
   - **Verificar:** Estados correctos (pagado, pendiente, fallido)
   - **Verificar:** Descarga de comprobantes

---

## 🏢 FASE 6: GESTIÓN DE GIMNASIO (PARA OWNERS)

### 6.1 Panel de Administración

33. **Dashboard de Gimnasio**
   - **Test:** Login como owner de gimnasio
   - **Verificar:** Métricas de ocupación actual
   - **Verificar:** Estadísticas de miembros
   - **Verificar:** Ingresos del mes

34. **Gestión de Empleados**
   - **Test:** Añadir/editar/eliminar empleados
   - **Verificar:** Asignación de permisos
   - **Verificar:** Horarios de trabajo
   - **Verificar:** Registro de asistencia

35. **Gestión de Sucursales**
   - **Test:** Crear nueva sucursal
   - **Verificar:** Configuración de equipos/máquinas
   - **Verificar:** Horarios de operación
   - **Verificar:** Capacidad máxima

---

## 📊 FASE 7: RENDIMIENTO Y UX (CRÍTICO)

### 7.1 Performance Testing

36. **Tiempos de Carga**
   - **Métrica:** Login < 3 segundos
   - **Métrica:** Carga de rutinas < 2 segundos
   - **Métrica:** Feed scroll fluido (60fps)
   - **Métrica:** Búsqueda ejercicios < 1 segundo

37. **Consumo de Memoria**
   - **Test:** Usar app durante 30 minutos continuos
   - **Verificar:** Sin memory leaks evidentes
   - **Verificar:** App no se cierra por memoria
   - **Verificar:** Transiciones suaves entre pantallas

38. **Uso de Batería**
   - **Test:** Entrenamiento completo (45-60 min)
   - **Verificar:** Consumo de batería razonable
   - **Verificar:** App no se calienta excesivamente

### 7.2 Experiencia de Usuario

39. **Navegación Intuitiva**
   - **Test:** Usuario nuevo sin instrucciones
   - **Verificar:** Puede completar tareas básicas
   - **Verificar:** Flujos no requieren más de 3 taps
   - **Verificar:** Breadcrumbs y back buttons claros

40. **Estados de Loading**
   - **Test:** Todas las pantallas con datos remotos
   - **Verificar:** Spinners/skeletons apropiados
   - **Verificar:** Timeouts manejados con elegancia
   - **Verificar:** Retry mechanism disponible

41. **Manejo de Errores**
   - **Test:** Simular errores de red
   - **Verificar:** Mensajes de error comprensibles
   - **Verificar:** No crashes por errores manejables
   - **Verificar:** Recovery paths claros

---

## 📱 FASE 8: COMPATIBILIDAD MULTIPLATAFORMA

### 8.1 iOS Testing

42. **Funcionalidades iOS**
   - **Test:** Face ID/Touch ID si implementado
   - **Verificar:** Notificaciones push
   - **Verificar:** Background app refresh
   - **Verificar:** Safe area handling

43. **Dispositivos iOS**
   - **Test:** iPhone SE (pantalla pequeña)
   - **Test:** iPhone Pro Max (pantalla grande)
   - **Test:** iPad (orientación tablet)

### 8.2 Android Testing

44. **Funcionalidades Android**
   - **Test:** Biometric authentication
   - **Verificar:** Android back button behavior
   - **Verificar:** Deep links desde notifications
   - **Verificar:** App permissions

45. **Dispositivos Android**
   - **Test:** Android 8+ (API 26+)
   - **Test:** Diferentes tamaños de pantalla
   - **Test:** Diferentes densidades de pixel

### 8.3 Web Testing

46. **Funcionalidades Web**
   - **Test:** Responsive design
   - **Verificar:** Keyboard navigation
   - **Verificar:** Browser compatibility (Chrome, Firefox, Safari)
   - **Verificar:** PWA installation

---

## 🔒 FASE 9: SEGURIDAD Y PRIVACIDAD

### 9.1 Autenticación y Autorización

47. **Token Security**
   - **Test:** Tokens expiran apropiadamente
   - **Verificar:** Refresh tokens seguros
   - **Verificar:** No tokens en logs
   - **Verificar:** HTTPS obligado en producción

48. **Permisos y Roles**
   - **Test:** Usuario normal no puede acceder a admin
   - **Test:** Owner no puede ver datos de otros gyms
   - **Verificar:** API respeta permisos backend

### 9.2 Protección de Datos

49. **Datos Sensibles**
   - **Test:** Passwords nunca visibles en logs
   - **Verificar:** Data encryption en AsyncStorage
   - **Verificar:** No data leaks en screenshots
   - **Verificar:** Logout limpia datos locales

50. **Input Sanitization**
   - **Test:** Inyección de scripts en comentarios
   - **Test:** Caracteres especiales en nombres
   - **Verificar:** Validación frontend y backend

---

## 🌐 FASE 10: CONECTIVIDAD Y OFFLINE

### 10.1 Funcionamiento Offline

51. **Cache de Datos**
   - **Test:** Usar app sin internet
   - **Verificar:** Rutinas guardadas accesibles
   - **Verificar:** Historial de entrenamientos visible
   - **Verificar:** Sincronización al reconectar

52. **Sincronización**
   - **Test:** Completar entrenamiento offline
   - **Verificar:** Datos se suben al reconectar
   - **Verificar:** Conflictos de sincronización manejados
   - **Verificar:** Usuario informado del estado sync

### 10.2 Conectividad Intermitente

53. **Red Inestable**
   - **Test:** Simular pérdida de conexión intermitente
   - **Verificar:** Retry automático
   - **Verificar:** Queue de requests pendientes
   - **Verificar:** Feedback visual del estado

---

## 🧪 FASE 11: TESTING TÉCNICO Y AUTOMATIZACIÓN

### 11.1 Unit Tests

54. **Ejecutar Test Suite**
   ```bash
   npm run test:coverage
   ```
   - **Verificar:** Coverage > 80% en utils críticos
   - **Verificar:** Todos los tests pasan
   - **Verificar:** No tests flaky

55. **Servicios API**
   - **Test:** Mock responses en tests
   - **Verificar:** Error handling en servicios
   - **Verificar:** Request/response format validation

### 11.2 Integration Tests

56. **Flujos E2E Críticos**
   - **Test:** Login → Rutina → Finalizar entrenamiento
   - **Test:** Registro → Configuración inicial → Primer uso
   - **Test:** Crear post → Ver en feed → Interacciones

---

## 📈 FASE 12: MÉTRICAS Y MONITOREO

### 12.1 Analytics y Tracking

57. **User Journey Tracking**
   - **Test:** Eventos se registran correctamente
   - **Verificar:** Funnel de conversión completo
   - **Verificar:** Retention tracking funcional

58. **Crash Reporting**
   - **Test:** Simular crashes controlados
   - **Verificar:** Reports llegan a servicio
   - **Verificar:** Stack traces útiles

---

## 🚨 ESCENARIOS DE STRESS Y EDGE CASES

### 12.2 Casos Extremos

59. **Datos Masivos**
   - **Test:** Usuario con 1000+ entrenamientos
   - **Test:** Gym con 500+ miembros
   - **Verificar:** Performance no se degrada
   - **Verificar:** Paginación efectiva

60. **Interrupciones del Sistema**
   - **Test:** Llamada telefónica durante entrenamiento
   - **Test:** Notificación sistema durante timer
   - **Test:** App enviado a background durante sync
   - **Verificar:** Recovery graceful en todos los casos

61. **Límites de API**
   - **Test:** Rate limiting del backend
   - **Test:** Quota exceeded scenarios
   - **Verificar:** Error messages apropiados
   - **Verificar:** Fallback behaviors

---

## 📋 CHECKLIST FINAL DE RELEASE

### ✅ Pre-Launch Validation

- [ ] **Configuración**
  - [ ] Todas las variables de entorno configuradas
  - [ ] URLs apuntan a producción
  - [ ] Keys y certificados válidos

- [ ] **Funcionalidad Core**
  - [ ] Login/Logout funcionan perfectamente
  - [ ] Rutinas se completan sin errores
  - [ ] Pagos procesan correctamente
  - [ ] Feed social responsive

- [ ] **Performance**
  - [ ] Tiempo de inicio < 3 segundos
  - [ ] Navegación fluida entre pantallas
  - [ ] Sin memory leaks detectados
  - [ ] Batería uso aceptable

- [ ] **Seguridad**
  - [ ] No datos sensibles en logs
  - [ ] Tokens manejados securely
  - [ ] Validaciones input completas

- [ ] **Compatibilidad**
  - [ ] iOS funcionando en dispositivos objetivo
  - [ ] Android funcionando en dispositivos objetivo
  - [ ] Web responsive en browsers principales

- [ ] **Contenido**
  - [ ] Textos en español completos
  - [ ] Imágenes y assets optimizados
  - [ ] Links y referencias actualizadas

---

## 🛠️ HERRAMIENTAS DE TESTING RECOMENDADAS

### **Manual Testing**
- **Device Farm:** Para testing en múltiples dispositivos
- **Network Condition Simulator:** Para testing de conectividad
- **Performance Profiler:** Para análisis de rendimiento

### **Automated Testing**
- **Jest:** Unit tests (ya configurado)
- **Detox:** E2E testing para React Native
- **Maestro:** Alternative para E2E mobile testing

### **Monitoring & Analytics**
- **Sentry:** Error tracking y performance monitoring
- **Firebase Analytics:** User behavior tracking
- **New Relic:** APM para backend APIs

---

## 📞 INFORMACIÓN DE CONTACTO Y ESCALACIÓN

### **Reportar Bugs**
1. **Captura de pantalla** del error
2. **Pasos exactos** para reproducir
3. **Dispositivo y OS version**
4. **Timestamp** cuando ocurrió
5. **Logs de consola** si disponible

### **Clasificación de Severidad**

- **🚨 Crítico:** App crash, data loss, imposible usar
- **⚠️ Alto:** Funcionalidad principal no funciona
- **📝 Medio:** Features secundarias con problemas
- **💡 Bajo:** Mejoras de UX, typos, sugerencias

### **Tiempo de Respuesta Esperado**
- **Crítico:** Inmediato (< 2 horas)
- **Alto:** Mismo día (< 8 horas)
- **Medio:** 2-3 días hábiles
- **Bajo:** Próximo sprint/release

---

## 🎯 CONCLUSIÓN

Este plan de testing cubre **todos los aspectos críticos** de la aplicación Gymmetry, desde funcionalidades básicas hasta casos edge complejos. La ejecución sistemática de estos tests garantizará:

1. **Calidad del producto** antes del lanzamiento
2. **Experiencia de usuario** óptima y consistente  
3. **Estabilidad** en producción
4. **Confianza** para escalado futuro

**Recomendación:** Ejecutar las fases en orden, priorizando **FASES 1-3** como bloqueantes antes de cualquier release.

---

*Documento generado automáticamente basado en análisis profundo del código fuente - Gymmetry v1.0.0*