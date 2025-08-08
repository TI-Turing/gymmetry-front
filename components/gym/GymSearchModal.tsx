import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import {
  gymServiceExtensions,
  FindGymsByNameResponse,
} from '@/services/gymService';
import { authService } from '@/services/authService';
import GymInfoView from './GymInfoView';

interface GymSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onGymSelected?: (gym: FindGymsByNameResponse) => void;
}

export default function GymSearchModal({
  visible,
  onClose,
  onGymSelected,
}: GymSearchModalProps) {
  const [searchText, setSearchText] = useState('');
  const [gyms, setGyms] = useState<FindGymsByNameResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGym, setSelectedGym] = useState<FindGymsByNameResponse | null>(
    null
  );
  const [showGymInfo, setShowGymInfo] = useState(false);

  // Ref para el debounce
  const debounceRef = useRef<number>(0);

  // Hook para manejar el debounce de la búsqueda
  useEffect(() => {
    // Limpiar timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Si el texto de búsqueda está vacío, limpiar resultados
    if (!searchText.trim()) {
      setGyms([]);
      setError(null);
      return;
    }

    // Validar mínimo de caracteres antes de buscar
    if (searchText.length < 2) {
      setGyms([]);
      setError(null);
      return;
    }

    // Crear nuevo timeout para el debounce (500ms)
    debounceRef.current = setTimeout(() => {
      searchGyms(searchText);
    }, 500) as unknown as number;

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchText]);

  const searchGyms = async (name: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await gymServiceExtensions.findGymsByName(name);

      if (response.Success) {
        setGyms(response.Data);
      } else {
        setError(response.Message || 'Error al buscar gimnasios');
        setGyms([]);
      }
    } catch (_err) {
      setError('Error al buscar gimnasios');
      setGyms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGymSelect = (gym: FindGymsByNameResponse) => {
    setSelectedGym(gym);
    setShowGymInfo(true);
  };

  const handleConnectToGym = async (gymId: string) => {
    try {
      // TODO: Implementar conexión del usuario al gym
      // Esto debería actualizar el UserGym y el cache del usuario

      if (onGymSelected && selectedGym) {
        onGymSelected(selectedGym);
      }

      // Cerrar modal
      handleCloseModal();
    } catch (_err) {
      setError('Error al conectar con el gimnasio');
    }
  };

  const handleCloseModal = () => {
    setSearchText('');
    setGyms([]);
    setError(null);
    setSelectedGym(null);
    setShowGymInfo(false);
    onClose();
  };

  const handleBackFromGymInfo = () => {
    setShowGymInfo(false);
    setSelectedGym(null);
  };

  const renderGymItem = (gym: FindGymsByNameResponse) => {
    // TODO: Implementar cálculo de distancia usando geolocalización
    const mockDistance = '2.5 km'; // Placeholder para la distancia

    return (
      <TouchableOpacity
        key={gym.Id}
        style={styles.gymItem}
        onPress={() => handleGymSelect(gym)}
      >
        <View style={styles.gymItemContent}>
          {/* TODO: Mostrar imagen del gym cuando el backend la retorne */}
          <View style={styles.gymImageContainer}>
            {gym.LogoUrl ? (
              <Image source={{ uri: gym.LogoUrl }} style={styles.gymImage} />
            ) : (
              <View style={styles.gymImagePlaceholder}>
                <FontAwesome name='building' size={24} color='#B0B0B0' />
              </View>
            )}
          </View>

          <View style={styles.gymDetails}>
            <Text style={styles.gymName}>{gym.Name}</Text>

            {/* TODO: Implementar ubicación real del gym */}
            <Text style={styles.gymLocation}>📍 Ubicación no disponible</Text>

            {/* TODO: Mostrar distancia real basada en geolocalización */}
            <Text style={styles.gymDistance}>📏 {mockDistance}</Text>

            {gym.IsVerified && (
              <View style={styles.verifiedBadge}>
                <FontAwesome name='check-circle' size={12} color='#4CAF50' />
                <Text style={styles.verifiedText}>Verificado</Text>
              </View>
            )}
          </View>

          <FontAwesome name='chevron-right' size={16} color='#B0B0B0' />
        </View>
      </TouchableOpacity>
    );
  };

  // Si estamos mostrando la información del gym seleccionado
  if (showGymInfo && selectedGym) {
    const currentUserGymId = authService.getGymId();
    const isCurrentGym = currentUserGymId === selectedGym.Id;

    return (
      <Modal
        visible={visible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={handleBackFromGymInfo}
      >
        <View style={styles.gymInfoContainer}>
          <View style={styles.gymInfoHeader}>
            <TouchableOpacity
              onPress={handleBackFromGymInfo}
              style={styles.backButton}
            >
              <FontAwesome
                name='arrow-left'
                size={20}
                color={Colors.dark.tint}
              />
              <Text style={styles.backButtonText}>Buscar Gyms</Text>
            </TouchableOpacity>
          </View>

          <GymInfoView
            gym={{
              Id: selectedGym.Id,
              Name: selectedGym.Name,
              Description: selectedGym.Description,
              Email: selectedGym.Email,
              PhoneNumber: selectedGym.PhoneNumber || '',
              LogoUrl: selectedGym.LogoUrl,
              IsVerified: selectedGym.IsVerified,
              BrandColor: selectedGym.BrandColor,
              WebsiteUrl: selectedGym.WebsiteUrl,
              SocialMediaLinks: selectedGym.SocialMediaLinks,
              FacbookUrl: selectedGym.FacbookUrl,
              InstagramUrl: selectedGym.InstagramUrl,
              Nit: selectedGym.Nit,
              LegalRepresentative: selectedGym.LegalRepresentative,
              BillingEmail: selectedGym.BillingEmail,
              SubscriptionPlanId: selectedGym.SubscriptionPlanId,
              Tags: selectedGym.Tags,
              Owner_UserId: selectedGym.Owner_UserId,
              MaxBranchesAllowed: selectedGym.MaxBranchesAllowed,
              QrImageUrl: selectedGym.QrImageUrl,
              TrialEndsAt: selectedGym.TrialEndsAt,
              CountryId: selectedGym.CountryId,
              CreatedAt: selectedGym.CreatedAt,
              UpdatedAt: selectedGym.UpdatedAt,
              DeletedAt: selectedGym.DeletedAt,
              Ip: selectedGym.Ip,
              IsActive: selectedGym.IsActive,
              GymTypeId: selectedGym.GymTypeId,
              GymType: selectedGym.GymType,
              Bills: selectedGym.Bills,
              Branches: selectedGym.Branches,
              GymPlanSelecteds: selectedGym.GymPlanSelecteds,
              Plans: selectedGym.Plans,
              RoutineTemplates: selectedGym.RoutineTemplates,
              UserGyms: selectedGym.UserGyms,
              UserUserGymAssigneds: [],
              PaymentAttempts: selectedGym.PaymentAttempts,
              Slogan: selectedGym.Slogan,
              PaisId: selectedGym.PaisId,
            }}
          />

          {!isCurrentGym && (
            <View style={styles.connectButtonContainer}>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleConnectToGym(selectedGym.Id)}
              >
                <FontAwesome name='plus' size={18} color='#FFFFFF' />
                <Text style={styles.connectButtonText}>Conectar</Text>
              </TouchableOpacity>
            </View>
          )}

          {isCurrentGym && (
            <View style={styles.currentGymContainer}>
              <FontAwesome name='check-circle' size={20} color='#4CAF50' />
              <Text style={styles.currentGymText}>
                Ya estás conectado a este gym
              </Text>
            </View>
          )}
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={handleCloseModal}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCloseModal}
            style={styles.closeButton}
          >
            <FontAwesome name='times' size={24} color={Colors.dark.tint} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buscar Gimnasios</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <FontAwesome
            name='search'
            size={16}
            color='#B0B0B0'
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholderTextColor='#B0B0B0'
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={true}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.clearButton}
            >
              <FontAwesome name='times' size={14} color='#B0B0B0' />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={Colors.dark.tint} />
              <Text style={styles.loadingText}>Buscando gimnasios...</Text>
            </View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <View style={styles.errorContainer}>
              <FontAwesome
                name='exclamation-triangle'
                size={24}
                color='#FF6B6B'
              />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                onPress={() => searchGyms(searchText)}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty State */}
          {!isLoading &&
            !error &&
            searchText.length >= 2 &&
            gyms.length === 0 && (
              <View style={styles.emptyContainer}>
                <FontAwesome name='search' size={48} color='#666666' />
                <Text style={styles.emptyTitle}>
                  No se encontraron gimnasios
                </Text>
                <Text style={styles.emptySubtitle}>
                  Intenta con otros términos de búsqueda
                </Text>
              </View>
            )}

          {/* Initial State */}
          {!isLoading && !error && searchText.length < 2 && (
            <View style={styles.initialContainer}>
              <FontAwesome name='search' size={48} color='#666666' />
              <Text style={styles.initialTitle}>Buscar Gimnasios</Text>
              <Text style={styles.initialSubtitle}>
                Escribe al menos 2 caracteres para comenzar la búsqueda
              </Text>
            </View>
          )}

          {/* Results */}
          {!isLoading && !error && gyms.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsHeader}>
                {gyms.length} gimnasio{gyms.length !== 1 ? 's' : ''} encontrado
                {gyms.length !== 1 ? 's' : ''}
              </Text>
              {gyms.map(renderGymItem)}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#B0B0B0',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
  },
  retryButton: {
    backgroundColor: Colors.dark.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  initialContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  initialTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  initialSubtitle: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsHeader: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },
  gymItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  gymItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  gymImageContainer: {
    marginRight: 16,
  },
  gymImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  gymImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  gymDetails: {
    flex: 1,
  },
  gymName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gymLocation: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 2,
  },
  gymDistance: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: '#4CAF50',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  gymInfoContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gymInfoHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.dark.tint,
    fontSize: 16,
    marginLeft: 8,
  },
  connectButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  connectButton: {
    backgroundColor: Colors.dark.tint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  currentGymContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  currentGymText: {
    color: '#4CAF50',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});
