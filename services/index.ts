// Exportar el servicio principal de API
export { apiService, default as ApiService } from './apiService';
export type { ApiResponse, RequestOptions, HttpMethod } from './apiService';

// Servicios específicos por entidad
export { catalogService } from './catalogService';
export { userSessionService } from './userSessionService';
export { authService } from './authService';
export { userService } from './userService';
export { gymServiceExtensions } from './gymService';
export { accessMethodTypeService } from './accessMethodTypeService';
export { branchService } from './branchService';
export { branchMediaService } from './branchMediaService';
