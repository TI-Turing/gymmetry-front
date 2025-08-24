// Mapea TagsMuscle del backend (ES) a keys de overlays usados por BodyMusclesDiagram
// Devuelve un objeto Record<overlayKey, opacity>

// Normaliza strings: minúsculas, sin acentos, recorta espacios
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

// Mapa de etiqueta normalizada -> key de overlay
const TAG_TO_OVERLAY_KEY: Record<string, string> = {
  // Frente
  biceps: 'front-biceps',
  cuadriceps: 'front-cuadriceps',
  deltoides: 'front-deltoides',
  dorsales: 'front-dorsales',
  oblicuos: 'front-oblicuos',
  'pectoral mayor': 'front-pectoralMayor',
  // Alias comunes reportados por backend
  pectoral: 'front-pectoralMayor',
  pectorales: 'front-pectoralMayor',
  pecho: 'front-pectoralMayor',
  'recto abdominal': 'front-rectoAbdominal',
  'serrato anterior': 'front-serratoAnterior',
  // Espalda
  dorsal: 'back-dorsal',
  gluteos: 'back-gluteos',
  isquiotibiales: 'back-isquiotibiales',
  pantorrillas: 'back-pantorrillas',
  soleo: 'back-soleo',
  trapecio: 'back-trapecio',
  triceps: 'back-triceps',
};

export function mapTagsToOverlayOpacities(
  tags: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [rawKey, value] of Object.entries(tags || {})) {
    const k = normalize(rawKey);
    const overlayKey = TAG_TO_OVERLAY_KEY[k];
    if (!overlayKey) continue;
    // clamp 0..1
    const v = Math.max(0, Math.min(1, Number(value) || 0));
    // si múltiples etiquetas alimentan la misma capa, tomar el máximo
    result[overlayKey] = Math.max(result[overlayKey] ?? 0, v);
  }
  return result;
}

export type OverlayKey = keyof typeof TAG_TO_OVERLAY_KEY;
