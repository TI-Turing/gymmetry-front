import React, { memo, useState, useMemo } from 'react';
import { BaseCatalogSelector } from './BaseCatalogSelector';
import { SelectorModal } from './SelectorModal';
import { DocumentTypeSelectorProps } from './types';

export const DocumentTypeSelector = memo<DocumentTypeSelectorProps>(
  ({
    documentTypes,
    countryId,
    value,
    onSelect,
    placeholder = 'Seleccionar tipo de documento',
    disabled = false,
    loading = false,
    required = false,
    error,
    accessibilityLabel = 'Seleccionar tipo de documento',
    accessibilityHint = 'Presiona para abrir la lista de tipos de documento',
  }) => {
    const [showModal, setShowModal] = useState(false);

    const filteredDocumentTypes = useMemo(() => {
      if (!countryId) {
        return [];
      }
      return documentTypes.filter(docType => docType.PaisId === countryId);
    }, [documentTypes, countryId]);

    const isDisabled = disabled || !countryId;

    const handleSelect = (id: string) => {
      onSelect(id);
      setShowModal(false);
    };

    return (
      <>
        <BaseCatalogSelector
          label='Tipo de documento'
          value={value}
          placeholder={placeholder}
          disabled={isDisabled}
          loading={loading}
          required={required}
          error={error}
          data={filteredDocumentTypes}
          onPress={() => setShowModal(true)}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />

        <SelectorModal
          visible={showModal}
          title='Selecciona el tipo de documento'
          data={filteredDocumentTypes}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      </>
    );
  }
);

DocumentTypeSelector.displayName = 'DocumentTypeSelector';
