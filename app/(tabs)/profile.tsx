import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { withWebLayout } from '@/components/layout/withWebLayout';

function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const userStats = {
    workouts: 156,
    streak: 12,
    weight: 75.2,
    height: 175,
    age: 28,
    joinDate: 'Enero 2024',
  };

  const achievements = [
    { icon: 'trophy', title: '100 Entrenamientos', color: '#FFD700' },
    { icon: 'fire', title: '30 Días Consecutivos', color: '#FF6B35' },
    { icon: 'star', title: 'Meta Mensual', color: '#4CAF50' },
    { icon: 'medal', title: 'Primer PR', color: '#9C27B0' },
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
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar Sesión', style: 'destructive', onPress: logout },
    ]);
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatarButton}>
          <FontAwesome name='camera' size={16} color='#FFFFFF' />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{user?.userName || 'Usuario'}</Text>
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
      <FontAwesome name={item.icon as any} size={20} color='#B0B0B0' />
      <Text style={styles.menuItemText}>{item.title}</Text>
      <FontAwesome name='chevron-right' size={16} color='#B0B0B0' />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
              color='#FFFFFF'
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
          <FontAwesome name='sign-out' size={20} color='#FF6B6B' />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

export default withWebLayout(ProfileScreen, { defaultTab: 'profile' });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#121212',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  statsCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  achievementsCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#333333',
    borderRadius: 12,
  },
  achievementTitle: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 8,
  },
  menuCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 12,
  },
  footer: {
    height: 100,
  },
});
