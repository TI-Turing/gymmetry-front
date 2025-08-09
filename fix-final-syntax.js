const fs = require('fs');
const path = require('path');

function fixFinalSyntaxErrors() {
  const componentFiles = [
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

      // Fix Promise.resolve([] with extra closing parentheses
      content = content.replace(/Promise\.resolve\(\[\s*\n\s*\)\s*\n\s*\}\)\s*;/g, 'Promise.resolve([]);');
      
      // Fix double closing braces/parentheses after style objects
      content = content.replace(/}\s*}\s*\)\s*;/g, '});');
      
      // Fix missing closing parentheses in React.memo
      content = content.replace(/React\.memo\(\(\) => \{[^}]*\}\s*\n\s*export default/g, (match) => {
        const componentName = relativePath.split('/').pop()?.replace('.tsx', '') || 'Component';
        return match.replace('export default', `});\n\nexport default ${componentName};`);
      });
      
      // Fix StyleSheet declaration syntax
      content = content.replace(/const styles = StyleSheet\.create\(\{([^}]+)\}\s*\)\s*\n\s*export default/g, 
        'const styles = StyleSheet.create({\n$1\n});\n\nexport default');
      
      // Ensure proper export structure
      if (!content.includes('export default') && content.includes('React.memo')) {
        const componentMatch = content.match(/const\s+(\w+List)\s*=/);
        if (componentMatch) {
          content += `\n\nexport default ${componentMatch[1]};`;
        }
      }

      // Remove extra commas before closing braces
      content = content.replace(/,(\s*})/g, '$1');
      
      // Fix object property syntax
      content = content.replace(/(\w+)\s*:\s*:\s*/g, '$1: ');

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

fixFinalSyntaxErrors();
