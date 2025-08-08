const fs = require('fs');
const path = require('path');

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

function fixSyntaxError(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return { status: 'not_found', file: filePath };
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Problema 1: "React.memo(() {" debería ser "React.memo(() => {"
    if (content.includes('React.memo(() {')) {
      content = content.replace(/React\.memo\(\(\) \{/g, 'React.memo(() => {');
      modified = true;
    }

    // Problema 2: displayName fuera de lugar
    const displayNamePattern = /^(\w+)\.displayName = '\1';$/gm;
    const matches = content.match(displayNamePattern);
    if (matches) {
      // Remover la línea mal ubicada
      content = content.replace(displayNamePattern, '');
      
      // Buscar el final de la función para insertar displayName después del });
      const functionNameMatch = content.match(/const (\w+) = React\.memo/);
      if (functionNameMatch) {
        const functionName = functionNameMatch[1];
        
        // Buscar el });
        const closingIndex = content.lastIndexOf('});');
        if (closingIndex !== -1) {
          const insertionPoint = closingIndex + 3;
          const displayNameLine = `\n\n${functionName}.displayName = '${functionName}';`;
          content = content.slice(0, insertionPoint) + displayNameLine + content.slice(insertionPoint);
          modified = true;
        }
      }
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

let results = { fixed: [], no_fix_needed: [], not_found: [], errors: [] };

console.log('🔧 Corrigiendo errores de sintaxis específicos...\n');

filesToFix.forEach(file => {
  const result = fixSyntaxError(file);
  results[result.status].push(result);
});

console.log('📊 RESUMEN:');
console.log(`✅ Corregidos: ${results.fixed.length}`);
console.log(`ℹ️  Sin cambios: ${results.no_fix_needed.length}`);

if (results.fixed.length > 0) {
  console.log('\n🎯 ARCHIVOS CORREGIDOS:');
  results.fixed.forEach(result => console.log(`   • ${result.file}`));
}
