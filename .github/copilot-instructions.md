# 🤖 AI Agent Instructions for gymmetry-front

Conciso, accionable y específico al proyecto. Usa este documento como guía operativa.

## 🎯 INSTRUCCIONES GENERALES DEL PROYECTO

### 💰 Filosofía de Costos (CRÍTICO)

**Este es un emprendimiento personal sin apoyo financiero externo. SIEMPRE:**

1. **Evaluar costo antes de proponer cualquier herramienta/servicio nuevo**
   - Informar costo exacto (mensual/por uso)
   - Proporcionar alternativas gratuitas cuando existan
   - Justificar relación beneficio-costo
   - Priorizar soluciones $0 o <$10/mes inicialmente

2. **Para nuevos recursos Azure/externos:**
   - Especificar impacto económico detallado
   - Sugerir implementación por fases (gratis → económico → premium)
   - Considerar alternativas open-source o gratuitas
   - Solo recursos premium cuando la app genere ingresos

3. **Reglas de oro para decisiones técnicas:**
   - Si es gratis y funciona → Implementar inmediatamente
   - Si cuesta <$10/mes y agrega valor crítico → Evaluar con usuario
   - Si cuesta >$25/mes → Solo cuando genere ingresos
   - Siempre tener fallback gratuito disponible

### 🔄 Coordinación Frontend-Backend

**Trabajo colaborativo con copilot del backend (.NET 9 + Azure Functions):**

1. **Cuando requieras backend nuevo:**
   - Detener ejecución y generar prompt específico
   - Incluir entidad exacta con todos los campos
   - Especificar endpoints siguiendo patrón "Daily"
   - Siempre solicitar migración de BD
   - Mencionar integración con Redis y Azure Blob Storage

2. **Arquitectura del Backend (CRÍTICO):**
   - **Application Layer:** Todas las reglas de negocio, validaciones complejas, lógica pesada
   - **Repository Layer:** Consultas, mutaciones de datos, conexiones externas (emails, Azure services)
   - **Siempre solicitar** que la lógica de negocio vaya en Application Layer
   - **Ejemplos de Application Layer:** Validaciones de negocio, cálculos complejos, workflows, reglas de autorización
   - **Ejemplos de Repository Layer:** CRUD operations, queries optimizadas, integración con proveedores externos

3. **Comunicación estructurada:**
   - Backend maneja: Redis, Azure Blob Storage, SQL Database
   - Cada nueva entidad = migración de BD obligatoria
   - Seguir estándares de naming y validaciones existentes
   - Incluir logs de auditoría y manejo de errores
   - **Especificar qué lógica va en Application vs Repository**

### 📊 Seguimiento de Progreso

**Mantener actualizado el archivo PLAN_ACCION_RED_SOCIAL.md:**

1. **Sistema de porcentajes:**
   - Actualizar progreso de cada tarea (0%, 25%, 50%, 75%, 100%)
   - Usar emojis de estado: ✅ completado, 🔄 en proceso, ⏳ planificado
   - Recalcular progreso general del proyecto
   - Documentar hitos y bloqueadores

2. **Banderas de progreso requeridas:**
   - Estado actual de cada fase con porcentaje
   - Próximos hitos y dependencias
   - Fecha de última actualización
   - Notas de cambios significativos

### 🛡️ Seguridad y Calidad

**Estándares no negociables:**

1. **Seguridad siempre primero:**
   - Sanitizar todos los inputs de usuario
   - Implementar rate limiting en acciones críticas
   - Validar permisos y autenticación
   - No hardcodear secrets o keys

2. **Calidad del código:**
   - Componentes reutilizables y modulares
   - Manejo robusto de errores
   - Tests unitarios cuando sea posible
   - Documentación clara y concisa

### 🔧 Metodología de Trabajo

**Proceso estructurado para nuevas funcionalidades:**

1. **Análisis inicial:**
   - Evaluar si requiere backend nuevo
   - Identificar dependencias y recursos necesarios
   - Estimar costo e impacto técnico
   - Definir alternativas y plan B

2. **Implementación:**
   - Priorizar funcionalidad core sobre features avanzadas
   - Usar patrones existentes del proyecto
   - Implementar por iteraciones pequeñas
   - Validar cada paso antes de continuar

3. **Validación:**
   - Testing manual de flujos críticos
   - Verificar performance y UX
   - Documentar cambios y decisiones
   - Actualizar plan de acción con progreso

### 🏗️ Arquitectura y Escalabilidad

**Principios para una app robusta y profesional:**

1. **Separación de Responsabilidades:**
   - UI Components: Solo presentación y eventos de usuario
   - Business Logic: En hooks personalizados o servicios
   - Data Layer: Servicios API y manejo de estado
   - Utils: Funciones puras y helpers reutilizables

2. **Gestión de Estado Profesional:**
   - Context API solo para estado global crítico (auth, theme)
   - Local state con useState/useReducer para estado de componente
   - Cache inteligente con react-query o similar cuando sea necesario
   - Evitar prop drilling excesivo

3. **Performance y Optimización:**
   - React.memo para componentes que re-renderizan frecuentemente
   - useMemo/useCallback para cálculos costosos y funciones
   - Lazy loading para componentes pesados
   - Virtualización para listas largas (>100 items)
   - Image optimization y lazy loading
   - Code splitting por rutas principales

### 🔒 Seguridad Avanzada

**Más allá de sanitización básica:**

1. **Input Validation Robusta:**
   - Validación client-side Y server-side siempre
   - Schemas de validación con Yup o Zod
   - Rate limiting por IP y por usuario
   - CSRF protection en formularios críticos

2. **Data Protection:**
   - Nunca almacenar tokens en localStorage (usar secure cookies o keychain)
   - Encriptar datos sensibles en AsyncStorage
   - Limpiar datos sensibles al cerrar sesión
   - Timeout automático de sesiones

3. **API Security:**
   - Headers de seguridad apropiados
   - Validación de permisos en cada request
   - Logging de acciones sensibles
   - Manejo seguro de errores (no exponer stack traces)

### 🧪 Testing Strategy

**Para minimizar errores en producción:**

1. **Unit Tests:**
   - Utilities y helpers (100% coverage obligatorio)
   - Hooks personalizados con todas las ramas
   - Servicios API con mocks
   - Validaciones y transformaciones de datos

2. **Integration Tests:**
   - Flujos completos de usuario (login, crear post, etc.)
   - Navigation entre pantallas
   - Manejo de estados de error y loading
   - Offline behavior

3. **E2E Testing:**
   - Flujos críticos de negocio al menos
   - Compatibilidad iOS/Android/Web
   - Performance en dispositivos reales

### 📊 Monitoring y Observabilidad

**Para detectar problemas antes que los usuarios:**

1. **Error Tracking:**
   - Crash reporting (Sentry o similar - evaluar costo)
   - Error boundaries en componentes críticos
   - Logging estructurado con niveles
   - Performance monitoring

2. **Analytics y Métricas:**
   - User journey tracking
   - Performance metrics (load times, crashes)
   - Feature usage analytics
   - Conversion funnels

3. **Health Checks:**
   - API availability monitoring
   - Database connection health
   - Cache hit rates
   - Memory usage tracking

### 🔄 CI/CD y Deployment

**Para releases confiables:**

1. **Automated Pipeline:**
   - Lint/TypeScript check en cada PR
   - Unit tests obligatorios antes de merge
   - Automated build testing
   - Security vulnerability scanning

2. **Release Strategy:**
   - Semantic versioning estricto
   - Staging environment obligatorio
   - Rollback strategy definida
   - Feature flags para releases graduales

3. **Code Quality Gates:**
   - No merge sin code review
   - Coverage mínimo de tests (80%+)
   - Performance budgets
   - Bundle size limits

### 📱 User Experience Excellence

**App profesional requiere UX impecable:**

1. **Responsive Design:**
   - Support para todos los screen sizes
   - Orientación portrait/landscape
   - Safe area handling
   - Keyboard avoidance

2. **Accessibility (A11y):**
   - Screen reader support
   - High contrast mode
   - Font scaling support
   - Voice over navigation
   - Semantic HTML/components

3. **Progressive Enhancement:**
   - Offline capability básica
   - Graceful degradation sin conexión
   - Background sync cuando sea posible
   - Local-first approach

### 🚀 Production Readiness

**Checklist antes de cada release:**

1. **Performance Audit:**
   - Bundle size analysis
   - Memory leak detection
   - Battery usage optimization
   - Network request optimization

2. **Security Audit:**
   - Dependency vulnerability scan
   - API endpoint security review
   - Data encryption validation
   - Permission usage justification

3. **Compatibility Testing:**
   - iOS/Android version support
   - Device fragmentation testing
   - Network condition testing
   - Battery optimization validation

> Nota temporal — 25/08/2025
> Se relajaron las validaciones automáticas de lint/type-check/tests para acelerar entregas.
> Recordatorio: antes de cualquier release estable, volver a habilitar estas verificaciones y restaurar:
>
> - En la sección 2: líneas de "Type check" y "Lint/format".
> - En la sección 6: reemplazar el punto 6 por ejecución de lint/type-check/tests.
> - En la sección 10: reponer checks de TypeScript, lint/format y tests.

## 1. Panorama Arquitectónico

- App React Native + Expo Router (carpeta `app/`) con routing basado en archivos.
- Capa de presentación: componentes en `components/**` organizados por dominio (auth, plan, routineDay, gym, etc.).
- Capa de servicios HTTP en `services/` usando `apiService.ts` (Axios con interceptores, manejo de auth y funciones Azure).
- DTOs tipados en `dto/**`, modelos planos en `models/**` (generados a partir del backend .NET; no mutar nombres de campos).
- Config multi‑entorno en `environment/` + `env-loader.js`; variables expuestas como `EXPO_PUBLIC_*`.
- Patrón transversal: EntityList (listas CRUD homogéneas) en muchos dominios.
- Estado global mínimo: Auth (`contexts/AuthContext.tsx`), preferencias ligeras vía AsyncStorage/localStorage.
- Se maneja una carpeta de componentes, un servicio, una carpeta de Dto por cada modelo o entidad.
- Siempre evitar usar el Alert nativo, ya se tiene un componente llamado CustomAlert para todo lo relacionado a las alertas.

## 2. Flujos Clave de Desarrollo

- Iniciar dev: `npm run start:local` (carga `.env.local` vía `env-loader.js`).
- Cambiar entorno: usar scripts `start:dev`, `start:prod` (no cambies manualmente `.env`).
- Añadir nueva entidad: (1) modelo en `models/`, (2) DTOs request/response en `dto/<Entity>/`, (3) servicio en `services/<entity>Service.ts` exportado por `services/index.ts`, (4) lista/pantallas usando patrón EntityList si aplica.

## 3. Patrones y Convenciones Específicas

- Listas: centralizar lógica de carga/paginación/empty states siguiendo ejemplos en `components/*/*List.tsx` (e.g. `MachineList.tsx`). No reinventar layout.
- Servicios: métodos CRUD nombrados `add<Entity>`, `update<Entity>`, `delete<Entity>`, `get<Entity>ById`, `find<Entities>ByFields`; POST de búsquedas usa `/plural/find`. El metodo `find<Entities>ByFields` debe aceptar un objeto con los campos a buscar, se creo para poder filtrar por cualquier campo de esa entidad, en el body siempre debe ir el nombre del campo (iniciando con mayuscula) como llave y el valor de este como valor a filtrar, este siempre retornara un array de datos ya sea con uno o muchos valores.
- Respuesta API unificada: interfaz `ApiResponse<T>` con campos `{ Success, Message, Data, StatusCode }`. Siempre verificar `resp?.Success` antes de acceder a `Data`.
- Backends .NET pueden devolver arrays como objeto con `$values`; normalizar siempre si consumes colecciones.
- Helper sugerido para normalizar arrays:
  ```ts
  const normalizeArray = (raw: unknown): unknown[] => {
    const anyRaw = raw as any;
    if (Array.isArray(anyRaw)) return anyRaw;
    return anyRaw?.$values ?? [];
  };
  ```
- Almacén local: usar claves con prefijo claro (`exercise_<Id>_progress`, `@daily_start_<templateId>_<dayNumber>`). Preferir `AsyncStorage` nativo; para web detectar `window.localStorage`.
- Timer y ejercicios: lógica compleja en `components/routineDay/ExerciseModal.tsx` (fases on/off/prep, detección de tiempos tipo "30s", doble ciclo con "por lado/pierna/brazo"). Reutiliza helpers allí si amplías funcionalidad.
- Finalización de rutina: creación de Daily y DailyExercise solo tras acción explícita (ver `RoutineDayScreen.tsx`: efecto dependiente de `routineFinishedMode`). No dispares por llegar a 100% automáticamente.
- Colores: usar `Colors` (p.ej. `Colors.dark.tint`) en lugar de hardcoded #FF6B35 salvo que se esté migrando.

## 4. Integraciones Externas

- API principal + Azure Functions: base URLs y keys vienen de variables `EXPO_PUBLIC_*` cargadas al inicio.
- Autenticación: `authService.getUserData()` retorna objeto con `id`; token se inyecta en `apiService` (ver interceptores si necesitas headers nuevos).
- Multimedia: animaciones Lottie en `assets/animations/`; imágenes en `assets/images/`; no hardcodear rutas, usar imports estáticos.

## 5. Errores y Manejo Especial

- Siempre envolver llamadas a servicios en try/catch y degradar en UI con mensajes amigables (ver ejemplos de `RoutineDayScreen.tsx`).
- Arrays `$values`: util pattern:
  ```ts
  const raw = resp.Data as any;
  const items = Array.isArray(raw) ? raw : raw?.$values || [];
  ```
- Evitar warnings de React por actualizaciones en render: usar `setTimeout` diferido (ejemplo en `ExerciseModal.commitFinishSet`).

## 6. Añadir Nuevas Funciones

1. Identifica dominio existente o crea carpeta en `components/<dominio>/`.
2. Define modelo/DTO si es nuevo; respeta nombres exactos backend.
3. Crea servicio siguiendo naming y exporta en `services/index.ts`.
4. Implementa UI reutilizando patrones (EntityList, modales, botones `Button` propio, `ScreenWrapper`).
5. Persiste estado granular en AsyncStorage solo si se necesita reanudación.
6. (Temporal) Omite validaciones automáticas de lint/type-check/tests; enfócate en funcionalidad.
7. Traduce textos estáticos a través de `useI18n`.
8. Los estiulos nunca deben ir dentro del archivo del componente sino que en un archivo de estilos independientes. Cada carpeta de compoenentes debe tener una carpeta llamada styles donde se encuentren los archivos de estilos de los componentes que esten en esa carpeta. Maneja un archivo de estilos por componente.
9. Se deben manejar estilos para el modo oscuro y modo claro.
10. Se deben utilizar constantes para los textos estáticos en lugar de hardcodearlos.
11. Se deben utilizar hooks personalizados para lógica reutilizable.
12. Se deben utilizar componentes reutilizables para UI común.
13. En la carpeta components/ se deben organizar los componentes por dominio o entidad, las entidades estan en models/ ambas carpetas en la raiz del proyecto, es decir, los componentes relacionados con rutinas deben estar en `components/routines/` y asi sucesivamente con los demas.
14. Los archivos no deben ser largos, si un archivo es muy largo separar en pequeños componentes individuales. y reutilizables.
15. Los componentes deben tener pruebas unitarias que verifiquen su comportamiento.
16. Los componentes deben ser fácilmente reutilizables en diferentes partes de la aplicación.
17. Los componentes deben ser accesibles, cumpliendo con las pautas de accesibilidad.
18. Los componentes deben tener documentación clara y concisa.
19. Cada componente debe manejar el componente del i18n para los textos estáticos. Nunca deben manejar textos hardcodeados.

## 7. Testing Manual Rápido

- Ruta ejercicio del día: abrir pantalla rutina, completar sets, finalizar → verifica creación de Daily (network) y limpieza de claves `@daily_start_*`.
- Temporizador: crear ejercicio con reps tipo "30s por lado" → validar 2 ciclos y fase `PREPÁRATE`.
- Comentarios: abrir lista de comentarios → verificar render seguro con campos faltantes/`unknown`, tags y conteos.

## 8. Anti‑Patrones a Evitar

### Código y Arquitectura:

- No duplicar lógica de normalización de arrays; extraer helper si se repite.
- No llamar a servicios en cada render/entrada si depende de acción del usuario.
- No introducir dependencias pesadas sin justificación (mantener footprint de Expo).
- No usar `any` salvo envolturas de respuestas backend heterogéneas.
- No usar `Alert` nativo; siempre `CustomAlert`.
- No acceder a `resp.Data` sin chequear `resp?.Success` y normalizar `$values` cuando aplique.

### Performance y UX:

- No renderizar listas largas sin virtualización (>100 items).
- No usar efectos sin dependencias apropiadas (memory leaks).
- No bloquear UI thread con operaciones síncronas pesadas.
- No hacer requests redundantes sin cache/debounce.
- No ignorar estados de loading/error en UI.

### Seguridad y Calidad:

- No hardcodear credenciales o keys sensibles.
- No confiar en validación solo del frontend.
- No exponer información sensible en logs de producción.
- No usar bibliotecas desactualizadas con vulnerabilidades conocidas.
- No deployar sin testing en staging environment.

### Mantenibilidad:

- No crear componentes monolíticos (>500 líneas).
- No usar magic numbers/strings sin constantes.
- No omitir documentación en funciones complejas.
- No ignorar warnings de TypeScript.
- No commitear código comentado o console.logs.

## 9. Ejemplos Rápidos

- Petición típica:

  ```ts
  const resp = await dailyService.addDaily(req);
  if (resp?.Success) {
    /* usar resp.Data */
  }
  ```

  Con normalización de arrays:

  ```ts
  const resp = await employeeTypeService.findEmployeeTypesByFields({});
  const items = resp?.Success ? normalizeArray(resp.Data) : [];
  ```

- Lectura reps guardadas:
  ```ts
  const key = `exercise_${id}_reps`;
  const raw =
    Platform.OS === 'web'
      ? window.localStorage.getItem(key)
      : await AsyncStorage.getItem(key);
  ```

## 10. Revisión Final Antes de Commit

- Sin hardcodes de URLs/keys; usar config.
- Limpieza de timers/intervalos en efectos.
- Ajustes de color migrados a theme si tocaste UI.

Notas:

- Los reportes de cobertura se generan en `coverage/` (gitignored). Usa `npm run test:coverage` y abre `coverage/index.html` si necesitas revisar cobertura.

## 🎯 RESPONSABILIDADES DEL AGENTE

### Antes de cada propuesta técnica:

1. ✅ Evaluar costo e impacto económico
2. ✅ Proporcionar alternativas gratuitas/económicas
3. ✅ Justificar beneficio vs costo
4. ✅ Considerar timing óptimo de implementación

### Durante implementación:

1. ✅ Seguir patrones existentes del proyecto
2. ✅ Actualizar progreso en PLAN_ACCION_RED_SOCIAL.md
3. ✅ Generar prompts específicos para backend cuando necesario
4. ✅ Priorizar seguridad y funcionalidad core
5. ✅ Especificar claramente qué lógica va en Application Layer (reglas de negocio) vs Repository Layer (datos/externos)

### Al completar tareas:

1. ✅ Validar funcionamiento completo
2. ✅ Documentar cambios significativos
3. ✅ Actualizar porcentajes de progreso
4. ✅ Identificar próximos pasos y dependencias

### 🔍 Criterios de Definición de "Terminado" (Definition of Done):

**Para considerar una funcionalidad como completada:**

1. **Funcionalidad:**
   - Feature funciona según especificaciones
   - Todos los casos edge manejados apropiadamente
   - Estados de error y loading implementados
   - Validaciones client-side y server-side

2. **Calidad de Código:**
   - TypeScript sin errores ni warnings
   - Código sigue patrones establecidos del proyecto
   - Funciones y componentes documentados
   - No hay console.logs o código comentado

3. **Testing:**
   - Unit tests para lógica crítica
   - Integration tests para flujos principales
   - Testing manual en dispositivos reales
   - Performance acceptable en dispositivos lentos

4. **UX/UI:**
   - Diseño responsive en todos los screen sizes
   - Accesibilidad básica implementada
   - Loading states y feedback visual apropiado
   - Navegación intuitiva y consistente

5. **Seguridad:**
   - Input sanitization implementada
   - Rate limiting cuando sea necesario
   - Manejo seguro de datos sensibles
   - Validación de permisos apropiada

6. **Documentación:**
   - README actualizado si es necesario
   - Cambios documentados en plan de acción
   - APIs documentadas si se crearon nuevas
   - Decisiones técnicas registradas

---

Actualiza este documento si:

- Se añade un nuevo patrón cross-cutting.
- Cambia la forma de crear Dailies o registrar ejercicios.
- Se altera la carga multi-entorno.
- Se establecen nuevos estándares de costos o metodología.
