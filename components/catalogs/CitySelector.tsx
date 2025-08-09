import React, { memo, useState, useMemo } from 'react';
import { BaseCatalogSelector } from './BaseCatalogSelector';
import { SelectorModal } from './SelectorModal';
import { CitySelectorProps } from './types';

export const CitySelector = memo<CitySelectorProps>(
  ({
    cities,
    regionId,
    value,
  onSelect,
  disabled = false,
    loading = false,
    required = false,
    error,
  placeholder = 'Seleccione',
    accessibilityLabel = 'Seleccionar ciudad',
    accessibilityHint = 'Presiona para abrir la lista de ciudades',
  }) => {
    const [showModal, setShowModal] = useState(false);

    const filteredCities = useMemo(() => {
      if (!regionId) {
        return [];
      }
      return cities.filter(city => city.RegionId === regionId);
    }, [cities, regionId]);

    // Normaliza visualmente: solo la primera letra en mayúscula, resto minúsculas
    const displayCities = useMemo(() => {
      const capitalizeFirst = (s: string) => {
        const t = (s ?? '').trim();
        if (!t) return t;
        return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
      };
      return filteredCities.map(c => ({
        ...c,
        Nombre: capitalizeFirst(c.Nombre),
      }));
    }, [filteredCities]);

    const isDisabled = disabled || !regionId;

    const handleSelect = (id: string) => {
      onSelect(id);
      setShowModal(false);
    };

    return (
      <>
        <BaseCatalogSelector
          label='Ciudad'
          value={value}
          placeholder={placeholder}
          disabled={isDisabled}
          loading={loading}
          required={required}
          error={error}
          data={displayCities}
          onPress={() => setShowModal(true)}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />

        <SelectorModal
          visible={showModal}
          title='Selecciona tu ciudad'
          data={displayCities}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
          loading={loading}
          selectedId={value}
          showSearch
          searchPlaceholder='Buscar ciudad...'
        />
      </>
    );
  }
);

CitySelector.displayName = 'CitySelector';
