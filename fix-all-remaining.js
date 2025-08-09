const fs = require('fs');
const path = require('path');

function fixAllCommaErrors() {
  // Lista completa de archivos con errores de coma
  const allFiles = [
    'components/employeeRegisterDaily/EmployeeRegisterDailyList.tsx',
    'components/employeeType/EmployeeTypeList.tsx',
    'components/employeeUser/EmployeeUserList.tsx',
    'components/equipment/EquipmentList.tsx',
    'components/exercise/ExerciseList.tsx',
    'components/feed/FeedList.tsx',
    'components/fitUser/FitUserList.tsx',
    'components/gymImage/GymImageList.tsx',
    'components/gymPlanSelectedModule/GymPlanSelectedModuleList.tsx',
    'components/gymPlanSelectedType/GymPlanSelectedTypeList.tsx',
    'components/gymType/GymTypeList.tsx',
    'components/gym/GymList.tsx',
    'components/journeyEmployee/JourneyEmployeeList.tsx',
    'components/like/LikeList.tsx',
    'components/logUninstall/LogUninstallList.tsx',
    'components/machineCategory/MachineCategoryList.tsx',
    'components/machine/MachineList.tsx',
    'components/module/ModuleList.tsx',
    'components/notificationOption/NotificationOptionList.tsx',
    'components/notification/NotificationList.tsx',
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
    // Archivos con errores de ':'
    'components/exercise/DailyExerciseHistoryList.tsx',
    'components/exercise/DailyExerciseList.tsx',
    'components/history/DailyHistoryList.tsx',
    'components/occupancy/CurrentOccupancyList.tsx'
  ];

  let fixedCount = 0;

  allFiles.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relativePath}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      // Strategy 1: Find the last line before closing StyleSheet and add comma if missing
      content = content.replace(/(\s+\w+:\s*[^,}\n]+)(\s*\n\s*}\s*\)\s*;)/g, '$1,$2');
      
      // Strategy 2: Fix object property syntax errors (': expected)
      content = content.replace(/(\w+)\s+{/g, '$1: {');
      
      // Strategy 3: Ensure proper closing of nested objects
      content = content.replace(/(\s+\w+:\s*[^,}\n]+)(\s*\n\s*},?\s*\n\s*}\s*\)\s*;)/g, '$1,$2');
      
      // Strategy 4: Fix specific patterns for style properties
      content = content.replace(/(\s+[a-zA-Z]+:\s*['"][^'"]*['"])(\s*\n\s*}\s*\)\s*;)/g, '$1,$2');
      content = content.replace(/(\s+[a-zA-Z]+:\s*\d+)(\s*\n\s*}\s*\)\s*;)/g, '$1,$2');
      content = content.replace(/(\s+[a-zA-Z]+:\s*true|false)(\s*\n\s*}\s*\)\s*;)/g, '$1,$2');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed final: ${relativePath}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  No changes: ${relativePath}`);
      }

    } catch (error) {
      console.log(`❌ Error processing ${relativePath}:`, error.message);
    }
  });

  console.log(`\n🎯 Final fixes applied: ${fixedCount}/${allFiles.length}`);
}

fixAllCommaErrors();
