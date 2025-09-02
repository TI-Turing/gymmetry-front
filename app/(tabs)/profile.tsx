import React, { useEffect, useMemo, useState } from 'react';
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
import {
  dailyHistoryService,
  physicalAssessmentService,
  userService,
} from '@/services';
import type { User } from '@/models/User';
import type { PhysicalAssessment } from '@/models/PhysicalAssessment';
import type { DailyHistory } from '@/models/DailyHistory';
import { normalizeCollection } from '@/utils/objectUtils';

function ProfileScreen() {
  const { user: authUser, userData, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const styles = useThemedStyles(makeProfileStyles);
  const { showAlert, AlertComponent } = useCustomAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [latestAssessment, setLatestAssessment] =
    useState<PhysicalAssessment | null>(null);
  const [dailyHistories, setDailyHistories] = useState<DailyHistory[]>([]);

  const userId = userData?.id || authUser?.id || null;

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        // Perfil básico
        const u = await userService.getUserById(userId);
        if (u?.Success && u.Data) setProfile(u.Data);

        // Última valoración física
        try {
          const pa =
            await physicalAssessmentService.findPhysicalAssessmentsByFields({
              UserId: userId,
            });
          const list = pa?.Success
            ? normalizeCollection<PhysicalAssessment>(pa.Data as unknown)
            : [];
          if (Array.isArray(list) && list.length > 0) {
            // Ordenar por CreatedAt desc
            const sorted = [...list].sort(
              (a, b) =>
                (Date.parse(b.CreatedAt || '') || 0) -
                (Date.parse(a.CreatedAt || '') || 0)
            );
            setLatestAssessment(sorted[0]);
          }
        } catch {}

        // Historial de dailies
        try {
          const dh = await dailyHistoryService.findDailyHistoriesByFields({
            UserId: userId,
          });
          const list = dh?.Success
            ? normalizeCollection<DailyHistory>(dh.Data as unknown)
            : [];
          setDailyHistories(Array.isArray(list) ? list : []);
        } catch {}
      } catch (e) {
        setError('No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const computeStreak = (items: DailyHistory[]): number => {
    if (!items || items.length === 0) return 0;
    const days = new Set(
      items
        .map((h) => h.EndDate || h.StartDate)
        .filter(Boolean)
        .map((iso) => new Date(iso as string).toDateString())
    );
    let streak = 0;
    const d = new Date();
    for (;;) {
      const key = d.toDateString();
      if (days.has(key)) {
        streak += 1;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const computedStats = useMemo(() => {
    const workouts = dailyHistories.length;
    const streak = computeStreak(dailyHistories);
    const weight = latestAssessment?.Weight
      ? Number(latestAssessment.Weight)
      : null;
    const height = latestAssessment?.Height
      ? Number(latestAssessment.Height)
      : null;
    const birth = profile?.BirthDate ? new Date(profile.BirthDate) : null;
    const age = birth
      ? Math.floor(
          (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        )
      : null;
    const joinDate = profile?.CreatedAt
      ? new Date(profile.CreatedAt).toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric',
        })
      : null;
    return { workouts, streak, weight, height, age, joinDate };
  }, [dailyHistories, latestAssessment, profile]);

  const achievements = [
    { icon: 'trophy', title: '100 Entrenamientos', color: styles.colors.tint },
    { icon: 'fire', title: '30 Días Consecutivos', color: styles.colors.tint },
    { icon: 'star', title: 'Meta Mensual', color: styles.colors.tint },
    { icon: 'medal', title: 'Primer PR', color: styles.colors.tint },
  ] as const;

  const noop = () => undefined;
  const menuItems = [
    { icon: 'user', title: 'Editar Perfil', action: () => setIsEditing(true) },
    { icon: 'cog', title: 'Configuración', action: noop },
    { icon: 'chart-line', title: 'Estadísticas', action: noop },
    { icon: 'calendar', title: 'Historial', action: noop },
    { icon: 'question-circle', title: 'Ayuda', action: noop },
    { icon: 'info-circle', title: 'Acerca de', action: noop },
  ] as const;

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
          uri={profile?.ProfileImageUrl || 'https://via.placeholder.com/100'}
          style={styles.avatar}
          deferOnDataSaver={false}
        />
        <TouchableOpacity style={styles.editAvatarButton}>
          <FontAwesome name="camera" size={16} color={styles.colors.text} />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>
        {profile?.Name || profile?.UserName || authUser?.userName || 'Usuario'}
      </Text>
      <Text style={styles.userEmail}>{profile?.Email || authUser?.email}</Text>
      {computedStats.joinDate ? (
        <Text style={styles.joinDate}>
          Miembro desde {computedStats.joinDate}
        </Text>
      ) : null}
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Estadísticas</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{computedStats.workouts}</Text>
          <Text style={styles.statLabel}>Entrenamientos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{computedStats.streak}</Text>
          <Text style={styles.statLabel}>Días seguidos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {computedStats.weight != null ? `${computedStats.weight} kg` : '-'}
          </Text>
          <Text style={styles.statLabel}>Peso actual</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {computedStats.height != null ? `${computedStats.height} cm` : '-'}
          </Text>
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
              name={
                achievement.icon as unknown as React.ComponentProps<
                  typeof FontAwesome
                >['name']
              }
              size={24}
              color={achievement.color}
            />
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMenuItem = (item: (typeof menuItems)[number], index: number) => (
    <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
      <FontAwesome
        name={
          item.icon as unknown as React.ComponentProps<
            typeof FontAwesome
          >['name']
        }
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
        {loading ? (
          <Text style={{ marginHorizontal: 20 }}>Cargando…</Text>
        ) : error ? (
          <Text style={{ marginHorizontal: 20, color: 'red' }}>{error}</Text>
        ) : null}

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
