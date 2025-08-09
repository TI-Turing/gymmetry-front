import React, { memo, useState } from 'react';
import { BaseCatalogSelector } from './BaseCatalogSelector';
import { SelectorModal } from './SelectorModal';
import { EPSSelectorProps } from './types';

export const EPSSelector = memo<EPSSelectorProps>(
  ({
    epsOptions,
    value,
  onSelect,
  disabled = false,
    loading = false,
    required = false,
    error,
  placeholder = 'Seleccione',
    accessibilityLabel = 'Seleccionar EPS',
    accessibilityHint = 'Presiona para abrir la lista de EPS',
  }) => {
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (id: string) => {
      onSelect(id);
      setShowModal(false);
    };

    return (
      <>
        <BaseCatalogSelector
          label='EPS'
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          loading={loading}
          required={required}
          error={error}
          data={epsOptions}
          onPress={() => setShowModal(true)}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />

        <SelectorModal
          visible={showModal}
          title='Selecciona tu EPS'
          data={epsOptions}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
          loading={loading}
          selectedId={value}
          showSearch
          searchPlaceholder='Buscar EPS...'
        />
      </>
    );
  }
);

EPSSelector.displayName = 'EPSSelector';
