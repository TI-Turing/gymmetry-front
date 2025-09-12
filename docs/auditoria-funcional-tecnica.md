# Auditoría funcional y técnica de Gymmetry Frontend (Expo/React Native)

Fecha: 2025-09-01
Autor: Auditoría interna del repositorio (front)

## Resumen ejecutivo

La aplicación Gymmetry Front es una app móvil/web construida con Expo + React Native, con routing por archivos (Expo Router), una capa de servicios HTTP unificada (Axios + interceptores), i18n básico (es/en) y un conjunto de dominios: autenticación, rutinas (plantillas, día de rutina, ejercicios con temporizador), feed social con modo anónimo, perfil, gimnasio (registro y vinculación), planes y pagos, evaluaciones físicas, notificaciones de bienestar (hidratación/pausas activas), y configuración de la app.

Fortalezas:

- Arquitectura modular por dominios (`components/<dominio>`, `services/**`, `dto/**`, `models/**`).
- Interceptor HTTP con refresh token y cola de reintentos; manejo de ApiResponse unificado; normalización .NET `$values`.
- Theming claro/oscuro y diseño responsivo (WebLayout/Mobile); i18n central con proveedor y diccionarios.
- Flujos de rutina detallados (ExerciseModal con fases prep/on/off, vibración, notificaciones locales, almacenamiento granular).
- Modo social anónimo consistente en UI y DTOs (Feed/Comment/Like).

Debilidades y brechas clave:

- Estilos mezclados en varios componentes (inline + themed), con usos directos de `Colors.dark` que rompen light mode.
- i18n incompleto en textos de UI (social, formularios, placeholders) y mensajes de error.
- Cobertura de tests mínima (solo 1 test), sin pruebas de componentes críticos (rutinas, pagos, auth).
- Accesibilidad (a11y) de componentes no consistente (falta de roles, labels, focus management).
- Servicios con rutas placeholder no parametrizadas (e.g., `/comment/post/{postId:guid}`), y ausencia de métodos `find<Entities>ByFields` uniformes en varios dominios sociales.
- Falta de paginación/caching en listas de Feed y otras entidades; riesgos de performance y consumo de datos.
- Falta de flujos de edición de perfil y carga de imagen integrados a la UI.
- Validaciones de CI (lint/typecheck/tests) relajadas temporalmente; riesgo de regresiones.

Este documento detalla arquitectura, flujos funcionales, reglas, edge cases y un plan de mejoras priorizado con entregables.

---

## Alcance y metodología

- Revisión estática del código fuente en ramas actuales (master).
- Inspección de configuración (package.json, environment/, env-loader.js) y servicios (apiService.ts, authService.ts, capa de servicios por dominio).
- Análisis de pantallas principales (tabs: home, feed, gym, progress, profile) y pantallas modales (rutina, planes, settings, etc.).
- Evaluación de patrones transversales (i18n, theming, EntityList, normalización .NET, respuestas ApiResponse, notificaciones locales).
- Validación contra guía operativa interna (.github/copilot-instructions.md) y README del proyecto.

---

## Arquitectura y convenciones

- Framework: React Native 0.79.5 + Expo SDK ~53; TypeScript ~5.8.
- Router: Expo Router (Stack + Tabs) con layouts: `app/_layout.tsx` y `app/(tabs)/_layout.tsx`.
- Temas/estilos: `Colors.ts`, constantes de theme y hooks `useThemedStyles`, estilos por archivo en varios dominios; falta homogeneidad total.
- i18n: `I18nProvider` + diccionarios `i18n/locales/es.ts` y `en.ts`; acceso con `useI18n().t(key)`.
- Estado global: `AuthContext` (sesión, roles derivados por gym), `AppSettingsContext` (preferencias, idioma, notificaciones, socialAnonymousMode).
- Servicios HTTP: `services/apiService.ts` (Axios) con:
  - BaseURL desde `environment/index.ts` (variables EXPO*PUBLIC*\*).
  - Interceptor request: Host, Cache-Control, x-functions-key, Authorization desde AsyncStorage.
  - Interceptor response: refresh token con cola para 401 y reintento seguro; retorno ApiResponse en errores con envoltura.
  - Utilidad para generar cURL (enmascara Authorization).
- DTOs/Modelos: `dto/**` y `models/**` compatibles con backend .NET; patrón ApiResponse<T>.
- Normalización .NET: `normalizeCollection` para `$values`.
- Notificaciones locales: `utils/localNotifications` + listeners configurados en `app/_layout.tsx` con gating por `AppSettings`.
- Entornos: `env-loader.js` genera `.env` consumido por Expo; `environment/index.ts` expone `Environment`.
- UI: Layouts responsivos `components/layout/WebLayout/WebHeader` (web) y `ScreenWrapper`/`MobileHeader` (móvil).

---

## Módulos funcionales

### 1) Autenticación y sesión

- Login (`authService.login`) guarda tokens/expiraciones, usuario crudo en `@user_data`, roles derivados (owner si GymId presente).
- Refresh/token: `authService.checkAndRefreshToken` con ventana de seguridad de 60s; `apiService` maneja 401 con cola.
- Logout: limpia tokens, cachés de gym y rutina activa.
- Navegación protegida: `app/_layout.tsx` guía acceso permitido por segmento y estado `useAuth()`.
- Riesgos/gaps:
  - Falta de pantalla de recuperación/OTP (existen endpoints `request-otp/validate-otp`, sin UI generalizada fuera del registro).
  - Falta de límites de intentos y mensajes i18n uniformes.

### 2) Configuración (Settings)

- `AppSettingsContext`: tema (system/light/dark), idioma (auto/es/en), ahorro de datos, calidad de imágenes, notificaciones, hidratación/pausas, analítica, log level, socialAnonymousMode.
- Persistencia: AsyncStorage o localStorage web por clave `@app_preferences`.
- Notificaciones de bienestar: listeners analizan payloads `type` (`wellness:hydration`, etc.) y programan recordatorios si habilitado y fuera de horas silenciosas.
- Gaps:
  - Falta UI consolidada para todas las opcionales (algunas existen; verificar paridad móvil/web).
  - Quiet hours: helper presente, pero falta vista de configuración dedicada.

### 3) Rutinas y ejercicios

- Plantillas: `components/routineTemplate/*` con filtros, asignación a usuario, estados Premium/Free, badges.
- Día de rutina: `RoutineDayScreen.tsx` con progreso por ejercicio; finalización: dos vías (marcar todo o con avance actual, requerimiento 30%).
- ExerciseModal:
  - Fases del timer: PREP (prepárate), ON (activo), OFF (descanso), STOPPED.
  - Temporizadores, vibración (Vibration), señales sonoras y mensajes "¡Prepárate!", "¡Comienza!", "¡Descansa!".
  - Maneja reps/time tipo "30s" y ciclos por lado/pierna/brazo; doble ciclo para por-lado (desde instrucciones).
  - Almacenamiento granular: claves `keyExerciseReps`, `keyExerciseProgress` en `utils/routineStorage` para reanudación.
  - Notificaciones locales para retomar rutina (si se sale).
- Motivación: frases `utils/motivationalPhrases.json` mostradas al completar ejercicios.
- Gaps/Mejoras:
  - Efectos y timers: asegurar limpieza en unmount y al pausar; ya hay patrones, pero revisar fugas en navegaciones rápidas.
  - A11y: anuncios de estado del timer para lectores de pantalla; botones con `accessibilityLabel`.
  - UI/estilos: homogeneizar con archivos de estilos externos en todos los subcomponentes; evitar estilos inline.
  - Tests: agregar pruebas unitarias de los estados del temporizador y persistencia de progreso.

### 4) Feed social y anonimato

- Feed (`app/(tabs)/feed.tsx`):
  - Cabecera estandarizada; en web se oculta sección de usuario del header (prop `hideUserSection` en `WebHeader`).
  - Composer, tarjetas, modal de comentarios; Skeleton tematizado.
  - Modo anónimo (global en settings) que:
    - Mascara identidad del usuario en UI para publicaciones/comentarios/likes propios.
    - Envía `IsAnonymous` en DTOs de creación: `FeedCreateRequestDto`, `CommentCreateRequestDto`, `LikeCreateRequestDto`.
    - Banner informativo y modal de reglas de comunidad.
- Servicios sociales: `feedService`, `commentService`, `likeService`.
- Gaps:
  - Endpoints de consulta por post/usuario están con placeholders (e.g. `/comment/post/{postId:guid}`) y no se parametrizan desde la UI; implementar métodos con params o `findByFields` como convención.
  - Falta paginación/infinite scroll y caching; riesgo de performance.
  - i18n pendiente en textos residuales; moderación/reportes no implementados.

### 5) Perfil

- `app/(tabs)/profile.tsx` carga datos reales: user, última evaluación física, daily histories para métricas (workouts totales, racha, peso, altura, fecha de ingreso).
- SmartImage para avatar; MobileHeader; estados de carga y error.
- Gaps: edición de perfil (nombre/username, imagen) aún no expuesta en UI pese a existir `userService.updateUser` y `uploadProfileImage`.

### 6) Gimnasio

- `components/gym/*`: Registro multi-paso (1-5) con validaciones y selects (país, región, ciudad via `catalogService`).
- `GymScreen` muestra estado: no vinculado, conectado, info de gym, formulario de sucursal.
- Habilitado botón atrás en paso de registro por requerimiento.
- Gaps:
  - Carga de multimedia (logo/portada/galería) marcada como "en desarrollo".
  - Flujo de vinculación por QR escáner: UI presente, validar integración real con backend.

### 7) Planes y pagos

- `PlanTypeView` y `PlanView` integran `paymentService`, `usePaymentStatus`, y consumo de `Environment.MP_PUBLIC_KEY` (MercadoPago).
- Tests: existe `__tests__/paymentStatus.test.ts` (mínimo).
- Gaps:
  - Falta de pruebas de integración mocked de pagos y UI de estados; documentación de fallbacks (web vs app).

### 8) Evaluación física y progresos

- `physicalAssessmentService` y `dailyHistoryService`; perfil deriva métricas.
- Gaps: gráficas de progreso aún limitadas; consolidar pantalla de progreso con tendencias y objetivos.

---

## Patrones y utilidades transversales

- ApiResponse<T> unificado; interceptores devuelven el sobre en fallos conocidos.
- Normalización de colecciones `$values` .NET: `normalizeCollection` en `utils/objectUtils`.
- Logger configurable por `AppSettings.logLevel`; cURL seguro (Authorization enmascarado).
- EntityList: patrón de listas CRUD homogéneas (aparece en dominios de catálogos y otros módulos).
- Persistencia con claves con prefijos claros (rutinas, settings).
- Theming: `Colors.ts` con tokens extendidos; `useThemedStyles` para estilos dependientes de tema.

---

## Calidad, pruebas y accesibilidad

- Type-check, lint y tests configurados, pero validados de forma laxa según nota operativa temporal.
- Cobertura de tests: baja. Recomendado:
  - Unit tests: timers de ExerciseModal (fases, restart, finish), normalización de arrays, authService (derive roles, refresh), AppSettings reducer, helpers de fecha/format.
  - Component tests: RoutineDayScreen (flujos de finalización), Feed (modo anónimo, banner), Profile (carga de métricas), Gym steps (validaciones).
  - E2E (opcional): flujos críticos (login → rutina → finalizar → perfil), con Detox/Expo E2E.
- A11y: añadir `accessibilityLabel`, roles y foco visible; anuncios de cambios de estado (timer) mediante `AccessibilityInfo.announceForAccessibility`.

---

## Seguridad y privacidad

- Claves de Azure Functions se inyectan por `EXPO_PUBLIC_*`; atajar riesgos: no exponer en logs, rotarlas si es necesario.
- Interceptor `generateCurlCommand` enmascara bearer; Host header calculado de baseURL.
- Modo anónimo: UI y DTOs lo soportan, pero el backend debe aplicar reglas para ocultar identidad en lecturas; se muestra banner que soporte sí puede ver identidad.
- Sugerencias:
  - Rate limiting cliente para likes/comments (prevención de spam).
  - Reporte de abuso y bloqueo de usuarios a nivel de UI.
  - Sanitización de contenido y filtros de lenguaje (moderación asistida).

---

## Rendimiento y consumo de datos

- Listas sin paginación/caching en varios módulos sociales.
- SmartImage soporta ahorro de datos, pero faltan tamaños/densidades coordinadas.
- Sugerencias:
  - Paginación estándar en `find<Entities>ByFields` con `page/size/sort`.
  - Estado de carga incremental (infinite scroll), y cache en memoria por pantalla.
  - Pre-carga con PreloadContext para datos de perfil/plan.
  - Compresión/transformación de imágenes del usuario antes de subir (ya existe manipulator; aplicar consistentemente).

---

## Reglas funcionales actuales importantes (resumen)

- Rutinas:
  - Finalización no automática por llegar a 100%; solo por acción explícita del usuario.
  - Claves locales por ejercicio (`exercise_<Id>_progress`, etc.) para reanudación.
  - Timer soporta reps temporizadas y doble ciclo por lado.
  - Se aplican notificaciones locales para recordar retomar rutina.
- Feed:
  - Modo anónimo global; IsAnonymous se envía en creaciones; UI enmascara identidad del usuario actual.
  - Reglas de comunidad visibles desde banner/modal; soporte siempre puede ver identidad.
- Servicios:
  - Siempre verificar `resp?.Success` antes de usar `Data`.
  - Normalizar colecciones con `$values`.
- UI/UX:
  - No usar Alert nativo; usar `CustomAlert`.
  - Usar colores desde `Colors` y estilos tematizados.

---

## Brechas detectadas y propuestas de mejora

1. Theming y estilos

- Problema: estilos inline y uso directo de `Colors.dark` en componentes (p. ej., `components/home/styles.ts`), causando inconsistencias en modo claro.
- Acción: migrar estilos a `make*.themed.ts` por dominio, usando `useThemedStyles`. Revisar todas las apariciones de `Colors.dark.*` y reemplazar por tokens temáticos.

2. i18n incompleto

- Problema: textos hardcoded en social y diversos formularios.
- Acción: barrido de cadenas, añadir keys a `es.ts` y `en.ts` (placeholders, labels, toasts, errores). Añadir util `tVar('start_set', { ordinal: '1ra' })` si se necesita interpolación consistente.

3. Servicios sociales: rutas y filtros

- Problema: endpoints con placeholders no parametrizados; falta `findByFields` estándar.
- Acción: exponer métodos `findCommentsByFields`, `findLikesByFields`, `findFeedsByFields` que acepten objeto con claves en PascalCase; agregar variantes parametrizadas (por postId/userId). Ajustar UI para consumir paginado.

4. Paginación, caching y rendimiento

- Implementar infinite scroll con umbral y `page/size` en peticiones. Cache local por pantalla con invalidación en pull-to-refresh.

5. Accesibilidad

- Añadir `accessibilityRole`, `accessibilityLabel`, soporte de navegación por teclado en web, foco visible. Anuncios en cambios del timer.

6. Tests y calidad

- Re-activar gates en CI (lint/format/type-check/tests) según la guía operativa.
- Añadir suites de pruebas unitarias/componentes descritas en sección de calidad.

7. Perfil: edición y multimedia

- Exponer UI para `updateUser` (nombre/username, contacto) y `uploadProfileImage`. Confirmaciones mediante `CustomAlert`.

8. Moderación y seguridad social

- Añadir: reporte de contenido, bloqueo/ocultamiento de usuarios, límite de tasa en acciones, términos de uso en primer uso del feed.

9. Notificaciones y quiet hours

- UI para configurar horas silenciosas, categorías de notificaciones y vista de historial básico; validaciones para no programar alarmas dentro del rango.

10. Offline y resiliencia

- Cache de rutina del día para operar sin conexión; cola de sincronización para progreso (Daily/DailyExercise) al recuperar conectividad.

11. Documentación y DX

- Documentar contratos API por dominio con ejemplos cURL (aprovechando `apiService.generateWindowsCurl`).
- README: agregar matriz de features por plataforma (iOS/Android/Web) y estados.

---

## Roadmap sugerido (priorizado)

Corto plazo (1-2 sprints):

- Reinstalar verificaciones CI (lint/type/tests) y corregir incompatibilidades.
- Barrido i18n + theming de componentes con estilos duros (home, categoryExercise, exercise detail, etc.).
- Implementar paginación y `findByFields` en feed/comments/likes; ajustar UI con infinite scroll y pull-to-refresh.
- UI de edición de perfil (nombre/username, imagen) con validaciones.
- Pruebas unitarias clave: ExerciseModal (timer), authService (refresh/roles), normalizeCollection, AppSettings.

Mediano plazo (3-5 sprints):

- Moderación social (reportes/bloqueos), límites de tasa y telemetría de abuso.
- Offline básico para rutina del día y progreso diferido.
- Pantalla de progreso con gráficas (historial de peso, rachas, volumen de entrenamiento) reutilizando `dailyHistoryService`.

Largo plazo (6+ sprints):

- Gestión de clases/reservas y check-in por QR.
- Gamificación (logros, niveles, rachas avanzadas, desafíos por gym).
- CDN y transformación de imágenes; carga diferida de medios del feed.

---

## Especificaciones funcionales detalladas (extracto)

A) Finalización de rutina (reglas):

- Condición: el usuario decide finalizar; no finalizar automáticamente por 100%.
- Opciones: "Marcar todo y finalizar" (marca todos los ejercicios como completados) o "Finalizar con avance actual" (requiere >= 30%).
- Efectos: crear entidades Daily y DailyExercise solo tras acción explícita; limpiar claves `@daily_start_*`.
- Edge cases: reconexión a mitad, switch de día de rutina (bloquear si hay día en progreso), notificaciones pendientes.

B) Temporizador de ejercicios:

- Estados: PREP (cuenta atrás configurable en settings), ON (ejecución), OFF (descanso), STOPPED (pausado o reiniciado).
- Entradas: reps numéricas o tiempos tipo "30s"; modo bilateral (por lado) → dos ciclos ON/OFF.
- Salidas: vibración en transiciones, mensajes i18n, avance de sets, persistencia por set.
- Errores: evitar actualizaciones de estado en render (usar setTimeout diferido); limpiar intervals al salir.

C) Modo anónimo social:

- Preferencia global en settings (`socialAnonymousMode`).
- Envío IsAnonymous en creación de posts, comentarios y likes.
- UI: máscara de identidad del usuario actual, banner de aviso y enlace a reglas.
- Backend: debe ocultar identidad en feed público; soporte puede ver auditoría.

D) Perfil y métricas:

- Cargar usuario, última evaluación física, historiales diarios.
- Métricas: entrenamientos totales, racha actual, peso/altura actuales, fecha de ingreso (si disponible).
- Próximo: edición de campos y foto; gráficas de evolución.

---

## Reglas y consideraciones adicionales

- No usar `Alert` nativo; `CustomAlert` centraliza modales de confirmación/feedback.
- Siempre verificar `resp?.Success` antes de usar `Data`; mapear `$values`.
- No hardcodear URLs ni keys: usar `Environment` y scripts `start:*`.
- Evitar servicios llamados en cada render: usar efectos y triggers explícitos.
- Limpiar timers/intervalos en efectos; evitar memory leaks.
- Componentes largos: dividir por responsabilidad; extraer hooks para lógica reutilizable.

---

## Funcionalidades y reglas nuevas sugeridas

1. Moderación y seguridad social

- Reporte de publicaciones/comentarios; flujo de revisión; bloqueo temporal/permanente.
- Filtros de lenguaje ofensivo (cliente/servidor) y detección simple de spam (frecuencia, repetición).

2. Gamificación y comunidad

- Logros por rachas, metas semanales, niveles; insignias visibles en perfil.
- Leaderboards por gimnasio y globales (opt-in por privacidad).

3. Rutinas inteligentes

- Sugerencias de sustituciones de ejercicios (si máquina ocupada), y ajuste de descanso según rendimiento.
- Modo "sesión guiada" con audio cues.

4. Progreso y analítica personal

- Gráficas (peso, RM, volumen) y objetivos mensuales; exportación CSV/PDF.

5. Integraciones y dispositivos

- Sincronización con HealthKit/Google Fit (pasos, calorías) como opcional.

6. Operación offline

- Continuidad del día de rutina sin conexión, con sincronización diferida.

7. Accesibilidad

- Alto contraste, tamaños de fuente escalables, navegación por teclado y lector de pantalla verificada en pantallas clave.

8. Calidad y DX

- Storybook para componentes; snapshot tests básicos; play functions para estados de UI críticos.

---

## Contratos API (ejemplos cURL)

Nota: Para depuración, el proyecto puede generar cURL; a continuación, ejemplos ilustrativos:

- Crear post (anónimo):

```
curl -X POST \
  -H "Authorization: Bearer ****" \
  -H "x-functions-key: <key>" \
  -H "Content-Type: application/json" \
  "<API_BASE_URL>/feed" \
  -d '{"Content":"Mi sesión","IsAnonymous":true}'
```

- Buscar evaluaciones físicas (por UserId):

```
curl -X POST \
  -H "Authorization: Bearer ****" \
  -H "Content-Type: application/json" \
  "<API_BASE_URL>/physicalassessments/find" \
  -d '{"UserId":"<guid>"}'
```

---

## Plan de calidad (gates) recomendado

- Pre-commit: eslint --fix, prettier, type-check (ya configurado con husky y lint-staged).
- Pre-push/CI: restaurar `npm run validate` (lint:check + format:check + type-check + test:ci).
- Métricas: mantener cobertura mínima en módulos críticos (>60% a corto plazo; >80% a mediano).

---

## Anexos

- Variables de entorno (README):
  - EXPO_PUBLIC_API_BASE_URL, EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY
  - EXPO_PUBLIC_CATALOGS_API_BASE_URL, EXPO_PUBLIC_API_FUNCTIONS_KEY
  - EXPO_PUBLIC_ENV, EXPO_PUBLIC_DEBUG, EXPO_PUBLIC_ENVIRONMENT, EXPO_PUBLIC_MP_PUBLIC_KEY
- Claves locales: `@app_preferences`, `@user_data`, `@active_routine_template_id`, etc.

---

## Cierre

El proyecto presenta una base sólida y estándares claros. La ejecución de las mejoras propuestas (theming/i18n completo, paginación/caching en social, edición de perfil, accesibilidad y pruebas) incrementará la calidad, rendimiento y mantenibilidad, habilitando escalabilidad funcional (moderación, gamificación, offline) sin comprometer la experiencia.
