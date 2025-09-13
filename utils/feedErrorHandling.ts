// Manejo de errores especficos para el mdulo de feed
export const feedErrorMessages = {
  // Errores de red
  network: 'Error de conexin. Verifica tu conexin a internet.',
  timeout: 'La solicitud tard demasiado. Intenta nuevamente.',
  offline: 'Sin conexin a internet. Conctate e intenta nuevamente.',

  // Errores de autenticacin
  unauthorized: 'Debes iniciar sesin para realizar esta accin.',
  forbidden: 'No tienes permisos para realizar esta accin.',

  // Errores de feed
  feedNotFound: 'La publicacin no existe o fue eliminada.',
  feedCreationFailed: 'No se pudo crear la publicacin. Intenta nuevamente.',
  feedUpdateFailed: 'No se pudo actualizar la publicacin.',
  feedDeletionFailed: 'No se pudo eliminar la publicacin.',

  // Errores de carga
  feedLoadFailed: 'No se pudieron cargar las publicaciones.',
  trendingLoadFailed: 'No se pudieron cargar las publicaciones trending.',
  feedDetailLoadFailed: 'No se pudo cargar el detalle de la publicacin.',

  // Errores de bsqueda
  searchFailed: 'Error en la bsqueda. Intenta con otros trminos.',
  emptySearchParams: 'Debes proporcionar trminos de bsqueda.',

  // Errores de comentarios
  commentCreationFailed: 'No se pudo agregar el comentario.',
  commentDeletionFailed: 'No se pudo eliminar el comentario.',
  commentsLoadFailed: 'No se pudieron cargar los comentarios.',
  emptyComment: 'El comentario no puede estar vaco.',
  commentTooLong: 'El comentario es demasiado largo.',

  // Errores de likes
  likeFailed: 'No se pudo dar like a la publicacin.',
  unlikeFailed: 'No se pudo quitar el like de la publicacin.',

  // Errores de contenido
  emptyTitle: 'El ttulo de la publicacin no puede estar vaco.',
  emptyContent: 'El contenido de la publicacin no puede estar vaco.',
  contentTooLong: 'El contenido es demasiado largo.',
  invalidMediaType: 'Tipo de archivo no compatible.',
  mediaUploadFailed: 'No se pudo subir el archivo multimedia.',

  // Errores de validacin
  invalidFeedId: 'ID de publicacin invlido.',
  invalidUserId: 'ID de usuario invlido.',
  invalidPageSize: 'Tamao de pgina invlido.',

  // Error genrico
  generic: 'Ocurri un error inesperado. Intenta nuevamente.',
};

// Funcin para mapear errores del backend a mensajes amigables
export const mapFeedError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    const err = error as {
      name?: string;
      message?: string;
      code?: string;
      status?: number;
      statusCode?: number;
    };

    // Errores de red
    if (err.name === 'CanceledError') {
      return 'Operacin cancelada';
    }

    if (
      err.code === 'NETWORK_ERROR' ||
      err.message?.includes('Network Error')
    ) {
      return feedErrorMessages.network;
    }

    if (err.code === 'TIMEOUT_ERROR' || err.message?.includes('timeout')) {
      return feedErrorMessages.timeout;
    }

    // Errores de estado HTTP
    if (err.status || err.statusCode) {
      const status = err.status || err.statusCode;
      switch (status) {
        case 401:
          return feedErrorMessages.unauthorized;
        case 403:
          return feedErrorMessages.forbidden;
        case 404:
          return feedErrorMessages.feedNotFound;
        case 429:
          return 'Demasiadas solicitudes. Espera un momento e intenta nuevamente.';
        case 500:
          return 'Error del servidor. Intenta ms tarde.';
        case 503:
          return 'Servicio no disponible. Intenta ms tarde.';
        default:
          return `Error ${status}: ${err.message || feedErrorMessages.generic}`;
      }
    }

    // Mensaje especfico del error
    if (err.message) {
      // Mapear mensajes especficos del backend
      const message = err.message.toLowerCase();

      if (message.includes('not found')) {
        return feedErrorMessages.feedNotFound;
      }

      if (
        message.includes('unauthorized') ||
        message.includes('not authorized')
      ) {
        return feedErrorMessages.unauthorized;
      }

      if (message.includes('forbidden')) {
        return feedErrorMessages.forbidden;
      }

      if (message.includes('validation')) {
        return `Error de validacin: ${err.message}`;
      }

      if (message.includes('empty') || message.includes('required')) {
        return `Campo requerido: ${err.message}`;
      }

      return err.message;
    }
  }

  return feedErrorMessages.generic;
};

// Funcin para crear errores tipados
export const createFeedError = (
  type: keyof typeof feedErrorMessages,
  details?: string
): Error => {
  const message = feedErrorMessages[type];
  const fullMessage = details ? `${message} ${details}` : message;
  const error = new Error(fullMessage);
  error.name = `FeedError_${type}`;
  return error;
};

// Funcin para validar parmetros de feed
export const validateFeedParams = {
  feedId: (id: string): void => {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw createFeedError('invalidFeedId');
    }
  },

  userId: (id: string): void => {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw createFeedError('invalidUserId');
    }
  },

  pagination: (page: number, size: number): void => {
    if (page < 1 || size < 1 || size > 100) {
      throw createFeedError('invalidPageSize');
    }
  },

  comment: (content: string): void => {
    const trimmed = (content || '').trim();
    if (!trimmed) {
      throw createFeedError('emptyComment');
    }
    if (trimmed.length > 1000) {
      throw createFeedError('commentTooLong');
    }
  },

  feedContent: (title: string, content?: string): void => {
    if (!title || title.trim().length === 0) {
      throw createFeedError('emptyTitle');
    }
    if (content && content.length > 5000) {
      throw createFeedError('contentTooLong');
    }
  },
};
