import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { getActiveFiltersCount } from './filterUtils';
import { useI18n } from '@/i18n';

// Tipos para los filtros
export interface FilterState {
  requiereEquipos: boolean | null; // null = no filtrar, true/false = filtrar por valor
  calistenia: boolean | null;
  objectives: {
    [key: string]: 'bajo' | 'medio' | 'alto' | null;
  };
}

interface FilterProps {
  visible: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterState) => void; // Cambio: aplicación en tiempo real
  currentFilters: FilterState;
  totalResults: number; // Nuevo: total de resultados
}

const levelColors = {
  bajo: '#ff6300',
  medio: '#FF9800',
  alto: '#FF6B35',
};

export default function RoutineFilters({
  visible,
  onClose,
  onFiltersChange,
  currentFilters,
  totalResults,
}: FilterProps) {
  const { t } = useI18n();
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  // Objeto de etiquetas dinámico basado en las traducciones
  const objectiveLabels: { [key: string]: string } = {
    perdida_peso: t('weight_loss'),
    masa_muscular: t('muscle_mass'),
    definicion_muscular: t('muscle_definition'),
    fuerza: t('strength'),
    resistencia_fisica: t('physical_endurance'),
    tonificacion: t('toning'),
    movilidad: t('mobility'),
    postura: t('posture'),
    rehabilitacion: t('rehabilitation'),
    salud_cardiovascular: t('cardiovascular_health'),
    anti_estres: t('anti_stress'),
    energia: t('energy'),
    sueño: t('sleep'),
    adulto_mayor: t('senior'),
    enfermedades_cronicas: t('chronic_diseases'),
    entrenamiento_funcional: t('functional_training'),
    deportes_especificos: t('specific_sports'),
    pruebas_fisicas: t('physical_tests'),
    hiit: t('hiit'),
    velocidad_agilidad: t('speed_agility'),
    entrenamiento_pareja: t('partner_training'),
    principiante: t('beginner'),
    intermedio: t('intermediate'),
    avanzado: t('advanced'),
    rutina_corta: t('short_routine'),
    rutina_larga: t('long_routine'),
    autoestima: t('self_esteem'),
  };

  // Sincronizar con currentFilters cuando el modal se abre
  React.useEffect(() => {
    if (visible) {
      setFilters(currentFilters);
    }
  }, [visible, currentFilters]);

  // Aplicar filtros en tiempo real cuando cambian
  React.useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // toggleBooleanFilter: se dejó de usar, mantener la lógica inline en botones

  const toggleObjectiveFilter = (
    key: string,
    level: 'bajo' | 'medio' | 'alto'
  ) => {
    setFilters((prev) => ({
      ...prev,
      objectives: {
        ...prev.objectives,
        [key]: prev.objectives[key] === level ? null : level,
      },
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      requiereEquipos: null,
      calistenia: null,
      objectives: {},
    };
    setFilters(clearedFilters);
  };

  const renderBooleanFilter = (
    key: 'requiereEquipos' | 'calistenia',
    label: string
  ) => {
    const value = filters[key];
    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>{label}</Text>
        <View style={styles.booleanOptions}>
          <TouchableOpacity
            style={[
              styles.booleanOption,
              value === null && styles.booleanOptionActive,
            ]}
            onPress={() => setFilters((prev) => ({ ...prev, [key]: null }))}
          >
            <Text
              style={[
                styles.booleanOptionText,
                value === null && styles.booleanOptionTextActive,
              ]}
            >
              {t('all')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.booleanOption,
              value === true && styles.booleanOptionActive,
            ]}
            onPress={() => setFilters((prev) => ({ ...prev, [key]: true }))}
          >
            <Text
              style={[
                styles.booleanOptionText,
                value === true && styles.booleanOptionTextActive,
              ]}
            >
              {t('yes')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.booleanOption,
              value === false && styles.booleanOptionActive,
            ]}
            onPress={() => setFilters((prev) => ({ ...prev, [key]: false }))}
          >
            <Text
              style={[
                styles.booleanOptionText,
                value === false && styles.booleanOptionTextActive,
              ]}
            >
              {t('no')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderObjectiveFilter = (key: string, label: string) => {
    const value = filters.objectives[key];
    return (
      <View style={styles.objectiveSection}>
        <Text style={styles.objectiveLabel}>{label}</Text>
        <View style={styles.levelOptions}>
          {(['bajo', 'medio', 'alto'] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelOption,
                { borderColor: levelColors[level] },
                value === level && {
                  backgroundColor: levelColors[level],
                },
              ]}
              onPress={() => toggleObjectiveFilter(key, level)}
            >
              <Text
                style={[
                  styles.levelOptionText,
                  { color: value === level ? '#FFFFFF' : levelColors[level] },
                ]}
              >
                {t(level)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome name="times" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>{t('routine_filters')}</Text>
            <View style={styles.headerResults}>
              <Text style={styles.headerResultsText}>
                {totalResults} {t('routine')}
                {totalResults !== 1 ? 's' : ''} {t('found')}
                {totalResults !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearText}>{t('clear')}</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Filtros Booleanos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('characteristics')}</Text>
            {renderBooleanFilter('requiereEquipos', t('equipment_required'))}
            {renderBooleanFilter('calistenia', t('calisthenics'))}
          </View>

          {/* Filtros de Objetivos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('objectives_and_characteristics')}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {t('select_focus_level')}
            </Text>
            {Object.entries(objectiveLabels).map(([key, label]) => (
              <View key={key}>{renderObjectiveFilter(key, label)}</View>
            ))}
          </View>
        </ScrollView>

        {/* Footer simplificado */}
        <View style={styles.footer}>
          <Text style={styles.activeFiltersText}>
            {getActiveFiltersCount(filters)} {t('active_filters')}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  headerResults: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
  },
  headerResultsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.tint,
  },
  clearText: {
    fontSize: 16,
    color: Colors.dark.tint,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  booleanOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  booleanOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1E1E1E',
  },
  booleanOptionActive: {
    backgroundColor: Colors.dark.tint,
    borderColor: Colors.dark.tint,
  },
  booleanOptionText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  booleanOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  objectiveSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  objectiveLabel: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  levelOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  levelOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  levelOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  activeFiltersText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
});
