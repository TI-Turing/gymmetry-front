import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import Dropdown from './Dropdown';
import { userAPI } from '@/services/apiExamples';

interface Step3Props {
  userId: string;
  onNext: (data: {
    eps?: string;
    country?: string;
    region?: string;
    city?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    address?: string;
  }) => void;
  initialData?: {
    eps?: string;
    country?: string;
    region?: string;
    city?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    address?: string;
  };
}

const EPS_OPTIONS = [
  'Sanitas',
  'Sura',
  'Nueva EPS',
  'Compensar',
  'Famisanar',
  'Salud Total',
  'Coomeva',
  'Medimás',
  'Capital Salud',
  'Aliansalud',
  'Cruz Blanca',
  'Otra',
];

const COUNTRIES = [
  'Colombia',
  'Argentina',
  'México',
  'España',
  'Estados Unidos',
  'Chile',
  'Perú',
  'Ecuador',
  'Venezuela',
  'Uruguay',
  'Paraguay',
  'Bolivia',
  'Brasil',
  'Otro',
];

const COLOMBIA_REGIONS = [
  'Amazonas',
  'Antioquia',
  'Arauca',
  'Atlántico',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Casanare',
  'Cauca',
  'Cesar',
  'Chocó',
  'Córdoba',
  'Cundinamarca',
  'Guainía',
  'Guaviare',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'San Andrés y Providencia',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
  'Vaupés',
  'Vichada',
];

const COLOMBIA_CITIES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Cúcuta',
  'Bucaramanga',
  'Pereira',
  'Santa Marta',
  'Ibagué',
  'Bello',
  'Pasto',
  'Manizales',
  'Neiva',
  'Soledad',
  'Villavicencio',
  'Armenia',
  'Soacha',
  'Valledupar',
  'Montería',
  'Itagüí',
  'Palmira',
  'Buenaventura',
  'Floridablanca',
  'Sincelejo',
  'Popayán',
  'Dosquebradas',
  'Tunja',
  'Envigado',
  'Cartago',
];

export default function Step3({ userId, onNext, initialData }: Step3Props) {
  const [eps, setEps] = useState(initialData?.eps || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [region, setRegion] = useState(initialData?.region || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [emergencyContact, setEmergencyContact] = useState(initialData?.emergencyContact || '');
  const [emergencyPhone, setEmergencyPhone] = useState(initialData?.emergencyPhone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const colorScheme = useColorScheme();

  const handleNext = async () => {
    console.log('🚀 [STEP 3] Iniciando actualización de datos personales...');
    console.log('👤 [STEP 3] User ID:', userId);
    
    const stepData = {
      eps: eps || undefined,
      country: country || undefined,
      region: region || undefined,
      city: city || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() || undefined,
      address: address.trim() || undefined,
    };
    
    console.log('📤 [STEP 3] Datos a enviar:', stepData);
    
    try {
      // Mapear a los campos del backend
      const updateData = {
        // Mapear campos según el backend schema
        emergencyName: stepData.emergencyContact,
        emergencyPhone: stepData.emergencyPhone,
        address: stepData.address,
        // TODO: Mapear correctamente eps, country, region, city a sus IDs correspondientes
        // idEps: eps se debe convertir a ID
        // countryId: country se debe convertir a ID  
        // regionId: region se debe convertir a ID
        // cityId: city se debe convertir a ID
      };
      
      console.log('📋 [STEP 3] Datos mapeados para API:', updateData);
      
      const response = await userAPI.updateUser(userId, updateData);
      console.log('✅ [STEP 3] Actualización exitosa:', response);
      
      // Verificar que la respuesta sea exitosa
      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }
      
      onNext(stepData);
    } catch (error) {
      console.error('❌ [STEP 3] Error al actualizar usuario:', error);
      // Por ahora continúamos aunque falle la API
      onNext(stepData);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Información personal
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].text }]}>
          Datos adicionales para tu perfil (opcional)
        </Text>
      </View>

      <View style={styles.form}>
        <Dropdown
          label="EPS"
          placeholder="Selecciona tu EPS"
          options={EPS_OPTIONS}
          value={eps}
          onSelect={setEps}
        />

        <Dropdown
          label="País"
          placeholder="Selecciona tu país"
          options={COUNTRIES}
          value={country}
          onSelect={setCountry}
          searchable
        />

        <Dropdown
          label="Región/Departamento"
          placeholder="Selecciona tu región"
          options={COLOMBIA_REGIONS}
          value={region}
          onSelect={setRegion}
          searchable
        />

        <Dropdown
          label="Ciudad"
          placeholder="Selecciona tu ciudad"
          options={COLOMBIA_CITIES}
          value={city}
          onSelect={setCity}
          searchable
        />

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
            Contacto de emergencia
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Nombre completo"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
            Teléfono de emergencia
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            placeholder="+57 300 123 4567"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
            Dirección
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={address}
            onChangeText={setAddress}
            placeholder="Calle, carrera, número, apartamento..."
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: Colors[colorScheme].tint },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 80,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
