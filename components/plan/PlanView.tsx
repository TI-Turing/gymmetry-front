import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { authService } from '@/services/authService';
import { planService } from '@/services/planService';
import { normalizeCollection } from '@/utils';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePlanViewStyles } from './PlanView.styles';

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
  onActivePlanTypeResolved?: (
    planTypeId: string | null,
    isFallback: boolean
  ) => void;
}

export default function PlanView({
  showCurrentPlan = true,
  refreshKey,
  onActivePlanTypeResolved,
}: PlanViewProps) {
  const styles = useThemedStyles(makePlanViewStyles);
  const [currentUserPlan, setCurrentUserPlan] = useState<UserPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [usingFallbackFreePlan, setUsingFallbackFreePlan] = useState(false);

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
      const FREE_PLAN_TYPE_ID = '4aa8380c-8479-4334-8236-3909be9c842b';
      if (response.Success && response.Data) {
        const raw = normalizeCollection(response.Data as any);
        const active = raw.find((p: any) => p?.isActive || p?.IsActive);
        if (active) {
          setUsingFallbackFreePlan(false);
          const pick = <T,>(obj: unknown, a: string, b: string, fb?: T): T => {
            const o = obj as Record<string, unknown>;
            return (o?.[a] as T) ?? (o?.[b] as T) ?? (fb as T);
          };
          const mapped: UserPlan = {
            id: pick<string>(active, 'id', 'Id'),
            userId: pick<string>(active, 'userId', 'UserId'),
            planTypeId: pick<string>(active, 'planTypeId', 'PlanTypeId'),
            planTypeName:
              (pick<any>(active, 'planType', 'PlanType')?.Name as string) ||
              'Plan',
            startDate: pick<string>(active, 'startDate', 'StartDate'),
            endDate: pick<string>(active, 'endDate', 'EndDate'),
            isActive: pick<boolean>(active, 'isActive', 'IsActive'),
            price:
              (pick<any>(active, 'planType', 'PlanType')?.Price as number) ||
              (active as any)?.price ||
              0,
          };
          setCurrentUserPlan(mapped);
        } else {
          // Fallback plan gratis (virtual)
          const now = new Date();
          const fallback: UserPlan = {
            id: 'free-fallback',
            userId: userId,
            planTypeId: FREE_PLAN_TYPE_ID,
            planTypeName: 'Gratis',
            startDate: now.toISOString(),
            endDate: new Date(
              now.getTime() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            isActive: true,
            price: 0,
          };
          setUsingFallbackFreePlan(true);
          setCurrentUserPlan(fallback);
        }
      } else {
        // También fallback en respuesta no exitosa
        const now = new Date();
        const fallback: UserPlan = {
          id: 'free-fallback',
          userId: userId,
          planTypeId: FREE_PLAN_TYPE_ID,
          planTypeName: 'Gratis',
          startDate: now.toISOString(),
          endDate: new Date(
            now.getTime() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          isActive: true,
          price: 0,
        };
        setUsingFallbackFreePlan(true);
        setCurrentUserPlan(fallback);
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

  // Derivados (no hooks) – se calculan siempre para mantener orden estable de hooks
  const daysRemaining =
    currentUserPlan && !usingFallbackFreePlan
      ? getDaysRemaining(currentUserPlan.endDate)
      : 0;
  const isExpiringSoon =
    !usingFallbackFreePlan && daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = !usingFallbackFreePlan && daysRemaining <= 0;

  // Notificar planTypeId activo al padre (incluye fallback) — hook estable
  useEffect(() => {
    if (onActivePlanTypeResolved) {
      onActivePlanTypeResolved(
        currentUserPlan?.planTypeId || null,
        usingFallbackFreePlan
      );
    }
  }, [
    currentUserPlan?.planTypeId,
    usingFallbackFreePlan,
    onActivePlanTypeResolved,
  ]);

  // Auto expandir si expira pronto (solo planes reales)
  useEffect(() => {
    if (!usingFallbackFreePlan && isExpiringSoon && collapsed) {
      setCollapsed(false);
    }
  }, [isExpiringSoon, usingFallbackFreePlan, collapsed]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Cargando plan actual...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome
          name="exclamation-triangle"
          size={48}
          color={Colors.light.danger}
        />
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
      <View style={styles.noPlanBanner}>
        <FontAwesome
          name="info-circle"
          size={18}
          color={Colors.light.warning}
          style={styles.noPlanIcon}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.noPlanBannerTitle}>Sin plan activo</Text>
          <Text style={styles.noPlanBannerText} numberOfLines={2}>
            Selecciona un plan para desbloquear funciones adicionales.
          </Text>
        </View>
      </View>
    );
  }

  if (!showCurrentPlan) {
    return null;
  }

  // (Ya calculado arriba y hooks ejecutados)

  return (
    <View style={styles.compactWrapper}>
      {usingFallbackFreePlan ? (
        <View style={[styles.planCard, styles.collapsibleCard]}>
          <View style={styles.summaryRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.planName} numberOfLines={1}>
                <Text style={styles.planLabel}>Plan actual: </Text>Gratis
              </Text>
            </View>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.detailValue}>
              Disfrutando del plan gratis. Selecciona otro plan para obtener más
              beneficios. Este plan no tiene fecha de término.
            </Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCollapsed((c) => !c)}
          style={[
            styles.planCard,
            isExpired && styles.expiredPlanCard,
            isExpiringSoon && styles.expiringSoonPlanCard,
            styles.collapsibleCard,
          ]}
        >
          <View style={styles.summaryRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.planName} numberOfLines={1}>
                <Text style={styles.planLabel}>Plan actual: </Text>
                {currentUserPlan?.planTypeName || '—'}
              </Text>
              <Text style={styles.planPrice} numberOfLines={1}>
                {formatPrice(currentUserPlan?.price || 0)} •{' '}
                {isExpired
                  ? 'Expirado'
                  : isExpiringSoon
                    ? `Por vencer (${daysRemaining}d)`
                    : `${daysRemaining}d restantes`}
              </Text>
            </View>
            <FontAwesome
              name={collapsed ? 'chevron-down' : 'chevron-up'}
              size={14}
              color={Colors.light.text}
            />
          </View>
          {!collapsed && (
            <View style={styles.detailSection}>
              <View style={styles.detailRow}>
                <FontAwesome
                  name="calendar"
                  size={12}
                  color={Colors.light.textMuted}
                />
                <Text style={styles.detailLabel}>Inicio</Text>
                <Text style={styles.detailValue}>
                  {formatDate(currentUserPlan!.startDate)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <FontAwesome
                  name="calendar-check-o"
                  size={12}
                  color={Colors.light.textMuted}
                />
                <Text style={styles.detailLabel}>Fin</Text>
                <Text
                  style={[
                    styles.detailValue,
                    isExpired && styles.expiredText,
                    isExpiringSoon && styles.expiringSoonText,
                  ]}
                >
                  {formatDate(currentUserPlan!.endDate)}
                </Text>
              </View>
              {(isExpired || isExpiringSoon) && (
                <TouchableOpacity style={styles.renewButtonCompact}>
                  <Text style={styles.renewButtonText}>Renovar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
// Styles migrated to PlanView.styles.ts and themed
