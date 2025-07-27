import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('semana');

  const periods = [
    { key: 'semana', label: 'Esta Semana' },
    { key: 'mes', label: 'Este Mes' },
    { key: 'year', label: 'Este Año' },
  ];

  const progressData = {
    semana: {
      workouts: 4,
      targetWorkouts: 5,
      calories: 1200,
      targetCalories: 1500,
      weight: 75.2,
      weightChange: -0.5,
    },
    mes: {
      workouts: 18,
      targetWorkouts: 20,
      calories: 5400,
      targetCalories: 6000,
      weight: 75.2,
      weightChange: -2.1,
    },
    year: {
      workouts: 156,
      targetWorkouts: 200,
      calories: 48600,
      targetCalories: 60000,
      weight: 75.2,
      weightChange: -8.3,
    },
  };

  const currentData = progressData[selectedPeriod as keyof typeof progressData];

  const renderPeriodSelector = () => (
    <View style={styles.periodContainer}>
      {periods.map(period => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.periodButton,
            selectedPeriod === period.key && styles.periodButtonActive,
          ]}
          onPress={() => setSelectedPeriod(period.key)}
        >
          <Text
            style={[
              styles.periodText,
              selectedPeriod === period.key && styles.periodTextActive,
            ]}
          >
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStatCard = (
    title: string,
    value: string | number,
    target?: string | number,
    icon?: string,
    subtitle?: string
  ) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        {icon && (
          <FontAwesome
            name={icon as any}
            size={20}
            color='#FFFFFF'
            style={styles.statIcon}
          />
        )}
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {target && <Text style={styles.statTarget}>Meta: {target}</Text>}
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderProgressChart = () => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Progreso de Entrenamientos</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartBar}>
          <View
            style={[
              styles.chartProgress,
              {
                width: `${(currentData.workouts / currentData.targetWorkouts) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.chartLabel}>
          {currentData.workouts} / {currentData.targetWorkouts} entrenamientos
        </Text>
      </View>

      <Text style={styles.chartTitle}>Progreso de Calorías</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartBar}>
          <View
            style={[
              styles.chartProgress,
              {
                width: `${(currentData.calories / currentData.targetCalories) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.chartLabel}>
          {currentData.calories} / {currentData.targetCalories} calorías
        </Text>
      </View>
    </View>
  );

  const renderWeightProgress = () => (
    <View style={styles.weightCard}>
      <View style={styles.weightHeader}>
        <FontAwesome name='balance-scale' size={24} color='#FFFFFF' />
        <Text style={styles.weightTitle}>Peso Actual</Text>
      </View>
      <Text style={styles.weightValue}>{currentData.weight} kg</Text>
      <View style={styles.weightChange}>
        <FontAwesome
          name={currentData.weightChange < 0 ? 'arrow-down' : 'arrow-up'}
          size={16}
          color={currentData.weightChange < 0 ? '#4CAF50' : '#F44336'}
        />
        <Text
          style={[
            styles.weightChangeText,
            { color: currentData.weightChange < 0 ? '#4CAF50' : '#F44336' },
          ]}
        >
          {Math.abs(currentData.weightChange)} kg
        </Text>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsCard}>
      <Text style={styles.achievementsTitle}>Logros Recientes</Text>
      <View style={styles.achievementsList}>
        <View style={styles.achievementItem}>
          <FontAwesome name='trophy' size={20} color='#FFD700' />
          <Text style={styles.achievementText}>5 días consecutivos</Text>
        </View>
        <View style={styles.achievementItem}>
          <FontAwesome name='fire' size={20} color='#FF6B35' />
          <Text style={styles.achievementText}>1000 calorías quemadas</Text>
        </View>
        <View style={styles.achievementItem}>
          <FontAwesome name='star' size={20} color='#4CAF50' />
          <Text style={styles.achievementText}>Meta semanal cumplida</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mi Progreso</Text>
          <Text style={styles.subtitle}>Seguimiento de tu evolución</Text>
        </View>

        {renderPeriodSelector()}

        <View style={styles.statsGrid}>
          {renderStatCard(
            'Entrenamientos',
            currentData.workouts,
            currentData.targetWorkouts,
            'dumbbell'
          )}
          {renderStatCard(
            'Calorías',
            currentData.calories,
            currentData.targetCalories,
            'fire'
          )}
        </View>

        {renderProgressChart()}
        {renderWeightProgress()}
        {renderAchievements()}

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B0B0B0',
  },
  periodTextActive: {
    color: '#121212',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    width: (width - 60) / 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#B0B0B0',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statTarget: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    marginBottom: 8,
  },
  chartProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  weightCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  weightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  weightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  weightChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightChangeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  achievementsCard: {
    backgroundColor: '#1E1E1E',
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
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 12,
  },
  footer: {
    height: 100,
  },
});
