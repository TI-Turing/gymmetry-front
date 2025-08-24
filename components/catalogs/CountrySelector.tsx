import React, { memo, useState } from 'react';
import { BaseCatalogSelector } from './BaseCatalogSelector';
import { SelectorModal } from './SelectorModal';
import { CountrySelectorProps } from './types';

export const CountrySelector = memo<CountrySelectorProps>(
  ({
    countries,
    value,
    onSelect,
    disabled = false,
    loading = false,
    required = false,
    error,
    placeholder = 'Seleccione',
    accessibilityLabel = 'Seleccionar país',
    accessibilityHint = 'Presiona para abrir la lista de países',
  }) => {
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (id: string) => {
      onSelect(id);
      setShowModal(false);
    };

    return (
      <>
        <BaseCatalogSelector
          label="País"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          loading={loading}
          required={required}
          error={error}
          data={countries}
          onPress={() => setShowModal(true)}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />

        <SelectorModal
          visible={showModal}
          title="Selecciona tu país"
          data={countries}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      </>
    );
  }
);

CountrySelector.displayName = 'CountrySelector';
