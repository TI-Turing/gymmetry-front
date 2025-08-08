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
import { planTypeService } from '@/services/planTypeService';
import type { PlanType } from '@/dto/planType/PlanType';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';

// Interface para la respuesta de la API (formato PascalCase)
interface ApiPlanType {
  Id: string;
  Name: string;
  Description: string;
  Price: number | null;
  UsdPrice: number | null;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  Plans: any[];
}

interface PlanTypeViewProps {
  onPlanSelected?: (planType: PlanType) => void;
}

export default function PlanTypeView({ onPlanSelected }: PlanTypeViewProps) {
  const [planTypes, setPlanTypes] = useState<PlanType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigningPlan, setIsAssigningPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función auxiliar para extraer características de la descripción
  const extractFeaturesFromDescription = (description: string): string[] => {
    // Buscar patrones de listas en la descripción
    const lines = description.split('\n');
    const features: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      // Buscar líneas que empiecen con "-" o "•" o sean parte de "Incluye:"
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        features.push(trimmedLine.substring(2).trim());
      }
    }

    // Si no se encontraron características con formato de lista, usar frases separadas por punto
    if (features.length === 0) {
      const sentences = description
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      return sentences.slice(0, 4); // Máximo 4 características
    }

    return features;
  };

  const loadPlanTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar y refrescar token si es necesario antes de hacer la petición
      const tokenValid = await authService.checkAndRefreshToken();
      if (!tokenValid) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        return;
      }

      // Obtener tipos de plan desde la API
      const response = await planTypeService.getAllPlanTypes();

      if (response.Success && response.Data) {
        // Mapear la respuesta de la API a la estructura esperada por el componente
        const mappedPlanTypes: PlanType[] = (
          response.Data as unknown as ApiPlanType[]
        ).map(apiPlanType => ({
          id: apiPlanType.Id,
          name: apiPlanType.Name,
          description: apiPlanType.Description,
          price: apiPlanType.Price || 0,
          features: extractFeaturesFromDescription(apiPlanType.Description),
          isActive: apiPlanType.IsActive,
          createdAt: apiPlanType.CreatedAt,
          updatedAt: apiPlanType.UpdatedAt || apiPlanType.CreatedAt,
          deletedAt: apiPlanType.DeletedAt,
        }));

        // Ordenar planes por precio (gratuito primero, luego por precio ascendente)
        const sortedPlans = mappedPlanTypes.sort((a, b) => {
          if (a.price === 0 && b.price > 0) return -1;
          if (b.price === 0 && a.price > 0) return 1;
          return a.price - b.price;
        });

        setPlanTypes(sortedPlans);
      } else {
        setError(response.Message || 'Error al cargar tipos de planes');
      }
  } catch {
      setError('Error al cargar tipos de planes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlanTypes();
  }, [loadPlanTypes]);

  const handleSelectPlan = async (planType: PlanType) => {
    // Verificar y refrescar token antes de obtener userId
    const tokenValid = await authService.checkAndRefreshToken();
    if (!tokenValid) {
      Alert.alert(
        'Error',
        'Sesión expirada. Por favor, inicia sesión nuevamente.'
      );
      return;
    }

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
          onPress: () => assignPlanToUser(planType, userId),
        },
      ]
    );
  };

  const assignPlanToUser = async (planType: PlanType, userId: string) => {
    try {
      setIsAssigningPlan(planType.id);

      // TODO: Implementar flujo de pago con pasarela de pagos
      // if (planType.price > 0) {
      //   const paymentResult = await processPayment(planType);
      //   if (!paymentResult.success) {
      //     Alert.alert('Error', 'Error en el proceso de pago');
      //     return;
      //   }
      // }

      // Por ahora, asignar el plan directamente al usuario
      const response = await userService.updateUserGym({
        UserId: userId,
        GymId: planType.id, // Usando el ID del plan como GymId temporalmente
      });

      if (response.Success) {
        Alert.alert('Éxito', `Plan "${planType.name}" asignado correctamente`, [
          {
            text: 'OK',
            onPress: () => {
              // Notificar al componente padre si existe callback
              onPlanSelected?.(planType);
              // Recargar los datos
              loadPlanTypes();
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.Message || 'Error al asignar el plan');
      }
  } catch {
      Alert.alert('Error', 'Error al asignar el plan');
    } finally {
      setIsAssigningPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.light.tint} />
        <Text style={styles.loadingText}>Cargando planes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name='exclamation-triangle' size={48} color='#FF6B6B' />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPlanTypes}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.plansContainer}>
        {planTypes.map(planType => (
          <View key={planType.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{planType.name}</Text>
              <Text style={styles.planPrice}>
                {formatPrice(planType.price)}
              </Text>
            </View>

            <Text style={styles.planDescription}>{planType.description}</Text>

            {planType.features.length > 0 && (
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Características:</Text>
                {planType.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <FontAwesome
                      name='check'
                      size={14}
                      color={Colors.light.tint}
                      style={styles.featureIcon}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.selectButton,
                isAssigningPlan === planType.id && styles.selectButtonDisabled,
              ]}
              onPress={() => handleSelectPlan(planType)}
              disabled={isAssigningPlan === planType.id}
            >
              {isAssigningPlan === planType.id ? (
                <ActivityIndicator size='small' color='#FFFFFF' />
              ) : (
                <Text style={styles.selectButtonText}>Seleccionar Plan</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
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
  plansContainer: {
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
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  planDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 16,
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#CCCCCC',
    flex: 1,
  },
  selectButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonDisabled: {
    backgroundColor: '#666666',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
