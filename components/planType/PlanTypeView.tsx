import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { getPaymentVisual } from '@/utils';
import { planTypeService } from '@/services/planTypeService';
import type { PlanType } from '@/dto/planType/PlanType';
import { planService } from '@/services/planService';
import { paymentService } from '@/services/paymentService';
import * as WebBrowser from 'expo-web-browser';
import CardPaymentModal from '@/components/payments/CardPaymentModal';
import { Environment } from '@/environment';
import { normalizeCollection } from '@/utils';
import { authService } from '@/services/authService';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';

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
  activePlanTypeId?: string | null; // para ocultar plan activo (ej. plan gratis)
  hideActive?: boolean; // si true oculta el plan activo de la lista
}

export default function PlanTypeView({ onPlanSelected, activePlanTypeId, hideActive = true }: PlanTypeViewProps) {
  const [planTypes, setPlanTypes] = useState<PlanType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigningPlan, setIsAssigningPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [lastAttemptedPlanTypeId, setLastAttemptedPlanTypeId] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [retryMotivo, setRetryMotivo] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'PSE'>('CARD');
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [showCardModal, setShowCardModal] = useState(false);
  const cardTokenProcessedRef = useRef(false);
  const { showAlert, showError, showSuccess, hideAlert, AlertComponent } = useCustomAlert();

  const { status: paymentStatus, rawStatus, start: startPolling, reset: resetPayment } = usePaymentStatus({
    onUpdate: async (s, raw) => {
      if (['approved', 'rejected', 'cancelled', 'expired'].includes(s)) {
        // Finalizar asignación visual y recargar tipos
        loadPlanTypes();
      }
      const exp = (raw as any)?.expiresAt || (raw as any)?.ExpiresAt || null;
      if (exp) setExpiresAt(exp);
      // Caso raro: Approved sin planCreated => re-poll corto y ofrecer reintento
      if (s === 'approved') {
        const created = (raw as any)?.planCreated ?? (raw as any)?.PlanCreated;
        if (!created && preferenceId) {
          await probePlanCreated(preferenceId);
        }
      }
    }
  });

  const approvedProbeForId = useRef<string | null>(null);
  const probePlanCreated = useCallback(async (prefId: string) => {
    if (approvedProbeForId.current === prefId) return;
    approvedProbeForId.current = prefId;
    let ok = false;
    for (let i = 0; i < 2; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const resp = await paymentService.getPaymentStatus(prefId);
      const created = (resp.Data as any)?.planCreated ?? (resp.Data as any)?.PlanCreated;
      if (created) { ok = true; break; }
    }
    if (!ok) {
      const failedPlan = planTypes.find(p => p.id === lastAttemptedPlanTypeId);
      showAlert('info', 'Pago aprobado sin plan', 'Tu pago fue aprobado, pero el plan no se creó aún. Puedes intentar iniciar un nuevo intento de pago para completar la activación.', {
        confirmText: 'Reintentar',
        cancelText: 'Cerrar',
        showCancel: true,
        onCancel: () => hideAlert(),
        onConfirm: () => { hideAlert(); setPreferenceId(null); resetPayment(); if (failedPlan) handleSelectPlanWithMotivo(failedPlan, 'Pago aprobado sin creación de plan.'); }
      });
    }
  }, [lastAttemptedPlanTypeId, planTypes, resetPayment, showAlert, hideAlert]);

  // Función auxiliar para extraer características de la descripción
  const extractFeaturesFromDescription = (description: string): string[] => {
    const lines = description.split('\n');
    const features: string[] = [];
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        features.push(trimmedLine.substring(2).trim());
      }
    }
    if (features.length === 0) {
      const sentences = description
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      return sentences.slice(0, 4);
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
        const raw = normalizeCollection<ApiPlanType>(response.Data as any);
        // Mapear la respuesta de la API a la estructura esperada por el componente
        const mappedPlanTypes: PlanType[] = raw.map(apiPlanType => ({
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
          if (a.price === 0 && b.price > 0) {
            return -1;
          }
          if (b.price === 0 && a.price > 0) {
            return 1;
          }
          return a.price - b.price;
        });

        const FREE_PLAN_TYPE_ID = '4aa8380c-8479-4334-8236-3909be9c842b';
        const filtered = hideActive
          ? sortedPlans.filter(p => p.id !== activePlanTypeId && p.id !== FREE_PLAN_TYPE_ID)
          : sortedPlans;
        setPlanTypes(filtered);
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

  // Prefill buyerEmail desde el perfil
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

  const handleSelectPlanWithMotivo = async (planType: PlanType, motivo: string) => {
    // Abrir panel de opciones de pago bajo el plan y mostrar motivo
    setRetryMotivo(motivo || null);
    setExpandedPlanId(planType.id);
    setLastAttemptedPlanTypeId(planType.id);
  };

  const handleSelectPlan = async (planType: PlanType) => {
    // Si es plan gratuito, mantener asignación directa
    if (planType.price === 0) {
      const tokenValid = await authService.checkAndRefreshToken();
      if (!tokenValid) { showError('Sesión expirada. Por favor, inicia sesión nuevamente.'); return; }
      const userId = authService.getUserId();
      if (!userId) { showError('Debes estar autenticado para seleccionar un plan'); return; }
      await assignPlanToUser(planType, userId);
      return;
    }
    // Plan de pago: abrir opciones de pago debajo del plan
    setExpandedPlanId(curr => (curr === planType.id ? null : planType.id));
    setRetryMotivo(null);
    setLastAttemptedPlanTypeId(planType.id);
  };

  const continuePayment = async (planType: PlanType) => {
    const tokenValid = await authService.checkAndRefreshToken();
    if (!tokenValid) { showError('Sesión expirada. Por favor, inicia sesión nuevamente.'); return; }
    const userId = authService.getUserId();
    if (!userId) { showError('Debes estar autenticado para seleccionar un plan'); return; }
    if (paymentMethod === 'CARD' && Environment.PAY_CARD_INAPP) {
      // Abrir modal in-app para tokenizar tarjeta (diferido para evitar warnings de insertion)
      setTimeout(() => setShowCardModal(true), 0);
    } else {
      await assignPlanToUser(planType, userId);
    }
  };

  const assignPlanToUser = async (planType: PlanType, userId: string) => {
    try {
      setIsAssigningPlan(planType.id);
      // Si el plan es gratis se mantiene lógica de asignación directa existente
      if (planType.price === 0) {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const addReq = {
          StartDate: startDate.toISOString(),
          EndDate: endDate.toISOString(),
          PlanTypeId: planType.id,
          UserId: userId,
        };
        const response = await planService.addPlan(addReq);
        if (response.Success) {
          showSuccess(`Plan "${planType.name}" asignado correctamente`, { onConfirm: () => { onPlanSelected?.(planType); loadPlanTypes(); } });
        } else { showError(response.Message || 'No se pudo asignar el plan'); }
        return;
      }

  // Plan de pago: crear preferencia y redirigir a Mercado Pago
      const successUrl = `${process.env.EXPO_PUBLIC_APP_WEB_BASE_URL || 'https://example.com'}/payments/success`; // Ajustar deep link real
      const failureUrl = `${process.env.EXPO_PUBLIC_APP_WEB_BASE_URL || 'https://example.com'}/payments/failure`;
      const pendingUrl = `${process.env.EXPO_PUBLIC_APP_WEB_BASE_URL || 'https://example.com'}/payments/pending`;
      const prefResp = await paymentService.createUserPlanPreference({
        PlanTypeId: planType.id,
        UserId: userId,
        SuccessUrl: successUrl,
        FailureUrl: failureUrl,
        PendingUrl: pendingUrl,
        PaymentMethod: paymentMethod,
        BuyerEmail: buyerEmail || undefined,
      });
  if (prefResp.Success && prefResp.Data?.InitPoint) {
  const prefId: string | null = (prefResp.Data.Id || prefResp.Data.preferenceId || null) as string | null;
  if (prefId) setPreferenceId(prefId);
    await WebBrowser.openBrowserAsync(prefResp.Data.InitPoint);
        if (prefId) {
          startPolling(prefId);
        }
      } else {
        const msg = (prefResp as any)?.Message || '';
        if (msg.toLowerCase().includes('pendiente') && preferenceId) {
          startPolling(preferenceId);
        } else {
          showError(prefResp.Message || 'No se pudo iniciar el pago');
        }
      }
  } catch { showError('Error al asignar el plan'); }
  finally {
      setIsAssigningPlan(null);
    }
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

  // Visuales dinámicos ahora centralizados en utils/paymentVisual

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
        <FontAwesome name='exclamation-triangle' size={48} color='#FF6B35' />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPlanTypes}>
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
      amount={planTypes.find(p=>p.id===expandedPlanId)?.price || null}
      onToken={async (cardToken: string) => {
        try {
          setTimeout(() => setShowCardModal(false), 0);
          cardTokenProcessedRef.current = true;
          const userId = authService.getUserId();
          const planId = expandedPlanId || lastAttemptedPlanTypeId;
          if (!userId || !planId) { showError('No se pudo continuar el pago.'); return; }
          const resp = await paymentService.createUserPlanCardPayment({ PlanTypeId: planId, UserId: userId, CardToken: cardToken, BuyerEmail: buyerEmail || undefined, Amount: planTypes.find(p=>p.id===planId)?.price || undefined });
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
      <View style={styles.plansContainer}>
        {/* Banner de estado de pago global (se mantiene arriba) */}
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
                 const failedPlan = planTypes.find(p => p.id === lastAttemptedPlanTypeId);
                 setPreferenceId(null);
                 resetPayment();
                 if (failedPlan) {
                   handleSelectPlanWithMotivo(failedPlan, motivo);
                 }
               }}>
                 <Text style={styles.selectButtonText}>Reintentar pago</Text>
               </TouchableOpacity>
             )}
           </View>
           ); })()
         )}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <FontAwesome name={planType.price === 0 ? 'check' : 'credit-card'} size={14} color={'#fff'} />
                  <Text style={styles.selectButtonText}>{planType.price === 0 ? 'Seleccionar Plan' : 'Ver opciones de pago'}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Opciones de pago por plan (solo para planes de pago) */}
            {expandedPlanId === planType.id && planType.price > 0 && (
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
                {/* PSE ya no requiere selección de banco manual: lo gestiona la pasarela */}
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
        ))}
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
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bankItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    marginRight: 8,
    marginBottom: 8,
  },
  bankItemActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  bankItemText: {
    color: '#fff',
    fontSize: 12,
  },
  bankItemTextActive: {
    color: '#000',
    fontWeight: '700',
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
