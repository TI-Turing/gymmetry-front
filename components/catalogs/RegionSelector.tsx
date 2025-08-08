import React, { memo, useState, useMemo } from 'react';
import { BaseCatalogSelector } from './BaseCatalogSelector';
import { SelectorModal } from './SelectorModal';
import { RegionSelectorProps } from './types';

export const RegionSelector = memo<RegionSelectorProps>(
  ({
    regions,
    countryId,
    value,
    onSelect,
    placeholder = 'Seleccionar región/estado',
    disabled = false,
    loading = false,
    required = false,
    error,
    accessibilityLabel = 'Seleccionar región o estado',
    accessibilityHint = 'Presiona para abrir la lista de regiones',
  }) => {
    const [showModal, setShowModal] = useState(false);

    const filteredRegions = useMemo(() => {
      if (!countryId) {
        return [];
      }
      return regions.filter(region => region.PaisId === countryId);
    }, [regions, countryId]);

    const isDisabled = disabled || !countryId;

    const handleSelect = (id: string) => {
      onSelect(id);
      setShowModal(false);
    };

    return (
      <>
        <BaseCatalogSelector
          label='Región/Estado'
          value={value}
          placeholder={placeholder}
          disabled={isDisabled}
          loading={loading}
          required={required}
          error={error}
          data={filteredRegions}
          onPress={() => setShowModal(true)}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />

        <SelectorModal
          visible={showModal}
          title='Selecciona tu región/estado'
          data={filteredRegions}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      </>
    );
  }
);

RegionSelector.displayName = 'RegionSelector';
