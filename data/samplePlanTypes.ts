// Datos de ejemplo para tipos de planes
// Este archivo contiene los datos de los planes según la especificación del usuario

export const samplePlanTypes = [
  {
    id: 'plan-gratuito-001',
    name: 'Plan Gratuito',
    description:
      'Ideal para enganchar usuarios y mostrar el valor de Gymmetry.',
    price: 0,
    features: [
      'Acceso a rutinas básicas predeterminadas',
      'Registro de progreso físico (peso, medidas)',
      'Visualización de rutinas asignadas por su gimnasio',
      'Seguimiento de asistencia y entrenamientos',
      'Acceso limitado al feed/red social de la app',
      'Notificaciones básicas (recordatorio de rutina del día)',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  },
  {
    id: 'plan-basico-001',
    name: 'Plan Básico',
    description:
      'Para usuarios que quieren más personalización sin ir al extremo.',
    price: 5000,
    features: [
      'Todo lo incluido en el Plan Gratuito',
      'Rutinas personalizadas según objetivos (ganancia muscular, pérdida de peso, etc.)',
      'Historial detallado de entrenamientos',
      'Acceso a planes de dieta básicos (diseñados por IA o plantillas)',
      'Soporte por chat básico con entrenadores del gimnasio',
      'Estadísticas semanales de progreso',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  },
  {
    id: 'plan-premium-001',
    name: 'Plan Premium',
    description:
      'Para usuarios comprometidos con su salud y que quieren lo mejor.',
    price: 15000,
    features: [
      'Todo lo incluido en el Plan Básico',
      'Chat con nutricionistas o entrenadores certificados',
      'Planes de dieta personalizados',
      'Videos de cada ejercicio en su rutina',
      'Corrección de técnica por IA (análisis del movimiento)',
      'Comunidad exclusiva con eventos, retos mensuales y premios',
      'Sincronización con wearables (smartwatch, banda cardíaca)',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  },
  {
    id: 'plan-familiar-001',
    name: 'Plan Familiar',
    description: 'Pensado para parejas o familias que entrenan juntos.',
    price: 25000,
    features: [
      'Todo lo incluido en el Plan Premium',
      'Acceso para 2 o más usuarios',
      'Descuentos para familiares adicionales',
      'Retos familiares o entre amigos',
      'Compartir progreso en grupo',
      'Gestión familiar de rutinas y objetivos',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  },
];

// Función helper para obtener datos de ejemplo
export const getPlanTypesSample = () => samplePlanTypes;

// Función helper para buscar un plan por ID
export const findPlanTypeById = (id: string) =>
  samplePlanTypes.find(plan => plan.id === id);

// Función helper para obtener planes por rango de precio
export const getPlanTypesByPriceRange = (minPrice: number, maxPrice: number) =>
  samplePlanTypes.filter(
    plan => plan.price >= minPrice && plan.price <= maxPrice
  );
