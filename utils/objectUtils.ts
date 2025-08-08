/**
 * Función helper para filtrar campos vacíos de un objeto
 * @param obj Objeto a filtrar
 * @returns Objeto solo con campos que tienen valor
 */
export const filterEmptyFields = (
  obj: Record<string, any>
): Record<string, any> => {
  const filtered: Record<string, any> = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];

    // Solo agregar si el valor no está vacío
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      (typeof value !== 'string' || value.trim() !== '')
    ) {
      filtered[key] = typeof value === 'string' ? value.trim() : value;
    }
  });

  return filtered;
};

/**
 * Función helper para limpiar strings y validar si tienen contenido
 * @param value Valor a validar
 * @returns true si el valor tiene contenido válido
 */
export const hasValidValue = (value: any): boolean => {
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
