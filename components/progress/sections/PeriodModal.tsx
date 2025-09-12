import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

export interface PeriodModalProps {
  visible: boolean;
  selectedPeriod: string;
  onPeriodSelect: (type: string) => void;
  onCustomRequest: () => void;
  onClose: () => void;
}

const PeriodModal: React.FC<PeriodModalProps> = ({
  visible,
  selectedPeriod,
  onPeriodSelect,
  onCustomRequest,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();

  const periodOptions = [
    { type: 'week', label: t('progress_dashboard_this_week') },
    { type: 'month', label: t('progress_dashboard_this_month') },
    { type: 'quarter', label: t('progress_dashboard_this_quarter') },
    { type: 'year', label: t('progress_dashboard_this_year') },
  ];

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
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            {t('progress_dashboard_select_period')}
          </Text>

          {periodOptions.map((option) => (
            <TouchableOpacity
              key={option.type}
              onPress={() => {
                onPeriodSelect(option.type);
                onClose();
              }}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                backgroundColor:
                  selectedPeriod === option.type
                    ? Colors[colorScheme ?? 'light'].tint
                    : 'transparent',
                borderRadius: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor:
                  selectedPeriod === option.type
                    ? Colors[colorScheme ?? 'light'].tint
                    : Colors[colorScheme ?? 'light'].text + '30',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight:
                    selectedPeriod === option.type ? 'bold' : 'normal',
                  color:
                    selectedPeriod === option.type
                      ? '#fff'
                      : Colors[colorScheme ?? 'light'].text,
                  textAlign: 'center',
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => {
              onCustomRequest();
            }}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              backgroundColor:
                selectedPeriod === 'custom'
                  ? Colors[colorScheme ?? 'light'].tint
                  : 'transparent',
              borderRadius: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor:
                selectedPeriod === 'custom'
                  ? Colors[colorScheme ?? 'light'].tint
                  : Colors[colorScheme ?? 'light'].text + '30',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: selectedPeriod === 'custom' ? 'bold' : 'normal',
                color:
                  selectedPeriod === 'custom'
                    ? '#fff'
                    : Colors[colorScheme ?? 'light'].text,
                textAlign: 'center',
              }}
            >
              {t('progress_dashboard_custom')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: '#ccc',
              borderRadius: 8,
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
        </View>
      </View>
    </Modal>
  );
};

export default PeriodModal;
