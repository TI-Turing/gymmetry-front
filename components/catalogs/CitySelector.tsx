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
    placeholder = 'Seleccionar ciudad',
    disabled = false,
    loading = false,
    required = false,
    error,
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
          data={filteredCities}
          onPress={() => setShowModal(true)}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />

        <SelectorModal
          visible={showModal}
          title='Selecciona tu ciudad'
          data={filteredCities}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      </>
    );
  }
);

CitySelector.displayName = 'CitySelector';
