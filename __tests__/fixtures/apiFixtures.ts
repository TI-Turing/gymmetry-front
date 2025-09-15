// __tests__/fixtures/apiFixtures.ts
export const mockApiResponses = {
  // Success responses
  success: {
    Success: true,
    Data: { message: 'Operation completed successfully' },
    Message: 'Success',
    StatusCode: 200,
  },

  successWithData: <T>(data: T) => ({
    Success: true,
    Data: data,
    Message: 'Data retrieved successfully',
    StatusCode: 200,
  }),

  created: <T>(data: T) => ({
    Success: true,
    Data: data,
    Message: 'Resource created successfully',
    StatusCode: 201,
  }),

  // Error responses
  badRequest: {
    Success: false,
    Data: null,
    Message: 'Bad request - invalid parameters',
    StatusCode: 400,
  },

  unauthorized: {
    Success: false,
    Data: null,
    Message: 'Unauthorized - authentication required',
    StatusCode: 401,
  },

  forbidden: {
    Success: false,
    Data: null,
    Message: 'Forbidden - insufficient permissions',
    StatusCode: 403,
  },

  notFound: {
    Success: false,
    Data: null,
    Message: 'Resource not found',
    StatusCode: 404,
  },

  conflict: {
    Success: false,
    Data: null,
    Message: 'Conflict - resource already exists',
    StatusCode: 409,
  },

  validationError: {
    Success: false,
    Data: null,
    Message: 'Validation failed',
    StatusCode: 422,
    Errors: {
      email: ['Email is required', 'Email format is invalid'],
      password: ['Password must be at least 8 characters'],
    },
  },

  internalServerError: {
    Success: false,
    Data: null,
    Message: 'Internal server error',
    StatusCode: 500,
  },

  serviceUnavailable: {
    Success: false,
    Data: null,
    Message: 'Service temporarily unavailable',
    StatusCode: 503,
  },
};

// Mock paginated responses
export const mockPaginatedResponse = <T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10,
  totalCount?: number
) => ({
  Success: true,
  Data: {
    Items: data,
    Page: page,
    PageSize: pageSize,
    TotalCount: totalCount ?? data.length,
    TotalPages: Math.ceil((totalCount ?? data.length) / pageSize),
    HasNextPage: page * pageSize < (totalCount ?? data.length),
    HasPreviousPage: page > 1,
  },
  Message: 'Data retrieved successfully',
  StatusCode: 200,
});

// Mock collection responses (for .NET $values format)
export const mockCollectionResponse = <T>(data: T[]) => ({
  Success: true,
  Data: {
    $values: data,
  },
  Message: 'Collection retrieved successfully',
  StatusCode: 200,
});

// Network error mocks
export const mockNetworkErrors = {
  timeout: {
    code: 'ECONNABORTED',
    message: 'Request timeout',
    isAxiosError: true,
  },

  networkError: {
    code: 'NETWORK_ERROR',
    message: 'Network error',
    isAxiosError: true,
  },

  connectionRefused: {
    code: 'ECONNREFUSED',
    message: 'Connection refused',
    isAxiosError: true,
  },

  dnsError: {
    code: 'ENOTFOUND',
    message: 'DNS resolution failed',
    isAxiosError: true,
  },
};

// Mock axios error responses
export const mockAxiosError = (
  status: number,
  message: string,
  data?: Record<string, unknown>
) => ({
  isAxiosError: true,
  response: {
    status,
    statusText: getStatusText(status),
    data: data || {
      Success: false,
      Data: null,
      Message: message,
      StatusCode: status,
    },
    headers: {},
    config: {},
  },
  request: {},
  config: {},
  toJSON: () => ({}),
});

// Helper function to get status text
function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    503: 'Service Unavailable',
  };
  return statusTexts[status] || 'Unknown';
}

// Mock delay for async operations
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock progressive responses (for testing loading states)
export const mockProgressiveResponse = async <T>(
  data: T,
  delayMs: number = 100
): Promise<T> => {
  await delay(delayMs);
  return data;
};

// Environment-specific mocks
export const mockEnvironmentConfig = {
  local: {
    apiBaseUrl: 'http://localhost:3000',
    timeout: 5000,
    retryAttempts: 1,
  },
  development: {
    apiBaseUrl: 'https://dev-api.gymmetry.com',
    timeout: 10000,
    retryAttempts: 3,
  },
  production: {
    apiBaseUrl: 'https://api.gymmetry.com',
    timeout: 15000,
    retryAttempts: 3,
  },
};

// Helper to create mock response with custom status
export const createMockResponse = <T>(
  success: boolean,
  data: T | null,
  message: string,
  statusCode: number,
  errors?: Record<string, string[]>
) => ({
  Success: success,
  Data: data,
  Message: message,
  StatusCode: statusCode,
  ...(errors && { Errors: errors }),
});

// Mock authentication tokens
export const mockTokens = {
  valid:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.token',
  invalid: 'invalid.token.format',
  empty: '',
};

// Mock rate limit responses
export const mockRateLimitResponse = {
  Success: false,
  Data: null,
  Message: 'Rate limit exceeded. Please try again later.',
  StatusCode: 429,
  Headers: {
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': '0',
    'X-RateLimit-Reset': '1640995200',
  },
};
