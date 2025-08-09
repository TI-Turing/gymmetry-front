const fs = require('fs');
const path = require('path');

// Lista de archivos con errores de parsing específicos
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

function fixParsingErrors() {
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
      
      // Fix 1: Floating commas at end of objects
      content = content.replace(/,(\s*[}\)])/g, '$1');
      
      // Fix 2: Missing closing braces/parentheses
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      const openParens = (content.match(/\(/g) || []).length;
      const closeParens = (content.match(/\)/g) || []).length;
      
      // Fix 3: Ensure proper React.memo structure
      if (content.includes('React.memo(') && !content.includes('React.memo(() =>')) {
        content = content.replace(
          /React\.memo\(\s*function\s*\w*\s*\([^)]*\)\s*{/g,
          'React.memo(() => {'
        );
      }
      
      // Fix 4: Property assignment expected errors
      content = content.replace(/(\w+):\s*{([^}]*)}(?!\s*[,}])/g, '$1: {$2}');
      
      // Fix 5: Declaration or statement expected - fix incomplete exports
      content = content.replace(/export\s+default\s*$/gm, '');
      
      // Fix 6: Ensure files end with proper export
      if (!content.trim().endsWith(');') && !content.trim().endsWith('export default ')) {
        if (content.includes('React.memo(')) {
          content = content.trim() + '\n\nexport default ';
          // Find the component name
          const componentMatch = content.match(/const\s+(\w+List)\s*=/);
          if (componentMatch) {
            content += componentMatch[1] + ';';
          }
        }
      }
      
      // Fix 7: ':' expected errors - fix object syntax
      content = content.replace(/(\w+)\s*(?<!:)\s*{/g, '$1: {');
      
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

fixParsingErrors();
