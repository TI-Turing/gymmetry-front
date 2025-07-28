import React, { useState } from 'react';
import { Platform } from 'react-native';
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
    const [activeTab, setActiveTab] = useState(defaultTab);

    const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      // Aquí puedes agregar lógica de navegación global si es necesaria
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
