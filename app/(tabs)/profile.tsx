import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import MobileHeader from '@/components/layout/MobileHeader';
import { withWebLayout } from '@/components/layout/withWebLayout';
import { useCustomAlert } from '@/components/common/CustomAlert';
import SmartImage from '@/components/common/SmartImage';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeProfileStyles } from './styles/profile';

function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const styles = useThemedStyles(makeProfileStyles);
  const { showAlert, AlertComponent } = useCustomAlert();

  const userStats = {
    workouts: 156,
    streak: 12,
    weight: 75.2,
    height: 175,
    age: 28,
    joinDate: 'Enero 2024',
  };

  const achievements = [
    { icon: 'trophy', title: '100 Entrenamientos', color: styles.colors.tint },
    { icon: 'fire', title: '30 Días Consecutivos', color: styles.colors.tint },
    { icon: 'star', title: 'Meta Mensual', color: styles.colors.tint },
    { icon: 'medal', title: 'Primer PR', color: styles.colors.tint },
  ];

  const menuItems = [
    { icon: 'user', title: 'Editar Perfil', action: () => setIsEditing(true) },
    { icon: 'cog', title: 'Configuración', action: () => {} },
    { icon: 'chart-line', title: 'Estadísticas', action: () => {} },
    { icon: 'calendar', title: 'Historial', action: () => {} },
    { icon: 'question-circle', title: 'Ayuda', action: () => {} },
    { icon: 'info-circle', title: 'Acerca de', action: () => {} },
  ];

  const handleLogout = () => {
    showAlert(
      'warning',
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      {
        confirmText: 'Cerrar Sesión',
        cancelText: 'Cancelar',
        onConfirm: logout,
      }
    );
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <SmartImage
          uri={'https://via.placeholder.com/100'}
          style={styles.avatar}
          deferOnDataSaver={false}
        />
        <TouchableOpacity style={styles.editAvatarButton}>
          <FontAwesome name="camera" size={16} color={styles.colors.text} />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{user?.email || 'Usuario'}</Text>
      <Text style={styles.userEmail}>{user?.email || 'email@ejemplo.com'}</Text>
      <Text style={styles.joinDate}>Miembro desde {userStats.joinDate}</Text>
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Estadísticas</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.workouts}</Text>
          <Text style={styles.statLabel}>Entrenamientos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.streak}</Text>
          <Text style={styles.statLabel}>Días seguidos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.weight} kg</Text>
          <Text style={styles.statLabel}>Peso actual</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.height} cm</Text>
          <Text style={styles.statLabel}>Altura</Text>
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsCard}>
      <Text style={styles.achievementsTitle}>Logros</Text>
      <View style={styles.achievementsGrid}>
        {achievements.map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <FontAwesome
              name={achievement.icon as any}
              size={24}
              color={achievement.color}
            />
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMenuItem = (item: (typeof menuItems)[0], index: number) => (
    <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
      <FontAwesome
        name={item.icon as any}
        size={20}
        color={styles.colors.muted}
      />
      <Text style={styles.menuItemText}>{item.title}</Text>
      <FontAwesome name="chevron-right" size={16} color={styles.colors.muted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AlertComponent />
      {Platform.OS !== 'web' && <MobileHeader />}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <FontAwesome
              name={isEditing ? 'check' : 'edit'}
              size={24}
              color={styles.colors.text}
            />
          </TouchableOpacity>
        </View>

        {renderProfileHeader()}
        {renderStatsCard()}
        {renderAchievements()}

        <View style={styles.menuCard}>
          <Text style={styles.menuTitle}>Configuración</Text>
          {menuItems.map(renderMenuItem)}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={20} color={styles.colors.red} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default withWebLayout(ProfileScreen, { defaultTab: 'profile' });
