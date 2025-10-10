import React from 'react';

/**
 * AdMobBanner - Web Stub
 *
 * En web, AdMob no está disponible.
 * Este componente no renderiza nada.
 */

interface AdMobBannerProps {
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: Error) => void;
  onAdOpened?: () => void;
  onAdClosed?: () => void;
  size?: unknown;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = () => {
  // En web, no renderizamos nada
  return null;
};
