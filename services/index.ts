// Exportar el servicio principal de API
export { apiService, default as ApiService } from './apiService';
export type { ApiResponse, RequestOptions, HttpMethod } from './apiService';

// Servicios específicos por entidad
export { catalogService } from './catalogService';
export { userSessionService } from './userSessionService';
export { authService } from './authService';
export { userService } from './userService';
export { gymServiceExtensions, GymService } from './gymService';
export type { CachedGymData } from './gymService';
export { accessMethodTypeService } from './accessMethodTypeService';
export { branchService } from './branchService';
export { branchMediaService } from './branchMediaService';
export { planService } from './planService';
export { planTypeService } from './planTypeService';
export { gymPlanService } from './gymPlanService';

// Auto-importar el watcher para que se active globalmente
export { gymDataWatcher } from './gymDataWatcher';
export { asyncStorageObserver } from './asyncStorageObserver';
