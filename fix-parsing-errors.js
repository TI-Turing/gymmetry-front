const fs = require('fs');
const path = require('path');

// Lista de archivos con errores de parsing que necesitan corrección
const filesToFix = [
  'components/branchMedia/BranchMediaList.tsx',
  'components/branch/BranchList.tsx',
  'components/comment/CommentList.tsx',
  'components/currentOccupancy/CurrentOccupancyList.tsx',
  'components/dailyExercise/DailyExerciseList.tsx',
  'components/dailyHistory/DailyHistoryList.tsx',
  'components/diet/DietList.tsx',
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

function fixParsingError(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return { status: 'not_found', file: filePath };
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Buscar patrones problemáticos que causa el script anterior
    
    // 1. Arreglar "const ComponentName = React.memo((" seguido inmediatamente por parámetros 
    const memoPattern = /const (\w+) = React\.memo\(\(([^)]*)\)\s*=>/g;
    if (memoPattern.test(content)) {
      content = content.replace(memoPattern, 'const $1 = React.memo(($2) =>');
      modified = true;
    }

    // 2. Buscar y arreglar funciones con mal formato
    const malformedFunctionPattern = /const (\w+) = React\.memo\(\(\)\s*=>/g;
    if (malformedFunctionPattern.test(content)) {
      content = content.replace(malformedFunctionPattern, 'const $1 = React.memo(() =>');
      modified = true;
    }

    // 3. Verificar que la función esté cerrada correctamente
    if (content.includes('React.memo((') && !content.includes('});')) {
      // Buscar el último '}' y cambiarlo a '});'
      const lines = content.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === '}' && !lines[i+1]?.includes('displayName')) {
          lines[i] = '});';
          modified = true;
          break;
        }
      }
      content = lines.join('\n');
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      return { status: 'fixed', file: filePath };
    } else {
      return { status: 'no_fix_needed', file: filePath };
    }

  } catch (error) {
    return { status: 'error', file: filePath, error: error.message };
  }
}

// Ejecutar corrección
let results = {
  fixed: [],
  no_fix_needed: [],
  not_found: [],
  errors: []
};

console.log('🔧 Corrigiendo errores de parsing en EntityList components...\n');

filesToFix.forEach(file => {
  const result = fixParsingError(file);
  results[result.status].push(result);
});

// Mostrar resumen
console.log('📊 RESUMEN DE CORRECCIÓN:');
console.log(`✅ Archivos corregidos: ${results.fixed.length}`);
console.log(`ℹ️  Sin cambios necesarios: ${results.no_fix_needed.length}`);
console.log(`❌ No encontrados: ${results.not_found.length}`);
console.log(`🔥 Errores: ${results.errors.length}`);

if (results.fixed.length > 0) {
  console.log('\n🎯 ARCHIVOS CORREGIDOS:');
  results.fixed.forEach(result => {
    console.log(`   • ${result.file}`);
  });
}

if (results.errors.length > 0) {
  console.log('\n❌ ERRORES:');
  results.errors.forEach(result => {
    console.log(`   • ${result.file}: ${result.error}`);
  });
}
