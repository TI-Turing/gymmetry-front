import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View as RNView,
  Image,
  Dimensions,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Gym } from './types';
import { UI_CONSTANTS } from '@/constants/AppConstants';

interface GymInfoViewProps {
  gym: Gym;
  onRefresh?: () => void;
}

export default function GymInfoView({ gym, onRefresh }: GymInfoViewProps) {
  const { width } = Dimensions.get('window');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header del Gym */}
      <View style={styles.header}>
        {gym.LogoUrl ? (
          <Image source={{ uri: gym.LogoUrl }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <FontAwesome name='building-o' size={40} color={Colors.dark.tint} />
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={styles.gymName}>{gym.Name}</Text>
          {gym.Slogan && <Text style={styles.slogan}>{gym.Slogan}</Text>}

          <View style={styles.statusContainer}>
            <FontAwesome
              name={gym.IsVerified ? 'check-circle' : 'clock-o'}
              size={16}
              color={gym.IsVerified ? '#4CAF50' : '#FFA726'}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: gym.IsVerified ? '#4CAF50' : '#FFA726',
                },
              ]}
            >
              {gym.IsVerified ? 'Verificado' : 'Pendiente de verificación'}
            </Text>
          </View>
        </View>

        {onRefresh && (
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <FontAwesome name='refresh' size={20} color={Colors.dark.tint} />
          </TouchableOpacity>
        )}
      </View>

      {/* Información Principal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información General</Text>

        {gym.Description && (
          <View style={styles.infoItem}>
            <FontAwesome
              name='info-circle'
              size={16}
              color={Colors.dark.tint}
            />
            <Text style={styles.infoText}>{gym.Description}</Text>
          </View>
        )}

        <View style={styles.infoItem}>
          <FontAwesome name='id-card' size={16} color={Colors.dark.tint} />
          <Text style={styles.infoText}>NIT: {gym.Nit}</Text>
        </View>

        <View style={styles.infoItem}>
          <FontAwesome name='envelope' size={16} color={Colors.dark.tint} />
          <Text style={styles.infoText}>{gym.Email}</Text>
        </View>

        {gym.PhoneNumber && (
          <View style={styles.infoItem}>
            <FontAwesome name='phone' size={16} color={Colors.dark.tint} />
            <Text style={styles.infoText}>{gym.PhoneNumber}</Text>
          </View>
        )}

        {gym.WebsiteUrl && (
          <TouchableOpacity style={styles.infoItem}>
            <FontAwesome name='globe' size={16} color={Colors.dark.tint} />
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
              <FontAwesome name='instagram' size={16} color='#E4405F' />
              <Text style={[styles.infoText, styles.linkText]}>Instagram</Text>
            </TouchableOpacity>
          )}

          {gym.FacbookUrl && (
            <TouchableOpacity style={styles.infoItem}>
              <FontAwesome name='facebook' size={16} color='#1877F2' />
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
      </View>

      {/* Información Adicional */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles</Text>

        <View style={styles.infoItem}>
          <FontAwesome name='calendar' size={16} color={Colors.dark.tint} />
          <Text style={styles.infoText}>
            Miembro desde: {formatDate(gym.CreatedAt)}
          </Text>
        </View>

        {gym.UpdatedAt && (
          <View style={styles.infoItem}>
            <FontAwesome name='edit' size={16} color={Colors.dark.tint} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    padding: UI_CONSTANTS.SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    backgroundColor: '#1A1A1A',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#333333',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: UI_CONSTANTS.SPACING.MD,
    justifyContent: 'center',
  },
  gymName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  slogan: {
    fontSize: 16,
    color: '#B0B0B0',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  refreshButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: UI_CONSTANTS.SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.tint,
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: UI_CONSTANTS.SPACING.SM,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  linkText: {
    color: Colors.dark.tint,
    textDecorationLine: 'underline',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: UI_CONSTANTS.SPACING.MD,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.tint,
  },
  statLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 4,
  },
});
