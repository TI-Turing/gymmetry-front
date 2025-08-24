import React, { memo, useMemo, useState } from 'react';
import { TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { catalogStyles, getColorSchemeStyles } from './styles/catalogStyles';
import { CatalogItem } from './types';

interface SelectorModalProps {
  visible: boolean;
  title: string;
  data: CatalogItem[];
  onSelect: (id: string) => void;
  onClose: () => void;
  loading?: boolean;
  selectedId?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export const SelectorModal = memo<SelectorModalProps>(
  ({
    visible,
    title,
    data,
    onSelect,
    onClose,
    loading = false,
    selectedId,
    showSearch = false,
    searchPlaceholder = 'Buscar...',
  }) => {
    const colorScheme = useColorScheme();
    const colorStyles = getColorSchemeStyles(colorScheme);
    const [term, setTerm] = useState('');

    const normalize = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}+/gu, '');

    const filtered = useMemo(() => {
      const t = normalize(term.trim());
      if (!t) return data;
      return data.filter((item) => normalize(item.Nombre).includes(t));
    }, [data, term]);

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={catalogStyles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={[catalogStyles.modalContent, colorStyles.modalContent]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[catalogStyles.modalTitle, colorStyles.modalTitle]}>
              {title}
            </Text>

            {showSearch && (
              <View style={catalogStyles.searchWrapper}>
                <TextInput
                  style={[
                    catalogStyles.searchInput,
                    colorStyles.searchInputText,
                  ]}
                  // Sin placeholder visible por requerimiento
                  placeholderTextColor={colorStyles.placeholderText.color}
                  onChangeText={setTerm}
                  value={term}
                />
                <FontAwesome
                  name="search"
                  size={18}
                  color={colorStyles.selectorText.color}
                  style={catalogStyles.searchIcon}
                />
              </View>
            )}

            {loading ? (
              <View style={catalogStyles.loadingContainer}>
                <LoadingSpinner size="large" />
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {filtered.map((item) => (
                  <TouchableOpacity
                    key={item.Id}
                    style={[
                      catalogStyles.optionItem,
                      colorStyles.optionItem,
                      selectedId === item.Id &&
                        catalogStyles.optionItemSelected,
                    ]}
                    onPress={() => onSelect(item.Id)}
                  >
                    <Text
                      style={[
                        catalogStyles.optionText,
                        colorStyles.optionText,
                        selectedId === item.Id &&
                          catalogStyles.optionTextSelected,
                      ]}
                    >
                      {item.Nombre}
                    </Text>
                    {selectedId === item.Id && (
                      <Text style={catalogStyles.checkMark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
                {filtered.length === 0 && !loading && (
                  <View style={catalogStyles.emptyContainer}>
                    <Text
                      style={[catalogStyles.emptyText, colorStyles.emptyText]}
                    >
                      No hay opciones disponibles
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
);

SelectorModal.displayName = 'SelectorModal';
