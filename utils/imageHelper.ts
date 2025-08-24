import { useMemo } from 'react';
import { useAppSettings } from '@/contexts/AppSettingsContext';

export function useImageQualityParams(
  originalWidth: number,
  originalHeight: number
) {
  const { settings } = useAppSettings();
  return useMemo(() => {
    let q = 0.8;
    let maxW = originalWidth;
    let maxH = originalHeight;
    const dq = settings.dataSaver ? 'low' : settings.imageQuality;
    switch (dq) {
      case 'high':
        q = 0.9;
        break;
      case 'medium':
        q = 0.7;
        maxW = Math.min(originalWidth, 1280);
        maxH = Math.min(originalHeight, 720);
        break;
      case 'low':
        q = 0.5;
        maxW = Math.min(originalWidth, 800);
        maxH = Math.min(originalHeight, 600);
        break;
      case 'auto':
      default:
        q = 0.8;
        break;
    }
    return { quality: q, maxWidth: maxW, maxHeight: maxH };
  }, [
    settings.dataSaver,
    settings.imageQuality,
    originalWidth,
    originalHeight,
  ]);
}
