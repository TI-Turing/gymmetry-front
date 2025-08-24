import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import PlanTypeView from '@/components/planType/PlanTypeView';
import PlanView from '@/components/plan/PlanView';
import GymPlanView from '@/components/gym/GymPlanView';
import { authService } from '@/services/authService';
import { gymService } from '@/services';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePlansStyles } from './styles/plans';

export default function PlansModal() {
  const styles = useThemedStyles(makePlansStyles);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [gymId, setGymId] = useState<string | null>(null);
  // Usado sólo para forzar refresh de vistas al crear/cambiar plan
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeUserPlanTypeId, setActiveUserPlanTypeId] = useState<
    string | null
  >(null);
  const [usingFallbackFreePlan, setUsingFallbackFreePlan] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const tokenValid = await authService.checkAndRefreshToken();
      if (!tokenValid) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        return;
      }

      const userId = authService.getUserId();
      const userGymId = authService.getGymId();
      if (!userId) {
        setError('Usuario no autenticado.');
        return;
      }

      // Determinar roles: owner o admin
      let userIsOwner = false;
      if (userGymId) {
        try {
          const gymData = await gymService.getCachedGymById(userGymId);
          if (gymData) {
            const legacyOwnerId = (
              gymData as unknown as { OwnerUserId?: string }
            ).OwnerUserId;
            if (
              gymData.Owner_UserId === userId ||
              (legacyOwnerId !== undefined && legacyOwnerId === userId)
            ) {
              userIsOwner = true;
            }
          }
        } catch {}
      }
      const userIsAdmin = authService.hasRole?.('admin') ?? false;
      const finalIsOwner = userIsOwner || userIsAdmin;
      setIsOwner(finalIsOwner);
      setGymId(userGymId);
    } catch {
      setError('Error al verificar el rol del usuario');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePlanCreatedOrChanged = () => {
    setRefreshCounter((c) => c + 1);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Planes</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="times" size={24} color={styles.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={styles.colors.tint} />
          <Text style={styles.loadingText}>Verificando permisos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Planes</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="times" size={24} color={styles.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.errorContainer}>
          <FontAwesome
            name="exclamation-triangle"
            size={48}
            color={styles.colors.danger as string}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={checkUserRole}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isOwner ? 'Planes del Gimnasio' : 'Planes Disponibles'}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="times" size={24} color={styles.colors.text} />
        </TouchableOpacity>
      </View>
      {isOwner && gymId ? (
        <GymPlanView
          gymId={gymId}
          onPlanSelected={handlePlanCreatedOrChanged}
          refreshKey={refreshCounter}
        />
      ) : (
        <>
          <PlanView
            showCurrentPlan={true}
            refreshKey={refreshCounter}
            onActivePlanTypeResolved={(planTypeId, isFallback) => {
              setActiveUserPlanTypeId(planTypeId);
              setUsingFallbackFreePlan(isFallback);
            }}
          />
          <PlanTypeView
            onPlanSelected={handlePlanCreatedOrChanged}
            activePlanTypeId={
              usingFallbackFreePlan
                ? activeUserPlanTypeId || '4aa8380c-8479-4334-8236-3909be9c842b'
                : activeUserPlanTypeId || undefined
            }
            hideActive={true}
          />
        </>
      )}
    </View>
  );
}
