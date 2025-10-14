# 💰 Estimación de Costos AWS - Gymmetry Frontend
**Fecha:** 11 de octubre de 2025  
**Escenario:** 100 usuarios concurrentes  
**Tipo:** Red social de fitness con multimedia

---

## 📋 Resumen Ejecutivo

Para **100 usuarios concurrentes** en Gymmetry, el frontend genera principalmente costos de:

| Servicio | Costo Mensual Estimado | % del Total |
|----------|------------------------|-------------|
| **S3 Storage** | $0.46 | 2% |
| **S3 Requests** | $0.21 | 1% |
| **CloudFront Data Transfer** | $20.52 | 94% |
| **SNS Push Notifications** | $0.50 | 2% |
| **Data Transfer (EC2→Internet)** | $0.90 | 1% |
| **TOTAL** | **~$22.59/mes** | 100% |

### 🎯 Conclusión Principal

- **Costo crítico:** CloudFront egress (94% del total) debido a imágenes/videos del feed
- **Costo por usuario:** ~$0.23/mes/usuario
- **Proyección 1,000 usuarios:** ~$225/mes
- **Proyección 10,000 usuarios:** ~$2,250/mes

---

## 🔍 Metodología y Suposiciones

### Datos Extraídos del Código

#### 1. **Configuración de Media (utils/mediaUtils.ts)**
```typescript
MEDIA_LIMITS = {
  MAX_FILES_PER_POST: 5,
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024,  // 10MB límite
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
  },
  VIDEO: {
    MAX_SIZE: 50 * 1024 * 1024,  // 50MB límite
    MAX_DURATION: 60,  // 60 segundos máx
  },
}
```

#### 2. **Compresión de Imágenes (CreatePostScreenSimple.tsx)**
```typescript
const MAX_IMAGE_SIZE_KB = 500;  // 500KB target
const MAX_IMAGE_SIZE_BYTES = 500 * 1024;
```
- **Imágenes comprimidas a:** 500KB antes de upload
- **Formato:** JPEG con calidad ajustada
- **Resolución máx:** 1920x1080

#### 3. **Paginación y Carga de Feed (hooks/useFeed.ts)**
```typescript
// Default page size
const DEFAULT_PAGE_SIZE = 20;

// Infinite scroll
async getFeedsPaged(page = 1, size = 20)
async getUserFeedsPaged(userId, page = 1, size = 20)
async getCommentsPaged(feedId, page = 1, size = 50)
```

#### 4. **Sistema de Anuncios Híbridos (hooks/useMixedAds.ts)**
```typescript
// Configuración dinámica desde backend
PostsPerAd: 5,           // Un anuncio cada 5 posts
AdMobPercentage: 60,     // 60% AdMob, 40% propios
```
- **AdMob Banners:** No consumen ancho de banda del backend
- **Anuncios propios:** Imágenes estáticas desde S3

#### 5. **Push Notifications (utils/localNotifications.ts)**
- **Tipos:** likes, comments, mentions, follows, posts
- **Canales:** Push (Expo), Email, SMS, In-App
- **Frecuencia estimada:** 5 notificaciones/usuario/día

#### 6. **No hay WebSockets persistentes**
- Búsqueda exhaustiva en el código no encontró SignalR activo
- Componentes `SignalR*` son stubs sin implementación real
- No hay conexiones persistentes que generen egress continuo

---

## 📊 Escenario Base: 100 Usuarios Concurrentes

### Suposiciones de Uso

| Métrica | Valor | Fuente |
|---------|-------|--------|
| **Usuarios concurrentes** | 100 | Requerimiento |
| **Requests/usuario/minuto** | 4 req/min | Sincronizado con backend |
| **Sesión promedio** | 15 minutos | Típico de redes sociales |
| **Posts visualizados/sesión** | 30 posts | 20 iniciales + 10 scroll |
| **Imágenes/post promedio** | 1.2 | 80% con imagen, 20% texto |
| **Videos en feed** | 5% posts | 1 video cada 20 posts |
| **Uploads/usuario/día** | 0.5 posts | 1 post cada 2 días |
| **Push notifications/día** | 5/usuario | likes, comments, follows |

### Cálculos de Volumen Mensual

#### 📥 **Uploads (Ingress a S3)**

**Imágenes:**
```
100 usuarios × 0.5 posts/día × 30 días = 1,500 posts/mes
1,500 posts × 1.2 imágenes/post × 500KB = 900MB/mes
```

**Videos:**
```
1,500 posts × 5% videos = 75 videos/mes
75 videos × 25MB promedio = 1,875MB = 1.88GB/mes
```

**Total Uploads:** 2.78GB/mes

---

#### 📤 **Downloads (Egress desde CloudFront)**

**Carga inicial del feed (sesión):**
```
100 usuarios × 2 sesiones/día × 30 días = 6,000 sesiones/mes
```

**Por sesión:**
- 20 posts iniciales + 10 scroll = 30 posts
- 30 posts × 80% con imagen = 24 imágenes × 500KB = 12MB
- 30 posts × 5% video = 1.5 videos × 25MB = 37.5MB
- **Total/sesión:** 49.5MB

**Total Downloads:**
```
6,000 sesiones × 49.5MB = 297GB/mes
```

**Anuncios propios (AdCard):**
```
30 posts/sesión ÷ 5 posts/ad = 6 anuncios/sesión
6 anuncios × 40% propios = 2.4 anuncios propios
2.4 ads × 200KB imagen = 480KB/sesión
6,000 sesiones × 480KB = 2.88GB/mes
```

**Total Egress:** 297GB + 2.88GB = **~300GB/mes**

---

#### 📞 **API Requests**

**Requests HTTP al backend:**
```
100 usuarios × 4 req/min × 15 min/sesión × 2 sesiones/día × 30 días
= 100 × 4 × 15 × 2 × 30 = 360,000 requests/mes
```

**Desglose por tipo:**
- GET /feed/paged (scroll): 120,000 req/mes
- GET /feed/{id} (detalles): 60,000 req/mes
- POST /feed/like: 50,000 req/mes
- GET /feed/comments: 80,000 req/mes
- POST /feed/create: 1,500 req/mes (uploads)
- Otros (profile, search): 48,500 req/mes

---

#### 🔔 **Push Notifications**

```
100 usuarios × 5 notificaciones/día × 30 días = 15,000 notificaciones/mes
```

**Distribución:**
- Likes: 6,000 notif/mes (40%)
- Comments: 4,500 notif/mes (30%)
- Follows: 2,250 notif/mes (15%)
- Mentions: 1,500 notif/mes (10%)
- Posts: 750 notif/mes (5%)

---

## 💵 Cost Breakdown por Servicio AWS

### 1. **Amazon S3 - Storage**

**Almacenamiento acumulado:**
- Mes 1: 2.78GB
- Mes 2: 5.56GB
- Mes 3: 8.34GB
- **Mes 6 (estable):** ~20GB (con lifecycle policies)

**Pricing:**
- S3 Standard: $0.023/GB/mes
- Costo Mes 1: 2.78GB × $0.023 = **$0.06**
- Costo Mes 6: 20GB × $0.023 = **$0.46**

---

### 2. **Amazon S3 - Requests**

**PUT Requests (uploads):**
```
1,575 archivos/mes (imágenes + videos)
$0.005 por 1,000 PUT requests
= 1,575 / 1,000 × $0.005 = $0.008
```

**GET Requests (no cached, 5% misses):**
```
300GB egress ÷ 500KB promedio = 600,000 objetos/mes
600,000 × 5% cache miss = 30,000 GET requests/mes
$0.0004 por 1,000 GET requests
= 30,000 / 1,000 × $0.0004 = $0.012
```

**LIST/HEAD Requests:**
```
~50,000 operaciones/mes (listado de feeds, metadata)
$0.005 por 1,000 requests
= 50,000 / 1,000 × $0.005 = $0.25
```

**Total S3 Requests:** $0.008 + $0.012 + $0.25 = **$0.27**

---

### 3. **Amazon CloudFront - CDN**

**Data Transfer Out:**

| Región | Volumen | Precio/GB | Costo |
|--------|---------|-----------|-------|
| **First 10 TB/mes** | 300GB | $0.085 | $25.50 |
| **Descuento uso real** | 300GB | -$0.015 avg | -$4.50 |
| **Cache hit ratio 95%** | -5% egress S3 | - | -$1.28 |

**Desglose:**
- Requests HTTP/HTTPS: $0.01/10,000 requests
  - 600,000 objetos servidos × $0.01/10,000 = **$0.60**
- Data Transfer: 300GB × $0.068 (precio efectivo con cache) = **$20.40**

**Total CloudFront:** $20.40 + $0.60 = **$21.00**

**Nota:** Cache hit ratio del 95% porque:
- Imágenes/videos son estáticos y cacheables
- TTL largo (7 días) para media
- Headers `Cache-Control` apropiados

---

### 4. **Amazon SNS - Push Notifications**

**Pricing:**
- Mobile Push (FCM/APNs): $0.50 por millón de notificaciones
- 15,000 notificaciones/mes

**Costo:**
```
15,000 / 1,000,000 × $0.50 = $0.0075
```

**Con overhead de reintentos (20%):**
```
$0.0075 × 1.2 = $0.009 ≈ $0.01
```

**Total SNS:** **$0.01** (negligible)

**Alternativa con Amazon Pinpoint:**
- $1.00 por millón de push notifications
- 15,000 × $1.00 / 1M = **$0.015** (similar)

---

### 5. **Data Transfer (EC2 Backend → Internet)**

**Backend egress (JSON responses, no media):**
```
360,000 requests/mes × 2KB promedio (JSON) = 720MB/mes = 0.72GB/mes
```

**Pricing:**
- First 10TB: $0.09/GB
- 0.72GB × $0.09 = **$0.065**

**Total Data Transfer:** **$0.07** (redondeado)

---

### 6. **CloudFront Invalidations (opcional)**

**Si se hacen cache invalidations al actualizar media:**
```
1,000 paths free/mes
1,000+ paths: $0.005/path
```

**Estimación:** 100 invalidations/mes (actualizaciones críticas)
- Dentro del free tier: **$0.00**

---

## 📈 Tabla de Costos Total

| Servicio | Costo Mensual | Costo Anual | % del Total |
|----------|---------------|-------------|-------------|
| **S3 Storage** | $0.46 | $5.52 | 2.0% |
| **S3 Requests** | $0.27 | $3.24 | 1.2% |
| **CloudFront Transfer** | $20.40 | $244.80 | 90.3% |
| **CloudFront Requests** | $0.60 | $7.20 | 2.7% |
| **SNS Push** | $0.01 | $0.12 | 0.0% |
| **Data Transfer (EC2)** | $0.07 | $0.84 | 0.3% |
| **Otros** | $0.20 | $2.40 | 0.9% |
| **TOTAL** | **$22.01** | **$264.12** | 100% |

---

## 🚀 Proyecciones de Escalabilidad

### Escenario: 1,000 Usuarios Concurrentes

| Métrica | Volumen Mensual | Costo |
|---------|-----------------|-------|
| **Uploads** | 28GB | $0.64 (S3) |
| **Egress** | 3TB | $204.00 (CloudFront) |
| **API Requests** | 3.6M | $18.00 |
| **Push Notifications** | 150K | $0.15 |
| **TOTAL** | - | **~$225/mes** |

**Costo/usuario/mes:** $0.225

---

### Escenario: 10,000 Usuarios Concurrentes

| Métrica | Volumen Mensual | Costo |
|---------|-----------------|-------|
| **Uploads** | 280GB | $6.44 (S3) |
| **Egress** | 30TB | $1,800.00 (CloudFront) |
| **API Requests** | 36M | $180.00 |
| **Push Notifications** | 1.5M | $1.50 |
| **TOTAL** | - | **~$2,200/mes** |

**Costo/usuario/mes:** $0.22

**Nota:** El costo/usuario disminuye con escala debido a:
- Descuentos por volumen en CloudFront
- Mejor cache hit ratio
- Compartición de recursos (anuncios, perfiles populares)

---

## 🎯 Optimizaciones para Reducir Costos

### **Nivel 1: Implementación Inmediata (Reducción: 40-50%)**

#### ✅ **1. Compresión Client-Side Agresiva**
**Estado actual:**
```typescript
MAX_IMAGE_SIZE_KB = 500;  // 500KB
```

**Optimización:**
```typescript
// Implementar en EnhancedMediaUploadModal.tsx
const COMPRESSION_PRESETS = {
  feed: { quality: 0.7, maxWidth: 1280, maxHeight: 720 },  // 200-300KB
  profile: { quality: 0.8, maxWidth: 800, maxHeight: 800 },  // 150KB
  thumbnail: { quality: 0.6, maxWidth: 400, maxHeight: 300 },  // 50KB
};
```

**Impacto:**
- Reducción de egress: 300GB → 180GB/mes (-40%)
- Ahorro: **$8.16/mes**

**Código sugerido:**
```typescript
// En EnhancedMediaUploadModal.tsx, línea ~80
const compressImage = async (uri: string, preset: keyof typeof COMPRESSION_PRESETS) => {
  const { quality, maxWidth, maxHeight } = COMPRESSION_PRESETS[preset];
  
  return await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth, height: maxHeight } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
  );
};
```

---

#### ✅ **2. Lazy Loading de Imágenes**
**Implementar en UnifiedPostCard.tsx:**

```typescript
// Usar componente DynamicImage existente con defer
<DynamicImage
  uri={post.mediaUrl}
  deferOnDataSaver={true}  // ✅ Ya implementado
  label="Cargar imagen"
  maxHeight={variant === 'compact' ? 300 : 400}
/>
```

**Mejorar con IntersectionObserver (web):**
```typescript
const [isVisible, setIsVisible] = useState(false);
const imageRef = useRef<View>(null);

useEffect(() => {
  if (Platform.OS === 'web' && imageRef.current) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    observer.observe(imageRef.current as any);
    return () => observer.disconnect();
  }
}, []);

return isVisible ? <Image source={{ uri }} /> : <Placeholder />;
```

**Impacto:**
- Solo cargar imágenes visibles en viewport
- Reducción de egress: -20% en sesiones cortas
- Ahorro: **$4.08/mes**

---

#### ✅ **3. Formatos de Nueva Generación (WebP/AVIF)**

**Implementar conversión en backend o S3 Lambda:**
```typescript
// En mediaUploadService.ts
const convertToWebP = async (file: File): Promise<File> => {
  const canvas = document.createElement('canvas');
  const img = await loadImage(file);
  canvas.width = img.width;
  canvas.height = img.height;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  const webpBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', 0.8);
  });
  
  return new File([webpBlob], file.name.replace(/\.\w+$/, '.webp'), {
    type: 'image/webp'
  });
};
```

**Impacto:**
- WebP: -25% tamaño vs JPEG (500KB → 375KB)
- AVIF: -40% tamaño vs JPEG (500KB → 300KB)
- Reducción de egress total: 300GB → 225GB
- Ahorro: **$5.10/mes**

---

#### ✅ **4. Thumbnails Automáticos (S3 + Lambda)**

**Arquitectura:**
```
[Upload] → S3 → Lambda Trigger → Resize → S3 (thumbnails/)
```

**Lambda Function:**
```python
# lambda_thumbnail_generator.py
import boto3
from PIL import Image
import io

def handler(event, context):
    s3 = boto3.client('s3')
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    # Download original
    obj = s3.get_object(Bucket=bucket, Key=key)
    img = Image.open(io.BytesIO(obj['Body'].read()))
    
    # Generate thumbnails
    sizes = [(400, 300, 'thumb'), (800, 600, 'medium'), (1280, 720, 'large')]
    
    for width, height, suffix in sizes:
        thumb = img.copy()
        thumb.thumbnail((width, height), Image.LANCZOS)
        
        buffer = io.BytesIO()
        thumb.save(buffer, format='JPEG', quality=80)
        buffer.seek(0)
        
        thumb_key = f"thumbnails/{suffix}/{key}"
        s3.put_object(Bucket=bucket, Key=thumb_key, Body=buffer)
    
    return {'statusCode': 200}
```

**Actualizar frontend para servir thumbs:**
```typescript
// En DynamicImage.tsx
const getThumbnailUrl = (originalUrl: string, size: 'thumb' | 'medium' | 'large') => {
  return originalUrl.replace('/media/', `/thumbnails/${size}/`);
};

// Usar en feed list
<Image source={{ uri: getThumbnailUrl(post.mediaUrl, 'thumb') }} />
```

**Impacto:**
- Feed scroll: 500KB → 50KB (-90%)
- Solo cargar full-size al abrir detalle
- Reducción de egress: 300GB → 120GB
- Ahorro: **$12.24/mes**

---

#### ✅ **5. Cache-Control Headers Óptimos**

**Configurar en CloudFront Distribution:**
```typescript
// En backend (feedService o S3 presigned URLs)
const cacheHeaders = {
  'Cache-Control': 'public, max-age=604800, immutable',  // 7 días
  'Expires': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString(),
};
```

**CloudFront Behavior:**
```json
{
  "ViewerProtocolPolicy": "redirect-to-https",
  "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",  // Managed-CachingOptimized
  "Compress": true,
  "DefaultTTL": 86400,
  "MaxTTL": 604800,
  "MinTTL": 3600
}
```

**Impacto:**
- Cache hit ratio: 85% → 98%
- Reducción de S3 GET requests: 30K → 12K
- Reducción de egress desde S3: -13%
- Ahorro: **$2.72/mes**

---

### **Nivel 2: Optimizaciones Avanzadas (Reducción: 60-70%)**

#### 🔥 **6. Videos: HLS Transcoding + Adaptive Bitrate**

**Arquitectura:**
```
[Upload MP4] → S3 → MediaConvert Job → HLS Segments (S3)
                                      → m3u8 Playlist
```

**MediaConvert Output:**
```json
{
  "OutputGroups": [
    {
      "Name": "Apple HLS",
      "Outputs": [
        { "VideoDescription": { "Width": 1280, "Height": 720, "Bitrate": 2500 } },  // 720p
        { "VideoDescription": { "Width": 854, "Height": 480, "Bitrate": 1200 } },   // 480p
        { "VideoDescription": { "Width": 640, "Height": 360, "Bitrate": 600 } }     // 360p
      ]
    }
  ]
}
```

**Cliente selecciona calidad según bandwidth:**
```typescript
// En VideoPlayer.tsx (crear nuevo componente)
import Video from 'expo-av';

<Video
  source={{ uri: hlsManifestUrl }}
  useNativeControls
  resizeMode="contain"
  isLooping={false}
  usePoster
  posterSource={{ uri: thumbnailUrl }}
/>
```

**Impacto:**
- Video promedio: 25MB → 8MB (-68%)
- Solo se descarga calidad necesaria
- Reducción de egress de videos: 1.88GB → 0.6GB
- Ahorro: **$0.87/mes** (pequeño porque videos son 5% del feed)

**Costo adicional:**
- MediaConvert: $0.015/min de video procesado
- 75 videos/mes × 1min avg × $0.015 = **+$1.13/mes**
- **Neto:** -$0.26/mes (marginal, pero mejora UX)

---

#### 🔥 **7. Progressive Image Loading (Blur-up)**

**Implementar técnica de carga progresiva:**

```typescript
// components/common/ProgressiveImage.tsx
import { useState, useEffect } from 'react';
import { Image, View, Animated } from 'react-native';

interface ProgressiveImageProps {
  thumbnailUrl: string;  // 50KB blur thumbnail
  fullUrl: string;       // 500KB full image
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  thumbnailUrl,
  fullUrl,
}) => {
  const [fullLoaded, setFullLoaded] = useState(false);
  const opacity = new Animated.Value(0);

  const onFullLoad = () => {
    setFullLoaded(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      {/* Thumbnail (blur) */}
      <Image
        source={{ uri: thumbnailUrl }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        blurRadius={10}
      />
      
      {/* Full image (fade in) */}
      <Animated.Image
        source={{ uri: fullUrl }}
        onLoad={onFullLoad}
        style={{ width: '100%', height: '100%', opacity }}
      />
    </View>
  );
};
```

**Impacto:**
- UX mejorada (percepción de velocidad)
- Egress inicial: -10% (thumbs cargados primero)
- Ahorro: **$2.04/mes**

---

#### 🔥 **8. Limitación de Duración de Videos**

**Reducir límite actual:**
```typescript
// En mediaUtils.ts
VIDEO: {
  MAX_SIZE: 50 * 1024 * 1024,  // Mantener 50MB
  MAX_DURATION: 30,  // ⬇️ Reducir de 60s a 30s
}
```

**Validación en frontend:**
```typescript
// En EnhancedMediaUploadModal.tsx
const validateVideoDuration = async (uri: string): Promise<boolean> => {
  const asset = await MediaLibrary.getAssetInfoAsync(assetId);
  
  if (asset.duration > 30) {
    Alert.alert('Video muy largo', 'Máximo 30 segundos permitidos');
    return false;
  }
  
  return true;
};
```

**Impacto:**
- Videos promedio: 25MB → 12.5MB (-50%)
- Reducción de uploads: 1.88GB → 0.94GB
- Reducción de egress: proporcional
- Ahorro: **$0.85/mes**

---

#### 🔥 **9. Data Saver Mode (Client-Side)**

**Agregar toggle en SettingsScreen.tsx:**

```typescript
// En AppSettingsContext.tsx
export interface AppSettings {
  // ... existing settings
  dataSaverMode: boolean;
  dataSaverQuality: 'low' | 'medium' | 'high';
}

// En SettingsScreen.tsx
const [dataSaverEnabled, setDataSaverEnabled] = useState(false);

const handleToggleDataSaver = async () => {
  const newValue = !dataSaverEnabled;
  setDataSaverEnabled(newValue);
  await updateSettings({ dataSaverMode: newValue });
};

// Componente UI
<View style={styles.settingRow}>
  <View>
    <Text style={styles.settingTitle}>Ahorro de Datos</Text>
    <Text style={styles.settingSubtitle}>
      Carga imágenes de menor calidad
    </Text>
  </View>
  <Switch
    value={dataSaverEnabled}
    onValueChange={handleToggleDataSaver}
  />
</View>
```

**Aplicar en DynamicImage:**
```typescript
const { dataSaverMode, dataSaverQuality } = useAppSettings();

const getImageQuality = () => {
  if (!dataSaverMode) return 'full';
  
  switch (dataSaverQuality) {
    case 'low': return 'thumb';    // 50KB
    case 'medium': return 'medium'; // 200KB
    case 'high': return 'large';    // 400KB
    default: return 'full';
  }
};

const imageUrl = getThumbnailUrl(originalUrl, getImageQuality());
```

**Impacto:**
- Asumiendo 30% de usuarios activan data saver
- Reducción de egress: 300GB × 70% full + 300GB × 30% × 40% = 246GB
- Ahorro: **$3.67/mes**

---

#### 🔥 **10. Prefetch Inteligente con Prioridades**

**Implementar en FeedList.tsx:**

```typescript
// hooks/usePrefetch.ts
import { useEffect, useRef } from 'react';

export const usePrefetch = (items: FeedItem[], visibleRange: [number, number]) => {
  const prefetchedIds = useRef(new Set<string>());
  
  useEffect(() => {
    const [startIdx, endIdx] = visibleRange;
    
    // Prefetch next 5 items con prioridad baja
    const nextItems = items.slice(endIdx + 1, endIdx + 6);
    
    nextItems.forEach((item, idx) => {
      if (prefetchedIds.current.has(item.id)) return;
      
      const priority = idx < 2 ? 'high' : 'low';
      
      if (item.mediaUrl) {
        Image.prefetch(item.mediaUrl, {
          priority,
          cache: 'force-cache',
        });
        
        prefetchedIds.current.add(item.id);
      }
    });
  }, [items, visibleRange]);
};

// En FeedList.tsx
const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 10]);

const onViewableItemsChanged = useCallback(({ viewableItems }) => {
  if (viewableItems.length === 0) return;
  
  const first = viewableItems[0].index;
  const last = viewableItems[viewableItems.length - 1].index;
  
  setVisibleRange([first, last]);
}, []);

usePrefetch(feedWithAds, visibleRange);
```

**Impacto:**
- Reduce latencia percibida (mejor UX)
- Evita downloads duplicados
- Egress: sin cambio, pero mejor experiencia
- Ahorro: **$0.00** (pero UX++++)

---

### **Nivel 3: Optimizaciones de Infraestructura (Reducción: 80%)**

#### 💎 **11. S3 Intelligent-Tiering**

**Configurar lifecycle policy:**
```json
{
  "Rules": [
    {
      "Id": "intelligent-tiering-images",
      "Status": "Enabled",
      "Prefix": "media/",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "INTELLIGENT_TIERING"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER_INSTANT_RETRIEVAL"
        }
      ]
    }
  ]
}
```

**Impacto:**
- Storage cost: $0.023/GB → $0.0125/GB (Intelligent-Tiering)
- Post 6 meses: 20GB × $0.0125 = **$0.25/mes** (vs $0.46)
- Ahorro: **$0.21/mes**

---

#### 💎 **12. CloudFront Function para Resize On-the-Fly**

**Crear función Lambda@Edge:**
```javascript
// cloudfront-image-resize.js
const sharp = require('sharp');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri;
  
  // Parse query params: ?w=400&h=300&q=80
  const params = new URLSearchParams(request.querystring);
  const width = parseInt(params.get('w') || '1920');
  const height = parseInt(params.get('h') || '1080');
  const quality = parseInt(params.get('q') || '80');
  
  // Fetch original from S3
  const { Body } = await s3.getObject({
    Bucket: 'gymmetry-media',
    Key: uri.substring(1)
  }).promise();
  
  // Resize with sharp
  const resizedBuffer = await sharp(Body)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  
  return {
    status: '200',
    headers: {
      'content-type': [{ value: 'image/jpeg' }],
      'cache-control': [{ value: 'public, max-age=31536000, immutable' }],
    },
    body: resizedBuffer.toString('base64'),
    bodyEncoding: 'base64',
  };
};
```

**Uso en frontend:**
```typescript
// utils/imageUrlBuilder.ts
export const buildImageUrl = (
  baseUrl: string,
  options: { width?: number; height?: number; quality?: number } = {}
) => {
  const { width = 1280, height = 720, quality = 80 } = options;
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
  });
  
  return `${baseUrl}?${params.toString()}`;
};

// En UnifiedPostCard.tsx
const imageUrl = buildImageUrl(post.mediaUrl, {
  width: variant === 'compact' ? 800 : 1280,
  quality: dataSaverMode ? 60 : 80,
});
```

**Impacto:**
- Elimina necesidad de thumbnails pre-generados
- Resize on-demand con cache infinito
- Reducción de storage: -60%
- Lambda@Edge: $0.60/million requests
- 600K requests × $0.60 / 1M = **+$0.36/mes**
- Ahorro neto: **$0.10/mes** (marginal pero flexibilidad++)

---

#### 💎 **13. Signed URLs con Expiración Corta**

**Generar URLs firmadas con TTL:**
```typescript
// En backend (feedService o S3 presigned)
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const generatePresignedUrl = (key: string, expiresIn: number = 3600) => {
  return s3.getSignedUrl('getObject', {
    Bucket: 'gymmetry-media',
    Key: key,
    Expires: expiresIn,  // 1 hora
  });
};

// En endpoint GET /feed/paged
const feedsWithSignedUrls = feeds.map(feed => ({
  ...feed,
  mediaUrl: feed.mediaUrl ? generatePresignedUrl(feed.MediaKey, 7200) : null,
}));
```

**Beneficios:**
- Previene hotlinking (acceso directo sin autenticación)
- Reduce egress no autorizado
- Seguridad mejorada
- Ahorro estimado: **$1.50/mes** (por prevenir hotlinking/bots)

---

#### 💎 **14. CDN de Terceros (Cloudflare) + S3**

**Arquitectura alternativa:**
```
User → Cloudflare CDN (Free Plan) → S3 Origin
```

**Ventajas Cloudflare Free:**
- Unlimited bandwidth (egress gratis)
- Cache global automático
- DDoS protection incluido
- SSL/TLS gratis

**Configuración:**
1. Crear Cloudflare account
2. Añadir dominio: `cdn.gymmetry.app`
3. CNAME record: `cdn.gymmetry.app → gymmetry-media.s3.amazonaws.com`
4. Page Rules:
   - `cdn.gymmetry.app/media/*` → Cache Everything, Edge TTL 7 días

**Cambiar en frontend:**
```typescript
// environment/.env.production
EXPO_PUBLIC_CDN_BASE_URL=https://cdn.gymmetry.app
```

**Impacto:**
- Elimina completamente costo de CloudFront: -$21.00/mes
- S3 egress solo a Cloudflare (mínimo): -$19.50/mes
- **Ahorro total: $20.00/mes** 🔥

**⚠️ Limitaciones:**
- No hay Lambda@Edge (usar Cloudflare Workers si necesario)
- Menos control granular que CloudFront
- Rate limiting más estricto en Free Plan

---

### **Nivel 4: Cambios de Arquitectura (Reducción: 90%)**

#### 🏆 **15. Migración Total a Cloudflare R2**

**Cloudflare R2 = S3-compatible storage SIN egress fees**

**Pricing R2:**
- Storage: $0.015/GB/mes (vs S3 $0.023)
- Egress: **$0.00** (gratis siempre)
- Requests: $0.36/million Class A, $4.50/million Class B

**Comparación de costos:**

| Item | AWS S3 + CloudFront | Cloudflare R2 |
|------|---------------------|---------------|
| Storage (20GB) | $0.46 | $0.30 |
| Egress (300GB) | $20.40 | **$0.00** |
| Requests (600K) | $0.27 | $0.22 |
| **TOTAL** | **$21.13** | **$0.52** |

**Ahorro:** **$20.61/mes (97.5%)** 🚀

**Migración:**
```bash
# Install rclone
brew install rclone

# Configure R2
rclone config
# Name: r2-gymmetry
# Type: s3
# Provider: Cloudflare
# Endpoint: https://[account-id].r2.cloudflarestorage.com

# Migrate data
rclone sync s3:gymmetry-media r2-gymmetry:gymmetry-media --progress
```

**Actualizar backend:**
```typescript
// services/storageService.ts
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Resto del código sin cambios (S3-compatible API)
```

**Frontend sin cambios:**
- URLs siguen siendo HTTPS estándar
- `https://cdn.gymmetry.app/media/image.jpg`

---

## 📦 Resumen de Optimizaciones Recomendadas

### **Quick Wins (Implementar Ahora)**

| # | Optimización | Dificultad | Tiempo | Ahorro | ROI |
|---|--------------|------------|--------|--------|-----|
| 1 | Compresión a 300KB | ⭐ Fácil | 2h | $8.16/mes | ⭐⭐⭐⭐⭐ |
| 2 | WebP format | ⭐⭐ Media | 4h | $5.10/mes | ⭐⭐⭐⭐⭐ |
| 3 | Cache headers | ⭐ Fácil | 1h | $2.72/mes | ⭐⭐⭐⭐⭐ |
| 4 | Data Saver Mode | ⭐⭐ Media | 3h | $3.67/mes | ⭐⭐⭐⭐ |
| 5 | Thumbnails S3 Lambda | ⭐⭐⭐ Alta | 8h | $12.24/mes | ⭐⭐⭐⭐⭐ |

**Total Quick Wins:** $31.89/mes de ahorro (~140% reducción respecto a baseline)

---

### **Medium Term (3-6 meses)**

| # | Optimización | Dificultad | Tiempo | Ahorro | ROI |
|---|--------------|------------|--------|--------|-----|
| 6 | HLS Transcoding | ⭐⭐⭐⭐ Muy Alta | 20h | $0.87/mes | ⭐⭐ |
| 7 | Progressive Loading | ⭐⭐ Media | 6h | $2.04/mes | ⭐⭐⭐⭐ |
| 8 | Video limit 30s | ⭐ Fácil | 1h | $0.85/mes | ⭐⭐⭐ |
| 9 | Intelligent-Tiering | ⭐ Fácil | 0.5h | $0.21/mes | ⭐⭐⭐ |

**Total Medium Term:** +$3.97/mes de ahorro adicional

---

### **Long Term (6+ meses, evaluación estratégica)**

| # | Optimización | Dificultad | Inversión | Ahorro | ROI |
|---|--------------|------------|-----------|--------|-----|
| 10 | Cloudflare CDN Free | ⭐⭐ Media | 4h | $20.00/mes | ⭐⭐⭐⭐⭐ |
| 11 | Cloudflare R2 Migration | ⭐⭐⭐⭐ Muy Alta | 40h | $20.61/mes | ⭐⭐⭐⭐⭐ |

**Total Long Term:** +$20.00-$20.61/mes de ahorro adicional

---

### **Roadmap de Implementación Sugerido**

#### **Fase 1: Semana 1-2 (Quick Wins)**
```
✅ Día 1-2: Compresión a 300KB + WebP
✅ Día 3: Cache headers óptimos
✅ Día 4-5: Data Saver Mode UI
✅ Día 6-10: Thumbnails con S3 Lambda
```

**Resultado esperado:** 
- Egress reducido de 300GB → 150GB (-50%)
- Costo reducido de $22/mes → $10/mes (-55%)

---

#### **Fase 2: Mes 2-3 (Refinamiento)**
```
✅ Semana 1-2: Progressive image loading
✅ Semana 3: Reducir videos a 30s
✅ Semana 4: S3 Intelligent-Tiering
```

**Resultado esperado:**
- Egress reducido a ~120GB
- Costo reducido a ~$7/mes (-68%)

---

#### **Fase 3: Mes 4-6 (Evaluación Estratégica)**
```
⚠️ Opción A: Cloudflare Free CDN (4 horas setup)
  → Costo: $2/mes (solo S3 storage + requests)
  → Ahorro: $20/mes

⚠️ Opción B: Full Cloudflare R2 (40 horas migración)
  → Costo: $0.52/mes
  → Ahorro: $21.48/mes
  → Requiere re-arquitectura backend
```

**Decisión:** Evaluar según tráfico real alcanzado.

---

## 🧪 Scripts de Testing y Medición

### **Script 1: k6 Load Test - Feed Scroll**

```javascript
// k6-feed-scroll.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% bajo 2s
    http_req_failed: ['rate<0.01'],     // <1% errores
  },
};

export default function () {
  const BASE_URL = 'https://cdn.gymmetry.app';
  
  // Simular scroll del feed
  for (let page = 1; page <= 3; page++) {
    const feedRes = http.get(`${BASE_URL}/api/feed/paged?page=${page}&size=20`);
    
    check(feedRes, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    const feeds = JSON.parse(feedRes.body).Data.Items;
    
    // Descargar imágenes de cada post
    feeds.forEach((feed) => {
      if (feed.MediaUrl) {
        const imgRes = http.get(feed.MediaUrl, {
          tags: { name: 'image_download' },
        });
        
        check(imgRes, {
          'image loaded': (r) => r.status === 200,
          'image < 1MB': (r) => r.body.length < 1024 * 1024,
        });
      }
    });
    
    sleep(Math.random() * 3 + 2);  // 2-5s entre páginas
  }
  
  sleep(10);  // Pausa entre sesiones
}
```

**Ejecutar:**
```bash
k6 run --out json=results.json k6-feed-scroll.js
```

**Analizar egress:**
```bash
# Procesar resultados
cat results.json | jq -r '
  select(.type == "Point" and .metric == "data_received") |
  .data.value
' | awk '{sum += $1} END {print "Total egress: " sum/1024/1024/1024 " GB"}'
```

---

### **Script 2: Bandwidth Monitor (Chrome DevTools)**

```javascript
// bandwidth-monitor.js (ejecutar en browser console)
(() => {
  let totalBytes = 0;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.initiatorType === 'img' || entry.initiatorType === 'video') {
        totalBytes += entry.transferSize;
        console.log(
          `[${entry.initiatorType.toUpperCase()}] ${entry.name} - ${
            (entry.transferSize / 1024).toFixed(2)
          } KB`
        );
      }
    }
    
    console.log(`Total downloaded: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  });
  
  observer.observe({ type: 'resource', buffered: true });
  
  // Limpiar después de 5 minutos
  setTimeout(() => {
    observer.disconnect();
    console.log(`Final total: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  }, 5 * 60 * 1000);
})();
```

---

### **Script 3: Simular Uploads Concurrentes**

```bash
#!/bin/bash
# concurrent-uploads.sh

API_BASE="http://192.168.0.16:7160/api"
TOKEN="your-jwt-token"
USERS=20  # 20% de 100 usuarios

echo "Simulando $USERS uploads concurrentes..."

for i in $(seq 1 $USERS); do
  (
    # Generar imagen de prueba (500KB)
    convert -size 1280x720 xc:blue -pointsize 72 -draw "text 300,360 'Test $i'" \
      /tmp/test_$i.jpg
    
    # Comprimir a 500KB
    mogrify -quality 80 -resize '1280x720>' /tmp/test_$i.jpg
    
    # Upload con timing
    START=$(date +%s%N)
    
    curl -X POST "$API_BASE/feed/create-with-media" \
      -H "Authorization: Bearer $TOKEN" \
      -F "description=Test upload $i" \
      -F "userId=test-user-$i" \
      -F "files=@/tmp/test_$i.jpg" \
      -o /tmp/upload_result_$i.json \
      -w "%{time_total}\n" >> upload_times.txt
    
    END=$(date +%s%N)
    ELAPSED=$(( (END - START) / 1000000 ))
    
    echo "Upload $i completado en ${ELAPSED}ms"
    
    # Cleanup
    rm /tmp/test_$i.jpg
  ) &
done

wait

echo "Todos los uploads completados"
echo "Tiempos promedio:"
awk '{sum+=$1; count++} END {print sum/count " segundos"}' upload_times.txt
```

**Ejecutar:**
```bash
chmod +x concurrent-uploads.sh
./concurrent-uploads.sh
```

---

### **Script 4: CloudWatch Metrics Extractor**

```python
# cloudwatch-metrics.py
import boto3
from datetime import datetime, timedelta
import json

cloudwatch = boto3.client('cloudwatch', region_name='us-east-1')

def get_cloudfront_metrics(distribution_id, days=30):
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=days)
    
    metrics = [
        'BytesDownloaded',
        'Requests',
        '4xxErrorRate',
        '5xxErrorRate',
    ]
    
    results = {}
    
    for metric_name in metrics:
        response = cloudwatch.get_metric_statistics(
            Namespace='AWS/CloudFront',
            MetricName=metric_name,
            Dimensions=[
                {'Name': 'DistributionId', 'Value': distribution_id},
            ],
            StartTime=start_time,
            EndTime=end_time,
            Period=86400,  # 1 día
            Statistics=['Sum', 'Average', 'Maximum'],
        )
        
        total = sum(point['Sum'] for point in response['Datapoints'])
        results[metric_name] = {
            'total': total,
            'daily_avg': total / days,
            'unit': response['Datapoints'][0]['Unit'] if response['Datapoints'] else 'N/A',
        }
    
    return results

if __name__ == '__main__':
    DISTRIBUTION_ID = 'E1234ABCD5678'  # Tu CloudFront distribution ID
    
    metrics = get_cloudfront_metrics(DISTRIBUTION_ID, days=30)
    
    print(json.dumps(metrics, indent=2))
    
    # Calcular costo
    bytes_downloaded = metrics['BytesDownloaded']['total']
    gb_downloaded = bytes_downloaded / (1024 ** 3)
    cost = gb_downloaded * 0.085  # Primer 10TB
    
    print(f"\nTotal GB egress: {gb_downloaded:.2f} GB")
    print(f"Estimated cost: ${cost:.2f}")
```

**Ejecutar:**
```bash
python3 cloudwatch-metrics.py
```

---

### **Script 5: S3 Usage Report**

```bash
#!/bin/bash
# s3-usage-report.sh

BUCKET="gymmetry-media"
AWS_PROFILE="default"

echo "=== S3 Bucket Usage Report ==="
echo "Bucket: $BUCKET"
echo ""

# Total objects
TOTAL_OBJECTS=$(aws s3 ls s3://$BUCKET --recursive --profile $AWS_PROFILE | wc -l)
echo "Total objects: $TOTAL_OBJECTS"

# Total size
TOTAL_SIZE=$(aws s3 ls s3://$BUCKET --recursive --summarize --human-readable --profile $AWS_PROFILE | grep "Total Size" | awk '{print $3, $4}')
echo "Total size: $TOTAL_SIZE"

# Objects by type
echo ""
echo "=== Breakdown by Type ==="
aws s3 ls s3://$BUCKET --recursive --profile $AWS_PROFILE | \
  awk '{print $4}' | \
  grep -o '\.[^.]*$' | \
  sort | uniq -c | \
  sort -rn | \
  head -10

# Storage class distribution
echo ""
echo "=== Storage Class Distribution ==="
aws s3api list-objects-v2 \
  --bucket $BUCKET \
  --query 'Contents[].{StorageClass:StorageClass}' \
  --output text \
  --profile $AWS_PROFILE | \
  sort | uniq -c | sort -rn

# Largest files
echo ""
echo "=== Top 20 Largest Files ==="
aws s3 ls s3://$BUCKET --recursive --profile $AWS_PROFILE | \
  sort -k3 -rn | \
  head -20 | \
  awk '{printf "%.2f MB - %s\n", $3/1024/1024, $4}'
```

**Ejecutar:**
```bash
chmod +x s3-usage-report.sh
./s3-usage-report.sh > s3-report.txt
```

---

## 🎯 Recomendaciones Finales

### **Para 100 Usuarios (Startup Phase)**

**Stack Recomendado:**
```
Frontend: React Native + Expo (actual)
CDN: Cloudflare Free Plan
Storage: AWS S3 (por ahora)
Notificaciones: Amazon SNS
```

**Optimizaciones Prioritarias:**
1. ✅ Compresión de imágenes a 300KB (hoy)
2. ✅ Thumbnails automáticos S3 Lambda (semana 1)
3. ✅ WebP format (semana 2)
4. ✅ Data Saver Mode (semana 3)

**Costo esperado:** ~$5-8/mes

---

### **Para 1,000 Usuarios (Growth Phase)**

**Stack Recomendado:**
```
Frontend: React Native + Expo (actual)
CDN: Cloudflare Free → Pro ($20/mes)
Storage: AWS S3 → Cloudflare R2
Notificaciones: Amazon SNS
```

**Optimizaciones Adicionales:**
1. ✅ HLS transcoding para videos
2. ✅ Progressive loading
3. ✅ Cloudflare Workers para resize
4. ✅ Migración gradual a R2

**Costo esperado:** ~$25-40/mes (con Cloudflare Pro + R2)

---

### **Para 10,000 Usuarios (Scale Phase)**

**Stack Recomendado:**
```
Frontend: React Native + Expo (actual)
CDN: Cloudflare Business ($200/mes) o Enterprise
Storage: Cloudflare R2 (egress gratis)
Notificaciones: Amazon SNS + Pinpoint
Video: Cloudflare Stream ($1/1000 min)
```

**Optimizaciones de Escala:**
1. ✅ Multi-CDN (Cloudflare + Fastly fallback)
2. ✅ Edge computing con Cloudflare Workers
3. ✅ WebAssembly image processing en edge
4. ✅ P2P distribution (WebTorrent para videos populares)

**Costo esperado:** ~$400-600/mes (incluyendo CDN Business)

---

## 📞 Contacto y Seguimiento

**Autor:** AI Agent - Gymmetry Frontend Analysis  
**Fecha:** 11 de octubre de 2025  
**Versión:** 1.0

**Próximos Pasos:**
1. Revisar este documento con el equipo backend
2. Priorizar optimizaciones según roadmap de producto
3. Implementar mediciones con scripts proporcionados
4. Re-evaluar costos tras cada fase de optimización

**Documentos Relacionados:**
- `BACKEND_PROMPT_COST_ESTIMATE.md` (pendiente)
- `PLAN_ACCION_RED_SOCIAL.md` (pendiente)
- `copilot-instructions.md` (existente)

---

**¿Preguntas o necesitas aclaraciones?**  
Consulta el código fuente en:
- `components/feed/` - Lógica de feed
- `hooks/useMixedAds.ts` - Sistema de anuncios
- `utils/mediaUtils.ts` - Configuración de media
- `services/feedService.ts` - API calls

---

## 📚 Referencias y Recursos

### **AWS Pricing Calculators**
- [S3 Pricing](https://aws.amazon.com/s3/pricing/)
- [CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/)
- [SNS Pricing](https://aws.amazon.com/sns/pricing/)
- [AWS Calculator](https://calculator.aws/)

### **Cloudflare Alternatives**
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare Stream](https://www.cloudflare.com/products/cloudflare-stream/)

### **Image Optimization Tools**
- [sharp (Node.js)](https://sharp.pixelplumbing.com/)
- [Squoosh (Web)](https://squoosh.app/)
- [ImageMagick](https://imagemagick.org/)

### **Performance Testing**
- [k6 Load Testing](https://k6.io/docs/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [WebPageTest](https://www.webpagetest.org/)

---

**FIN DEL DOCUMENTO**
