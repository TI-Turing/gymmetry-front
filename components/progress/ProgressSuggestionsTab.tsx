import SuggestionIcon from './SuggestionIcon';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ProgressSummaryResponse } from '../../dto/Progress/ProgressSummaryResponse';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';
import { CustomAlert } from '../common/CustomAlert';

interface Props {
  data?: ProgressSummaryResponse['Suggestions'];
  loading: boolean;
  error?: Error | null;
  onRefresh: () => void;
}

const ProgressSuggestionsTab: React.FC<Props> = ({
  data,
  loading,
  error,
  onRefresh,
}) => {
  const themed = useThemedStyles(styles) as ReturnType<typeof styles>;
  if (loading) return <ActivityIndicator style={themed.loading} />;
  if (error)
    return (
      <CustomAlert
        visible
        type="error"
        title="Error"
        message={error.message}
        onClose={onRefresh}
      />
    );
  type Suggestion = string | { Title?: string; Description?: string };
  const suggestions: Suggestion[] = Array.isArray(data) ? data : [];
  if (!suggestions.length)
    return <Text style={themed.empty}>No hay sugerencias.</Text>;

  return (
    <View style={themed.tabContent}>
      <Text style={themed.title}>Sugerencias</Text>
      {suggestions.map((s, idx) =>
        typeof s === 'string' ? (
          <View
            key={idx}
            style={[
              themed.item,
              { flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            <SuggestionIcon title={s} />
            <Text style={[themed.itemValue, { marginLeft: 8 }]}>{s}</Text>
          </View>
        ) : (
          <View
            key={idx}
            style={[
              themed.item,
              { flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            <SuggestionIcon title={(s as { Title?: string }).Title} />
            <View style={{ marginLeft: 8 }}>
              <Text style={themed.itemTitle}>
                {(s as { Title?: string }).Title ?? 'Sugerencia'}
              </Text>
              <Text style={themed.itemValue}>
                {(s as { Description?: string }).Description ?? ''}
              </Text>
            </View>
          </View>
        )
      )}
    </View>
  );
};
export default ProgressSuggestionsTab;
