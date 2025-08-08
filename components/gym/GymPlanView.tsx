import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { gymPlanService } from '@/services/gymPlanService';
import { GymPlanSelectedType } from '@/dto/gymPlan/GymPlanSelectedType';
import { GymPlanSelected } from '@/dto/gymPlan/GymPlanSelected';
import { authService } from '@/services/authService';

interface GymPlanViewProps {
  gymId: string;
  onPlanSelected?: (planId: string) => void;
}

export default function GymPlanView({
  gymId,
  onPlanSelected,
}: GymPlanViewProps) {
  const [gymPlanTypes, setGymPlanTypes] = useState<GymPlanSelectedType[]>([]);
  const [currentGymPlan, setCurrentGymPlan] = useState<GymPlanSelected | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGymPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar y refrescar token si es necesario
      const tokenValid = await authService.checkAndRefreshToken();
      if (!tokenValid) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        return;
      }
      // Cargar tipos de planes y plan actual en paralelo
      const [planTypesResponse, currentPlanResponse] = await Promise.all([
        gymPlanService.getGymPlanTypes(),
        gymPlanService.getCurrentGymPlan(gymId),
      ]);
      if (planTypesResponse.Success) {
        // Asegurar que siempre tenemos un array
        setGymPlanTypes(planTypesResponse.Data || []);
      } else {
        // Solo mostrar error si el servicio falló, no si no hay datos
        setGymPlanTypes([]);
        setError('Error al cargar los tipos de planes');
        return;
      }

      if (currentPlanResponse.Success) {
        setCurrentGymPlan(currentPlanResponse.Data);
      }
    } catch {
      setError('Error al cargar los planes del gimnasio');
    } finally {
      setIsLoading(false);
    }
  }, [gymId]);

  useEffect(() => {
    loadGymPlans();
  }, [loadGymPlans]);

  const handleSelectPlan = async (planType: GymPlanSelectedType) => {
    try {
      setIsCreatingPlan(true);

      Alert.alert(
        'Confirmar Selección',
        `¿Estás seguro de que deseas seleccionar el plan "${planType.name}"?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => setIsCreatingPlan(false),
          },
          {
            text: 'Confirmar',
            onPress: async () => {
              try {
                // TODO: Integrar con pasarela de pagos
                // Generar fechas del plan (1 mes)
                const { startDate, endDate } =
                  gymPlanService.generatePlanDates();

                const createPlanRequest = {
                  GymId: gymId,
                  StartDate: startDate,
                  EndDate: endDate,
                  GymPlanSelectedTypeId: planType.id,
                };

                const response =
                  await gymPlanService.createGymPlan(createPlanRequest);

                if (response.Success) {
                  Alert.alert(
                    'Plan Creado',
                    `El plan "${planType.name}" ha sido asignado exitosamente al gimnasio.`,
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          // Recargar los datos para mostrar el nuevo plan
                          loadGymPlans();
                          onPlanSelected?.(planType.id);
                        },
                      },
                    ]
                  );
                } else {
                  Alert.alert(
                    'Error',
                    response.Message || 'No se pudo crear el plan'
                  );
                }
              } catch {
                Alert.alert(
                  'Error',
                  'Ocurrió un error al crear el plan. Intenta nuevamente.'
                );
              } finally {
                setIsCreatingPlan(false);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch {
      setIsCreatingPlan(false);
      Alert.alert('Error', 'Ocurrió un error inesperado.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.light.tint} />
        <Text style={styles.loadingText}>Cargando planes del gimnasio...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name='exclamation-triangle' size={48} color='#FF6B6B' />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadGymPlans}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Plan actual del gimnasio */}
      {currentGymPlan && (
        <View style={styles.currentPlanContainer}>
          <Text style={styles.sectionTitle}>Plan Actual del Gimnasio</Text>
          <View style={styles.currentPlanCard}>
            <View style={styles.planHeader}>
              <Text style={styles.currentPlanName}>
                {currentGymPlan.gymPlanSelectedType?.name || 'Plan Activo'}
              </Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeText}>Activo</Text>
              </View>
            </View>
            <View style={styles.planDetails}>
              <View style={styles.detailRow}>
                <FontAwesome name='calendar' size={16} color='#CCCCCC' />
                <Text style={styles.detailLabel}>Inicio:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(currentGymPlan.startDate)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <FontAwesome
                  name='calendar-check-o'
                  size={16}
                  color='#CCCCCC'
                />
                <Text style={styles.detailLabel}>Vencimiento:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(currentGymPlan.endDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Planes disponibles */}
      <View style={styles.availablePlansContainer}>
        <Text style={styles.sectionTitle}>
          {currentGymPlan
            ? 'Cambiar Plan'
            : 'Seleccionar Plan para el Gimnasio'}
        </Text>

        {gymPlanTypes.length === 0 ? (
          <View style={styles.noPlansContainer}>
            <FontAwesome name='info-circle' size={48} color='#FFB86C' />
            <Text style={styles.noPlansText}>
              No hay planes disponibles actualmente
            </Text>
            <Text style={styles.noPlansSubtext}>
              Los planes del gimnasio no están disponibles en este momento.
            </Text>
          </View>
        ) : (
          gymPlanTypes.map(planType => (
            <View key={planType.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{planType.name}</Text>
                  <Text style={styles.planPrice}>
                    {gymPlanService.formatPrice(
                      planType.price,
                      planType.usdPrice,
                      planType.countryId
                    )}
                  </Text>
                </View>
                {planType.isActive && (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>Disponible</Text>
                  </View>
                )}
              </View>

              {planType.description && (
                <Text style={styles.planDescription}>
                  {planType.description}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  !planType.isActive && styles.selectButtonDisabled,
                  isCreatingPlan && styles.selectButtonDisabled,
                ]}
                onPress={() => handleSelectPlan(planType)}
                disabled={!planType.isActive || isCreatingPlan}
              >
                {isCreatingPlan ? (
                  <ActivityIndicator size='small' color='#FFFFFF' />
                ) : (
                  <Text style={styles.selectButtonText}>
                    {currentGymPlan
                      ? 'Cambiar a este Plan'
                      : 'Seleccionar Plan'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  currentPlanContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  currentPlanCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#50E3C2',
  },
  availablePlansContainer: {
    padding: 20,
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  planDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  activeBadge: {
    backgroundColor: '#50E3C2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availableBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  availableText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planDetails: {
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    marginLeft: 12,
    marginRight: 8,
    minWidth: 100,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  selectButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  selectButtonDisabled: {
    backgroundColor: '#666666',
    opacity: 0.6,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noPlansContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noPlansText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  noPlansSubtext: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
