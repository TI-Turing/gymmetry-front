// Definiciones de paths SVG más detallados (aproximados) para músculos frontales y posteriores.
// Inspirado en siluetas estándar: vista frontal en X 0..100 y dorsal en X 100..200 (viewBox 0 0 200 200).

export type MusclePath = {
  id: string; // nombre semántico, ej: 'pectorales_superiores_derecho'
  side: 'front' | 'back';
  d: string; // atributo d del Path de SVG
  kind?: 'shape' | 'line'; // line = solo trazo, sin relleno (detalles)
  strokeWidth?: number;
  strokeColor?: string;
};

// Frente: ordenados para dar una apariencia más natural (grupos grandes primero, detalles encima)
export const FRONT_MUSCLES: MusclePath[] = [
  // Hombros (deltoides anteriores)
  {
    id: 'deltoides_anterior_izquierdo',
    side: 'front',
    d: 'M18 38 C 14 46, 15 59, 22 63 C 28 60, 28 47, 25 40 Z',
  },
  {
    id: 'deltoides_anterior_derecho',
    side: 'front',
    d: 'M82 38 C 86 46, 85 59, 78 63 C 72 60, 72 47, 75 40 Z',
  },

  // Pectoral mayor: forma más anatómica (clavicular + esternocostal) y líneas de detalle
  // Clavicular (superior)
  {
    id: 'pectorales_superiores_izquierdo',
    side: 'front',
    d: 'M28 42 C 36 36, 47 35, 50 40 C 49 43, 44 46, 36 48 C 32 48, 30 47, 28 45 Z',
  },
  {
    id: 'pectorales_superiores_derecho',
    side: 'front',
    d: 'M72 42 C 64 36, 53 35, 50 40 C 51 43, 56 46, 64 48 C 68 48, 70 47, 72 45 Z',
  },
  // Esternocostal (inferior)
  {
    id: 'pectorales_inferiores_izquierdo',
    side: 'front',
    d: 'M28 48 C 34 52, 44 55, 50 59 C 44 60, 36 59, 30 56 C 28 53, 28 50, 28 48 Z',
  },
  {
    id: 'pectorales_inferiores_derecho',
    side: 'front',
    d: 'M72 48 C 66 52, 56 55, 50 59 C 56 60, 64 59, 70 56 C 72 53, 72 50, 72 48 Z',
  },
  // Línea del esternón (detalle)
  {
    id: 'esternon_linea',
    side: 'front',
    d: 'M50 40 L 50 62',
    kind: 'line',
    strokeWidth: 0.6,
  },
  // Pliegue inframamario (detalle)
  {
    id: 'pliegue_pectoral_izquierdo',
    side: 'front',
    d: 'M30 56 C 38 60, 45 61, 50 60',
    kind: 'line',
    strokeWidth: 0.5,
  },
  {
    id: 'pliegue_pectoral_derecho',
    side: 'front',
    d: 'M50 60 C 55 61, 62 60, 70 56',
    kind: 'line',
    strokeWidth: 0.5,
  },

  // Serratos / Oblicuos superiores
  {
    id: 'serrato_izquierdo',
    side: 'front',
    d: 'M36 56 C 34 60, 33 64, 35 67 C 37 64, 39 60, 40 57 Z',
  },
  {
    id: 'serrato_derecho',
    side: 'front',
    d: 'M64 56 C 66 60, 67 64, 65 67 C 63 64, 61 60, 60 57 Z',
  },

  // Abdomen (recto abdominal segmentado)
  {
    id: 'abdominales_superiores_izquierdo',
    side: 'front',
    d: 'M44 60 L 49 60 L 49 70 L 44 70 Z',
  },
  {
    id: 'abdominales_superiores_derecho',
    side: 'front',
    d: 'M51 60 L 56 60 L 56 70 L 51 70 Z',
  },
  {
    id: 'abdominales_medios_izquierdo',
    side: 'front',
    d: 'M44 72 L 49 72 L 49 82 L 44 82 Z',
  },
  {
    id: 'abdominales_medios_derecho',
    side: 'front',
    d: 'M51 72 L 56 72 L 56 82 L 51 82 Z',
  },
  {
    id: 'abdominales_inferiores_izquierdo',
    side: 'front',
    d: 'M44 84 L 49 84 L 49 96 L 44 96 Z',
  },
  {
    id: 'abdominales_inferiores_derecho',
    side: 'front',
    d: 'M51 84 L 56 84 L 56 96 L 51 96 Z',
  },

  // Oblicuos
  {
    id: 'oblicuos_izquierdo',
    side: 'front',
    d: 'M37 72 C 33 80, 33 92, 37 98 C 40 94, 40 80, 37 72 Z',
  },
  {
    id: 'oblicuos_derecho',
    side: 'front',
    d: 'M63 72 C 67 80, 67 92, 63 98 C 60 94, 60 80, 63 72 Z',
  },

  // Brazos - Bíceps y Antebrazos
  {
    id: 'biceps_izquierdo',
    side: 'front',
    d: 'M22 66 C 18 76, 18 96, 24 106 C 30 98, 29 77, 27 68 Z',
  },
  {
    id: 'biceps_derecho',
    side: 'front',
    d: 'M78 66 C 82 76, 82 96, 76 106 C 70 98, 71 77, 73 68 Z',
  },
  {
    id: 'antebrazo_flexores_izquierdo',
    side: 'front',
    d: 'M24 106 C 20 116, 21 132, 26 142 C 31 134, 30 118, 29 108 Z',
  },
  {
    id: 'antebrazo_flexores_derecho',
    side: 'front',
    d: 'M76 106 C 80 116, 79 132, 74 142 C 69 134, 70 118, 71 108 Z',
  },

  // Cintura / Aductores (zona inguinal)
  {
    id: 'aductores_izquierdo',
    side: 'front',
    d: 'M46 98 C 43 104, 42 112, 44 118 C 47 112, 48 105, 48 100 Z',
  },
  {
    id: 'aductores_derecho',
    side: 'front',
    d: 'M54 98 C 57 104, 58 112, 56 118 C 53 112, 52 105, 52 100 Z',
  },

  // Piernas - Cuádriceps (medial/lateral)
  {
    id: 'cuadriceps_lateral_izquierdo',
    side: 'front',
    d: 'M38 112 C 34 128, 34 160, 40 176 L 46 176 C 47 160, 46 132, 43 114 Z',
  },
  {
    id: 'cuadriceps_medial_izquierdo',
    side: 'front',
    d: 'M46 112 C 45 130, 45 162, 47 178 C 44 178, 41 178, 40 176 C 38 160, 38 134, 41 116 Z',
  },
  {
    id: 'cuadriceps_lateral_derecho',
    side: 'front',
    d: 'M62 112 C 66 128, 66 160, 60 176 L 54 176 C 53 160, 54 132, 57 114 Z',
  },
  {
    id: 'cuadriceps_medial_derecho',
    side: 'front',
    d: 'M54 112 C 55 130, 55 162, 53 178 C 56 178, 59 178, 60 176 C 62 160, 62 134, 59 116 Z',
  },

  // Piernas - Tibiales anteriores
  {
    id: 'tibial_anterior_izquierdo',
    side: 'front',
    d: 'M43 176 C 42 186, 42 194, 43 202 L 47 202 C 48 194, 48 186, 47 176 Z',
  },
  {
    id: 'tibial_anterior_derecho',
    side: 'front',
    d: 'M57 176 C 58 186, 58 194, 57 202 L 53 202 C 52 194, 52 186, 53 176 Z',
  },
];

// Espalda: grupos grandes (trapecio, dorsales), luego detalles (romboides, infraespinoso), brazos y piernas
export const BACK_MUSCLES: MusclePath[] = [
  // Trapecio (superior, medio, inferior)
  {
    id: 'trapecio_superior',
    side: 'back',
    d: 'M145 28 C 150 22, 160 22, 165 28 L 160 40 L 150 40 Z',
  },
  {
    id: 'trapecio_medio',
    side: 'back',
    d: 'M148 40 L 162 40 L 170 56 L 140 56 Z',
  },
  {
    id: 'trapecio_inferior',
    side: 'back',
    d: 'M142 56 L 168 56 L 160 76 L 150 76 Z',
  },

  // Romboides / Infraespinoso / Redondo mayor (zona escapular)
  {
    id: 'romboides_izquierdo',
    side: 'back',
    d: 'M144 46 L 150 44 L 152 54 L 146 56 Z',
  },
  {
    id: 'romboides_derecho',
    side: 'back',
    d: 'M156 44 L 162 46 L 160 56 L 154 54 Z',
  },
  {
    id: 'infraespinoso_izquierdo',
    side: 'back',
    d: 'M138 58 C 140 64, 146 68, 150 70 C 150 66, 146 62, 142 58 Z',
  },
  {
    id: 'infraespinoso_derecho',
    side: 'back',
    d: 'M172 58 C 170 64, 164 68, 160 70 C 160 66, 164 62, 168 58 Z',
  },
  {
    id: 'redondo_mayor_izquierdo',
    side: 'back',
    d: 'M140 70 C 142 76, 148 80, 150 84 C 148 82, 144 78, 142 74 Z',
  },
  {
    id: 'redondo_mayor_derecho',
    side: 'back',
    d: 'M170 70 C 168 76, 162 80, 160 84 C 162 82, 166 78, 168 74 Z',
  },

  // Dorsales (superior e inferior)
  {
    id: 'dorsales_superiores',
    side: 'back',
    d: 'M132 66 C 126 78, 126 92, 134 100 L 166 100 C 174 92, 174 78, 168 66 Z',
  },
  {
    id: 'dorsales_inferiores',
    side: 'back',
    d: 'M136 100 C 130 110, 130 116, 136 124 L 164 124 C 170 116, 170 110, 164 100 Z',
  },

  // Deltoides posteriores
  {
    id: 'deltoides_posterior_izquierdo',
    side: 'back',
    d: 'M122 44 C 118 52, 118 62, 126 64 C 132 60, 132 50, 128 46 Z',
  },
  {
    id: 'deltoides_posterior_derecho',
    side: 'back',
    d: 'M178 44 C 182 52, 182 62, 174 64 C 168 60, 168 50, 172 46 Z',
  },

  // Tríceps
  {
    id: 'triceps_izquierdo',
    side: 'back',
    d: 'M126 66 C 122 76, 122 96, 128 106 C 134 98, 133 77, 131 68 Z',
  },
  {
    id: 'triceps_derecho',
    side: 'back',
    d: 'M174 66 C 178 76, 178 96, 172 106 C 166 98, 167 77, 169 68 Z',
  },
  // Antebrazos extensores
  {
    id: 'antebrazo_extensores_izquierdo',
    side: 'back',
    d: 'M128 106 C 124 116, 125 132, 130 142 C 135 134, 134 118, 133 108 Z',
  },
  {
    id: 'antebrazo_extensores_derecho',
    side: 'back',
    d: 'M172 106 C 176 116, 175 132, 170 142 C 165 134, 166 118, 167 108 Z',
  },

  // Erectores espinales
  {
    id: 'erectores_espinales_izquierdo',
    side: 'back',
    d: 'M146 124 C 146 136, 146 148, 146 160 L 150 160 C 150 148, 150 136, 150 124 Z',
  },
  {
    id: 'erectores_espinales_derecho',
    side: 'back',
    d: 'M154 124 C 154 136, 154 148, 154 160 L 150 160 C 150 148, 150 136, 150 124 Z',
  },

  // Glúteos
  {
    id: 'gluteo_mayor_izquierdo',
    side: 'back',
    d: 'M138 160 C 142 170, 150 172, 150 180 C 140 178, 136 170, 136 164 Z',
  },
  {
    id: 'gluteo_mayor_derecho',
    side: 'back',
    d: 'M162 160 C 158 170, 150 172, 150 180 C 160 178, 164 170, 164 164 Z',
  },

  // Isquiotibiales
  {
    id: 'isquiotibiales_lateral_izquierdo',
    side: 'back',
    d: 'M140 180 C 138 188, 138 196, 142 206 L 146 206 C 146 196, 146 188, 146 180 Z',
  },
  {
    id: 'isquiotibiales_medial_izquierdo',
    side: 'back',
    d: 'M146 180 C 146 190, 146 198, 146 206 L 148 206 C 148 198, 148 190, 148 180 Z',
  },
  {
    id: 'isquiotibiales_lateral_derecho',
    side: 'back',
    d: 'M160 180 C 162 188, 162 196, 158 206 L 154 206 C 154 196, 154 188, 154 180 Z',
  },
  {
    id: 'isquiotibiales_medial_derecho',
    side: 'back',
    d: 'M154 180 C 154 190, 154 198, 154 206 L 152 206 C 152 198, 152 190, 152 180 Z',
  },

  // Gemelos (gastrocnemios)
  {
    id: 'gemelos_izquierdo',
    side: 'back',
    d: 'M146 206 C 146 214, 146 220, 146 226 L 150 226 C 151 220, 151 214, 150 206 Z',
  },
  {
    id: 'gemelos_derecho',
    side: 'back',
    d: 'M154 206 C 154 214, 154 220, 154 226 L 150 226 C 149 220, 149 214, 150 206 Z',
  },
];

// Mapa de colores por grupo (prefijo) para resaltar músculos
export const MUSCLE_COLOR_MAP: Record<string, string> = {
  pectorales: '#E53935', // rojo
  biceps: '#1E88E5', // azul
  triceps: '#1565C0', // azul oscuro
  deltoides: '#FB8C00', // naranja
  abdominales: '#FDD835', // amarillo
  oblicuos: '#FFB300', // ámbar
  serrato: '#66BB6A', // verde claro
  dorsales: '#43A047', // verde
  trapecio: '#26C6DA', // cian
  romboides: '#00ACC1',
  infraespinoso: '#26A69A',
  redondo: '#00796B',
  erectores: '#8D6E63', // marrón claro
  cuadriceps: '#8E24AA', // púrpura
  tibial: '#7E57C2',
  isquiotibiales: '#6D4C41', // marrón
  gemelos: '#5D4037',
  gluteo: '#EC407A', // rosa
  antebrazo: '#90A4AE', // gris azulado
};

// Ayuda: resolver color por prefijo "grupo" antes del primer guion bajo
export function colorForMuscle(id: string): string {
  const group = id.split('_')[0];
  return MUSCLE_COLOR_MAP[group] || '#FF7043';
}

// Mapa por id para acceso rápido
export const MUSCLES_BY_ID: Record<string, MusclePath> = [
  ...FRONT_MUSCLES,
  ...BACK_MUSCLES,
].reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, MusclePath>
);
