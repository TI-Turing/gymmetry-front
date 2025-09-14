import DOMPurify from 'dompurify';

/**
 * Configuración de DOMPurify para sanitización de contenido
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  REMOVE_DATA_URI: true,
  SANITIZE_DOM: true,
};

/**
 * Sanitiza contenido HTML para prevenir ataques XSS
 * @param content - Contenido a sanitizar
 * @returns Contenido sanitizado
 */
export const sanitizeContent = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(content.trim(), SANITIZE_CONFIG);
};

/**
 * Sanitiza contenido de texto plano removiendo caracteres peligrosos
 * @param text - Texto a sanitizar
 * @returns Texto sanitizado
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/data:/gi, '') // Remover data:
    .substring(0, 5000); // Limitar longitud
};

/**
 * Valida que el contenido no esté vacío después de sanitización
 * @param content - Contenido a validar
 * @returns true si es válido
 */
export const isValidContent = (content: string): boolean => {
  const sanitized = sanitizeText(content);
  return sanitized.length >= 3 && sanitized.length <= 5000;
};

/**
 * Sanitiza y valida título de post
 * @param title - Título a sanitizar
 * @returns Título sanitizado
 */
export const sanitizeTitle = (title: string): string => {
  if (!title || typeof title !== 'string') {
    return '';
  }

  return title.trim().replace(/[<>]/g, '').substring(0, 200); // Límite de título
};

/**
 * Valida título de post
 * @param title - Título a validar
 * @returns true si es válido
 */
export const isValidTitle = (title: string): boolean => {
  const sanitized = sanitizeTitle(title);
  return sanitized.length >= 3 && sanitized.length <= 200;
};
