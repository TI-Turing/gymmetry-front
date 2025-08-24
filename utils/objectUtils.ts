/**
 * Función helper para filtrar campos vacíos de un objeto
 * @param obj Objeto a filtrar
 * @returns Objeto solo con campos que tienen valor
 */
export const filterEmptyFields = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  const filtered: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof typeof obj];

    // Solo agregar si el valor no está vacío
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      (typeof value !== 'string' || value.trim() !== '')
    ) {
      filtered[key] =
        typeof value === 'string' ? (value as string).trim() : value;
    }
  });

  return filtered;
};

/**
 * Función helper para limpiar strings y validar si tienen contenido
 * @param value Valor a validar
 * @returns true si el valor tiene contenido válido
 */
export const hasValidValue = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  return true;
};

// Normaliza colecciones que pueden venir de .NET con forma { $values: [...] }
// Acepta: array directo, objeto con $values, null/undefined -> []
type WithValues = { $values?: unknown };

export function normalizeCollection<T = unknown>(raw: unknown): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as T[];
  if (
    typeof raw === 'object' &&
    raw !== null &&
    Array.isArray((raw as WithValues).$values)
  ) {
    return ((raw as WithValues).$values as unknown[] as T[]) || [];
  }
  return [];
}
