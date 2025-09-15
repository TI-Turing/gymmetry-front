// __tests__/utils/logger.test.ts
/* eslint-disable no-console */
import { logger, setLoggerConfig } from '../../utils/logger';

// Mock console methods
const mockConsole = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

describe('Logger Utils', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(mockConsole.log);
    jest.spyOn(console, 'warn').mockImplementation(mockConsole.warn);
    jest.spyOn(console, 'error').mockImplementation(mockConsole.error);
    jest.spyOn(console, 'info').mockImplementation(mockConsole.info);
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
  });

  describe('logger methods', () => {
    it('should log debug messages', () => {
      logger.debug('Debug message', { data: 'test' });
      expect(console.log).toHaveBeenCalledWith('Debug message', {
        data: 'test',
      });
    });

    it('should log info messages', () => {
      logger.info('Info message', { data: 'test' });
      expect(console.info).toHaveBeenCalledWith('Info message', {
        data: 'test',
      });
    });

    it('should log warn messages', () => {
      logger.warn('Warning message', { data: 'test' });
      expect(console.warn).toHaveBeenCalledWith('Warning message', {
        data: 'test',
      });
    });

    it('should log error messages', () => {
      logger.error('Error message', { error: 'test error' });
      expect(console.error).toHaveBeenCalledWith('Error message', {
        error: 'test error',
      });
    });

    it('should handle messages without additional data', () => {
      logger.info('Simple message');
      expect(console.info).toHaveBeenCalledWith('Simple message');
    });

    it('should handle multiple arguments', () => {
      logger.debug('Message', 'arg1', 'arg2', { data: 'test' });
      expect(console.log).toHaveBeenCalledWith('Message', 'arg1', 'arg2', {
        data: 'test',
      });
    });
  });

  describe('setLoggerConfig', () => {
    it('should configure logger with debug level', () => {
      setLoggerConfig('debug');

      logger.debug('Debug test');
      logger.info('Info test');
      logger.warn('Warn test');
      logger.error('Error test');

      expect(console.log).toHaveBeenCalledWith('Debug test');
      expect(console.info).toHaveBeenCalledWith('Info test');
      expect(console.warn).toHaveBeenCalledWith('Warn test');
      expect(console.error).toHaveBeenCalledWith('Error test');
    });

    it('should configure logger with info level', () => {
      setLoggerConfig('info');

      logger.debug('Debug test');
      logger.info('Info test');
      logger.warn('Warn test');
      logger.error('Error test');

      // Debug should be filtered out in info level
      expect(console.log).not.toHaveBeenCalledWith('Debug test');
      expect(console.info).toHaveBeenCalledWith('Info test');
      expect(console.warn).toHaveBeenCalledWith('Warn test');
      expect(console.error).toHaveBeenCalledWith('Error test');
    });

    it('should configure logger with warn level', () => {
      setLoggerConfig('warn');

      logger.debug('Debug test');
      logger.info('Info test');
      logger.warn('Warn test');
      logger.error('Error test');

      // Debug and info should be filtered out in warn level
      expect(console.log).not.toHaveBeenCalledWith('Debug test');
      expect(console.info).not.toHaveBeenCalledWith('Info test');
      expect(console.warn).toHaveBeenCalledWith('Warn test');
      expect(console.error).toHaveBeenCalledWith('Error test');
    });

    it('should configure logger with error level', () => {
      setLoggerConfig('error');

      logger.debug('Debug test');
      logger.info('Info test');
      logger.warn('Warn test');
      logger.error('Error test');

      // Only error should be logged in error level
      expect(console.log).not.toHaveBeenCalledWith('Debug test');
      expect(console.info).not.toHaveBeenCalledWith('Info test');
      expect(console.warn).not.toHaveBeenCalledWith('Warn test');
      expect(console.error).toHaveBeenCalledWith('Error test');
    });

    it('should configure logger with silent level', () => {
      setLoggerConfig('silent');

      logger.debug('Debug test');
      logger.info('Info test');
      logger.warn('Warn test');
      logger.error('Error test');

      // Nothing should be logged in silent level
      expect(console.log).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined messages', () => {
      logger.info(null);
      logger.info(undefined);

      expect(console.info).toHaveBeenCalledWith(null);
      expect(console.info).toHaveBeenCalledWith(undefined);
    });

    it('should handle complex objects', () => {
      const complexObject = {
        nested: {
          array: [1, 2, 3],
          func: () => 'test',
        },
        date: new Date('2024-01-01'),
      };

      logger.debug('Complex object test', complexObject);
      expect(console.log).toHaveBeenCalledWith(
        'Complex object test',
        complexObject
      );
    });

    it('should handle error objects', () => {
      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      logger.error('Error occurred', error);
      expect(console.error).toHaveBeenCalledWith('Error occurred', error);
    });
  });
});
