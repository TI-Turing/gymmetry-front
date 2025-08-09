const fs = require('fs');
const path = require('path');

function fixFinalParsingErrors() {
  // Archivos con errores específicos identificados
  const fixMap = [
    // Declaration or statement expected (línea ~41)
    { file: 'components/dailyExercise/DailyExerciseList.tsx', type: 'promise' },
    { file: 'components/dailyHistory/DailyHistoryList.tsx', type: 'promise' },
    
    // ',' expected (StyleSheet objects)
    { file: 'components/employeeRegisterDaily/EmployeeRegisterDailyList.tsx', type: 'styleComma' },
    { file: 'components/employeeType/EmployeeTypeList.tsx', type: 'styleComma' },
    { file: 'components/employeeUser/EmployeeUserList.tsx', type: 'styleComma' },
    { file: 'components/equipment/EquipmentList.tsx', type: 'styleComma' },
    { file: 'components/exercise/ExerciseList.tsx', type: 'styleComma' },
    { file: 'components/feed/FeedList.tsx', type: 'styleComma' },
    { file: 'components/fitUser/FitUserList.tsx', type: 'styleComma' },
    { file: 'components/gymImage/GymImageList.tsx', type: 'styleComma' },
    { file: 'components/gymPlanSelectedModule/GymPlanSelectedModuleList.tsx', type: 'styleComma' },
    { file: 'components/gymPlanSelectedType/GymPlanSelectedTypeList.tsx', type: 'styleComma' },
    { file: 'components/gymType/GymTypeList.tsx', type: 'styleComma' },
    { file: 'components/gym/GymList.tsx', type: 'styleComma' },
    { file: 'components/journeyEmployee/JourneyEmployeeList.tsx', type: 'styleComma' },
    { file: 'components/like/LikeList.tsx', type: 'styleComma' },
    { file: 'components/logUninstall/LogUninstallList.tsx', type: 'styleComma' },
    { file: 'components/machineCategory/MachineCategoryList.tsx', type: 'styleComma' },
    { file: 'components/machine/MachineList.tsx', type: 'styleComma' },
    { file: 'components/module/ModuleList.tsx', type: 'styleComma' },
    { file: 'components/notificationOption/NotificationOptionList.tsx', type: 'styleComma' },
    { file: 'components/notification/NotificationList.tsx', type: 'styleComma' },
    { file: 'components/otp/OtpList.tsx', type: 'styleComma' },
    { file: 'components/paymentMethod/PaymentMethodList.tsx', type: 'styleComma' },
    { file: 'components/permission/PermissionList.tsx', type: 'styleComma' },
    { file: 'components/physicalAssessment/PhysicalAssessmentList.tsx', type: 'styleComma' },
    { file: 'components/planType/PlanTypeList.tsx', type: 'styleComma' },
    { file: 'components/routineAssigned/RoutineAssignedList.tsx', type: 'styleComma' },
    { file: 'components/routineDay/RoutineDayList.tsx', type: 'styleComma' },
    { file: 'components/routineExercise/RoutineExerciseList.tsx', type: 'styleComma' },
    { file: 'components/routineTemplate/RoutineTemplateList.tsx', type: 'styleComma' },
    { file: 'components/schedule/ScheduleList.tsx', type: 'styleComma' },
    { file: 'components/signalR/SignalRList.tsx', type: 'styleComma' },
    { file: 'components/subModule/SubModuleList.tsx', type: 'styleComma' },
    { file: 'components/uninstallOption/UninstallOptionList.tsx', type: 'styleComma' },
    { file: 'components/userType/UserTypeList.tsx', type: 'styleComma' },
    
    // ':' expected (object property syntax)
    { file: 'components/exercise/DailyExerciseHistoryList.tsx', type: 'colonExpected' },
    { file: 'components/exercise/DailyExerciseList.tsx', type: 'colonExpected' },
    { file: 'components/history/DailyHistoryList.tsx', type: 'colonExpected' },
    { file: 'components/occupancy/CurrentOccupancyList.tsx', type: 'colonExpected' },
    
    // Property assignment expected
    { file: 'components/plan/PlanList.tsx', type: 'propertyAssignment' }
  ];

  let fixedCount = 0;

  fixMap.forEach(({ file, type }) => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      switch (type) {
        case 'promise':
          // Fix Promise.resolve([] with broken closing
          content = content.replace(/return Promise\.resolve\(\[\s*\n\s*\)\s*;\s*\n\s*\}\)\s*;/g, 'return Promise.resolve([]);\n}');
          break;
          
        case 'styleComma':
          // Fix missing comma after style properties
          content = content.replace(/(\s+[a-zA-Z]+:\s*[^,\n}]+)(\s*\n\s*}\)\s*;)/g, '$1$2');
          // Fix specifically missing commas before closing StyleSheet
          content = content.replace(/(\s+[a-zA-Z]+:\s*[^,\n}]+)(\s*\n\s*}\s*\)\s*;)/g, '$1$2');
          // Ensure proper StyleSheet closing
          content = content.replace(/(\w+:\s*[^,}]+)(\s*}\s*\)\s*;)/g, '$1\n$2');
          break;
          
        case 'colonExpected':
          // Fix object property syntax - add missing colons
          content = content.replace(/(\w+)\s+{/g, '$1: {');
          content = content.replace(/(\w+)\s*\n\s*{/g, '$1: {');
          break;
          
        case 'propertyAssignment':
          // Fix property assignment issues
          content = content.replace(/(\w+):\s*:\s*/g, '$1: ');
          content = content.replace(/(\w+)\s*=\s*:/g, '$1: ');
          break;
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed ${type}: ${file}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  No changes (${type}): ${file}`);
      }

    } catch (error) {
      console.log(`❌ Error processing ${file}:`, error.message);
    }
  });

  console.log(`\n🎯 Files fixed: ${fixedCount}/${fixMap.length}`);
}

fixFinalParsingErrors();
