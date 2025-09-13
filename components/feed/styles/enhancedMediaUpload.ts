import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const enhancedMediaUploadStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const muted = theme === 'dark' ? '#B0B0B0' : '#6B7280';
  const border = theme === 'dark' ? '#333' : '#DDD';
  const cardBg = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';

  return {
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },

    // Header
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: border,
      backgroundColor: palette.background,
    },
    closeButton: {
      padding: 8,
      width: 80,
      alignItems: 'flex-start' as const,
    },
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: text,
      flex: 1,
      textAlign: 'center' as const,
    },
    confirmButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: palette.tint,
      borderRadius: 8,
      width: 80,
      alignItems: 'center' as const,
    },
    confirmButtonDisabled: {
      backgroundColor: palette.tabIconDefault,
    },
    confirmButtonText: {
      color: 'white',
      fontWeight: '600' as const,
      fontSize: 14,
    },
    confirmButtonTextDisabled: {
      color: muted,
    },

    // Estadísticas
    statsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: cardBg,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },
    statsText: {
      fontSize: 14,
      color: muted,
      textAlign: 'center' as const,
    },

    // Botones de acción
    actionButtons: {
      flexDirection: 'row' as const,
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 16,
      backgroundColor: palette.background,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: 16,
      backgroundColor: cardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: border,
      gap: 8,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '500' as const,
      color: palette.tint,
    },

    // Processing
    processingContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: 16,
      gap: 12,
    },
    processingText: {
      fontSize: 14,
      color: muted,
    },

    // Progress bar
    progressContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: border,
      borderRadius: 2,
      overflow: 'hidden' as const,
    },
    progressFill: {
      height: '100%' as const,
      backgroundColor: palette.tint,
    },
    progressText: {
      fontSize: 12,
      color: muted,
      minWidth: 35,
      textAlign: 'right' as const,
    },

    // Media list
    mediaList: {
      flex: 1,
      paddingHorizontal: 16,
    },
    mediaGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 12,
      paddingVertical: 16,
    },

    // Media preview item
    mediaPreviewItem: {
      width: '48%' as const,
      aspectRatio: 1,
      position: 'relative' as const,
    },
    mediaPreview: {
      width: '100%' as const,
      height: '100%' as const,
      borderRadius: 12,
      overflow: 'hidden' as const,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
    },
    mediaImage: {
      width: '100%' as const,
      height: '100%' as const,
      resizeMode: 'cover' as const,
    },
    mediaOverlay: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 8,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    mediaInfo: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 6,
    },
    mediaSize: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500' as const,
    },
    compressedBadge: {
      backgroundColor: 'rgba(76, 175, 80, 0.8)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    removeButton: {
      position: 'absolute' as const,
      top: -8,
      right: -8,
      backgroundColor: 'white',
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },

    // Empty state
    emptyState: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 32,
      gap: 16,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: muted,
      textAlign: 'center' as const,
    },
    emptyStateText: {
      fontSize: 14,
      color: muted,
      textAlign: 'center' as const,
      lineHeight: 20,
    },

    // Preview modal
    previewModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    previewModalBackdrop: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    previewModalContent: {
      width: '90%' as const,
      maxWidth: 400,
      backgroundColor: 'white',
      borderRadius: 16,
      overflow: 'hidden' as const,
    },
    previewImage: {
      width: '100%' as const,
      aspectRatio: 1,
    },
    previewInfo: {
      padding: 16,
      backgroundColor: cardBg,
    },
    previewFileName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: text,
      marginBottom: 4,
    },
    previewFileInfo: {
      fontSize: 14,
      color: muted,
    },
  } as const;
};
