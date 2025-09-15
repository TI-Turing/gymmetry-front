// __tests__/fixtures/userFixtures.ts
import { UserData } from '../../services/authService';

export const mockUsers = {
  basicUser: {
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
    roles: ['user'],
    isOwner: false,
  } as UserData,

  premiumUser: {
    id: '2',
    email: 'premium@example.com',
    name: 'Jane Smith',
    roles: ['user', 'premium'],
    isOwner: false,
  } as UserData,

  adminUser: {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    roles: ['user', 'admin'],
    isOwner: false,
  } as UserData,

  gymOwner: {
    id: '4',
    email: 'owner@gym.com',
    name: 'Gym Owner',
    roles: ['user', 'owner'],
    isOwner: true,
  } as UserData,

  incompleteUser: {
    id: '5',
    email: 'incomplete@example.com',
    name: '',
    roles: [],
    isOwner: false,
  } as UserData,
};

export const mockLoginResponses = {
  successfulLogin: {
    Success: true,
    Data: {
      UserId: '1',
      Token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      Email: 'user@example.com',
      ExpiresIn: 3600,
    },
    Message: 'Login successful',
    StatusCode: 200,
  },

  invalidCredentials: {
    Success: false,
    Data: null,
    Message: 'Invalid email or password',
    StatusCode: 401,
  },

  accountLocked: {
    Success: false,
    Data: null,
    Message: 'Account has been locked due to multiple failed attempts',
    StatusCode: 423,
  },

  serverError: {
    Success: false,
    Data: null,
    Message: 'Internal server error',
    StatusCode: 500,
  },
};

export const mockRegistrationData = {
  valid: {
    Email: 'newuser@example.com',
    Password: 'SecurePassword123!',
    ConfirmPassword: 'SecurePassword123!',
    Name: 'New User',
    PhoneNumber: '3001234567',
    DateOfBirth: '1990-01-01',
  },

  invalidEmail: {
    Email: 'invalid-email',
    Password: 'SecurePassword123!',
    ConfirmPassword: 'SecurePassword123!',
    Name: 'User',
    PhoneNumber: '3001234567',
    DateOfBirth: '1990-01-01',
  },

  weakPassword: {
    Email: 'user@example.com',
    Password: '123',
    ConfirmPassword: '123',
    Name: 'User',
    PhoneNumber: '3001234567',
    DateOfBirth: '1990-01-01',
  },

  missingFields: {
    Email: 'user@example.com',
    Password: 'SecurePassword123!',
    ConfirmPassword: 'SecurePassword123!',
    Name: '',
    PhoneNumber: '',
    DateOfBirth: '',
  },
};

export const mockUserProfiles = {
  complete: {
    Id: '1',
    Email: 'user@example.com',
    Name: 'John Doe',
    PhoneNumber: '3001234567',
    DateOfBirth: '1990-01-01',
    ProfilePicture: 'https://example.com/avatar.jpg',
    Bio: 'Fitness enthusiast',
    GymId: 'gym1',
    IsActive: true,
    CreatedAt: '2024-01-01T00:00:00Z',
    UpdatedAt: '2024-01-15T00:00:00Z',
  },

  minimal: {
    Id: '2',
    Email: 'minimal@example.com',
    Name: 'Min User',
    PhoneNumber: null,
    DateOfBirth: null,
    ProfilePicture: null,
    Bio: null,
    GymId: null,
    IsActive: true,
    CreatedAt: '2024-01-01T00:00:00Z',
    UpdatedAt: '2024-01-01T00:00:00Z',
  },

  inactive: {
    Id: '3',
    Email: 'inactive@example.com',
    Name: 'Inactive User',
    PhoneNumber: '3009876543',
    DateOfBirth: '1985-05-15',
    ProfilePicture: null,
    Bio: null,
    GymId: 'gym2',
    IsActive: false,
    CreatedAt: '2024-01-01T00:00:00Z',
    UpdatedAt: '2024-01-10T00:00:00Z',
  },
};

export const createMockUser = (overrides: Partial<UserData> = {}): UserData => {
  return {
    ...mockUsers.basicUser,
    ...overrides,
  };
};

export const createMockUserProfile = (
  overrides: Partial<typeof mockUserProfiles.complete> = {}
) => {
  return {
    ...mockUserProfiles.complete,
    ...overrides,
  };
};
