const fs = require('fs');
const path = require('path');

function removeTrailingCommas() {
  const files = [
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
    'components/userType/UserTypeList.tsx'
  ];

  let fixedCount = 0;

  files.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relativePath}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      // Remove trailing commas before closing braces in StyleSheet
      content = content.replace(/,(\s*\n\s*}\s*\);)/g, '$1');
      content = content.replace(/,(\s*\n\s*})/g, '$1');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Removed trailing commas: ${relativePath}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  No trailing commas: ${relativePath}`);
      }

    } catch (error) {
      console.log(`❌ Error processing ${relativePath}:`, error.message);
    }
  });

  console.log(`\n🎯 Trailing comma fixes: ${fixedCount}/${files.length}`);
}

removeTrailingCommas();
