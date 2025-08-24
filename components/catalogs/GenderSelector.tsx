import React, { memo, useState } from 'react';
import { BaseCatalogSelector } from './BaseCatalogSelector';
import { SelectorModal } from './SelectorModal';
import { GenderSelectorProps } from './types';

export const GenderSelector = memo<GenderSelectorProps>(
  ({
    genders,
    value,
    onSelect,
    disabled = false,
    loading = false,
    required = false,
    error,
    placeholder = 'Seleccione',
    accessibilityLabel = 'Seleccionar género',
    accessibilityHint = 'Presiona para abrir la lista de géneros',
  }) => {
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (id: string) => {
      onSelect(id);
      setShowModal(false);
    };

    return (
      <>
        <BaseCatalogSelector
          label="Género"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          loading={loading}
          required={required}
          error={error}
          data={genders}
          onPress={() => setShowModal(true)}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />

        <SelectorModal
          visible={showModal}
          title="Selecciona tu género"
          data={genders}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      </>
    );
  }
);

GenderSelector.displayName = 'GenderSelector';
