const fs = require('fs');
const path = require('path');

console.log('🔧 Starting targeted repair for parsing errors...');

// Lista de archivos que probablemente tienen comas flotantes u otros errores de sintaxis
const targetFiles = [
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
  'components/userType/UserTypeList.tsx',
];

let processed = 0;
let fixed = 0;

targetFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    processed++;

    // Fix 1: Remove floating commas (lines that are just "," or ",\n")
    content = content.replace(/^\s*,\s*$/gm, '');

    // Fix 2: Remove trailing commas before closing braces in function calls
    content = content.replace(/,(\s*\}\s*,\s*\[\s*\]\s*;)/g, '$1');

    // Fix 3: Fix broken useCallback structures
    content = content.replace(
      /return response\.Data \|\| \[\];\s*,\s*\}\s*,\s*\[\s*\]\s*\)\s*;/g,
      'return response.Data || [];\n  }, []);'
    );

    // Fix 4: Remove duplicate displayName assignments
    content = content.replace(
      /(\w+)\.displayName\s*=\s*['"`]\w+['"`];\s*\n\s*\n\s*\n/g,
      ''
    );

    // Fix 5: Fix StyleSheet syntax - remove floating commas in objects
    content = content.replace(/([^,\s])\s*,\s*\n\s*,\s*/g, '$1,\n  ');

    // Fix 6: Fix broken object property syntax in StyleSheet
    content = content.replace(/(\w+):\s*\{\s*,/g, '$1: {');

    // Fix 7: Ensure proper spacing after commas in objects
    content = content.replace(/,([^\s\n])/g, ', $1');

    // Fix 8: Remove multiple consecutive empty lines
    content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');

    // Fix 9: Ensure file ends with newline
    if (!content.endsWith('\n')) {
      content += '\n';
    }

    // Fix 10: Remove any leftover syntax artifacts
    content = content.replace(/\}\)\s*;\s*\n\s*\n\s*const/g, '});\n\nconst');

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      fixed++;
    } else {
      console.log(`⏭️  No changes: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${filePath} - ${error.message}`);
  }
});

console.log(`\n📊 Repair Summary:`);
console.log(`- Files processed: ${processed}`);
console.log(`- Files fixed: ${fixed}`);
console.log(`- Files unchanged: ${processed - fixed}`);
console.log('\n🚀 Running lint check after repairs...');
