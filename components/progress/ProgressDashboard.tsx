import React, { useMemo, useState } from 'react';

import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useMultiProgressSummary } from '../../hooks/useProgress';
import { ProgressSummaryResponse } from '../../dto/Progress/ProgressSummaryResponse';
import { CustomAlert } from '../common/CustomAlert';
import Badge from './Badge';
import PieChartMuscle from './PieChartMuscle';
import SuggestionIcon from './SuggestionIcon';
import { useColorScheme } from '../../components/useColorScheme';
import { useAuth } from '../../contexts/AuthContext';
import Colors from '../../constants/Colors';

type PeriodType =
  | 'month'
  | '3months'
  | '6months'
  | 'year'
  | '2years'
  | 'custom';

interface PeriodOption {
  type: PeriodType;
  label: string;
  from: string;
  to: string;
  days: number;
}

const ProgressDashboard: React.FC = () => {
  const [_showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('3months');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  // Eliminados customStartDate, setCustomStartDate, customEndDate, setCustomEndDate por no usarse
  const [showAllMeasures, setShowAllMeasures] = useState(false);
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  const getPeriodOptions = (): PeriodOption[] => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const last3Months = new Date(today);
    last3Months.setMonth(today.getMonth() - 3);

    const last6Months = new Date(today);
    last6Months.setMonth(today.getMonth() - 6);

    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);

    const last2Years = new Date(today);
    last2Years.setFullYear(today.getFullYear() - 2);

    const options: PeriodOption[] = [
      {
        type: 'month',
        label: 'Último mes',
        from: formatDate(lastMonth),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      {
        type: '3months',
        label: 'Últimos 3 meses',
        from: formatDate(last3Months),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - last3Months.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      {
        type: '6months',
        label: 'Últimos 6 meses',
        from: formatDate(last6Months),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - last6Months.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      {
        type: 'year',
        label: 'Último año',
        from: formatDate(lastYear),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - lastYear.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      {
        type: '2years',
        label: 'Últimos 2 años',
        from: formatDate(last2Years),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - last2Years.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
    ];

    if (selectedPeriod === 'custom' && customFrom && customTo) {
      const fromDate = new Date(customFrom);
      const toDate = new Date(customTo);
      options.push({
        type: 'custom',
        label: 'Personalizado',
        from: customFrom,
        to: customTo,
        days: Math.ceil(
          (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
        ),
      });
    }

    return options;
  };

  const currentOption =
    getPeriodOptions().find((opt) => opt.type === selectedPeriod) ||
    getPeriodOptions()[0];

  const req = useMemo(
    () => ({
      UserId: user?.id || '', // Usar el ID del usuario autenticado
      Periods: [
        {
          From: currentOption.from,
          To: currentOption.to,
          Days: currentOption.days,
        },
      ],
      IncludeHistory: true,
      Timezone: 'America/Bogota',
    }),
    [currentOption, user?.id]
  );

  const { data, loading, error, refetch } = useMultiProgressSummary(req, {
    enabled: !!user?.id, // Solo habilitado si hay userId
  });
  const periods: ProgressSummaryResponse[] = Array.isArray(data?.Periods)
    ? data.Periods
    : [];
  const current: ProgressSummaryResponse | undefined = periods[0] || undefined; // Siempre usar el primer periodo ya que solo enviamos uno

  // Manejar usuario no autenticado
  if (!user?.id) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            fontSize: 16,
            textAlign: 'center',
          }}
        >
          Debes iniciar sesión para ver tu progreso
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? 'light'].tint}
        />
      </View>
    );
  }

  if (error) {
    return (
      <CustomAlert
        visible
        type="error"
        title="Error"
        message={error}
        onClose={refetch}
      />
    );
  }

  if (!current) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
          No hay datos de progreso disponibles.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Selector de periodo - Botón único */}
      <TouchableOpacity
        onPress={() => setShowPeriodModal(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          backgroundColor: Colors[colorScheme ?? 'light'].card,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: Colors[colorScheme ?? 'light'].tint,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors[colorScheme ?? 'light'].text,
            marginRight: 8,
          }}
        >
          Período:
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: Colors[colorScheme ?? 'light'].tint,
          }}
        >
          {currentOption.label}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: Colors[colorScheme ?? 'light'].text,
            marginLeft: 8,
          }}
        >
          ▼
        </Text>
      </TouchableOpacity>
      {/* Tarjeta de medidas físicas con expansión y ver histórico */}
      {current.Assessments?.Latest && (
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderRadius: 16,
            padding: 18,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: Colors[colorScheme ?? 'light'].tint,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].tint,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Medidas físicas recientes
          </Text>
          {/* Mostrar solo los campos principales */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {['Height', 'Weight', 'BodyFatPercentage'].map((key) => {
              const value = current.Assessments?.Latest?.[key];
              if (!value) return null;
              let label = key;
              if (key === 'Height') label = 'Altura';
              if (key === 'Weight') label = 'Peso';
              if (key === 'BodyFatPercentage') label = '% Grasa';
              return (
                <View key={key} style={{ width: '48%', marginBottom: 10 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: Colors[colorScheme ?? 'light'].text,
                      fontWeight: '600',
                    }}
                  >
                    {label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      color: Colors[colorScheme ?? 'light'].tint,
                      fontWeight: 'bold',
                    }}
                  >
                    {String(value)}
                  </Text>
                </View>
              );
            })}
          </View>
          {/* Botón ver más y ver histórico */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowAllMeasures((prev) => !prev)}
              style={{
                backgroundColor: Colors[colorScheme ?? 'light'].tint,
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {showAllMeasures ? 'Ver menos' : 'Ver más'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowHistoryModal(true)}
              style={{
                backgroundColor: Colors[colorScheme ?? 'light'].tint,
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                Ver histórico
              </Text>
            </TouchableOpacity>
          </View>
          {/* Expansión de todas las medidas */}
          {showAllMeasures && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginTop: 12,
              }}
            >
              {Object.entries(current.Assessments.Latest).map(
                ([key, value]) => {
                  if (
                    !value ||
                    ['Height', 'Weight', 'BodyFatPercentage'].includes(key)
                  )
                    return null;
                  let label = key;
                  if (key === 'Waist') label = 'Cintura';
                  if (key === 'Hip') label = 'Cadera';
                  if (key === 'Chest') label = 'Pecho';
                  if (key === 'Arm') label = 'Brazo';
                  if (key === 'Leg') label = 'Pierna';
                  // Puedes agregar más traducciones si hay más campos
                  return (
                    <View key={key} style={{ width: '48%', marginBottom: 10 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: Colors[colorScheme ?? 'light'].text,
                          fontWeight: '600',
                        }}
                      >
                        {label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          color: Colors[colorScheme ?? 'light'].tint,
                          fontWeight: 'bold',
                        }}
                      >
                        {String(value)}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
          )}
        </View>
      )}
      // Estado para expansión y modal de histórico const [showAllMeasures,
      setShowAllMeasures] = useState(false); const [showHistoryModal,
      setShowHistoryModal] = useState(false);
      {/* KPIs Principales */}
      <View
        style={{
          backgroundColor: Colors[colorScheme ?? 'light'].card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors[colorScheme ?? 'light'].text,
            marginBottom: 16,
          }}
        >
          📊 Resumen del Período
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <Badge
            label="Adherencia"
            value={`${current.Adherence.AdherencePct}%`}
            color="#4CAF50"
          />
          <Badge
            label="Racha Actual"
            value={`${current.Adherence.CurrentStreak} días`}
            color="#2196F3"
          />
          <Badge
            label="Sesiones"
            value={current.Adherence.Sessions.toString()}
            color="#FF9800"
          />
          <Badge
            label="Ejercicios"
            value={current.Exercises.DistinctExercises.toString()}
            color="#9C27B0"
          />
        </View>

        {/* Barra de progreso de adherencia */}
        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 14,
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 8,
            }}
          >
            Progreso semanal ({current.Adherence.CompletedDays}/
            {current.Adherence.TargetDays} días)
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              height: 40,
              gap: 2,
            }}
          >
            {Array.from({ length: current.Period.Days }).map((_, i) => {
              const completado = i < current.Adherence.CompletedDays;
              return (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: completado ? 32 : 12,
                    backgroundColor: completado ? '#4CAF50' : '#E0E0E0',
                    borderRadius: 3,
                  }}
                />
              );
            })}
          </View>
        </View>
      </View>
      {/* Músculos trabajados */}
      {current.Muscles?.Distribution && (
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 12,
            }}
          >
            💪 Distribución Muscular
          </Text>
          <PieChartMuscle distribution={current.Muscles.Distribution} />

          {current.Muscles.Dominant && current.Muscles.Dominant.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors[colorScheme ?? 'light'].text,
                  marginBottom: 8,
                }}
              >
                Grupos dominantes:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {current.Muscles.Dominant.map((muscle: string, idx: number) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: Colors[colorScheme ?? 'light'].tint,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                      {muscle}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
      {/* Ejercicios destacados */}
      {current.Exercises && (
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 12,
            }}
          >
            🏋️‍♂️ Ejercicios Destacados
          </Text>

          {current.Exercises.TopExercises &&
            current.Exercises.TopExercises.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors[colorScheme ?? 'light'].text,
                    marginBottom: 8,
                  }}
                >
                  Más practicados:
                </Text>
                {current.Exercises.TopExercises.slice(0, 3).map(
                  (
                    exercise: import('../../dto/Progress/ProgressSummaryResponse').ExerciseFreq,
                    idx: number
                  ) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor:
                          idx === 0
                            ? '#FFD700'
                            : idx === 1
                              ? '#C0C0C0'
                              : '#CD7F32',
                        borderRadius: 8,
                        marginBottom: 4,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', color: '#000' }}>
                        {idx + 1}. {exercise.Name}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#555' }}>
                        {exercise.Sessions} sesiones • {exercise.Reps} reps
                      </Text>
                    </View>
                  )
                )}
              </View>
            )}

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: Colors[colorScheme ?? 'light'].tint,
                }}
              >
                {current.Exercises.TotalSeries}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                Series totales
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: Colors[colorScheme ?? 'light'].tint,
                }}
              >
                {current.Exercises.TotalReps}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                Repeticiones
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: Colors[colorScheme ?? 'light'].tint,
                }}
              >
                {current.Time?.TotalMinutes || 0}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                Minutos totales
              </Text>
            </View>
          </View>
        </View>
      )}
      {/* Objetivos */}
      {current.Objectives && (
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 12,
            }}
          >
            🎯 Objetivos
          </Text>

          {current.Objectives.Planned && current.Objectives.Executed && (
            <View>
              {Object.entries(current.Objectives.Planned).map(
                ([key, planned]) => {
                  const executed =
                    (current.Objectives.Executed as Record<string, number>)[
                      key
                    ] || 0;
                  const percentage =
                    (planned as number) > 0
                      ? (executed / (planned as number)) * 100
                      : 0;

                  return (
                    <View key={key} style={{ marginBottom: 12 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors[colorScheme ?? 'light'].text,
                          }}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: Colors[colorScheme ?? 'light'].text,
                          }}
                        >
                          {`${executed}/${planned}`}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 8,
                          backgroundColor: '#E0E0E0',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <View
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            height: '100%',
                            backgroundColor:
                              percentage >= 80
                                ? '#4CAF50'
                                : percentage >= 50
                                  ? '#FF9800'
                                  : '#F44336',
                          }}
                        />
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          )}
        </View>
      )}
      {/* Sugerencias */}
      {current.Suggestions && current.Suggestions.length > 0 && (
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 12,
            }}
          >
            💡 Sugerencias
          </Text>
          {current.Suggestions.map((suggestion: string, idx: number) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderRadius: 12,
                marginBottom: 8,
              }}
            >
              <SuggestionIcon title={suggestion} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors[colorScheme ?? 'light'].text,
                    marginBottom: 4,
                  }}
                >
                  {suggestion || 'Sugerencia'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
      {/* Disciplina */}
      {current.Discipline && (
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 32,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 12,
            }}
          >
            ⏰ Disciplina
          </Text>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: Colors[colorScheme ?? 'light'].tint,
                }}
              >
                {Math.round((current.Discipline.ConsistencyIndex || 0) * 100)}%
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                Consistencia
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: Colors[colorScheme ?? 'light'].tint,
                }}
              >
                {current.Discipline.CommonStartHour || 'N/A'}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                Hora común
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: Colors[colorScheme ?? 'light'].tint,
                }}
              >
                {current.Discipline.ScheduleRegularity || 'N/A'}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                Regularidad
              </Text>
            </View>
          </View>
        </View>
      )}
      {/* Modal de selección de período */}
      <Modal
        visible={showPeriodModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPeriodModal(false)}
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
              Seleccionar Período
            </Text>

            {getPeriodOptions().map((option) => (
              <TouchableOpacity
                key={option.type}
                onPress={() => {
                  setSelectedPeriod(option.type);
                  setShowPeriodModal(false);
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
                setShowPeriodModal(false);
                setShowCustomModal(true);
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
                Personalizado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowPeriodModal(false)}
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
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal para período personalizado */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomModal(false)}
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
              Período Personalizado
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: Colors[colorScheme ?? 'light'].text,
                marginBottom: 8,
              }}
            >
              Fecha de inicio:
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
              onChangeText={setCustomFrom}
            />

            <Text
              style={{
                fontSize: 14,
                color: Colors[colorScheme ?? 'light'].text,
                marginBottom: 8,
              }}
            >
              Fecha de fin:
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
              onChangeText={setCustomTo}
            />

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <TouchableOpacity
                onPress={() => setShowCustomModal(false)}
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
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (customFrom && customTo) {
                    setSelectedPeriod('custom');
                    setShowCustomModal(false);
                  }
                }}
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
                  Aplicar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProgressDashboard;
