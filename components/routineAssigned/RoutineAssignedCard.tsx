import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import type { RoutineAssigned } from '@/models/RoutineAssigned';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeRoutineAssignedCardStyles } from './styles';
import { useI18n } from '@/i18n';

interface Props {
  assignment: RoutineAssigned;
  onPress?: () => void;
}

const RoutineAssignedCard: React.FC<Props> = ({ assignment, onPress }) => {
  const styles = useThemedStyles(makeRoutineAssignedCardStyles);
  const { t } = useI18n();
  
  // Backend a veces devuelve la plantilla como "RoutineTemplate" (objeto) o como
  // colección "RoutineTemplates" (array). Fallback al primer elemento si existe.
  type ShortTpl = { Name: string; Premium?: boolean };
  const templateObj = (assignment as unknown as {
    RoutineTemplate?: ShortTpl;
    RoutineTemplates?: ShortTpl[];
  }) || { RoutineTemplate: undefined, RoutineTemplates: undefined };
  const template: Partial<ShortTpl> | null =
    templateObj.RoutineTemplate || templateObj.RoutineTemplates?.[0] || null;
  const createdAtDate = assignment?.CreatedAt
    ? new Date(assignment.CreatedAt)
    : null;
  const content = (
    <View
      style={styles.container}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? t('view_todays_routine') : undefined}
    >
      <View style={styles.badgeRow}>
        <Text style={styles.title}>
          {template?.Name || t('assigned_routine')}
        </Text>
        {template && (
          <Text
            style={[
              styles.badge,
              template.Premium ? styles.badgePremium : styles.badgeFree,
            ]}
          >
            {template.Premium ? t('premium_badge') : t('free_badge')}
          </Text>
        )}
      </View>
      {createdAtDate && (
        <Text style={styles.text}>
          {t('assigned_on')} {createdAtDate.toLocaleDateString()}
        </Text>
      )}
      <Text style={styles.status}>
        {t('status_label')}{' '}
        {assignment.IsActive ? t('active_status') : t('inactive_status')}
      </Text>
      {onPress && (
        <Text
          style={[styles.status, { marginTop: 8, fontSize: 12, opacity: 0.8 }]}
        >
          {t('tap_to_view_routine')}
        </Text>
      )}
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

export default RoutineAssignedCard;
