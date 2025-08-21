import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { authService } from '@/services/authService';
import { planService } from '@/services/planService';

interface UserPlan {
  id: string;
  userId: string;
  planTypeId: string;
  planTypeName?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  price?: number;
}

interface PlanViewProps {
  showCurrentPlan?: boolean;
  refreshKey?: number; // fuerza recarga cuando cambia
}

export default function PlanView({ showCurrentPlan = true, refreshKey }: PlanViewProps) {
  const [currentUserPlan, setCurrentUserPlan] = useState<UserPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentUserPlan = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar y refrescar token si es necesario
      const tokenValid = await authService.checkAndRefreshToken();
      if (!tokenValid) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        return;
      }

      const userId = authService.getUserId();
      if (!userId) {
        setError('Usuario no autenticado');
        return;
      }

      // Buscar planes activos del usuario: patrón find<Entities>ByFields
      // Según convención backend: campos en body Iniciando con Mayúscula
      const response = await planService.findPlansByFields({
        fields: { UserId: userId, IsActive: true },
      } as any);
      if (response.Success && response.Data) {
        const raw = Array.isArray(response.Data)
          ? response.Data
          : (response.Data as any)?.$values || [];
        const active = raw.find((p: any) => p.isActive || p.IsActive);
        if (active) {
          setCurrentUserPlan({
            id: active.id || active.Id,
            userId: active.userId || active.UserId,
            planTypeId: active.planTypeId || active.PlanTypeId,
            planTypeName:
              active.planType?.name || active.PlanType?.Name || 'Plan',
            startDate: active.startDate || active.StartDate,
            endDate: active.endDate || active.EndDate,
            isActive: active.isActive || active.IsActive,
            price:
              active.planType?.price ||
              active.PlanType?.Price ||
              active.price ||
              0,
          });
        } else {
          setCurrentUserPlan(null);
        }
      } else {
        setCurrentUserPlan(null);
      }
    } catch {
      setError('Error al cargar el plan actual');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showCurrentPlan) {
      loadCurrentUserPlan();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCurrentPlan, loadCurrentUserPlan, refreshKey]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) {
      return 'Gratis';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.light.tint} />
        <Text style={styles.loadingText}>Cargando plan actual...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name='exclamation-triangle' size={48} color='#FF6B35' />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadCurrentUserPlan}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentUserPlan && showCurrentPlan) {
    return (
      <View style={styles.noPlanContainer}>
        <FontAwesome name='info-circle' size={48} color='#FFB86C' />
        <Text style={styles.noPlanText}>
          No tienes un plan activo actualmente
        </Text>
        <Text style={styles.noPlanSubtext}>
          Selecciona un plan para comenzar a disfrutar de todos los beneficios
        </Text>
      </View>
    );
  }

  if (!showCurrentPlan) {
    return null;
  }

  const daysRemaining = currentUserPlan
    ? getDaysRemaining(currentUserPlan.endDate)
    : 0;
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.currentPlanContainer}>
        <Text style={styles.sectionTitle}>Mi Plan Actual</Text>

        <View
          style={[
            styles.planCard,
            isExpired && styles.expiredPlanCard,
            isExpiringSoon && styles.expiringSoonPlanCard,
          ]}
        >
          <View style={styles.planHeader}>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>
                {currentUserPlan?.planTypeName || 'Plan Desconocido'}
              </Text>
              <Text style={styles.planPrice}>
                {formatPrice(currentUserPlan?.price || 0)}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                isExpired
                  ? styles.expiredBadge
                  : isExpiringSoon
                    ? styles.expiringSoonBadge
                    : styles.activeBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isExpired
                    ? styles.expiredText
                    : isExpiringSoon
                      ? styles.expiringSoonText
                      : styles.activeText,
                ]}
              >
                {isExpired
                  ? 'Expirado'
                  : isExpiringSoon
                    ? 'Por vencer'
                    : 'Activo'}
              </Text>
            </View>
          </View>

          <View style={styles.planDetails}>
            <View style={styles.detailRow}>
              <FontAwesome name='calendar' size={16} color='#CCCCCC' />
              <Text style={styles.detailLabel}>Inicio:</Text>
              <Text style={styles.detailValue}>
                {formatDate(
                  currentUserPlan?.startDate || new Date().toISOString()
                )}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name='calendar-check-o' size={16} color='#CCCCCC' />
              <Text style={styles.detailLabel}>Vencimiento:</Text>
              <Text
                style={[
                  styles.detailValue,
                  isExpired && styles.expiredText,
                  isExpiringSoon && styles.expiringSoonText,
                ]}
              >
                {formatDate(
                  currentUserPlan?.endDate || new Date().toISOString()
                )}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name='clock-o' size={16} color='#CCCCCC' />
              <Text style={styles.detailLabel}>Días restantes:</Text>
              <Text
                style={[
                  styles.detailValue,
                  isExpired && styles.expiredText,
                  isExpiringSoon && styles.expiringSoonText,
                ]}
              >
                {isExpired
                  ? '0 días (Expirado)'
                  : daysRemaining === 1
                    ? '1 día'
                    : `${daysRemaining} días`}
              </Text>
            </View>
          </View>

          {(isExpired || isExpiringSoon) && (
            <View style={styles.renewalContainer}>
              <Text style={styles.renewalText}>
                {isExpired
                  ? 'Tu plan ha expirado. Renueva para seguir disfrutando de los beneficios.'
                  : 'Tu plan vence pronto. ¡Renuévalo para no perder el acceso!'}
              </Text>
              <TouchableOpacity style={styles.renewButton}>
                <Text style={styles.renewButtonText}>Renovar Plan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    color: '#FF6B35',
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
  noPlanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  noPlanText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  noPlanSubtext: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  currentPlanContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  expiredPlanCard: {
    borderColor: '#FF6B35',
    backgroundColor: '#2a1a1a',
  },
  expiringSoonPlanCard: {
    borderColor: '#FFB86C',
    backgroundColor: '#2a2a1a',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: '#50E3C2',
  },
  expiringSoonBadge: {
    backgroundColor: '#FFB86C',
  },
  expiredBadge: {
    backgroundColor: '#FF6B6B',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#000000',
  },
  expiringSoonText: {
    color: '#000000',
  },
  expiredText: {
    color: '#FFFFFF',
  },
  planDetails: {
    marginBottom: 20,
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
  renewalContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFB86C',
  },
  renewalText: {
    color: '#FFB86C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  renewButton: {
    backgroundColor: '#FFB86C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  renewButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
