const fs = require('fs');
const path = require('path');

function finalCleanup() {
  // Lista de archivos con errores específicos
  const filesToFix = [
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

  let fixedCount = 0;

  filesToFix.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relativePath}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      // Fix 1: ',' expected - Add missing commas before closing StyleSheet
      content = content.replace(/(\s+[a-zA-Z_][a-zA-Z0-9_]*:\s*[^,}\n]+)(\s*\n\s*}\s*\);)/g, '$1,$2');
      
      // Fix 2: ':' expected - Fix object property syntax
      content = content.replace(/(\w+)\s+{/g, '$1: {');
      content = content.replace(/(\w+)\s*\n\s*{/g, '$1: {');
      
      // Fix 3: Ensure proper comma placement in objects
      content = content.replace(/(\w+:\s*[^,}\n]+)(\s*\n\s*})/g, '$1$2');
      
      // Fix 4: Fix StyleSheet structure specifically
      content = content.replace(/(fontSize:\s*FONT_SIZES\.\w+)(\s*\n\s*}\s*\);)/g, '$1,$2');
      content = content.replace(/(color:\s*'[^']*')(\s*\n\s*}\s*\);)/g, '$1$2');
      
      // Fix 5: Handle malformed try blocks
      content = content.replace(/try:\s*{/g, 'try {');
      content = content.replace(/catch:\s*{/g, 'catch {');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Final fix: ${relativePath}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  No issues: ${relativePath}`);
      }

    } catch (error) {
      console.log(`❌ Error processing ${relativePath}:`, error.message);
    }
  });

  console.log(`\n🎯 Final fixes applied: ${fixedCount}/${filesToFix.length}`);
}

finalCleanup();
