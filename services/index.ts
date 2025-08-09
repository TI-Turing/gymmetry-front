// Exportar el servicio principal de API
export { apiService, default as ApiService } from './apiService';
export type { ApiResponse, RequestOptions, HttpMethod } from './apiService';

// Servicios específicos por entidad
export { catalogService } from './catalogService';
export { userSessionService } from './userSessionService';
export { authService } from './authService';
export { userService } from './userService';
export { gymServiceExtensions, GymService } from './gymService';
export type { CachedGymData } from '@/dto/gym/CachedGymData';
export { accessMethodTypeService } from './accessMethodTypeService';
export { branchService } from './branchService';
export { BranchApiService } from './branchServiceNew';
export { branchMediaService } from './branchMediaService';
export { planService } from './planService';
export { planTypeService } from './planTypeService';
export { gymPlanService } from './gymPlanService';
export * as functionServices from './functions';

// Servicios adicionales (alias para servicios existentes)
export { catalogService as dietService } from './catalogService';
export { catalogService as employeeRegisterDailyService } from './catalogService';
export { catalogService as employeeTypeService } from './catalogService';
export { catalogService as employeeUserService } from './catalogService';
export { catalogService as equipmentService } from './catalogService';
export { catalogService as exerciseService } from './catalogService';
export { catalogService as feedService } from './catalogService';
export { userService as fitUserService } from './userService';
export { GymService as gymService } from './gymService';
export { catalogService as gymImageService } from './catalogService';
export { catalogService as paymentMethodService } from './catalogService';

// Auto-importar el watcher para que se active globalmente
export { gymDataWatcher } from './gymDataWatcher';
export { asyncStorageObserver } from './asyncStorageObserver';
