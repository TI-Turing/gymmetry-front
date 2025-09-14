/**
 * Rate limiter para prevenir spam de acciones
 */
class RateLimiter {
  private actions: Map<string, number[]> = new Map();
  private readonly cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    // Limpiar registros antiguos cada 5 minutos
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    );
  }

  /**
   * Verifica si una acción está permitida
   * @param actionKey - Clave única para la acción (ej: "post_create_userId123")
   * @param maxAttempts - Máximo número de intentos permitidos
   * @param windowMs - Ventana de tiempo en milisegundos
   * @returns true si la acción está permitida
   */
  isActionAllowed(
    actionKey: string,
    maxAttempts: number = 5,
    windowMs: number = 60000 // 1 minuto por defecto
  ): boolean {
    const now = Date.now();
    const attempts = this.actions.get(actionKey) || [];

    // Filtrar intentos dentro de la ventana de tiempo
    const recentAttempts = attempts.filter(
      (timestamp) => now - timestamp < windowMs
    );

    // Verificar si excede el límite
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }

    // Registrar el nuevo intento
    recentAttempts.push(now);
    this.actions.set(actionKey, recentAttempts);

    return true;
  }

  /**
   * Obtiene el tiempo restante hasta que se puede realizar la acción
   * @param actionKey - Clave de la acción
   * @param windowMs - Ventana de tiempo en milisegundos
   * @returns Tiempo restante en milisegundos
   */
  getTimeUntilReset(actionKey: string, windowMs: number = 60000): number {
    const attempts = this.actions.get(actionKey) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const timeElapsed = Date.now() - oldestAttempt;
    const timeRemaining = windowMs - timeElapsed;

    return Math.max(0, timeRemaining);
  }

  /**
   * Resetea el contador para una acción específica
   * @param actionKey - Clave de la acción
   */
  resetAction(actionKey: string): void {
    this.actions.delete(actionKey);
  }

  /**
   * Limpia registros antiguos
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutos

    for (const [key, attempts] of this.actions.entries()) {
      const recentAttempts = attempts.filter(
        (timestamp) => now - timestamp < maxAge
      );

      if (recentAttempts.length === 0) {
        this.actions.delete(key);
      } else {
        this.actions.set(key, recentAttempts);
      }
    }
  }

  /**
   * Destructor para limpiar el interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Instancia singleton del rate limiter
export const rateLimiter = new RateLimiter();

/**
 * Rate limiter específico para posts
 * @param userId - ID del usuario
 * @returns true si puede crear post
 */
export const canCreatePost = (userId: string): boolean => {
  return rateLimiter.isActionAllowed(
    `post_create_${userId}`,
    3, // Máximo 3 posts
    5 * 60 * 1000 // en 5 minutos
  );
};

/**
 * Rate limiter específico para comentarios
 * @param userId - ID del usuario
 * @returns true si puede crear comentario
 */
export const canCreateComment = (userId: string): boolean => {
  return rateLimiter.isActionAllowed(
    `comment_create_${userId}`,
    10, // Máximo 10 comentarios
    60 * 1000 // en 1 minuto
  );
};

/**
 * Rate limiter específico para likes
 * @param userId - ID del usuario
 * @returns true si puede dar like
 */
export const canToggleLike = (userId: string): boolean => {
  return rateLimiter.isActionAllowed(
    `like_toggle_${userId}`,
    30, // Máximo 30 likes
    60 * 1000 // en 1 minuto
  );
};

/**
 * Obtiene mensaje de error personalizado para rate limiting
 * @param action - Tipo de acción
 * @param timeRemaining - Tiempo restante en ms
 * @returns Mensaje de error
 */
export const getRateLimitMessage = (
  action: 'post' | 'comment' | 'like',
  timeRemaining: number
): string => {
  const minutes = Math.ceil(timeRemaining / 60000);
  const seconds = Math.ceil((timeRemaining % 60000) / 1000);

  const timeText =
    minutes > 0
      ? `${minutes} minuto${minutes > 1 ? 's' : ''}`
      : `${seconds} segundo${seconds > 1 ? 's' : ''}`;

  const actionMessages = {
    post: `Has alcanzado el límite de posts. Intenta de nuevo en ${timeText}.`,
    comment: `Has alcanzado el límite de comentarios. Intenta de nuevo en ${timeText}.`,
    like: `Has alcanzado el límite de likes. Intenta de nuevo en ${timeText}.`,
  };

  return actionMessages[action];
};
