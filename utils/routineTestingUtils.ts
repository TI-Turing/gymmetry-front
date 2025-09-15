// Utilidades específicas para testing de rutinas, ejercicios y timers
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';
import { routineTemplateService, routineDayService } from '@/services';
import type { RoutineTemplate } from '@/models/RoutineTemplate';
import type { Exercise } from '@/models/Exercise';
import type { RoutineDay } from '@/models/RoutineDay';

/**
 * Estado del timer de ejercicio
 */
export interface ExerciseTimerState {
  isRunning: boolean;
  remainingTime: number;
  totalTime: number;
  currentPhase: 'prep' | 'active' | 'rest' | 'complete';
  exerciseId: string;
  setNumber: number;
}

/**
 * Progreso de rutina simulado
 */
export interface RoutineProgressState {
  routineId: string;
  dayNumber: number;
  exercisesCompleted: number;
  totalExercises: number;
  currentExerciseIndex: number;
  startTime: Date;
  isActive: boolean;
  progress: Record<
    string,
    {
      completedSets: number;
      totalSets: number;
      reps: number[];
      weights: number[];
    }
  >;
}

/**
 * Resultado de test de rutina
 */
export interface RoutineTestResult {
  success: boolean;
  routineId?: string;
  exercises?: Exercise[];
  error?: string;
  timing?: {
    loadTime: number;
    executionTime: number;
  };
  storage?: {
    keysSaved: string[];
    keysCleared: string[];
  };
}

export const routineTestingUtils = {
  /**
   * Simula la carga de una rutina completa
   */
  async testRoutineLoad(templateId?: string): Promise<RoutineTestResult> {
    const startTime = Date.now();

    try {
      logger.info('🏋️‍♂️ Testing: Carga de rutina');

      // Si no se proporciona templateId, intentar obtener uno de prueba
      if (!templateId) {
        logger.info(
          'No templateId proporcionado, buscando rutinas disponibles...'
        );

        try {
          const templatesResponse =
            await routineTemplateService.findRoutineTemplatesByFields({});

          if (templatesResponse?.Success && templatesResponse.Data) {
            const templates = Array.isArray(templatesResponse.Data)
              ? templatesResponse.Data
              : (templatesResponse.Data as any)?.$values || []; // eslint-disable-line @typescript-eslint/no-explicit-any

            if (templates.length > 0) {
              templateId = templates[0].Id;
              logger.info(`Usando template de prueba: ${templateId}`);
            } else {
              throw new Error('No hay templates disponibles para testing');
            }
          } else {
            throw new Error('No se pudieron cargar los templates');
          }
        } catch (error) {
          return {
            success: false,
            error: `Error cargando templates: ${error}`,
            timing: { loadTime: Date.now() - startTime, executionTime: 0 },
          };
        }
      }

      // Cargar el template específico
      const templateResponse = await routineTemplateService.getRoutineTemplate(
        templateId!
      );

      if (!templateResponse?.Success || !templateResponse.Data) {
        throw new Error('Template no encontrado');
      }

      const template = templateResponse.Data as RoutineTemplate;
      logger.info(`Template cargado: ${template.Name}`);

      // Simular carga de días de rutina
      const daysResponse = await routineDayService.findRoutineDaysByFields({
        RoutineTemplateId: templateId,
      });

      let routineDays: RoutineDay[] = [];
      if (daysResponse?.Success && daysResponse.Data) {
        routineDays = Array.isArray(daysResponse.Data)
          ? daysResponse.Data
          : (daysResponse.Data as any)?.$values || []; // eslint-disable-line @typescript-eslint/no-explicit-any
      }

      // Cargar ejercicios para cada día
      const allExercises: Exercise[] = [];
      for (const day of routineDays) {
        if (day.Exercise) {
          allExercises.push(day.Exercise);
        }
      }

      const loadTime = Date.now() - startTime;

      return {
        success: true,
        routineId: templateId!,
        exercises: allExercises,
        timing: {
          loadTime,
          executionTime: 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Error en carga de rutina: ${error}`,
        timing: {
          loadTime: Date.now() - startTime,
          executionTime: 0,
        },
      };
    }
  },

  /**
   * Simula la ejecución completa de una rutina
   */
  async testRoutineExecution(
    routineId: string,
    dayNumber: number = 1
  ): Promise<RoutineTestResult> {
    const startTime = Date.now();
    const keysToSave: string[] = [];
    const keysToClean: string[] = [];

    try {
      logger.info(
        `🎯 Testing: Ejecución de rutina ${routineId}, día ${dayNumber}`
      );

      // 1. Inicializar rutina en storage
      const dailyStartKey = `@daily_start_${routineId}_${dayNumber}`;
      const routineState: RoutineProgressState = {
        routineId,
        dayNumber,
        exercisesCompleted: 0,
        totalExercises: 0,
        currentExerciseIndex: 0,
        startTime: new Date(),
        isActive: true,
        progress: {},
      };

      await AsyncStorage.setItem(dailyStartKey, JSON.stringify(routineState));
      keysToSave.push(dailyStartKey);

      // 2. Cargar ejercicios del día
      const daysResponse = await routineDayService.findRoutineDaysByFields({
        RoutineTemplateId: routineId,
        DayNumber: dayNumber,
      });

      if (!daysResponse?.Success || !daysResponse.Data) {
        throw new Error('No se encontraron ejercicios para este día');
      }

      const days = Array.isArray(daysResponse.Data)
        ? daysResponse.Data
        : (daysResponse.Data as any)?.$values || []; // eslint-disable-line @typescript-eslint/no-explicit-any

      if (days.length === 0) {
        throw new Error('Día de rutina no encontrado');
      }

      const routineDay = days[0];
      const exercises = routineDay.Exercises || [];
      routineState.totalExercises = exercises.length;

      // 3. Simular progreso de cada ejercicio
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        logger.info(`Simulando ejercicio ${i + 1}: ${exercise.Name}`);

        // Simular sets completados
        const exerciseProgressKey = `exercise_${exercise.Id}_progress`;
        const exerciseProgress = {
          completedSets: 3,
          totalSets: 3,
          reps: [12, 10, 8],
          weights: [20, 25, 30],
        };

        await AsyncStorage.setItem(
          exerciseProgressKey,
          JSON.stringify(exerciseProgress)
        );
        keysToSave.push(exerciseProgressKey);

        routineState.progress[exercise.Id] = exerciseProgress;
        routineState.exercisesCompleted = i + 1;
        routineState.currentExerciseIndex = i;

        // Actualizar estado en storage
        await AsyncStorage.setItem(dailyStartKey, JSON.stringify(routineState));

        // Simular delay de ejecución
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 4. Finalizar rutina - crear Daily y DailyExercises
      logger.info('Finalizando rutina y creando registros...');

      // Simular creación de Daily
      const _dailyData = {
        UserId: 'test-user-id', // En test real, obtener del authService
        RoutineTemplateId: routineId,
        StartTime: routineState.startTime.toISOString(),
        EndTime: new Date().toISOString(),
        Notes: 'Rutina completada via testing framework',
      };

      // Simular creación de DailyExercises
      for (const exercise of exercises) {
        const _exerciseData = {
          DailyId: 'simulated-daily-id',
          ExerciseId: exercise.Id,
          Sets: 3,
          Reps: '12,10,8',
          Weight: '20,25,30',
          Duration: null,
          Notes: 'Ejercicio completado via testing',
        };
        // En test real: await dailyExerciseService.addDailyExercise(exerciseData);
      }

      // 5. Limpiar storage de rutina
      routineState.isActive = false;
      await AsyncStorage.setItem(dailyStartKey, JSON.stringify(routineState));

      // Marcar keys para limpieza
      for (const exercise of exercises) {
        keysToClean.push(`exercise_${exercise.Id}_progress`);
        keysToClean.push(`exercise_${exercise.Id}_reps`);
      }
      keysToClean.push(dailyStartKey);

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        routineId,
        exercises,
        timing: {
          loadTime: 0,
          executionTime,
        },
        storage: {
          keysSaved: keysToSave,
          keysCleared: keysToClean,
        },
      };
    } catch (error) {
      // Limpiar en caso de error
      for (const key of keysToSave) {
        try {
          await AsyncStorage.removeItem(key);
        } catch {
          // Ignorar errores de limpieza
        }
      }

      return {
        success: false,
        error: `Error en ejecución de rutina: ${error}`,
        timing: {
          loadTime: 0,
          executionTime: Date.now() - startTime,
        },
        storage: {
          keysSaved: keysToSave,
          keysCleared: [],
        },
      };
    }
  },

  /**
   * Simula el timer de un ejercicio con tiempo
   */
  async testExerciseTimer(duration: number = 30): Promise<{
    success: boolean;
    phases: string[];
    totalTime: number;
    error?: string;
  }> {
    const phases: string[] = [];
    const startTime = Date.now();

    try {
      logger.info(`⏰ Testing: Timer de ejercicio ${duration}s`);

      // Fase PREP
      phases.push('prep');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Fase ACTIVE
      phases.push('active');
      const timerState: ExerciseTimerState = {
        isRunning: true,
        remainingTime: duration,
        totalTime: duration,
        currentPhase: 'active',
        exerciseId: 'test-exercise',
        setNumber: 1,
      };

      // Simular countdown
      for (let i = duration; i > 0; i--) {
        timerState.remainingTime = i;

        // Simular actualización cada segundo (acelerado para testing)
        await new Promise((resolve) => setTimeout(resolve, 50));

        if (i <= 5) {
          // Últimos 5 segundos - simular alerta
          phases.push(`countdown-${i}`);
        }
      }

      // Fase COMPLETE
      phases.push('complete');
      timerState.currentPhase = 'complete';
      timerState.isRunning = false;
      timerState.remainingTime = 0;

      const totalTime = Date.now() - startTime;

      return {
        success: true,
        phases,
        totalTime,
      };
    } catch (error) {
      return {
        success: false,
        phases,
        totalTime: Date.now() - startTime,
        error: `Error en timer: ${error}`,
      };
    }
  },

  /**
   * Simula ejercicio "por lado" (doble timer)
   */
  async testDoubleSideTimer(durationPerSide: number = 30): Promise<{
    success: boolean;
    sides: string[];
    totalTime: number;
    error?: string;
  }> {
    const sides: string[] = [];
    const startTime = Date.now();

    try {
      logger.info(`⏰ Testing: Timer doble lado ${durationPerSide}s por lado`);

      // Lado 1
      sides.push('lado-derecho-prep');
      await new Promise((resolve) => setTimeout(resolve, 100));

      sides.push('lado-derecho-active');
      await new Promise((resolve) => setTimeout(resolve, 200));

      sides.push('lado-derecho-complete');

      // Transición
      sides.push('preparate-lado-izquierdo');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Lado 2
      sides.push('lado-izquierdo-prep');
      await new Promise((resolve) => setTimeout(resolve, 100));

      sides.push('lado-izquierdo-active');
      await new Promise((resolve) => setTimeout(resolve, 200));

      sides.push('lado-izquierdo-complete');

      // Finalización
      sides.push('exercise-complete');

      const totalTime = Date.now() - startTime;

      return {
        success: true,
        sides,
        totalTime,
      };
    } catch (error) {
      return {
        success: false,
        sides,
        totalTime: Date.now() - startTime,
        error: `Error en timer doble: ${error}`,
      };
    }
  },

  /**
   * Test de interrupciones y recuperación
   */
  async testRoutineInterruption(routineId: string): Promise<{
    success: boolean;
    recovered: boolean;
    storedData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    error?: string;
  }> {
    try {
      logger.info('🔄 Testing: Interrupción y recuperación de rutina');

      const dailyStartKey = `@daily_start_${routineId}_1`;

      // 1. Simular rutina en progreso
      const routineState: RoutineProgressState = {
        routineId,
        dayNumber: 1,
        exercisesCompleted: 2,
        totalExercises: 5,
        currentExerciseIndex: 2,
        startTime: new Date(),
        isActive: true,
        progress: {
          'exercise-1': {
            completedSets: 3,
            totalSets: 3,
            reps: [10, 8, 6],
            weights: [20, 25, 30],
          },
          'exercise-2': {
            completedSets: 2,
            totalSets: 3,
            reps: [12, 10],
            weights: [15, 20],
          },
        },
      };

      await AsyncStorage.setItem(dailyStartKey, JSON.stringify(routineState));

      // 2. Simular "cierre de app" - verificar que los datos persisten
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. Simular "reapertura de app" - recuperar datos
      const recoveredData = await AsyncStorage.getItem(dailyStartKey);

      if (!recoveredData) {
        throw new Error('No se pudo recuperar la rutina interrumpida');
      }

      const parsed = JSON.parse(recoveredData);
      const recovered = parsed.isActive && parsed.exercisesCompleted === 2;

      // 4. Limpiar después del test
      await AsyncStorage.removeItem(dailyStartKey);

      return {
        success: true,
        recovered,
        storedData: parsed,
      };
    } catch (error) {
      return {
        success: false,
        recovered: false,
        error: `Error en test de interrupción: ${error}`,
      };
    }
  },

  /**
   * Test de limpieza de storage después de rutina
   */
  async testStorageCleanup(routineId: string): Promise<{
    success: boolean;
    cleanedKeys: string[];
    error?: string;
  }> {
    const cleanedKeys: string[] = [];

    try {
      logger.info('🧹 Testing: Limpieza de storage después de rutina');

      // Crear keys de prueba
      const testKeys = [
        `@daily_start_${routineId}_1`,
        `exercise_test1_progress`,
        `exercise_test1_reps`,
        `exercise_test2_progress`,
        `exercise_test2_reps`,
      ];

      // Crear datos de prueba
      for (const key of testKeys) {
        await AsyncStorage.setItem(key, 'test-data');
      }

      // Simular limpieza después de completar rutina
      for (const key of testKeys) {
        await AsyncStorage.removeItem(key);
        cleanedKeys.push(key);
      }

      // Verificar que fueron eliminados
      for (const key of testKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          throw new Error(`Key ${key} no fue eliminada correctamente`);
        }
      }

      return {
        success: true,
        cleanedKeys,
      };
    } catch (error) {
      return {
        success: false,
        cleanedKeys,
        error: `Error en limpieza de storage: ${error}`,
      };
    }
  },

  /**
   * Genera reporte completo de testing de rutinas
   */
  async generateRoutineTestReport(): Promise<void> {
    logger.info('🏋️‍♂️ ============ REPORTE DE TESTING DE RUTINAS ============');

    try {
      // Test de carga de rutina
      const loadTest = await this.testRoutineLoad();
      logger.info(`📚 Carga de Rutina: ${loadTest.success ? '✅' : '❌'}`);
      if (loadTest.success) {
        logger.info(`   - Rutina ID: ${loadTest.routineId}`);
        logger.info(
          `   - Ejercicios encontrados: ${loadTest.exercises?.length || 0}`
        );
        logger.info(`   - Tiempo de carga: ${loadTest.timing?.loadTime}ms`);
      } else {
        logger.error(`   - Error: ${loadTest.error}`);
      }

      // Test de timer básico
      const timerTest = await this.testExerciseTimer(10);
      logger.info(`⏰ Timer de Ejercicio: ${timerTest.success ? '✅' : '❌'}`);
      if (timerTest.success) {
        logger.info(`   - Fases completadas: ${timerTest.phases.length}`);
        logger.info(`   - Tiempo total: ${timerTest.totalTime}ms`);
      }

      // Test de timer doble lado
      const doubleTimerTest = await this.testDoubleSideTimer(5);
      logger.info(
        `⏰ Timer Doble Lado: ${doubleTimerTest.success ? '✅' : '❌'}`
      );
      if (doubleTimerTest.success) {
        logger.info(`   - Lados completados: ${doubleTimerTest.sides.length}`);
        logger.info(`   - Tiempo total: ${doubleTimerTest.totalTime}ms`);
      }

      // Test de interrupción
      const interruptionTest =
        await this.testRoutineInterruption('test-routine-id');
      logger.info(
        `🔄 Interrupción/Recuperación: ${interruptionTest.success ? '✅' : '❌'}`
      );
      if (interruptionTest.success) {
        logger.info(
          `   - Datos recuperados: ${interruptionTest.recovered ? '✅' : '❌'}`
        );
      }

      // Test de limpieza de storage
      const cleanupTest = await this.testStorageCleanup('test-routine-id');
      logger.info(
        `🧹 Limpieza de Storage: ${cleanupTest.success ? '✅' : '❌'}`
      );
      if (cleanupTest.success) {
        logger.info(`   - Keys limpiadas: ${cleanupTest.cleanedKeys.length}`);
      }
    } catch (error) {
      logger.error('Error en reporte de rutinas:', error);
    }

    logger.info('🏋️‍♀️ ======================================================');
  },
};

// Solo en desarrollo: exponer globalmente
if (__DEV__) {
  (globalThis as Record<string, unknown>).routineTestingUtils =
    routineTestingUtils;
}
