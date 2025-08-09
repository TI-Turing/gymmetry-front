import React, { memo, useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
// Conservamos los tipos/exports por compatibilidad futura, pero no se usan en este render basado en SVG externo
// import { FRONT_MUSCLES, BACK_MUSCLES, MUSCLES_BY_ID, colorForMuscle } from './musclesPaths';

export type ActiveMuscle = {
  id: string; // ej: 'pectorales_superiores'
  role?: 'primary' | 'secondary';
};

interface BodyMusclesDiagramProps {
  width?: number | string; // admite porcentajes como '100%'
  height?: number | string; // permite porcentaje; si se omite, usa 100%
  // listado de ids de músculos activos o estructuras con role
  activeMuscles?: Array<string | ActiveMuscle>;
  // color por defecto de músculos inactivos
  defaultColor?: string;
  // escala general (zoom simple). Si no se pasa, ajusta a width/height automáticamente con viewBox
  scale?: number;
  // paleta visual: 'color' usa mapa por grupo; 'mono' imita el estilo de lámina anatómica (gris oscuro)
  palette?: 'color' | 'mono';
  // color de fondo del lienzo; útil para 'mono' (p. ej. '#fff'). Usa 'transparent' por defecto
  backgroundColor?: string;
  // Mapa opcional de opacidades por capa (key de overlay), para integrarse con API
  overlayOpacities?: Record<string, number>;
}

/**
 * BodyMusclesDiagram
 * - Renderiza músculos frontales y posteriores en un solo canvas (lado a lado)
 * - Paths independientes por músculo con ids semánticos
 * - Permite resaltar músculos activos con colores según grupo y opacidad por rol
 * - Optimizado con memo y cálculos precomputados
 */
const BodyMusclesDiagram: React.FC<BodyMusclesDiagramProps> = ({
  width = 360,
  height = '100%',
  activeMuscles = [], // reservado para futuras superposiciones
  defaultColor = '#cccccc', // sin uso en base SVG
  scale, // sin uso en base SVG
  palette = 'color',
  backgroundColor = 'transparent',
  overlayOpacities,
}) => {
  const [frontXml, setFrontXml] = useState<string | null>(null);
  const [backXml, setBackXml] = useState<string | null>(null);
  type OverlayLayer = { key: string; xml: string; opacity: number; side: 'front' | 'back' };
  const [overlayLayers, setOverlayLayers] = useState<OverlayLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const monoTransform = (xml: string) => {
    if (palette !== 'mono') return xml;
    // Reemplazar fills por un gris oscuro y strokes por gris claro
    let out = xml.replace(/fill="#([0-9a-fA-F]{3,6})"/g, 'fill="#2d2d2d"');
    out = out.replace(/stroke="#([0-9a-fA-F]{3,6})"/g, 'stroke="#f2f2f2"');
    return out;
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        // Definir módulos (ids de require) y metadatos para overlays
        const frontMod = require('../../assets/images/muscles/muscular_system_front.svg');
        const backMod = require('../../assets/images/muscles/muscular_system_back.svg');
        const overlayDefs = [
          { mod: require('../../assets/images/muscles/main/front-biceps.svg'), key: 'front-biceps', side: 'front' as const },
          { mod: require('../../assets/images/muscles/main/front-cuadriceps.svg'), key: 'front-cuadriceps', side: 'front' as const },
          { mod: require('../../assets/images/muscles/main/front-deltoides.svg'), key: 'front-deltoides', side: 'front' as const },
          { mod: require('../../assets/images/muscles/main/front-dorsales.svg'), key: 'front-dorsales', side: 'front' as const },
          { mod: require('../../assets/images/muscles/main/front-oblicuos.svg'), key: 'front-oblicuos', side: 'front' as const },
          { mod: require('../../assets/images/muscles/main/front-pectoralMayor.svg'), key: 'front-pectoralMayor', side: 'front' as const },
          { mod: require('../../assets/images/muscles/main/front-rectoAbdominal.svg'), key: 'front-rectoAbdominal', side: 'front' as const },
          { mod: require('../../assets/images/muscles/main/front-serratoAnterior.svg'), key: 'front-serratoAnterior', side: 'front' as const },
          { mod: require('../../assets/images/muscles/main/back-dorsal.svg'), key: 'back-dorsal', side: 'back' as const },
          { mod: require('../../assets/images/muscles/main/back-gluteos.svg'), key: 'back-gluteos', side: 'back' as const },
          { mod: require('../../assets/images/muscles/main/back-isquiotibiales.svg'), key: 'back-isquiotibiales', side: 'back' as const },
          { mod: require('../../assets/images/muscles/main/back-pantorrillas.svg'), key: 'back-pantorrillas', side: 'back' as const },
          { mod: require('../../assets/images/muscles/main/back-soleo.svg'), key: 'back-soleo', side: 'back' as const },
          { mod: require('../../assets/images/muscles/main/back-trapecio.svg'), key: 'back-trapecio', side: 'back' as const },
          { mod: require('../../assets/images/muscles/main/back-triceps.svg'), key: 'back-triceps', side: 'back' as const },
        ];

        // Cargar todos los assets de una vez y obtener instancias con localUri
        const allAssets = await Asset.loadAsync([
          frontMod,
          backMod,
          ...overlayDefs.map(d => d.mod),
        ]);
        const frontAsset = allAssets[0];
        const backAsset = allAssets[1];
        const overlayAssets = allAssets.slice(2);

        const readText = async (asset: Asset) => {
          const uri = asset.localUri || asset.uri;
          if (!uri) throw new Error('URI de asset no disponible');
          if (uri.startsWith('file://') || uri.startsWith('content://')) {
            return await FileSystem.readAsStringAsync(uri);
          }
          const resp = await fetch(uri);
          return await resp.text();
        };

        const [frontText, backText, overlayTexts] = await Promise.all([
          readText(frontAsset),
          readText(backAsset),
          Promise.all(overlayAssets.map(a => readText(a))),
        ]);

        if (!cancelled) {
          setFrontXml(monoTransform(frontText));
          setBackXml(monoTransform(backText));
          const initialLayers: OverlayLayer[] = overlayTexts.map((xml, idx) => ({
            key: overlayDefs[idx].key,
            xml,
            opacity: 0,
            side: overlayDefs[idx].side,
          }));
          setOverlayLayers(initialLayers);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error cargando SVG');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [palette]);

  // Simulación de API: actualiza opacidades con valores mock tras la carga
  useEffect(() => {
    if (!overlayLayers.length) return;
    if (overlayOpacities) {
      setOverlayLayers(prev => prev.map(layer => ({ ...layer, opacity: Math.max(0, Math.min(1, overlayOpacities[layer.key] ?? 0)) })));
      return;
    }
    // Simulación de API: intensidades mock entre 0 y 1
    const mockOpacities = overlayLayers.map((_, i) => {
      if (i % 7 === 0) return 0.85;
      if (i % 11 === 0) return 0.55;
      return 0;
    });
    setOverlayLayers(prev => prev.map((layer, i) => ({ ...layer, opacity: mockOpacities[i] })));
  }, [overlayLayers.length, overlayOpacities]);

  if (loading) {
    return (
      <View style={{ width: width as any, height: height as any, alignItems: 'center', justifyContent: 'center', backgroundColor }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !frontXml || !backXml) {
    return (
      <View style={{ width: width as any, height: height as any, alignItems: 'center', justifyContent: 'center', backgroundColor }}>
        {/* Fallback simple si falla la carga */}
      </View>
    );
  }

  return (
    <View style={{ width: width as any, height: height as any, backgroundColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {/* SVG frontal con overlays */}
      <View style={{ flex: 1, maxWidth: '50%', aspectRatio: 200 / 369, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <SvgXml xml={frontXml} width="100%" height="100%" />
        {overlayLayers.filter(l => l.side === 'front').map(layer => (
          <View key={`front-${layer.key}`} pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: layer.opacity }}>
            <SvgXml xml={layer.xml} width="100%" height="100%" />
          </View>
        ))}
      </View>
      {/* Separación mínima */}
      <View style={{ width: 8 }} />
      {/* SVG posterior con overlays */}
      <View style={{ flex: 1, maxWidth: '50%', aspectRatio: 200 / 369, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <SvgXml xml={backXml} width="100%" height="100%" />
        {overlayLayers.filter(l => l.side === 'back').map(layer => (
          <View key={`back-${layer.key}`} pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: layer.opacity }}>
            <SvgXml xml={layer.xml} width="100%" height="100%" />
          </View>
        ))}
      </View>
    </View>
  );
};

export default memo(BodyMusclesDiagram);

// Ejemplo rápido de uso (para referencia):
// <BodyMusclesDiagram
//   width={360}
//   height={260}
//   activeMuscles={[
//     { id: 'pectorales_superiores_izquierdo', role: 'primary' },
//     { id: 'pectorales_superiores_derecho', role: 'secondary' },
//     { id: 'biceps_derecho', role: 'primary' },
//     { id: 'biceps_izquierdo', role: 'secondary' },
//     'abdominales_superiores_izquierdo',
//     'abdominales_superiores_derecho',
//   ]}
// />
