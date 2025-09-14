// Auto-generated from C# UserBlock entity. Do not edit manually.

export interface UserBlock {
  Id: string;
  BlockerId: string;
  BlockedUserId: string;
  CreatedAt: string;
  IsActive: boolean;

  // Navigation properties (if included)
  Blocker?: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
  BlockedUser?: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
}

export enum BlockStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export const BlockStatusLabels = {
  [BlockStatus.Active]: 'Bloqueado',
  [BlockStatus.Inactive]: 'Desbloqueado',
} as const;

export const BlockStatusColors = {
  [BlockStatus.Active]: '#EF4444', // red-500
  [BlockStatus.Inactive]: '#10B981', // green-500
} as const;

// Helper interfaces for UI components
export interface BlockUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  isBlocked?: boolean;
  blockedAt?: string;
}

export interface BlockStats {
  totalBlocked: number;
  totalBlockers: number;
  mutualBlocks: number;
  recentBlocks: number;
}

// Utility functions
export const getUserDisplayName = (user: {
  name?: string;
  username?: string;
}): string => {
  return user.name || user.username || 'Usuario';
};

export const formatBlockDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getBlockDuration = (createdAt: string): string => {
  const now = new Date();
  const blockDate = new Date(createdAt);
  const diffInDays = Math.floor(
    (now.getTime() - blockDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return 'Hoy';
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `${diffInDays} días`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses`;
  return `${Math.floor(diffInDays / 365)} años`;
};
