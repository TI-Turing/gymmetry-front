const fs = require('fs');
const path = require('path');

// Lista de archivos con errores de import
const filesToFix = [
  'components/currentOccupancy/CurrentOccupancyList.tsx',
  'components/dailyExercise/DailyExerciseList.tsx',
  'components/dailyHistory/DailyHistoryList.tsx',
  'components/employeeRegisterDaily/EmployeeRegisterDailyList.tsx',
  'components/employeeType/EmployeeTypeList.tsx',
  'components/employeeUser/EmployeeUserList.tsx',
  'components/equipment/EquipmentList.tsx',
  'components/exercise/DailyExerciseHistoryList.tsx',
  'components/exercise/DailyExerciseList.tsx',
  'components/exercise/ExerciseList.tsx',
  'components/feed/FeedList.tsx',
  'components/fitUser/FitUserList.tsx',
  'components/gymImage/GymImageList.tsx',
  'components/gymPlanSelectedModule/GymPlanSelectedModuleList.tsx',
  'components/gymPlanSelectedType/GymPlanSelectedTypeList.tsx',
  'components/gymType/GymTypeList.tsx',
  'components/gym/GymList.tsx',
  'components/history/DailyHistoryList.tsx',
  'components/journeyEmployee/JourneyEmployeeList.tsx',
  'components/like/LikeList.tsx',
  'components/logUninstall/LogUninstallList.tsx',
  'components/machineCategory/MachineCategoryList.tsx',
  'components/machine/MachineList.tsx',
  'components/module/ModuleList.tsx',
  'components/notificationOption/NotificationOptionList.tsx',
  'components/notification/NotificationList.tsx',
  'components/occupancy/CurrentOccupancyList.tsx',
  'components/otp/OtpList.tsx',
  'components/paymentMethod/PaymentMethodList.tsx',
  'components/permission/PermissionList.tsx',
  'components/physicalAssessment/PhysicalAssessmentList.tsx',
  'components/planType/PlanTypeList.tsx',
  'components/plan/PlanList.tsx',
  'components/routineAssigned/RoutineAssignedList.tsx',
  'components/routineDay/RoutineDayList.tsx',
  'components/routineExercise/RoutineExerciseList.tsx',
  'components/routineTemplate/RoutineTemplateList.tsx',
  'components/schedule/ScheduleList.tsx',
  'components/signalR/SignalRList.tsx',
  'components/subModule/SubModuleList.tsx',
  'components/uninstallOption/UninstallOptionList.tsx',
  'components/userType/UserTypeList.tsx'
];

function fixImports() {
  let fixedCount = 0;
  
  filesToFix.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${relativePath}`);
      return;
    }
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Fix incorrect import: statements
      content = content.replace(/^import:\s+/gm, 'import ');
      
      // Fix try: statements
      content = content.replace(/try:\s*{/g, 'try {');
      
      // Fix catch: statements  
      content = content.replace(/catch:\s*{/g, 'catch {');
      
      // Fix object property syntax errors
      content = content.replace(/(\w+):\s*{/g, '$1: {');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Reparado: ${relativePath}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  Sin cambios: ${relativePath}`);
      }
      
    } catch (error) {
      console.log(`❌ Error procesando ${relativePath}:`, error.message);
    }
  });
  
  console.log(`\n🎯 Archivos reparados: ${fixedCount}/${filesToFix.length}`);
}

fixImports();
