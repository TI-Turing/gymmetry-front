// Exportar el servicio principal de API
export { apiService, default as ApiService } from './apiService';
export type { RequestOptions, HttpMethod } from './apiService';
export type { ApiResponse } from '@/dto/common/ApiResponse';

// Servicios de autenticación y sesión
export { authService } from './authService';
export { userSessionService } from './userSessionService';

// Servicio de anuncios
export { advertisementService } from './advertisementService';

// Servicios de usuario y perfil
export { userService } from './userService';
export { fitUserService } from './fitUserService';
export { userTypeService } from './userTypeService';

// Servicios de gimnasio
export { gymService } from './gymService';
export { gymImageService } from './gymImageService';
export { gymTypeService } from './gymTypeService';
export { gymPlanService } from './gymPlanService';
export { gymPlanSelectedService } from './gymPlanSelectedService';
export { gymPlanSelectedModuleService } from './gymPlanSelectedModuleService';
export { gymPlanSelectedTypeService } from './gymPlanSelectedTypeService';

// Servicios de sucursales
export { branchService } from './branchService';
export { BranchApiService } from './branchServiceNew';
export { branchMediaService } from './branchMediaService';
export { branchServiceFunctions } from './branchServiceFunctions';

// Servicios de planes
export { planService } from './planService';
export { planTypeService } from './planTypeService';

// Servicios de rutinas y ejercicios
export { exerciseService } from './exerciseService';
export { routineAssignedService } from './routineAssignedService';
export { routineDayService } from './routineDayService';
export { routineExerciseService } from './routineExerciseService';
export { routineTemplateService } from './routineTemplateService';
export { categoryExerciseService } from './categoryExerciseService';

// Servicios de seguimiento diario
export { dailyService } from './dailyService';
export { dailyExerciseService } from './dailyExerciseService';
export { dailyExerciseHistoryService } from './dailyExerciseHistoryService';
export { dailyHistoryService } from './dailyHistoryService';

// Servicios de empleados
export { employeeRegisterDailyService } from './employeeRegisterDailyService';
export { employeeTypeService } from './employeeTypeService';
export { employeeUserService } from './employeeUserService';
export { journeyEmployeeService } from './journeyEmployeeService';

// Servicios de máquinas y equipos
export { machineService } from './machineService';
export { machineCategoryService } from './machineCategoryService';

// Servicios de notificaciones
export { notificationService } from './notificationService';
export { notificationOptionService } from './notificationOptionService';

// Servicios de feed y social
export { feedService } from './feedService';
export { postService } from './postService';
export { commentService } from './commentService';
export { likeService } from './likeService';

// Servicios de configuración y catálogos
export { catalogService } from './catalogService';
export { configService } from './configService';
export { accessMethodTypeService } from './accessMethodTypeService';
export { moduleService } from './moduleService';
export { subModuleService } from './subModuleService';
export { permissionService } from './permissionService';

// Servicios adicionales y alias para compatibilidad
export { catalogService as equipmentService } from './catalogService';
export { catalogService as paymentMethodService } from './catalogService';
export { branchServiceFunctions as branchServiceFunctionsService } from './branchServiceFunctions';
export { catalogService as employeeRegisterdailyService } from './catalogService';

// Alias para compatibilidad de nombres
export { routineExerciseService as routineexerciseService } from './routineExerciseService';
export { subModuleService as submoduleService } from './subModuleService';

// Servicios de dieta y evaluación
export { dietService } from './dietService';
export { physicalAssessmentService } from './physicalAssessmentService';
export { userExerciseMaxService } from './userExerciseMaxService';

// Servicios de horarios y ocupación
export { scheduleService } from './scheduleService';
export { currentOccupancyService } from './currentOccupancyService';

// Servicios de facturación y pagos
export { billService } from './billService';
export { paymentService } from './paymentService';

// Servicios de OTP y validación
export { otpService } from './otpService';

// Servicios de marcas y opciones
export { brandService } from './brandService';
export { uninstallOptionService } from './uninstallOptionService';
export { logUninstallService } from './logUninstallService';

// Servicios de comunicación
export { signalRService } from './signalRService';
export { progressReportService } from './progressReportService';
export { appStateService } from './appStateService';

// Servicios de utilidad y observadores
export { gymDataWatcher } from './gymDataWatcher';
export { asyncStorageObserver } from './asyncStorageObserver';
// Analytics
export { analyticsService } from './analyticsService';

// Social & Reporting
export { reportContentService } from './reportContentService';
export {
  userBlockService,
  BLOCK_LIMITS,
  BLOCK_ERROR_CODES,
} from './userBlockService';
export type { BlockOperationError } from './userBlockService';

// Tipos exportados
export type { CachedGymData } from '@/dto/gym/CachedGymData';
