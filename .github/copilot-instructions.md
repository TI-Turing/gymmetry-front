# 🤖 AI Agent Instructions for gymmetry-front

Conciso, accionable y específico al proyecto. Usa este documento como guía operativa.

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
8. Los estiulos nunca deben ir dentro del archivo del componente sino que en un archivo de estilos independientes.
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

## 7. Testing Manual Rápido

- Ruta ejercicio del día: abrir pantalla rutina, completar sets, finalizar → verifica creación de Daily (network) y limpieza de claves `@daily_start_*`.
- Temporizador: crear ejercicio con reps tipo "30s por lado" → validar 2 ciclos y fase `PREPÁRATE`.
- Comentarios: abrir lista de comentarios → verificar render seguro con campos faltantes/`unknown`, tags y conteos.

## 8. Anti‑Patrones a Evitar

- No duplicar lógica de normalización de arrays; extraer helper si se repite.
- No llamar a servicios en cada render/entrada si depende de acción del usuario.
- No introducir dependencias pesadas sin justificación (mantener footprint de Expo).
- No usar `any` salvo envolturas de respuestas backend heterogéneas.
- No usar `Alert` nativo; siempre `CustomAlert`.
- No acceder a `resp.Data` sin chequear `resp?.Success` y normalizar `$values` cuando aplique.

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

Actualiza este documento si:

- Se añade un nuevo patrón cross-cutting.
- Cambia la forma de crear Dailies o registrar ejercicios.
- Se altera la carga multi-entorno.
