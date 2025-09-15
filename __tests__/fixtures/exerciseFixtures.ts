// __tests__/fixtures/exerciseFixtures.ts
export const mockExercises = {
  pushUps: {
    Id: '1',
    Name: 'Push-ups',
    Description:
      'Classic upper body exercise targeting chest, shoulders, and triceps',
    Instructions: 'Start in plank position, lower body to ground, push back up',
    CategoryExerciseId: 'upper-body',
    CategoryName: 'Upper Body',
    MuscleGroups: ['chest', 'shoulders', 'triceps'],
    Difficulty: 'Beginner',
    Equipment: [],
    ImageUrl: 'https://example.com/pushups.jpg',
    VideoUrl: 'https://example.com/pushups.mp4',
    EstimatedDuration: 30,
    CaloriesPerMinute: 7,
    IsActive: true,
    CreatedAt: '2024-01-01T00:00:00Z',
    UpdatedAt: '2024-01-01T00:00:00Z',
  },

  squats: {
    Id: '2',
    Name: 'Squats',
    Description:
      'Lower body exercise targeting quadriceps, glutes, and hamstrings',
    Instructions:
      'Stand with feet shoulder-width apart, lower into sitting position, return to standing',
    CategoryExerciseId: 'lower-body',
    CategoryName: 'Lower Body',
    MuscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    Difficulty: 'Beginner',
    Equipment: [],
    ImageUrl: 'https://example.com/squats.jpg',
    VideoUrl: 'https://example.com/squats.mp4',
    EstimatedDuration: 45,
    CaloriesPerMinute: 8,
    IsActive: true,
    CreatedAt: '2024-01-01T00:00:00Z',
    UpdatedAt: '2024-01-01T00:00:00Z',
  },

  benchPress: {
    Id: '3',
    Name: 'Bench Press',
    Description: 'Upper body strength exercise using barbell or dumbbells',
    Instructions:
      'Lie on bench, grip bar wider than shoulders, lower to chest, press up',
    CategoryExerciseId: 'upper-body',
    CategoryName: 'Upper Body',
    MuscleGroups: ['chest', 'shoulders', 'triceps'],
    Difficulty: 'Intermediate',
    Equipment: ['barbell', 'bench'],
    ImageUrl: 'https://example.com/benchpress.jpg',
    VideoUrl: 'https://example.com/benchpress.mp4',
    EstimatedDuration: 60,
    CaloriesPerMinute: 10,
    IsActive: true,
    CreatedAt: '2024-01-01T00:00:00Z',
    UpdatedAt: '2024-01-01T00:00:00Z',
  },

  plank: {
    Id: '4',
    Name: 'Plank',
    Description: 'Core strengthening isometric exercise',
    Instructions:
      'Hold push-up position with straight body line for specified time',
    CategoryExerciseId: 'core',
    CategoryName: 'Core',
    MuscleGroups: ['abs', 'core', 'shoulders'],
    Difficulty: 'Beginner',
    Equipment: [],
    ImageUrl: 'https://example.com/plank.jpg',
    VideoUrl: 'https://example.com/plank.mp4',
    EstimatedDuration: 60,
    CaloriesPerMinute: 5,
    IsActive: true,
    CreatedAt: '2024-01-01T00:00:00Z',
    UpdatedAt: '2024-01-01T00:00:00Z',
  },

  deadlift: {
    Id: '5',
    Name: 'Deadlift',
    Description: 'Full body compound exercise focusing on posterior chain',
    Instructions:
      'Stand over bar, grip bar, lift by extending hips and knees simultaneously',
    CategoryExerciseId: 'full-body',
    CategoryName: 'Full Body',
    MuscleGroups: ['hamstrings', 'glutes', 'back', 'traps'],
    Difficulty: 'Advanced',
    Equipment: ['barbell', 'weight plates'],
    ImageUrl: 'https://example.com/deadlift.jpg',
    VideoUrl: 'https://example.com/deadlift.mp4',
    EstimatedDuration: 90,
    CaloriesPerMinute: 12,
    IsActive: true,
    CreatedAt: '2024-01-01T00:00:00Z',
    UpdatedAt: '2024-01-01T00:00:00Z',
  },
};

export const mockExerciseCategories = {
  upperBody: {
    Id: 'upper-body',
    Name: 'Upper Body',
    Description: 'Exercises targeting upper body muscles',
    Icon: 'arm-flex',
    Color: '#ff6b35',
    IsActive: true,
  },

  lowerBody: {
    Id: 'lower-body',
    Name: 'Lower Body',
    Description: 'Exercises targeting lower body muscles',
    Icon: 'leg',
    Color: '#4ecdc4',
    IsActive: true,
  },

  core: {
    Id: 'core',
    Name: 'Core',
    Description: 'Exercises targeting core and abdominal muscles',
    Icon: 'target',
    Color: '#45b7d1',
    IsActive: true,
  },

  cardio: {
    Id: 'cardio',
    Name: 'Cardio',
    Description: 'Cardiovascular and endurance exercises',
    Icon: 'heart',
    Color: '#f39c12',
    IsActive: true,
  },

  fullBody: {
    Id: 'full-body',
    Name: 'Full Body',
    Description: 'Compound exercises working multiple muscle groups',
    Icon: 'body',
    Color: '#9b59b6',
    IsActive: true,
  },
};

export const mockRoutineExercises = {
  beginnerWorkout: [
    {
      Id: '1',
      ExerciseId: '1',
      RoutineId: 'routine-1',
      Sets: 3,
      Reps: '10',
      Weight: null,
      Duration: '30s',
      RestTime: '60s',
      Order: 1,
      Notes: 'Keep good form',
      Exercise: mockExercises.pushUps,
    },
    {
      Id: '2',
      ExerciseId: '2',
      RoutineId: 'routine-1',
      Sets: 3,
      Reps: '15',
      Weight: null,
      Duration: null,
      RestTime: '45s',
      Order: 2,
      Notes: 'Full range of motion',
      Exercise: mockExercises.squats,
    },
    {
      Id: '3',
      ExerciseId: '4',
      RoutineId: 'routine-1',
      Sets: 3,
      Reps: null,
      Weight: null,
      Duration: '30s',
      RestTime: '30s',
      Order: 3,
      Notes: 'Hold steady position',
      Exercise: mockExercises.plank,
    },
  ],

  strengthWorkout: [
    {
      Id: '4',
      ExerciseId: '3',
      RoutineId: 'routine-2',
      Sets: 4,
      Reps: '8',
      Weight: '60kg',
      Duration: null,
      RestTime: '120s',
      Order: 1,
      Notes: 'Progressive overload',
      Exercise: mockExercises.benchPress,
    },
    {
      Id: '5',
      ExerciseId: '5',
      RoutineId: 'routine-2',
      Sets: 4,
      Reps: '6',
      Weight: '80kg',
      Duration: null,
      RestTime: '180s',
      Order: 2,
      Notes: 'Focus on form over weight',
      Exercise: mockExercises.deadlift,
    },
  ],
};

export const mockApiResponses = {
  getAllExercisesSuccess: {
    Success: true,
    Data: Object.values(mockExercises),
    Message: 'Exercises retrieved successfully',
    StatusCode: 200,
  },

  getExerciseByIdSuccess: {
    Success: true,
    Data: mockExercises.pushUps,
    Message: 'Exercise found',
    StatusCode: 200,
  },

  exerciseNotFound: {
    Success: false,
    Data: null,
    Message: 'Exercise not found',
    StatusCode: 404,
  },

  createExerciseSuccess: {
    Success: true,
    Data: {
      ...mockExercises.pushUps,
      Id: 'new-exercise-id',
    },
    Message: 'Exercise created successfully',
    StatusCode: 201,
  },

  validationError: {
    Success: false,
    Data: null,
    Message: 'Validation failed',
    StatusCode: 400,
    Errors: {
      Name: ['Exercise name is required'],
      Description: ['Description must be at least 10 characters'],
    },
  },
};

export const createMockExercise = (
  overrides: Partial<typeof mockExercises.pushUps> = {}
) => {
  return {
    ...mockExercises.pushUps,
    ...overrides,
  };
};

export const createMockRoutineExercise = (
  overrides: Partial<(typeof mockRoutineExercises.beginnerWorkout)[0]> = {}
) => {
  return {
    ...mockRoutineExercises.beginnerWorkout[0],
    ...overrides,
  };
};
