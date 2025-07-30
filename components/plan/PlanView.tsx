import React, { useState, useEffect } from 'react';
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
import { UI_CONSTANTS } from '@/constants/AppConstants';
import { planTypeService, PlanType } from '@/services/planTypeService';
import { planService } from '@/services/planService';
import { authService } from '@/services/authService';

interface PlanTypeViewProps {
  onPlanSelected?: (planType: PlanType) => void;
  showCurrentPlan?: boolean;
}

export default function PlanTypeView({
  onPlanSelected,
  showCurrentPlan = true,
}: PlanTypeViewProps) {
  const [planTypes, setPlanTypes] = useState<PlanType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPlan, setIsCreatingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUserPlan, setCurrentUserPlan] = useState<any>(null);

  useEffect(() => {
    loadPlanTypes();
    if (showCurrentPlan) {
      loadCurrentUserPlan();
    }
  }, [showCurrentPlan]);

  const loadPlanTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Datos mock temporales mientras se implementa el backend
      const mockPlanTypes: PlanType[] = [
        {
          id: '1',
          name: 'Gratuito',
          description: 'Plan básico con funcionalidades limitadas',
          price: 0,
          features: [
            'Acceso básico al gimnasio',
            'Plan de entrenamiento básico',
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        },
        {
          id: '2',
          name: 'Básico',
          description: 'Plan intermedio con más beneficios',
          price: 5000,
          features: [
            'Acceso completo al gimnasio',
            'Plan de entrenamiento personalizado',
            'Seguimiento de progreso',
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        },
        {
          id: '3',
          name: 'Premium',
          description: 'Plan completo con todos los beneficios',
          price: 15000,
          features: [
            'Todo del plan Básico',
            'Asesoría nutricional',
            'Clases grupales ilimitadas',
            'Acceso a equipos especializados',
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        },
        {
          id: '4',
          name: 'Familiar',
          description: 'Plan para toda la familia',
          price: 25000,
          features: [
            'Todo del plan Premium',
            'Acceso para hasta 4 miembros de la familia',
            'Descuentos en productos deportivos',
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        },
      ];

      // Ordenar planes por precio (gratuito primero, luego por precio ascendente)
      const sortedPlans = mockPlanTypes.sort((a, b) => {
        if (a.price === 0 && b.price > 0) return -1;
        if (b.price === 0 && a.price > 0) return 1;
        return a.price - b.price;
      });
      setPlanTypes(sortedPlans);

      // Comentado temporalmente mientras se implementa el backend
      // const response = await planTypeService.getAllActivePlanTypes();
      // if (response.Success) {
      //   const sortedPlans = response.Data.sort((a, b) => {
      //     if (a.price === 0 && b.price > 0) return -1;
      //     if (b.price === 0 && a.price > 0) return 1;
      //     return a.price - b.price;
      //   });
      //   setPlanTypes(sortedPlans);
      // } else {
      //   setError(response.Message || 'Error al cargar tipos de planes');
      // }
    } catch (err) {
      setError('Error al cargar tipos de planes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentUserPlan = async () => {
    try {
      const userId = authService.getUserId();
      if (!userId) return;

      // Mock de plan actual del usuario (comentar cuando el backend esté listo)
      const mockCurrentPlan = {
        id: 'user-plan-1',
        userId: userId,
        planTypeId: '1', // Plan gratuito
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
        isActive: true,
      };
      setCurrentUserPlan(mockCurrentPlan);

      // Comentado temporalmente mientras se implementa el backend
      // const response = await planService.getCurrentUserPlan(userId);
      // if (response.Success) {
      //   setCurrentUserPlan(response.Data);
      // }
    } catch (_err) {
      // No mostrar error si no tiene plan activo
    }
  };

  const handleSelectPlan = async (planType: PlanType) => {
    const userId = authService.getUserId();
    if (!userId) {
      Alert.alert('Error', 'Debes estar autenticado para seleccionar un plan');
      return;
    }

    // Confirmar selección
    Alert.alert(
      'Confirmar Plan',
      `¿Estás seguro que quieres seleccionar el plan "${planType.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => createUserPlan(planType, userId),
        },
      ]
    );
  };

  const createUserPlan = async (planType: PlanType, userId: string) => {
    try {
      setIsCreatingPlan(planType.id);

      const startDate = new Date().toISOString();
      const endDate = new Date();

      // Configurar duración según el tipo de plan
      if (planType.price === 0) {
        // Plan gratuito: 30 días
        endDate.setDate(endDate.getDate() + 30);
      } else {
        // Planes pagos: 1 año
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const request = {
        startDate,
        endDate: endDate.toISOString(),
        planTypeId: planType.id,
        userId,
      };

      const response = await planService.addPlan(request);

      if (response.Success) {
        Alert.alert(
          'Plan Asignado',
          `¡Felicidades! Tu plan "${planType.name}" ha sido activado correctamente.`,
          [
            {
              text: 'OK',
              onPress: () => {
                loadCurrentUserPlan();
                if (onPlanSelected) {
                  onPlanSelected(planType);
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.Message || 'Error al asignar el plan');
      }
    } catch (err) {
      Alert.alert('Error', 'Error al asignar el plan');
    } finally {
      setIsCreatingPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return `$${price.toLocaleString('es-CO')} COP`;
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('gratuito') || name.includes('free')) return 'gift';
    if (name.includes('básico') || name.includes('basic')) return 'star';
    if (name.includes('premium')) return 'star';
    if (name.includes('familiar') || name.includes('duo')) return 'users';
    return 'certificate';
  };

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('gratuito') || name.includes('free')) return '#4CAF50';
    if (name.includes('básico') || name.includes('basic')) return '#2196F3';
    if (name.includes('premium')) return '#FF9800';
    if (name.includes('familiar') || name.includes('duo')) return '#9C27B0';
    return Colors.dark.tint;
  };

  const renderPlanCard = (planType: PlanType) => {
    const isCurrentPlan = currentUserPlan?.planTypeId === planType.id;
    const isCreating = isCreatingPlan === planType.id;
    const planColor = getPlanColor(planType.name);

    return (
      <View key={planType.id} style={styles.planCard}>
        {/* Header del plan */}
        <View style={[styles.planHeader, { backgroundColor: planColor }]}>
          <FontAwesome
            name={getPlanIcon(planType.name)}
            size={24}
            color='#FFFFFF'
          />
          <Text style={styles.planName}>{planType.name}</Text>
          <Text style={styles.planPrice}>{formatPrice(planType.price)}</Text>
        </View>

        {/* Descripción */}
        <View style={styles.planContent}>
          <Text style={styles.planDescription}>{planType.description}</Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Incluye:</Text>
            {planType.features?.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <FontAwesome name='check' size={12} color={planColor} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Botón de acción */}
          <TouchableOpacity
            style={[
              styles.selectButton,
              { backgroundColor: planColor },
              isCurrentPlan && styles.currentPlanButton,
              isCreating && styles.disabledButton,
            ]}
            onPress={() =>
              !isCurrentPlan && !isCreating && handleSelectPlan(planType)
            }
            disabled={isCurrentPlan || isCreating}
          >
            {isCreating ? (
              <ActivityIndicator size='small' color='#FFFFFF' />
            ) : (
              <>
                <FontAwesome
                  name={isCurrentPlan ? 'check-circle' : 'plus'}
                  size={16}
                  color='#FFFFFF'
                />
                <Text style={styles.selectButtonText}>
                  {isCurrentPlan ? 'Plan Actual' : 'Seleccionar Plan'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Badge de plan actual */}
        {isCurrentPlan && (
          <View style={styles.currentPlanBadge}>
            <Text style={styles.currentPlanBadgeText}>ACTIVO</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.dark.tint} />
        <Text style={styles.loadingText}>Cargando planes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name='exclamation-triangle' size={48} color='#FF6B6B' />
        <Text style={styles.errorTitle}>Error al cargar planes</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPlanTypes}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Elige tu Plan</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona el plan que mejor se adapte a tus necesidades
        </Text>
      </View>

      {/* Current plan info */}
      {showCurrentPlan && currentUserPlan && (
        <View style={styles.currentPlanInfo}>
          <FontAwesome name='info-circle' size={16} color={Colors.dark.tint} />
          <Text style={styles.currentPlanInfoText}>
            Tienes un plan activo hasta{' '}
            {new Date(currentUserPlan.endDate).toLocaleDateString('es-ES')}
          </Text>
        </View>
      )}

      {/* Plans Grid */}
      <View style={styles.plansContainer}>{planTypes.map(renderPlanCard)}</View>

      {/* Footer info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Todos los planes incluyen acceso completo a la aplicación.{'\n'}
          Puedes cambiar o cancelar tu plan en cualquier momento.
        </Text>
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
    color: '#B0B0B0',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 20,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.dark.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 22,
  },
  currentPlanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
  },
  currentPlanInfoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  plansContainer: {
    paddingHorizontal: 20,
  },
  planCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
    position: 'relative',
  },
  planHeader: {
    padding: 20,
    alignItems: 'center',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planContent: {
    padding: 20,
  },
  planDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#E0E0E0',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  currentPlanButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.6,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  currentPlanBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPlanBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
