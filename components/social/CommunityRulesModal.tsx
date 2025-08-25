import React from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeCommunityRulesModalStyles } from './styles/communityRulesModal';
import { useI18n } from '@/i18n';

interface CommunityRulesModalProps {
  visible: boolean;
  onClose: () => void;
}

const CommunityRulesModal: React.FC<CommunityRulesModalProps> = ({
  visible,
  onClose,
}) => {
  const styles = useThemedStyles(makeCommunityRulesModalStyles);
  const { t } = useI18n();
  if (!visible) return null;
  const rules: string[] = [
    t('rule_respect'),
    t('rule_no_harassment'),
    t('rule_no_spam'),
    t('rule_no_illegal'),
    t('rule_privacy'),
    t('rule_false_info'),
    t('rule_report_abuse'),
  ];
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('community_rules_title')}</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button">
              <Text style={styles.close}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body}>
            {rules.map((r, idx) => (
              <View style={styles.ruleRow} key={idx}>
                <Text style={styles.ruleIndex}>{idx + 1}.</Text>
                <Text style={styles.ruleText}>{r}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>{t('accept')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommunityRulesModal;
