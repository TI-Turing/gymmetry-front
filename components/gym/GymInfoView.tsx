import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import SmartImage from '@/components/common/SmartImage';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Gym } from './types';
import { authService } from '@/services/authService';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymInfoViewStyles } from './styles/gymInfoView';

interface GymInfoViewProps {
  gym: Gym;
  onRefresh?: () => void;
  onAddBranch?: () => void;
}

export default function GymInfoView({
  gym,
  onRefresh,
  onAddBranch,
}: GymInfoViewProps) {
  const styles = useThemedStyles(makeGymInfoViewStyles);
  // const { width } = Dimensions.get('window');
  const router = useRouter();

  // Verificar si el usuario actual es el propietario del gimnasio
  const currentUserId = authService.getUserId();
  const isOwner = currentUserId === gym.Owner_UserId;
  // Verificar si el gimnasio tiene un plan activo
  const hasActivePlan = gym.SubscriptionPlanId !== null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSelectPlan = () => {
    router.push('/plans');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header del Gym */}
      <View style={styles.header}>
        {gym.LogoUrl ? (
          <SmartImage uri={gym.LogoUrl} style={styles.logo} deferOnDataSaver />
        ) : (
          <View style={styles.logoPlaceholder}>
            <FontAwesome
              name="building-o"
              size={40}
              color={styles.colors.tint}
            />
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={styles.gymName}>{gym.Name}</Text>
          {gym.Slogan && <Text style={styles.slogan}>{gym.Slogan}</Text>}

          <View style={styles.statusContainer}>
            <FontAwesome
              name={gym.IsVerified ? 'check-circle' : 'clock-o'}
              size={16}
              color={
                gym.IsVerified ? styles.colors.success : styles.colors.warning
              }
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: gym.IsVerified
                    ? styles.colors.success
                    : styles.colors.warning,
                },
              ]}
            >
              {gym.IsVerified ? 'Verificado' : 'Pendiente de verificación'}
            </Text>
          </View>
        </View>

        {onRefresh && (
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <FontAwesome name="refresh" size={20} color={styles.colors.tint} />
          </TouchableOpacity>
        )}
      </View>

      {/* Información Principal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información General</Text>

        {gym.Description && (
          <View style={styles.infoItem}>
            <FontAwesome
              name="info-circle"
              size={16}
              color={styles.colors.tint}
            />
            <Text style={styles.infoText}>{gym.Description}</Text>
          </View>
        )}

        <View style={styles.infoItem}>
          <FontAwesome name="id-card" size={16} color={styles.colors.tint} />
          <Text style={styles.infoText}>NIT: {gym.Nit}</Text>
        </View>

        <View style={styles.infoItem}>
          <FontAwesome name="envelope" size={16} color={styles.colors.tint} />
          <Text style={styles.infoText}>{gym.Email}</Text>
        </View>

        {gym.PhoneNumber && (
          <View style={styles.infoItem}>
            <FontAwesome name="phone" size={16} color={styles.colors.tint} />
            <Text style={styles.infoText}>{gym.PhoneNumber}</Text>
          </View>
        )}

        {gym.WebsiteUrl && (
          <TouchableOpacity style={styles.infoItem}>
            <FontAwesome name="globe" size={16} color={styles.colors.tint} />
            <Text style={[styles.infoText, styles.linkText]}>
              {gym.WebsiteUrl}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Redes Sociales */}
      {(gym.InstagramUrl || gym.FacbookUrl) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Redes Sociales</Text>

          {gym.InstagramUrl && (
            <TouchableOpacity style={styles.infoItem}>
              <FontAwesome
                name="instagram"
                size={16}
                color={styles.colors.tint}
              />
              <Text style={[styles.infoText, styles.linkText]}>Instagram</Text>
            </TouchableOpacity>
          )}

          {gym.FacbookUrl && (
            <TouchableOpacity style={styles.infoItem}>
              <FontAwesome
                name="facebook"
                size={16}
                color={styles.colors.tint}
              />
              <Text style={[styles.infoText, styles.linkText]}>Facebook</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Estadísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{gym.Branches?.length || 0}</Text>
            <Text style={styles.statLabel}>Sedes</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{gym.Plans?.length || 0}</Text>
            <Text style={styles.statLabel}>Planes</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {gym.RoutineTemplates?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Rutinas</Text>
          </View>
        </View>

        {/* Botón Agregar Sede */}
        {onAddBranch && isOwner && (
          <TouchableOpacity
            style={styles.addBranchButton}
            onPress={onAddBranch}
          >
            <FontAwesome name="plus" size={18} color={styles.colors.onTint} />
            <Text style={styles.addBranchText}>Agregar sede</Text>
          </TouchableOpacity>
        )}

        {/* Botón Seleccionar Plan */}
        {isOwner && !hasActivePlan && (
          <TouchableOpacity
            style={styles.selectPlanButton}
            onPress={handleSelectPlan}
          >
            <FontAwesome
              name="credit-card"
              size={18}
              color={styles.colors.onTint}
            />
            <Text style={styles.selectPlanText}>Seleccionar plan</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Información Adicional */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles</Text>

        <View style={styles.infoItem}>
          <FontAwesome name="calendar" size={16} color={styles.colors.tint} />
          <Text style={styles.infoText}>
            Miembro desde: {formatDate(gym.CreatedAt)}
          </Text>
        </View>

        {gym.UpdatedAt && (
          <View style={styles.infoItem}>
            <FontAwesome name="edit" size={16} color={styles.colors.tint} />
            <Text style={styles.infoText}>
              Última actualización: {formatDate(gym.UpdatedAt)}
            </Text>
          </View>
        )}
      </View>

      {/* Espaciado inferior */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// styles come from themed factory
