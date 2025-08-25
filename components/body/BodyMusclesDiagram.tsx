import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, type DimensionValue } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
// Assets base y overlays importados estáticamente para evitar require()
import frontBaseSvg from '../../assets/images/muscles/muscular_system_front.svg';
import backBaseSvg from '../../assets/images/muscles/muscular_system_back.svg';
import overlayFrontBiceps from '../../assets/images/muscles/main/front-biceps.svg';
import overlayFrontCuadriceps from '../../assets/images/muscles/main/front-cuadriceps.svg';
import overlayFrontDeltoides from '../../assets/images/muscles/main/front-deltoides.svg';
import overlayFrontDorsales from '../../assets/images/muscles/main/front-dorsales.svg';
import overlayFrontOblicuos from '../../assets/images/muscles/main/front-oblicuos.svg';
import overlayFrontPectoralMayor from '../../assets/images/muscles/main/front-pectoralMayor.svg';
import overlayFrontRectoAbdominal from '../../assets/images/muscles/main/front-rectoAbdominal.svg';
import overlayFrontSerratoAnterior from '../../assets/images/muscles/main/front-serratoAnterior.svg';
import overlayBackDorsal from '../../assets/images/muscles/main/back-dorsal.svg';
import overlayBackGluteos from '../../assets/images/muscles/main/back-gluteos.svg';
import overlayBackIsquiotibiales from '../../assets/images/muscles/main/back-isquiotibiales.svg';
import overlayBackPantorrillas from '../../assets/images/muscles/main/back-pantorrillas.svg';
import overlayBackSoleo from '../../assets/images/muscles/main/back-soleo.svg';
import overlayBackTrapecio from '../../assets/images/muscles/main/back-trapecio.svg';
import overlayBackTriceps from '../../assets/images/muscles/main/back-triceps.svg';
// Conservamos los tipos/exports por compatibilidad futura, pero no se usan en este render basado en SVG externo
// import { FRONT_MUSCLES, BACK_MUSCLES, MUSCLES_BY_ID, colorForMuscle } from './musclesPaths';

export type ActiveMuscle = {
  id: string; // ej: 'pectorales_superiores'
  role?: 'primary' | 'secondary';
};

interface BodyMusclesDiagramProps {
  width?: DimensionValue; // admite porcentajes como '100%'
  height?: DimensionValue; // permite porcentaje; si se omite, usa 100%
  // listado de ids de músculos activos o estructuras con role
  activeMuscles?: (string | ActiveMuscle)[];
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
  side?: 'front' | 'back' | 'both'; // controla qué vista renderizar
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
  activeMuscles: _activeMuscles = [], // reservado para futuras superposiciones
  defaultColor: _defaultColor = '#cccccc', // sin uso en base SVG
  scale: _scale, // sin uso en base SVG
  palette = 'color',
  backgroundColor = 'transparent',
  overlayOpacities,
  side = 'both',
}) => {
  const [frontXml, setFrontXml] = useState<string | null>(null);
  const [backXml, setBackXml] = useState<string | null>(null);
  type OverlayLayer = {
    key: string;
    xml: string;
    opacity: number;
    side: 'front' | 'back';
  };
  const [overlayLayers, setOverlayLayers] = useState<OverlayLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const monoTransform = useCallback(
    (xml: string) => {
      if (palette !== 'mono') return xml;
      // Reemplazar fills por un gris oscuro y strokes por gris claro
      let out = xml.replace(/fill="#([0-9a-fA-F]{3,6})"/g, 'fill="#2d2d2d"');
      out = out.replace(/stroke="#([0-9a-fA-F]{3,6})"/g, 'stroke="#f2f2f2"');
      return out;
    },
    [palette]
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        // Definir módulos importados y metadatos para overlays
        const frontMod = frontBaseSvg;
        const backMod = backBaseSvg;
        const overlayDefs = [
          {
            mod: overlayFrontBiceps,
            key: 'front-biceps',
            side: 'front' as const,
          },
          {
            mod: overlayFrontCuadriceps,
            key: 'front-cuadriceps',
            side: 'front' as const,
          },
          {
            mod: overlayFrontDeltoides,
            key: 'front-deltoides',
            side: 'front' as const,
          },
          {
            mod: overlayFrontDorsales,
            key: 'front-dorsales',
            side: 'front' as const,
          },
          {
            mod: overlayFrontOblicuos,
            key: 'front-oblicuos',
            side: 'front' as const,
          },
          {
            mod: overlayFrontPectoralMayor,
            key: 'front-pectoralMayor',
            side: 'front' as const,
          },
          {
            mod: overlayFrontRectoAbdominal,
            key: 'front-rectoAbdominal',
            side: 'front' as const,
          },
          {
            mod: overlayFrontSerratoAnterior,
            key: 'front-serratoAnterior',
            side: 'front' as const,
          },
          { mod: overlayBackDorsal, key: 'back-dorsal', side: 'back' as const },
          {
            mod: overlayBackGluteos,
            key: 'back-gluteos',
            side: 'back' as const,
          },
          {
            mod: overlayBackIsquiotibiales,
            key: 'back-isquiotibiales',
            side: 'back' as const,
          },
          {
            mod: overlayBackPantorrillas,
            key: 'back-pantorrillas',
            side: 'back' as const,
          },
          { mod: overlayBackSoleo, key: 'back-soleo', side: 'back' as const },
          {
            mod: overlayBackTrapecio,
            key: 'back-trapecio',
            side: 'back' as const,
          },
          {
            mod: overlayBackTriceps,
            key: 'back-triceps',
            side: 'back' as const,
          },
        ];

        // Cargar todos los assets de una vez y obtener instancias con localUri
        const allAssets = await Asset.loadAsync([
          frontMod,
          backMod,
          ...overlayDefs.map((d) => d.mod),
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
          Promise.all(overlayAssets.map((a) => readText(a))),
        ]);

        if (!cancelled) {
          setFrontXml(monoTransform(frontText));
          setBackXml(monoTransform(backText));
          const initialLayers: OverlayLayer[] = overlayTexts.map(
            (xml, idx) => ({
              key: overlayDefs[idx].key,
              xml,
              opacity: 0,
              side: overlayDefs[idx].side,
            })
          );
          setOverlayLayers(initialLayers);
          setError(null);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Error cargando SVG';
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [monoTransform]);

  // Simulación de API: actualiza opacidades con valores mock tras la carga
  useEffect(() => {
    if (!overlayLayers.length) return;
    if (overlayOpacities) {
      setOverlayLayers((prev) =>
        prev.map((layer) => ({
          ...layer,
          opacity: Math.max(0, Math.min(1, overlayOpacities[layer.key] ?? 0)),
        }))
      );
      return;
    }
    // Simulación de API: intensidades mock entre 0 y 1
    const count = overlayLayers.length;
    const mockOpacities = Array.from({ length: count }, (_, i) => {
      if (i % 7 === 0) return 0.85;
      if (i % 11 === 0) return 0.55;
      return 0;
    });
    setOverlayLayers((prev) =>
      prev.map((layer, i) => ({ ...layer, opacity: mockOpacities[i] }))
    );
  }, [overlayLayers.length, overlayOpacities]);

  if (loading) {
    return (
      <View
        style={{
          width: width,
          height: height,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !frontXml || !backXml) {
    return (
      <View
        style={{
          width: width,
          height: height,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
        }}
      >
        {/* Fallback simple si falla la carga */}
      </View>
    );
  }

  const renderFront = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        aspectRatio: 200 / 369,
      }}
    >
      <SvgXml xml={frontXml} width="100%" height="100%" />
      {overlayLayers
        .filter((l) => l.side === 'front')
        .map((layer) => (
          <View
            key={`front-${layer.key}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              opacity: layer.opacity,
            }}
          >
            <SvgXml xml={layer.xml} width="100%" height="100%" />
          </View>
        ))}
    </View>
  );
  const renderBack = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        aspectRatio: 200 / 369,
      }}
    >
      <SvgXml xml={backXml} width="100%" height="100%" />
      {overlayLayers
        .filter((l) => l.side === 'back')
        .map((layer) => (
          <View
            key={`back-${layer.key}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              opacity: layer.opacity,
            }}
          >
            <SvgXml xml={layer.xml} width="100%" height="100%" />
          </View>
        ))}
    </View>
  );

  if (side === 'front') {
    return (
      <View style={{ width: width, height: height, backgroundColor }}>
        {renderFront}
      </View>
    );
  }
  if (side === 'back') {
    return (
      <View style={{ width: width, height: height, backgroundColor }}>
        {renderBack}
      </View>
    );
  }

  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ flex: 1, maxWidth: '50%' }}>{renderFront}</View>
      <View style={{ width: 8 }} />
      <View style={{ flex: 1, maxWidth: '50%' }}>{renderBack}</View>
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
