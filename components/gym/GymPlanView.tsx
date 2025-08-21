import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { getPaymentVisual } from '@/utils';
import { gymPlanService } from '@/services/gymPlanService';
import { gymPlanSelectedService } from '@/services/gymPlanSelectedService';
import { paymentService } from '@/services/paymentService';
import * as WebBrowser from 'expo-web-browser';
import CardPaymentModal from '@/components/payments/CardPaymentModal';
import { Environment } from '@/environment';
import { normalizeCollection } from '@/utils';
import { GymPlanSelectedType } from '@/dto/gymPlan/GymPlanSelectedType';
import { GymPlanSelected } from '@/dto/gymPlan/GymPlanSelected';
import { authService } from '@/services/authService';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { useCustomAlert } from '@/components/common/CustomAlert';

interface GymPlanViewProps {
  gymId: string;
  onPlanSelected?: (planId: string) => void;
  refreshKey?: number; // fuerza recarga al cambiar
}

export default function GymPlanView({
  gymId,
  onPlanSelected,
  refreshKey,
}: GymPlanViewProps) {
  const [gymPlanTypes, setGymPlanTypes] = useState<GymPlanSelectedType[]>([]);
  const [currentGymPlan, setCurrentGymPlan] = useState<GymPlanSelected | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [lastAttemptedGymPlanTypeId, setLastAttemptedGymPlanTypeId] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [retryMotivo, setRetryMotivo] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'PSE'>('CARD');
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [showCardModal, setShowCardModal] = useState(false);
  const cardTokenProcessedRef = useRef(false);
  const { status: paymentStatus, rawStatus, start: startPolling, reset: resetPayment } = usePaymentStatus({
    onUpdate: s => {
      if (['approved', 'rejected', 'cancelled', 'expired'].includes(s)) {
        loadGymPlans();
      }
    },
  });

  // Tomar expiresAt del estado crudo
  useEffect(() => {
    const exp = (rawStatus as any)?.expiresAt || (rawStatus as any)?.ExpiresAt || null;
    if (exp) setExpiresAt(exp);
  }, [rawStatus]);

  // Prefill buyerEmail
  useEffect(() => {
    (async () => {
      const u = await authService.getUserData();
      if (u?.email) setBuyerEmail(u.email);
    })();
  }, []);
  // Countdown expiración
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (expiresAt && (paymentStatus === 'pending' || paymentStatus === 'polling')) {
      const tick = () => {
        const diff = new Date(expiresAt).getTime() - Date.now();
        setRemaining(diff > 0 ? Math.floor(diff / 1000) : 0);
      };
      tick();
      timer = setInterval(tick, 1000) as any;
    } else {
      setRemaining(0);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [expiresAt, paymentStatus]);
  const { showAlert, showError, showSuccess, hideAlert, AlertComponent } = useCustomAlert();

  // Visuales dinámicos ahora centralizados en utils/paymentVisual

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
      // Cargar tipos de planes en paralelo con búsqueda de plan activo real
      const [planTypesResponse, currentSelecteds] = await Promise.all([
        gymPlanService.getGymPlanTypes(),
        gymPlanSelectedService.findGymPlanSelectedsByFields({
          fields: { GymId: gymId, IsActive: true },
        } as any),
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

      if (currentSelecteds.Success && currentSelecteds.Data) {
        const raw = normalizeCollection(currentSelecteds.Data as any);
        const active = raw.find((p: any) => p.isActive || p.IsActive);
        if (active) {
          setCurrentGymPlan({
            id: active.id || active.Id,
            gymId: active.gymId || active.GymId,
            gymPlanSelectedTypeId:
              active.gymPlanSelectedTypeId || active.GymPlanSelectedTypeId,
            startDate: active.startDate || active.StartDate,
            endDate: active.endDate || active.EndDate,
            isActive: active.isActive || active.IsActive,
            createdAt: active.createdAt || active.CreatedAt || new Date().toISOString(),
            updatedAt: active.updatedAt || active.UpdatedAt || null,
            gymPlanSelectedType:
              active.gymPlanSelectedType || active.GymPlanSelectedType,
          });
        } else {
          setCurrentGymPlan(null);
        }
      } else {
        setCurrentGymPlan(null);
      }
    } catch {
      setError('Error al cargar los planes del gimnasio');
    } finally {
      setIsLoading(false);
    }
  }, [gymId]);

  useEffect(() => {
    loadGymPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadGymPlans, refreshKey]);

  const assignGymPlan = async (planType: GymPlanSelectedType) => {
    setIsCreatingPlan(true);
    try {
      if ((planType.price || 0) === 0 && (planType.usdPrice || 0) === 0) {
        const { startDate, endDate } = gymPlanService.generatePlanDates();
        const createPlanRequest = { GymId: gymId, StartDate: startDate, EndDate: endDate, GymPlanSelectedTypeId: planType.id };
        const response = await gymPlanService.createGymPlan(createPlanRequest);
        if (response.Success) {
          showSuccess(`El plan "${planType.name}" ha sido asignado exitosamente al gimnasio.`, {
            onConfirm: () => { loadGymPlans(); onPlanSelected?.(planType.id); }
          });
        } else { showError(response.Message || 'No se pudo crear el plan'); }
      } else {
        const successUrl = `${process.env.EXPO_PUBLIC_APP_WEB_BASE_URL || 'https://example.com'}/payments/gym/success`;
        const failureUrl = `${process.env.EXPO_PUBLIC_APP_WEB_BASE_URL || 'https://example.com'}/payments/gym/failure`;
        const pendingUrl = `${process.env.EXPO_PUBLIC_APP_WEB_BASE_URL || 'https://example.com'}/payments/gym/pending`;
  // PSE no requiere selección de banco en la app; la pasarela lo gestiona
        const user = await authService.getUserData();
        if (!user?.id) { showError('No se pudo obtener el usuario autenticado. Inicia sesión nuevamente.'); return; }
        const prefResp = await paymentService.createGymPlanPreference({
          GymPlanSelectedTypeId: planType.id,
          GymId: gymId,
          UserId: user.id,
          SuccessUrl: successUrl,
          FailureUrl: failureUrl,
          PendingUrl: pendingUrl,
          PaymentMethod: paymentMethod,
          BuyerEmail: buyerEmail || undefined,
        });
        if (prefResp.Success && prefResp.Data?.InitPoint) {
          const prefId: string | null = (prefResp.Data.Id || prefResp.Data.preferenceId || null) as string | null;
          if (prefId) setPreferenceId(prefId);
          setLastAttemptedGymPlanTypeId(planType.id);
          await WebBrowser.openBrowserAsync(prefResp.Data.InitPoint);
          if (prefId) startPolling(prefId);
        } else {
          const msg = (prefResp as any)?.Message || '';
          if (msg.toLowerCase().includes('pendiente') && preferenceId) {
            startPolling(preferenceId);
          } else {
            showError(prefResp.Message || 'No se pudo iniciar el pago');
          }
        }
      }
    } catch {
      showError('Ocurrió un error al crear el plan. Intenta nuevamente.');
    } finally { setIsCreatingPlan(false); }
  };

  const handleSelectPlan = (planType: GymPlanSelectedType) => {
    if (isCreatingPlan) return;
    // Si es gratis, asignar directo
    if ((planType.price || 0) === 0 && (planType.usdPrice || 0) === 0) {
      assignGymPlan(planType);
      return;
    }
    // Abrir panel de opciones de pago bajo el plan
    setExpandedPlanId(curr => (curr === planType.id ? null : planType.id));
    setRetryMotivo(null);
    setLastAttemptedGymPlanTypeId(planType.id);
  };

  const handleSelectPlanWithMotivo = (planType: GymPlanSelectedType, motivo: string) => {
    if (isCreatingPlan) return;
    setRetryMotivo(motivo || null);
    setExpandedPlanId(planType.id);
    setLastAttemptedGymPlanTypeId(planType.id);
  };

  const continuePayment = async (planType: GymPlanSelectedType) => {
    if (isCreatingPlan) return;
    if (paymentMethod === 'CARD' && Environment.PAY_CARD_INAPP) {
      setExpandedPlanId(planType.id);
      setTimeout(() => setShowCardModal(true), 0);
    } else {
      await assignGymPlan(planType);
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
  <>
  <CardPaymentModal
    visible={showCardModal}
  onClose={() => { setTimeout(() => setShowCardModal(false), 0); cardTokenProcessedRef.current = false; }}
    publicKey={Environment.MP_PUBLIC_KEY || null}
    buyerEmail={buyerEmail}
    amount={(() => { const p = gymPlanTypes.find(x=>x.id===expandedPlanId); return (p?.price || 0) + (p?.usdPrice || 0) ? (p?.price || 0) : p?.usdPrice || null; })()}
    onToken={async (cardToken: string) => {
      try {
        setTimeout(() => setShowCardModal(false), 0);
        cardTokenProcessedRef.current = true;
        const user = await authService.getUserData();
        if (!user?.id || !expandedPlanId) { showError('No se pudo continuar el pago.'); return; }
        const resp = await paymentService.createGymPlanCardPayment({ GymPlanSelectedTypeId: expandedPlanId, GymId: gymId, UserId: user.id, CardToken: cardToken, BuyerEmail: buyerEmail || undefined, Amount: undefined });
        if (resp.Success) {
          const prefId: string | null = (resp.Data?.Id || resp.Data?.preferenceId || null) as string | null;
          if (prefId) { setPreferenceId(prefId); startPolling(prefId); }
        } else {
          showError(resp.Message || 'No se pudo procesar el pago con tarjeta');
        }
      } catch { showError('Error al procesar el pago con tarjeta'); }
    }}
  />
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {currentGymPlan && (
        <View style={styles.compactWrapper}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setCollapsed(c => !c)}
            style={[styles.compactCard]}
          >
            <View style={styles.compactSummaryRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.compactTitle} numberOfLines={1}>
                  {currentGymPlan.gymPlanSelectedType?.name || 'Plan Activo'}
                </Text>
                <Text style={styles.compactSubtitle} numberOfLines={1}>
                  {formatDate(currentGymPlan.startDate)} • {formatDate(currentGymPlan.endDate)}
                </Text>
              </View>
              <FontAwesome
                name={collapsed ? 'chevron-down' : 'chevron-up'}
                size={14}
                color={'#FFFFFF'}
              />
            </View>
            {!collapsed && (
              <View style={styles.compactDetails}>
                <View style={styles.detailRow}>
                  <FontAwesome name='calendar' size={12} color='#CCCCCC' />
                  <Text style={styles.detailLabel}>Inicio</Text>
                  <Text style={styles.detailValue}>{formatDate(currentGymPlan.startDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <FontAwesome name='calendar-check-o' size={12} color='#CCCCCC' />
                  <Text style={styles.detailLabel}>Fin</Text>
                  <Text style={styles.detailValue}>{formatDate(currentGymPlan.endDate)}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.availablePlansContainer}>
        {preferenceId && paymentStatus !== 'approved' && (
          (() => { const v = getPaymentVisual(paymentStatus); const pm = (rawStatus as any)?.paymentMethod || (rawStatus as any)?.PaymentMethod; const bank = (rawStatus as any)?.bankCode || (rawStatus as any)?.BankCode; return (
          <View style={[styles.paymentStatusBanner, { borderColor: v.borderColor, backgroundColor: v.backgroundColor }] }>
            <Text style={[styles.paymentStatusText, { color: v.color }] }>
              {paymentStatus === 'polling' || paymentStatus === 'pending' ? 'Esperando confirmación de pago...' :
                paymentStatus === 'cancelled' ? 'Pago cancelado. Puedes reintentar.' :
                paymentStatus === 'expired' ? 'Tu intento de pago expiró. Genera uno nuevo.' :
                paymentStatus === 'rejected' ? 'Pago rechazado. Puedes reintentar.' :
                paymentStatus === 'error' ? 'Error consultando estado de pago' : ''}
            </Text>
            {(paymentStatus === 'polling' || paymentStatus === 'pending') && expiresAt && (
              <Text style={[styles.paymentStatusText, { color: v.color, marginTop: 4 }]}>Expira en {Math.floor(remaining/60)}:{`${remaining%60}`.padStart(2,'0')} • {pm || paymentMethod}{bank?` • ${bank}`:''}</Text>
            )}
            {(paymentStatus === 'expired' || paymentStatus === 'rejected' || paymentStatus === 'cancelled') && (
              <TouchableOpacity style={[styles.selectButton, { marginTop: 12 }]} onPress={() => {
                let motivo = '';
                if (paymentStatus === 'expired') motivo = 'El intento anterior expiró.';
                else if (paymentStatus === 'rejected') motivo = 'El pago fue rechazado.';
                else if (paymentStatus === 'cancelled') motivo = 'El pago fue cancelado.';
                const failedPlan = gymPlanTypes.find(p => p.id === lastAttemptedGymPlanTypeId);
                setPreferenceId(null);
                resetPayment();
                if (failedPlan) handleSelectPlanWithMotivo(failedPlan, motivo);
              }}>
                <Text style={styles.selectButtonText}>Reintentar pago</Text>
              </TouchableOpacity>
            )}
          </View>
          ); })()
        )}
  {/* La configuración de pago se mueve debajo de cada plan */}
        <Text style={styles.sectionTitle}>{currentGymPlan ? 'Cambiar Plan' : 'Seleccionar Plan para el Gimnasio'}</Text>
        {gymPlanTypes.length === 0 ? (
          <View style={styles.noPlansContainer}>
            <FontAwesome name='info-circle' size={48} color='#FFB86C' />
            <Text style={styles.noPlansText}>No hay planes disponibles actualmente</Text>
            <Text style={styles.noPlansSubtext}>Los planes del gimnasio no están disponibles en este momento.</Text>
          </View>
        ) : (
          gymPlanTypes.map(planType => (
            <View key={planType.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{planType.name}</Text>
                  <Text style={styles.planPrice}>{gymPlanService.formatPrice(planType.price, planType.usdPrice, planType.countryId)}</Text>
                </View>
                {planType.isActive && (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>Disponible</Text>
                  </View>
                )}
              </View>
              {planType.description && (
                <Text style={styles.planDescription}>{planType.description}</Text>
              )}
              <TouchableOpacity
                style={[styles.selectButton, !planType.isActive && styles.selectButtonDisabled, isCreatingPlan && styles.selectButtonDisabled]}
                onPress={() => handleSelectPlan(planType)}
                disabled={!planType.isActive || isCreatingPlan}
              >
                {isCreatingPlan ? (
                  <ActivityIndicator size='small' color='#FFFFFF' />
                ) : (
                  <Text style={styles.selectButtonText}>
                    {((planType.price || 0) === 0 && (planType.usdPrice || 0) === 0)
                      ? (currentGymPlan ? 'Cambiar a este Plan' : 'Seleccionar Plan')
                      : (currentGymPlan ? 'Cambiar (ver opciones de pago)' : 'Ver opciones de pago')}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Opciones de pago por plan */}
              {expandedPlanId === planType.id && ((planType.price || 0) > 0 || (planType.usdPrice || 0) > 0) && (
                <View style={[styles.paymentConfig, { marginTop: 12 }]}>
                  {!!retryMotivo && (
                    <Text style={{ color: '#ccc', marginBottom: 8 }}>{retryMotivo}</Text>
                  )}
                  <Text style={styles.configTitle}>Método de pago</Text>
                  <View style={styles.methodRow}>
                    <TouchableOpacity onPress={() => setPaymentMethod('CARD')} style={[styles.methodPill, paymentMethod==='CARD' && styles.methodPillActive]}>
                      <FontAwesome name='credit-card' color={paymentMethod==='CARD'?'#000':'#fff'} size={14} />
                      <Text style={[styles.methodPillText, paymentMethod==='CARD' && styles.methodPillTextActive]}>Tarjeta (Mercado Pago)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPaymentMethod('PSE')} style={[styles.methodPill, paymentMethod==='PSE' && styles.methodPillActive]}>
                      <FontAwesome name='university' color={paymentMethod==='PSE'?'#000':'#fff'} size={14} />
                      <Text style={[styles.methodPillText, paymentMethod==='PSE' && styles.methodPillTextActive]}>PSE</Text>
                    </TouchableOpacity>
                  </View>
                  {/* PSE: sin selección de bancos; lo gestiona la pasarela */}
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.configLabel}>Correo del comprador</Text>
                    <TextInput
                      value={buyerEmail}
                      onChangeText={setBuyerEmail}
                      placeholder='correo@dominio.com'
                      placeholderTextColor={'#888'}
                      style={styles.emailInput}
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  </View>
                  <TouchableOpacity style={[styles.selectButton, { marginTop: 12 }]} onPress={() => continuePayment(planType)}>
                    <Text style={styles.selectButtonText}>Continuar al pago</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </View>
  </ScrollView>
  <AlertComponent />
  </>
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
  compactWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  compactCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#333333',
  },
  compactSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactSubtitle: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  compactDetails: {
    marginTop: 10,
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
  paymentStatusBanner: {
    backgroundColor: '#1a1a1a',
    borderColor: Colors.light.tint,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  paymentStatusText: {
    color: Colors.light.tint,
    fontSize: 14,
    textAlign: 'center',
  },
  // Config pago
  paymentConfig: {
    backgroundColor: '#111',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  configTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  methodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#555',
    marginRight: 8,
  },
  methodPillActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  methodPillText: {
    color: '#fff',
    fontSize: 14,
  },
  methodPillTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  configLabel: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 6,
  },
  emailInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
});
