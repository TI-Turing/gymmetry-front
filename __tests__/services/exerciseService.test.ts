// __tests__/services/exerciseService.test.ts
import { exerciseService } from '../../services/exerciseService';
import { apiService } from '../../services/apiService';

// Mock dependencies
jest.mock('../../services/apiService');

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('Exercise Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addExercise', () => {
    it('should add exercise successfully', async () => {
      const mockResponse = {
        Success: true,
        Data: {
          Id: '1',
          Name: 'Push-ups',
          Description: 'Upper body exercise',
          CategoryExerciseId: 'cat1',
        },
        Message: 'Exercise added',
        StatusCode: 201,
      };

      mockApiService.post.mockResolvedValue(mockResponse);

      const exerciseData = {
        Name: 'Push-ups',
        Description: 'Upper body exercise',
        CategoryExerciseId: 'cat1',
      };

      const result = await exerciseService.addExercise(exerciseData);

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/Exercise',
        exerciseData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle add exercise error', async () => {
      const error = new Error('Validation failed');
      mockApiService.post.mockRejectedValue(error);

      const exerciseData = {
        Name: '',
        Description: 'Invalid exercise',
        CategoryExerciseId: 'cat1',
      };

      await expect(exerciseService.addExercise(exerciseData)).rejects.toThrow(
        'Validation failed'
      );
    });
  });

  describe('getExerciseById', () => {
    it('should get exercise by ID successfully', async () => {
      const mockResponse = {
        Success: true,
        Data: {
          Id: '1',
          Name: 'Push-ups',
          Description: 'Upper body exercise',
          CategoryExerciseId: 'cat1',
          Instructions: 'Do push-ups properly',
        },
        Message: 'Exercise found',
        StatusCode: 200,
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await exerciseService.getExerciseById('1');

      expect(mockApiService.get).toHaveBeenCalledWith('/Exercise/1');
      expect(result).toEqual(mockResponse);
    });

    it('should handle exercise not found', async () => {
      const mockResponse = {
        Success: false,
        Data: null,
        Message: 'Exercise not found',
        StatusCode: 404,
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await exerciseService.getExerciseById('999');

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAllExercises', () => {
    it('should get all exercises successfully', async () => {
      const mockResponse = {
        Success: true,
        Data: [
          {
            Id: '1',
            Name: 'Push-ups',
            Description: 'Upper body exercise',
            CategoryExerciseId: 'cat1',
          },
          {
            Id: '2',
            Name: 'Squats',
            Description: 'Lower body exercise',
            CategoryExerciseId: 'cat2',
          },
        ],
        Message: 'Exercises retrieved',
        StatusCode: 200,
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await exerciseService.getAllExercises();

      expect(mockApiService.get).toHaveBeenCalledWith('/Exercise');
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty exercise list', async () => {
      const mockResponse = {
        Success: true,
        Data: [],
        Message: 'No exercises found',
        StatusCode: 200,
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await exerciseService.getAllExercises();

      expect(result).toEqual(mockResponse);
      expect(result.Data).toHaveLength(0);
    });
  });

  describe('findExercisesByFields', () => {
    it('should find exercises by category', async () => {
      const mockResponse = {
        Success: true,
        Data: [
          {
            Id: '1',
            Name: 'Push-ups',
            Description: 'Upper body exercise',
            CategoryExerciseId: 'cat1',
          },
        ],
        Message: 'Exercises found',
        StatusCode: 200,
      };

      mockApiService.post.mockResolvedValue(mockResponse);

      const searchFields = { CategoryExerciseId: 'cat1' };
      const result = await exerciseService.findExercisesByFields(searchFields);

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/Exercise/find',
        searchFields
      );
      expect(result).toEqual(mockResponse);
    });

    it('should find exercises by name', async () => {
      const mockResponse = {
        Success: true,
        Data: [
          {
            Id: '1',
            Name: 'Push-ups',
            Description: 'Upper body exercise',
            CategoryExerciseId: 'cat1',
          },
        ],
        Message: 'Exercises found',
        StatusCode: 200,
      };

      mockApiService.post.mockResolvedValue(mockResponse);

      const searchFields = { Name: 'Push' };
      const result = await exerciseService.findExercisesByFields(searchFields);

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/Exercise/find',
        searchFields
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle no matches found', async () => {
      const mockResponse = {
        Success: true,
        Data: [],
        Message: 'No exercises match criteria',
        StatusCode: 200,
      };

      mockApiService.post.mockResolvedValue(mockResponse);

      const searchFields = { Name: 'NonExistentExercise' };
      const result = await exerciseService.findExercisesByFields(searchFields);

      expect(result).toEqual(mockResponse);
      expect(result.Data).toHaveLength(0);
    });
  });

  describe('updateExercise', () => {
    it('should update exercise successfully', async () => {
      const mockResponse = {
        Success: true,
        Data: {
          Id: '1',
          Name: 'Modified Push-ups',
          Description: 'Updated description',
          CategoryExerciseId: 'cat1',
        },
        Message: 'Exercise updated',
        StatusCode: 200,
      };

      mockApiService.put.mockResolvedValue(mockResponse);

      const exerciseData = {
        Id: '1',
        Name: 'Modified Push-ups',
        Description: 'Updated description',
        CategoryExerciseId: 'cat1',
      };

      const result = await exerciseService.updateExercise('1', exerciseData);

      expect(mockApiService.put).toHaveBeenCalledWith(
        '/Exercise/1',
        exerciseData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle update validation error', async () => {
      const error = new Error('Validation failed');
      mockApiService.put.mockRejectedValue(error);

      const exerciseData = {
        Id: '1',
        Name: '',
        Description: 'Invalid name',
        CategoryExerciseId: 'cat1',
      };

      await expect(
        exerciseService.updateExercise('1', exerciseData)
      ).rejects.toThrow('Validation failed');
    });
  });

  describe('deleteExercise', () => {
    it('should delete exercise successfully', async () => {
      const mockResponse = {
        Success: true,
        Data: null,
        Message: 'Exercise deleted',
        StatusCode: 200,
      };

      mockApiService.delete.mockResolvedValue(mockResponse);

      const result = await exerciseService.deleteExercise('1');

      expect(mockApiService.delete).toHaveBeenCalledWith('/Exercise/1');
      expect(result).toEqual(mockResponse);
    });

    it('should handle delete non-existent exercise', async () => {
      const mockResponse = {
        Success: false,
        Data: null,
        Message: 'Exercise not found',
        StatusCode: 404,
      };

      mockApiService.delete.mockResolvedValue(mockResponse);

      const result = await exerciseService.deleteExercise('999');

      expect(result).toEqual(mockResponse);
    });

    it('should handle delete with dependencies error', async () => {
      const error = new Error('Cannot delete: exercise is in use');
      mockApiService.delete.mockRejectedValue(error);

      await expect(exerciseService.deleteExercise('1')).rejects.toThrow(
        'Cannot delete: exercise is in use'
      );
    });
  });
});
