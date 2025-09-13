// Servicio simulado para notificaciones sociales
export interface NotificationData {
  id: string;
  type: 'like' | 'comment' | 'mention' | 'follow' | 'post';
  userId: string;
  userName: string;
  userAvatar?: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  postTitle?: string;
  commentText?: string;
}

export interface NotificationPreferences {
  likes: boolean;
  comments: boolean;
  mentions: boolean;
  follows: boolean;
  posts: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
}

class NotificationServiceSimple {
  private notifications: NotificationData[] = [];
  private preferences: NotificationPreferences = {
    likes: true,
    comments: true,
    mentions: true,
    follows: true,
    posts: false,
    pushEnabled: true,
    emailEnabled: false,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
  };

  // Obtener todas las notificaciones
  async getNotifications(): Promise<NotificationData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.notifications]);
      }, 500);
    });
  }

  // Obtener notificaciones no leídas
  async getUnreadNotifications(): Promise<NotificationData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.notifications.filter((n) => !n.isRead));
      }, 300);
    });
  }

  // Contar notificaciones no leídas
  async getUnreadCount(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.notifications.filter((n) => !n.isRead).length);
      }, 200);
    });
  }

  // Marcar notificación como leída
  async markAsRead(notificationId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = this.notifications.find(
          (n) => n.id === notificationId
        );
        if (notification) {
          notification.isRead = true;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  }

  // Marcar todas como leídas
  async markAllAsRead(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.notifications.forEach((n) => {
          n.isRead = true;
        });
        resolve(true);
      }, 300);
    });
  }

  // Agregar nueva notificación (para simulación)
  async addNotification(
    notification: Omit<NotificationData, 'id'>
  ): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNotification: NotificationData = {
          ...notification,
          id: Date.now().toString(),
        };
        this.notifications.unshift(newNotification);
        resolve(newNotification.id);
      }, 200);
    });
  }

  // Eliminar notificación
  async deleteNotification(notificationId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.notifications.findIndex(
          (n) => n.id === notificationId
        );
        if (index !== -1) {
          this.notifications.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  }

  // Obtener preferencias de notificaciones
  async getPreferences(): Promise<NotificationPreferences> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.preferences });
      }, 200);
    });
  }

  // Actualizar preferencias
  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.preferences = { ...this.preferences, ...preferences };
        resolve(true);
      }, 300);
    });
  }

  // Verificar si se debe mostrar notificación según preferencias
  shouldShowNotification(type: NotificationData['type']): boolean {
    switch (type) {
      case 'like':
        return this.preferences.likes;
      case 'comment':
        return this.preferences.comments;
      case 'mention':
        return this.preferences.mentions;
      case 'follow':
        return this.preferences.follows;
      case 'post':
        return this.preferences.posts;
      default:
        return true;
    }
  }

  // Simular llegada de nuevas notificaciones
  simulateNewNotifications(): void {
    const mockNotifications: Omit<NotificationData, 'id'>[] = [
      {
        type: 'like',
        userId: 'user1',
        userName: 'Ana García',
        targetType: 'post',
        targetId: 'post1',
        message: 'le dio like a tu publicación',
        timestamp: new Date(),
        isRead: false,
        postTitle: 'Mi rutina de piernas 🔥',
      },
      {
        type: 'comment',
        userId: 'user2',
        userName: 'Carlos Ruiz',
        targetType: 'post',
        targetId: 'post2',
        message: 'comentó en tu publicación',
        timestamp: new Date(),
        isRead: false,
        postTitle: 'Entrenamiento de pecho',
        commentText: '¡Excelente rutina! ¿Cuántas series recomiendas?',
      },
    ];

    mockNotifications.forEach((notification) => {
      this.addNotification(notification);
    });
  }
}

// Instancia singleton del servicio
export const notificationService = new NotificationServiceSimple();

// Hook personalizado para usar el servicio
export const useNotifications = () => {
  return {
    getNotifications: () => notificationService.getNotifications(),
    getUnreadCount: () => notificationService.getUnreadCount(),
    markAsRead: (id: string) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(),
    getPreferences: () => notificationService.getPreferences(),
    updatePreferences: (prefs: Partial<NotificationPreferences>) =>
      notificationService.updatePreferences(prefs),
  };
};
