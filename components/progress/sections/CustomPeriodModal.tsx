import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

export interface CustomPeriodModalProps {
  visible: boolean;
  customFrom: string;
  customTo: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onApply: () => void;
  onClose: () => void;
}

const CustomPeriodModal: React.FC<CustomPeriodModalProps> = ({
  visible,
  customFrom,
  customTo,
  onFromChange,
  onToChange,
  onApply,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderRadius: 16,
            padding: 24,
            width: '90%',
            maxWidth: 400,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            {t('progress_dashboard_custom_period')}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 8,
            }}
          >
            {t('progress_dashboard_start_date')}
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: Colors[colorScheme ?? 'light'].tint,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].background,
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            value={customFrom}
            onChangeText={onFromChange}
          />

          <Text
            style={{
              fontSize: 14,
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 8,
            }}
          >
            {t('progress_dashboard_end_date')}
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: Colors[colorScheme ?? 'light'].tint,
              borderRadius: 8,
              padding: 12,
              marginBottom: 24,
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].background,
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            value={customTo}
            onChangeText={onToChange}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: '#ccc',
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                {t('progress_dashboard_cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApply}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: Colors[colorScheme ?? 'light'].tint,
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                {t('progress_dashboard_apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomPeriodModal;
