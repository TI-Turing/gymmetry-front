// Exportar el servicio principal de API
export { apiService, default as ApiService } from './apiService';
export type { ApiResponse, RequestOptions, HttpMethod } from './apiService';

// Aquí se pueden agregar más servicios en el futuro
// export { apiService } from './apiService';
export { catalogService } from './catalogService';
export { userSessionService } from './userSessionService';
export { authService } from './authService';
// export { authService } from './authService';
// export { userService } from './userService';
