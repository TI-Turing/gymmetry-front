const fs = require('fs');
const path = require('path');

function fixSpecificSyntaxErrors() {
  const componentFiles = [
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

  let fixedCount = 0;

  componentFiles.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relativePath}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      // Fix 1: Promise.resolve([] with malformed closing
      content = content.replace(/Promise\.resolve\(\[\s*\n\s*\)\s*\n\s*\}\)\s*;/g, 'Promise.resolve([]);');
      
      // Fix 2: Fix broken StyleSheet ending
      content = content.replace(/color: '[^']*'\s*\}\)\s*;/g, match => {
        return match.replace(/\}\)\s*;/, '}\n});');
      });
      
      // Fix 3: Remove duplicate export statements
      content = content.replace(/export default \w+;\s*\n\s*export default \w+;/g, match => {
        const parts = match.split('\n');
        return parts[0];
      });
      
      // Fix 4: Fix StyleSheet.create closing
      content = content.replace(/color: '#666'\s*\}\)\s*;/g, "color: '#666'\n  }\n});");
      
      // Fix 5: Fix object structure in StyleSheet
      content = content.replace(/}\s*,\s*\n\s*\}\)/g, '}\n});');
      
      // Fix 6: Fix Promise.resolve pattern specifically
      content = content.replace(/return Promise\.resolve\(\[\s*\n\s*\)\s*;\s*\n\s*\}\)\s*;/g, 'return Promise.resolve([]);\n}');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${relativePath}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  No changes: ${relativePath}`);
      }

    } catch (error) {
      console.log(`❌ Error processing ${relativePath}:`, error.message);
    }
  });

  console.log(`\n🎯 Files fixed: ${fixedCount}/${componentFiles.length}`);
}

fixSpecificSyntaxErrors();
