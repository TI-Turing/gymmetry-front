import React, { memo } from 'react';
import { TouchableOpacity, Modal, ScrollView } from 'react-native';
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
}

export const SelectorModal = memo<SelectorModalProps>(
  ({ visible, title, data, onSelect, onClose, loading = false }) => {
    const colorScheme = useColorScheme();
    const colorStyles = getColorSchemeStyles(colorScheme);

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType='slide'
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

            {loading ? (
              <View style={catalogStyles.loadingContainer}>
                <LoadingSpinner size='large' />
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {data.map(item => (
                  <TouchableOpacity
                    key={item.Id}
                    style={[catalogStyles.optionItem, colorStyles.optionItem]}
                    onPress={() => onSelect(item.Id)}
                  >
                    <Text
                      style={[catalogStyles.optionText, colorStyles.optionText]}
                    >
                      {item.Nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
                {data.length === 0 && !loading && (
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
