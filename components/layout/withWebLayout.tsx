import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import WebLayout from './WebLayout';

interface WithWebLayoutOptions {
  defaultTab?: string;
}

export function withWebLayout<P extends object>(
  Component: React.ComponentType<P>,
  options: WithWebLayoutOptions = {}
) {
  const { defaultTab = 'index' } = options;

  return function WrappedComponent(props: P) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Detectar la tab activa basada en la URL
    useEffect(() => {
      if (Platform.OS === 'web' && pathname) {
        const pathSegments = pathname.split('/');
        const currentTab = pathSegments[pathSegments.length - 1] || 'index';
        setActiveTab(currentTab);
      }
    }, [pathname]);

  const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      // Navegación usando expo-router
      if (Platform.OS === 'web') {
    // Ahora las rutas del menú viven en raíz en web
    router.push(`/${tab}` as any);
      }
    };

    if (Platform.OS === 'web') {
      return (
        <WebLayout activeTab={activeTab} onTabChange={handleTabChange}>
          <Component {...props} />
        </WebLayout>
      );
    }

    return <Component {...props} />;
  };
}
