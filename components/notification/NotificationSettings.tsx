import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useColorScheme } from '../useColorScheme';

interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  mentions: boolean;
  follows: boolean;
  posts: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
}

interface NotificationSettingsProps {
  onSave?: (settings: NotificationSettings) => void;
}

const defaultSettings: NotificationSettings = {
  likes: true,
  comments: true,
  mentions: true,
  follows: true,
  posts: false,
  pushEnabled: true,
  emailEnabled: false,
  quietHours: false,
  quietStart: '22:00',
  quietEnd: '08:00',
};

export const NotificationSettingsPanel: React.FC<NotificationSettingsProps> = ({
  onSave,
}) => {
  const colorScheme = useColorScheme();
  const [settings, setSettings] =
    useState<NotificationSettings>(defaultSettings);

  const styles = createStyles(colorScheme);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    onSave?.(updatedSettings);
  };

  const SettingItem: React.FC<{
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    icon?: string;
  }> = ({ title, description, value, onToggle, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingHeader}>
          {icon && <Text style={styles.settingIcon}>{icon}</Text>}
          <Text style={styles.settingTitle}>{title}</Text>
        </View>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: colorScheme === 'dark' ? '#333' : '#e0e0e0',
          true: '#FF6B35',
        }}
        thumbColor={colorScheme === 'dark' ? '#fff' : '#fff'}
        ios_backgroundColor={colorScheme === 'dark' ? '#333' : '#e0e0e0'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración de Notificaciones</Text>
        <Text style={styles.headerSubtitle}>
          Personaliza qué notificaciones quieres recibir
        </Text>
      </View>

      {/* Notificaciones por tipo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos de Notificaciones</Text>

        <SettingItem
          icon="❤️"
          title="Me gusta"
          description="Cuando alguien le da like a tu contenido"
          value={settings.likes}
          onToggle={(value) => updateSetting('likes', value)}
        />

        <SettingItem
          icon="💬"
          title="Comentarios"
          description="Cuando alguien comenta en tus publicaciones"
          value={settings.comments}
          onToggle={(value) => updateSetting('comments', value)}
        />

        <SettingItem
          icon="@"
          title="Menciones"
          description="Cuando alguien te menciona en un comentario"
          value={settings.mentions}
          onToggle={(value) => updateSetting('mentions', value)}
        />

        <SettingItem
          icon="👤"
          title="Nuevos seguidores"
          description="Cuando alguien comienza a seguirte"
          value={settings.follows}
          onToggle={(value) => updateSetting('follows', value)}
        />

        <SettingItem
          icon="📝"
          title="Nuevas publicaciones"
          description="Cuando las personas que sigues publican contenido"
          value={settings.posts}
          onToggle={(value) => updateSetting('posts', value)}
        />
      </View>

      {/* Métodos de entrega */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métodos de Entrega</Text>

        <SettingItem
          icon="📱"
          title="Notificaciones Push"
          description="Recibe notificaciones en tu dispositivo"
          value={settings.pushEnabled}
          onToggle={(value) => updateSetting('pushEnabled', value)}
        />

        <SettingItem
          icon="📧"
          title="Notificaciones por Email"
          description="Recibe un resumen semanal por correo electrónico"
          value={settings.emailEnabled}
          onToggle={(value) => updateSetting('emailEnabled', value)}
        />
      </View>

      {/* Horario silencioso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horario Silencioso</Text>

        <SettingItem
          icon="🌙"
          title="Activar horario silencioso"
          description="No recibir notificaciones durante ciertas horas"
          value={settings.quietHours}
          onToggle={(value) => updateSetting('quietHours', value)}
        />

        {settings.quietHours && (
          <View style={styles.quietHoursContainer}>
            <View style={styles.timeRange}>
              <Text style={styles.timeLabel}>Desde:</Text>
              <TouchableOpacity style={styles.timeButton}>
                <Text style={styles.timeText}>{settings.quietStart}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeRange}>
              <Text style={styles.timeLabel}>Hasta:</Text>
              <TouchableOpacity style={styles.timeButton}>
                <Text style={styles.timeText}>{settings.quietEnd}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Acciones */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetText}>Restaurar valores por defecto</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            💡 Consejo: Puedes desactivar notificaciones específicas para
            mantener tu feed organizado sin perder actividad importante.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#fff' : '#000',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: isDark ? '#ccc' : '#666',
      lineHeight: 22,
    },
    section: {
      paddingTop: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#222' : '#f8f8f8',
    },
    settingContent: {
      flex: 1,
      marginRight: 16,
    },
    settingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    settingIcon: {
      fontSize: 20,
      marginRight: 12,
      width: 24,
      textAlign: 'center',
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    settingDescription: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
      lineHeight: 20,
      marginLeft: 36,
    },
    quietHoursContainer: {
      marginTop: 16,
      paddingLeft: 36,
      borderLeftWidth: 3,
      borderLeftColor: '#FF6B35',
      paddingBottom: 16,
    },
    timeRange: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    timeLabel: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
      width: 60,
    },
    timeButton: {
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      marginLeft: 12,
    },
    timeText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#fff' : '#000',
    },
    actionsSection: {
      paddingHorizontal: 20,
      paddingTop: 32,
      paddingBottom: 24,
    },
    resetButton: {
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
    },
    resetText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#FF6B35',
    },
    infoContainer: {
      backgroundColor: isDark ? '#111' : '#f9f9f9',
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#FF6B35',
    },
    infoText: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
      lineHeight: 20,
    },
  });
};
