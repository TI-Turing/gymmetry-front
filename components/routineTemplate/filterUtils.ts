import type { RoutineTemplate } from '@/models/RoutineTemplate';
import type { FilterState } from './RoutineFilters';

/**
 * Convierte un valor numérico de objetivo en su nivel correspondiente
 */
export function getObjectiveLevel(value: number): 'bajo' | 'medio' | 'alto' {
  if (value >= 0 && value <= 0.3) return 'bajo';
  if (value >= 0.4 && value <= 0.7) return 'medio';
  return 'alto'; // 0.8 - 1.0
}

/**
 * Parsea el JSON de TagsObjectives de manera segura
 */
export function parseTagsObjectives(tagsObjectives: string | null): Record<string, number> {
  if (!tagsObjectives) return {};
  
  try {
    const parsed = JSON.parse(tagsObjectives);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Aplica los filtros a una lista de rutinas
 */
export function applyRoutineFilters(
  routines: RoutineTemplate[],
  filters: FilterState
): RoutineTemplate[] {
  return routines.filter(routine => {
    // Filtro de requiere equipos
    if (filters.requiereEquipos !== null) {
      const routineRequiresEquipment = Boolean(routine.RequiresEquipment);
      if (routineRequiresEquipment !== filters.requiereEquipos) {
        return false;
      }
    }

    // Filtro de calistenia
    if (filters.calistenia !== null) {
      const routineIsCalisthenics = Boolean(routine.IsCalisthenic);
      if (routineIsCalisthenics !== filters.calistenia) {
        return false;
      }
    }

    // Filtros de objetivos
    const objectives = parseTagsObjectives(routine.TagsObjectives);
    
    for (const [objectiveKey, requiredLevel] of Object.entries(filters.objectives)) {
      if (requiredLevel === null) continue;
      
      const objectiveValue = objectives[objectiveKey];
      if (objectiveValue === undefined) {
        // Si el objetivo no existe en la rutina, no cumple el filtro
        return false;
      }
      
      const routineLevel = getObjectiveLevel(objectiveValue);
      if (routineLevel !== requiredLevel) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Cuenta cuántos filtros están activos
 */
export function getActiveFiltersCount(filters: FilterState): number {
  let count = 0;
  
  if (filters.requiereEquipos !== null) count++;
  if (filters.calistenia !== null) count++;
  
  count += Object.values(filters.objectives).filter(val => val !== null).length;
  
  return count;
}

/**
 * Crea un estado de filtros vacío
 */
export function createEmptyFilters(): FilterState {
  return {
    requiereEquipos: null,
    calistenia: null,
    objectives: {},
  };
}
