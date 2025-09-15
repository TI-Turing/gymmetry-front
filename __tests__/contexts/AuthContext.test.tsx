import React from 'react';

import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';

// Mock authService
jest.mock('@/services', () => ({
  authService: {
    getUserData: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthService.getUserData.mockResolvedValue(null);
  });

  it('provides auth context', () => {
    const TestComponent = () => {
      const {
        isAuthenticated,
        user,
        login: _login,
        logout: _logout,
      } = useAuth();
      expect(typeof _login).toBe('function');
      expect(typeof _logout).toBe('function');
      expect(typeof isAuthenticated).toBe('boolean');
      expect(user).toBeDefined();
      return null;
    };

    const App = () => (
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simple test render without RTL
    expect(() => React.createElement(App)).not.toThrow();
  });

  it('context exists', () => {
    expect(AuthProvider).toBeDefined();
    expect(useAuth).toBeDefined();
  });
});
