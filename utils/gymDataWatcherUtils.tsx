// Ejemplo de cómo integrar el sistema de observador en la aplicación principal

import React, { useEffect } from 'react';
import { useGymDataObserver } from '@/hooks/useAsyncStorageObserver';
import { gymDataWatcher } from '@/services/gymDataWatcher';

// Componente ejemplo que se beneficia del observador global
export function GymAwareComponent() {
  const { gymData, hasGymData, error } = useGymDataObserver();

  useEffect(() => {
    // El componente puede reaccionar automáticamente a cambios en los datos del gym
    // if (gymData) {
    //   console.debug('Datos del gym actualizados:', gymData.gym?.Name);
    // }
    return () => {};
  }, [gymData]);

  if (error) {
    return <div>Error loading gym data: {error}</div>;
  }

  if (!hasGymData) {
    return <div>No hay datos de gimnasio disponibles</div>;
  }

  return (
    <div>
      <h2>Información del Gimnasio</h2>
      <p>Nombre: {gymData.gym?.Name}</p>
      <p>Email: {gymData.gym?.Email}</p>
      <p>Última actualización: {gymData.lastFetched}</p>
    </div>
  );
}

// Hook personalizado para escuchar eventos de actualización de gym
export function useGymDataUpdates() {
  useEffect(() => {
    const handleGymUpdate = (_event: CustomEvent) => {
      // Aquí puedes agregar lógica personalizada cuando se actualicen los datos
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(
        'gymDataUpdated',
        handleGymUpdate as EventListener
      );

      return () => {
        window.removeEventListener(
          'gymDataUpdated',
          handleGymUpdate as EventListener
        );
      };
    }
    return () => {};
  }, []);
}

// Función para inicializar el sistema de observadores en la aplicación
export function initializeGymDataWatcher() {
  // El watcher ya se auto-inicializa al importar el módulo,
  // pero puedes llamar esta función si necesitas control manual

  if (!gymDataWatcher.isCurrentlyWatching()) {
    gymDataWatcher.startWatching();
  }

  return {
    stopWatching: () => gymDataWatcher.stopWatching(),
    forceCheck: () => gymDataWatcher.forceCheck(),
    isWatching: () => gymDataWatcher.isCurrentlyWatching(),
  };
}
