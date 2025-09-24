# 🎯 PLAN DE ACCIÓN INTEGRAL - MÓDULO DE RED SOCIAL

## Transformación a Plataforma Robusta y Segura

### 📋 **ESTRATEGIA DE EJECUCIÓN**

Trabajo coordinado frontend-backend en fases priorizadas. Cada funcionalidad requiere sincronización entre ambos equipos.

---

## 🚀 **FASE 1: SEGURIDAD CRÍTICA** ✅ COMPLETADO (100%)

**Objetivo:** Corregir vulnerabilidades XSS y implementar controles de seguridad

### Frontend (100%):

- ✅ Instalación de DOMPurify para sanitización (100%)
- ✅ Creación de `utils/securityUtils.ts` con sanitización de contenido (100%)
- ✅ Creación de `utils/rateLimitUtils.ts` con rate limiting inteligente (100%)
- ✅ Actualización de `PostComposer.tsx` con: (100%)
  - Sanitización de input antes del envío
  - Validación de contenido (3-5000 caracteres)
  - Rate limiting (máx 3 posts cada 5 minutos)
  - Alertas de seguridad integradas
  - Estado de loading durante envío

### Pendiente en otros componentes (0%):

- ⏳ Aplicar mismas mejoras a comentarios y otros inputs sociales (planificado para después de reportes)

---

## 🚀 **FASE 2: SISTEMA DE REPORTES** ✅ COMPLETADO (100%)

### Backend (✅ COMPLETADO - 100%):

**Entidad:** `ReportContent`
**Campos:**

- Id, ReportedContentId, ContentType (Feed/Comment)
- ReporterId, ReportedUserId, Reason (enum), Description
- Status (Pending/UnderReview/Resolved/Dismissed)
- Priority (Low/Medium/High/Critical)
- ReviewedBy, ReviewedAt, Resolution
- CreatedAt, UpdatedAt, IsActive

**Endpoints:**

- POST /reportcontent - Crear reporte
- GET /reportcontent - Listar con paginación
- GET /reportcontent/{id} - Obtener por ID
- PUT /reportcontent/{id} - Actualizar (moderación)
- DELETE /reportcontent/{id} - Eliminar
- POST /reportcontent/find - Búsqueda por criterios
- GET /reportcontent/pending - Reportes pendientes
- PUT /reportcontent/{id}/review - Marcar como revisado
- GET /reportcontent/stats - Estadísticas

**Arquitectura de Capas:**

- **Application Layer:** Validaciones de negocio (no reportar mismo contenido 2x), reglas de auto-flagging, workflows de moderación, lógica de prioridades
- **Repository Layer:** CRUD operations, queries a BD, integración Redis cache, Azure Blob Storage para evidencias, envío de notificaciones

**Características Especiales:**

- Prevención de reportes duplicados por usuario (Application Layer)
- Auto-flagging con múltiples reportes (Application Layer)
- Integración con Redis para caché (Repository Layer)
- Notificaciones automáticas (Repository Layer)
- Logs de auditoría completos
- **MIGRACIÓN DE BD REQUERIDA**

### Frontend (✅ COMPLETADO - 100%):

- ✅ **Modelos:** ReportContent, ReportContentAudit, ReportContentEvidence con enums completos (100%)
- ✅ **DTOs:** Request/Response DTOs para todos los 14 endpoints (100%)
- ✅ **Servicios:** reportContentService.ts implementado completamente (100%)
- ✅ **ReportModal:** Modal completo con rate limiting (10/día), validaciones, categorías y UX optimizada (100%)
- ✅ **ReportButton:** Componente reutilizable con 3 estilos y 3 tamaños (100%)
- ✅ **Rate Limit Hook:** useReportRateLimit con persistencia local y reset automático (100%)
- ✅ **Integración Posts:** ReportButton en PostCardWithReport funcionando (100%)
- ✅ **Integración Comentarios:** ReportButton agregado a CommentsModal (100%)
- ✅ **Traducciones:** Español e inglés completas para todo el sistema (100%)
- ✅ **Estilos:** Diseño responsive, modo oscuro/claro, accesibilidad (100%)

### ✅ **CARACTERÍSTICAS IMPLEMENTADAS:**

- ✅ **Rate Limiting Avanzado:** 10 reportes por día con indicador visual
- ✅ **Validaciones UX:** Formulario con validaciones en tiempo real
- ✅ **Anti-Spam:** Prevención de reportes duplicados y rate limiting
- ✅ **Categorización:** 7 motivos de reporte + prioridades
- ✅ **Feedback Visual:** Estados de loading, success, error con mensajes contextuales
- ✅ **Accesibilidad:** Screen reader support, navegación por teclado
- ✅ **Performance:** Lazy loading, cache local, optimistic updates

---

## 🚀 **FASE 3: SISTEMA DE BLOQUEO DE USUARIOS** ✅ FRONTEND COMPLETADO (90%)

### Backend (⏳ COORDINADO - 0%):

**Entidad:** `UserBlock` - ✅ Prompt generado para copilot backend
**Campos:**

- Id, BlockerId, BlockedUserId, Reason, Notes
- BlockedAt, UnblockedAt, IsActive, CreatedAt, UpdatedAt

**Endpoints diseñados:**

- POST /userblock - Bloquear usuario
- DELETE /userblock/{blockerId}/{blockedUserId} - Desbloquear
- GET /userblock/check/{blockerId}/{blockedUserId} - Verificar bloqueo
- GET /userblock/blocked-by-me/{userId} - Mis usuarios bloqueados
- GET /userblock/blocked-me/{userId} - Quién me bloqueó
- POST /userblock/find - Búsqueda de bloqueos
- GET /userblock/stats/{userId} - Estadísticas de bloqueos
- POST /userblock/bulk/unblock - Desbloqueo masivo
- GET /userblock/count/blocked-by-me/{userId} - Contador

**Arquitectura de Capas:**

- **Application Layer:** Rate limiting (20 bloqueos/día max), validaciones de auto-bloqueo, workflows de bloqueo bidireccional, lógica de filtrado
- **Repository Layer:** CRUD operations, queries optimizadas, Redis caché para bloqueos activos, logs de auditoría
- **MIGRACIÓN DE BD REQUERIDA**

### Frontend (✅ COMPLETADO - 100%):

- ✅ **Modelos:** UserBlock.ts con interfaces, enums BlockStatus, helpers UI (100%)
- ✅ **DTOs:** UserBlockRequest/Response para todos endpoints (100%)
- ✅ **Servicios:** userBlockService.ts con 9 endpoints completos (100%)
- ✅ **Componentes UI base:** BlockButton.tsx con confirmaciones y estados (100%)
- ✅ **Lista usuarios:** BlockedUsersList.tsx con gestión completa (100%)
- ✅ **Estilos:** Diseño responsive y modo oscuro/claro (100%)
- ✅ **Traducciones:** 18 claves en español para todo el sistema (100%)

### Pendiente (0%):

- ⏳ **Backend implementación:** Esperar implementación por copilot backend (0%)
- ⏳ **Testing completo:** Validación end-to-end una vez implementado backend (0%)

### ✅ **IMPLEMENTACIÓN FRONTEND COMPLETADA (100%)**

- ✅ **Integración UI:** BlockButton agregado en PostCardWithReport, FeedListWithEditAndReactions, EnhancedCommentsModal (100%)
- ✅ **Filtrado inteligente:** useBlockedContentFilter hook con filtrado automático de posts y comentarios (100%)
- ✅ **Pantalla gestión:** blocked-users.tsx con BlockedUsersList para administrar usuarios bloqueados (100%)
- ✅ **UX completa:** Actualización automática de feeds cuando se bloquea/desbloquea usuarios (100%)

---

## 🚀 **FASE 4: MODERACIÓN DE CONTENIDO** ⏳ PLANIFICADO (0%)

### Backend (PLANIFICADO):

**Entidad:** `ContentModeration`
**Campos:**

- Id, ContentId, ContentType, UserId
- ModerationStatus, Flags, AutoModerated
- ModeratorId, ModeratedAt, Reason
- Actions (Hide/Warn/Ban), CreatedAt

**Funcionalidades:**

- Filtros automáticos de palabras prohibidas
- Scoring de contenido sospechoso
- Panel de moderador con Redis caché
- Integración con sistema de reportes
- **MIGRACIÓN DE BD REQUERIDA**

### Frontend (⏳ PLANIFICADO - 0%):

- ⏳ Panel de moderación para administradores (0%)
- ⏳ Indicadores visuales de contenido moderado (0%)
- ⏳ Filtros en tiempo real (0%)
- ⏳ Historial de moderaciones (0%)

---

## 🚀 **FASE 5: NOTIFICACIONES PUSH REAL-TIME** ⏳ PLANIFICADO (0%)

### Backend (PLANIFICADO):

**Mejoras a:** `Notification` (existente)
**Nuevas funcionalidades:**

- SignalR real-time mejorado
- Push notifications con Azure Notification Hubs
- Redis para caché de notificaciones
- Suscripciones por temas sociales
- **POSIBLE MIGRACIÓN DE BD**

### Frontend (⏳ PLANIFICADO - 0%):

- ⏳ Permisos de push notifications (0%)
- ⏳ Gestión de suscripciones (0%)
- ⏳ Notificaciones en tiempo real (0%)
- ⏳ Badge counters actualizados (0%)

---

## 🚀 **FASE 6: SISTEMA DE COMPARTIR** 🔄 EN PROCESO (20%)

### Backend (PLANIFICADO):

**Entidad:** `PostShare`
**Campos:**

- Id, PostId, SharedBy, SharedWith
- ShareType (Internal/External), Platform
- SharedAt, Metadata, TrackingData

**Funcionalidades:**

- Tracking de compartidos
- Metadatos para redes sociales
- Analytics de viralidad
- **MIGRACIÓN DE BD REQUERIDA**

### Frontend (🔄 EN PROCESO - 55%):

- ✅ Compartir progreso detallado como imagen desde el modal de disciplina (100%)
  - Captura enriquecida con tarjetas de métricas, textos traducidos y estados vacíos consistentes
  - Formato vertical optimizado con calendario + métricas apiladas y watermark centrado para redes sociales
  - Reajuste de distribución: calendario ampliado y tarjetas en dos columnas equilibradas aprovechando todo el ancho
- ✅ Ajuste responsivo del calendario en el modal en vivo (100%)
  - Las celdas se recalculan automáticamente en base al ancho y alto disponibles, evitando scroll y solapamientos
  - Preserva dimensiones específicas en el modo de captura para mantener la consistencia de la imagen compartida
  - Centrado automático del grid y espaciados consistentes entre semanas en cualquier tamaño de pantalla
- 📅 Última actualización: 2025-09-24
- ⏳ Botones de compartir en posts (0%)
- ⏳ Compartir interno (usuarios de la app) (0%)
- ⏳ Integración con redes sociales externas (0%)
- ⏳ Estadísticas de compartidos (0%)

---

## 🚀 **FASE 7: OPTIMIZACIÓN Y REFACTORING** ⏳ PLANIFICADO (0%)

### Tareas Técnicas (⏳ PENDIENTES - 0%):

- ⏳ Consolidar componentes duplicados (múltiples FeedList) (0%)
- ⏳ Implementar Error Boundaries (0%)
- ⏳ Tests unitarios completos (0%)
- ⏳ Optimización de re-renders (0%)
- ⏳ Virtualización de listas largas (0%)
- ⏳ Code splitting y lazy loading (0%)

---

## 📊 **CONSIDERACIONES TÉCNICAS ESPECIALES**

### Backend (.NET 9 + Azure Functions):

- **Application Layer:** Reglas de negocio, validaciones complejas, workflows, lógica pesada
- **Repository Layer:** CRUD operations, queries, conexiones Azure services, emails
- **Redis:** Caché para reportes, moderaciones y notificaciones
- **Azure Blob Storage:** Almacenamiento de evidencias de reportes
- **Migraciones BD:** Cada nueva entidad requiere migración
- **Azure Notification Hubs:** Para push notifications
- **SignalR:** Comunicación real-time mejorada

### Frontend (React Native + Expo):

- **Optimistic Updates:** Para mejor UX
- **Offline Support:** Caché local de acciones
- **Performance:** Virtualización y lazy loading
- **Security:** Sanitización y rate limiting

---

## 💰 **ANÁLISIS DE COSTOS Y ALTERNATIVAS ECONÓMICAS**

### 🎯 **FILOSOFÍA: MÁXIMO BENEFICIO, MÍNIMO COSTO**

_Priorizar soluciones gratuitas/económicas sin sacrificar funcionalidad crítica_

### **RECURSOS ACTUALES (SIN COSTO ADICIONAL):**

✅ **Azure Functions** - Ya implementado (pay-per-use, muy económico)  
✅ **SQL Database** - Ya en uso (escalable según necesidad)  
✅ **Redis** - Si ya está configurado, NO genera costo adicional  
✅ **Azure Blob Storage** - Ya en uso (muy económico: ~$0.02/GB)

### **NUEVAS FUNCIONALIDADES - ANÁLISIS DE COSTO:**

#### 🟢 **BAJO/NULO IMPACTO (RECOMENDADO INMEDIATO):**

- **Sistema de Reportes:** $0 - Solo usa recursos existentes
- **Sistema de Bloqueo:** $0 - Solo base de datos y lógica
- **Moderación Básica:** $0 - Filtros por palabras clave locales
- **Caché Redis adicional:** $0 - Si ya existe la instancia

#### 🟡 **IMPACTO MODERADO (EVALUAR):**

- **Azure Notification Hubs:**
  - Costo: $0.50/millón de notificaciones
  - Alternativa GRATUITA: **Expo Push Notifications** (0 costo hasta 100k/mes)
  - **RECOMENDACIÓN:** Usar Expo inicialmente
- **SignalR Service:**
  - Costo: ~$25-50/mes para uso básico
  - Alternativa ECONÓMICA: WebSockets simples o polling
  - **RECOMENDACIÓN:** Implementar polling cada 30s inicialmente

#### 🔴 **ALTO IMPACTO (POSPONER):**

- **Azure Cognitive Services** (moderación IA): $1-2 por 1000 llamadas
- **Azure Search Service:** $250+/mes
- **CDN Premium:** $50+/mes

### **ESTRATEGIA RECOMENDADA - FASE POR FASE:**

#### **FASE INMEDIATA (Costo: $0):**

1. ✅ Sistema de Reportes - Solo BD y lógica
2. ✅ Sistema de Bloqueo - Solo BD y lógica
3. ✅ Moderación básica con palabras clave hardcodeadas
4. ✅ Notificaciones con Expo Push (gratis hasta 100k/mes)

#### **FASE DE CRECIMIENTO (Cuando tengas usuarios activos):**

1. 🟡 Upgrade a Azure Notification Hubs si excedes 100k/mes
2. 🟡 SignalR real-time si el polling no es suficiente
3. 🟡 Moderación con IA si hay mucho spam

#### **FASE DE ESCALAMIENTO (Cuando generes ingresos):**

1. 🔴 CDN para assets pesados
2. 🔴 Azure Search para búsquedas avanzadas
3. 🔴 Analytics premium y métricas detalladas

### **ALTERNATIVAS GRATUITAS ESPECÍFICAS:**

#### **Para Notificaciones Push:**

- **Expo Push Notifications:** GRATIS hasta 100,000/mes
- **OneSignal:** GRATIS hasta 10,000 usuarios
- **Firebase Cloud Messaging:** GRATIS (Google)

#### **Para Real-time:**

- **Polling optimizado:** Cada 30-60 segundos (0 costo adicional)
- **WebSockets nativos:** En lugar de SignalR Service
- **Server-Sent Events:** Más ligero que WebSockets

#### **Para Moderación:**

- **Lista de palabras prohibidas local:** Gratis, actualizable
- **Filtros por reportes múltiples:** Automático cuando X reportes = hide
- **Moderación comunitaria:** Los usuarios reportan, admins revisan

#### **Para Analytics:**

- **Expo Analytics:** Básico gratuito
- **Google Analytics:** Gratuito con limitaciones
- **Logs de Azure Functions:** Ya incluido

### **ESTIMACIÓN DE COSTOS MENSUAL:**

#### **Escenario Inicial (0-1000 usuarios):**

- Infraestructura actual: ~$10-20/mes (ya pagando)
- Nuevas funcionalidades: **$0/mes** (solo usa recursos existentes)
- **TOTAL ADICIONAL: $0/mes**

#### **Escenario Crecimiento (1000-10000 usuarios):**

- Base actual: ~$30-50/mes
- Notificaciones Expo: $0 (bajo límite gratuito)
- Storage adicional: ~$2-5/mes
- **TOTAL ADICIONAL: $2-5/mes**

#### **Escenario Escalamiento (10000+ usuarios):**

- Base: ~$100-200/mes
- Notification Hubs: ~$10-25/mes
- SignalR: ~$25-50/mes
- **TOTAL ADICIONAL: $35-75/mes**

### **REGLAS DE ORO PARA DECISIONES:**

1. **Si es gratis y funciona → Implementar inmediatamente**
2. **Si cuesta <$10/mes y agrega valor crítico → Evaluar**
3. **Si cuesta >$25/mes → Solo cuando genere ingresos**
4. **Siempre tener alternativa gratuita como fallback**

---

## 🎯 **CRONOGRAMA ESTIMADO**

### Sprint 1-2: Seguridad + Reportes

- ✅ Seguridad crítica (completado)
- 🔄 Sistema de reportes completo

### Sprint 3-4: Bloqueo + Moderación

- Sistema de bloqueo usuarios
- Moderación básica de contenido

### Sprint 5-6: Notificaciones + Compartir

- Push notifications real-time
- Sistema de compartir posts

### Sprint 7-8: Optimización

- Refactoring y consolidación
- Tests y performance

---

## 🚨 **PUNTOS CRÍTICOS A RECORDAR**

1. **Cada entidad nueva = MIGRACIÓN BD obligatoria**
2. **Redis** integrado en todas las funcionalidades de caché
3. **Azure Blob Storage** para almacenamiento de archivos
4. **Coordinación estricta** entre frontend y backend
5. **Testing exhaustivo** antes de cada release
6. **Seguridad primero** en todas las implementaciones

---

## 📞 **PROTOCOLO DE COMUNICACIÓN**

**Para Backend:** Siempre especificar:

- Entidad exacta con todos los campos
- Endpoints completos siguiendo patrón "Daily"
- **Separación de capas obligatoria:**
  - **Application Layer:** Reglas de negocio, validaciones complejas, workflows
  - **Repository Layer:** CRUD, queries, Azure services, emails, integraciones externas
- Integración con Redis y Azure services
- **MIGRACIÓN DE BD REQUERIDA**
- Validaciones y permisos necesarios

**Para Frontend:** Siempre incluir:

- Componentes reutilizables
- Manejo de errores robusto
- Estados de loading/error
- Integración con sistema de alertas
- Tests unitarios correspondientes

---
---

## ✨ **ACTUALIZACIONES RECIENTES**

- ✅ **24/09/2025:** Se actualizó el branding principal configurando el icono de la app y el favicon para que utilicen `assets/images/G.png`, asegurando consistencia visual en mobile y web.

---

## 📊 **PROGRESO GENERAL DEL PROYECTO**

**🎯 Progreso Total: 25.5%**

- ✅ **Fase 1 - Seguridad Crítica:** 100% COMPLETADO
- ✅ **Fase 2 - Sistema de Reportes:** 90% COMPLETADO (Solo falta panel de moderación y notificaciones)
- ⏳ **Fase 3 - Sistema de Bloqueo:** 0% PLANIFICADO
- ⏳ **Fase 4 - Moderación de Contenido:** 0% PLANIFICADO
- ⏳ **Fase 5 - Notificaciones Push:** 0% PLANIFICADO
- 🔄 **Fase 6 - Sistema de Compartir:** 35% EN PROCESO (Modal de progreso enriquecido y captura vertical optimizada con mayor cobertura de calendario y métricas)
- ⏳ **Fase 7 - Optimización:** 0% PLANIFICADO

---

_Documento actualizado: 24 de septiembre de 2025_
_Estado: Fase 1 completada (100%), Fase 2 en progreso (50% - backend completado), Fase 6 avanzando (35%)_
_Próximo hito: Implementar botones de compartir en posts y flujo de compartido interno_
