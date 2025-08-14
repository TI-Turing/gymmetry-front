import React, { useEffect, useState } from 'react';
import { Platform, Switch, View as RNView, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const SOUND_KEY = '@sound_cues_enabled';
const PREP_KEY = '@prep_seconds';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [prepSeconds, setPrepSeconds] = useState<number>(10);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Sonido
        const rawSound = Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window
          ? window.localStorage.getItem(SOUND_KEY)
          : await AsyncStorage.getItem(SOUND_KEY);
        const enabled = rawSound == null ? true : rawSound === '1';
        if (!cancelled) setSoundEnabled(enabled);
        // Prep
        const rawPrep = Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window
          ? window.localStorage.getItem(PREP_KEY)
          : await AsyncStorage.getItem(PREP_KEY);
        const prep = rawPrep == null ? 10 : Math.max(0, parseInt(rawPrep, 10) || 0);
        if (!cancelled) setPrepSeconds(prep);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const persistSound = async (val: boolean) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.setItem(SOUND_KEY, val ? '1' : '0');
    } else {
      await AsyncStorage.setItem(SOUND_KEY, val ? '1' : '0');
    }
  };

  const toggleSound = async (val: boolean) => {
    setSoundEnabled(val);
    try { await persistSound(val); } catch {}
  };

  const persistPrep = async (val: number) => {
    const s = String(Math.max(0, Math.floor(val)));
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.setItem(PREP_KEY, s);
    } else {
      await AsyncStorage.setItem(PREP_KEY, s);
    }
  };

  const changePrep = async (val: number) => {
    setPrepSeconds(val);
    try { await persistPrep(val); } catch {}
  };

  return (
    <ScreenWrapper
      headerTitle="Ajustes"
      showBackButton
      onPressBack={() => router.back()}
    >
      <View style={{ flex: 1, padding: 16 }}>
        {/* Sección: Entrenamiento */}
        <View
          style={{
            backgroundColor: '#1A1A1A',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#2A2A2A',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Entrenamiento</Text>
          <RNView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 8,
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '600' }}>Señales sonoras / vibración</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>
                Activa avisos al cambiar de fase del temporizador y al finalizar. Se guarda en este dispositivo.
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              disabled={loading}
            />
          </RNView>

          <RNView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 8,
              marginTop: 8,
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '600' }}>Tiempo de preparación entre ciclos</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>
                Pausa breve antes de iniciar el siguiente ciclo (0 para desactivar).
              </Text>
            </View>
            <RNView style={{ flexDirection: 'row', gap: 8 }}>
              {[0,5,10,15].map(val => (
                <RNView key={val}>
                  <TouchableOpacity
                    onPress={() => changePrep(val)}
                    disabled={loading}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: val === prepSeconds ? '#FF6B35' : '#3A3A3A',
                      backgroundColor: val === prepSeconds ? '#2A2A2A' : 'transparent',
                      minWidth: 48,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>{val}s</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
        </View>

        {/* Más opciones futuras */}
        <Text style={{ opacity: 0.7, fontSize: 12 }}>
          Más opciones de configuración estarán disponibles próximamente.
        </Text>
      </View>
    </ScreenWrapper>
  );
}
