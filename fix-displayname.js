const fs = require('fs');
const path = require('path');

// Lista de archivos que necesitan corrección
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

function fixDisplayNamePlacement(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return { status: 'not_found', file: filePath };
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Extraer el nombre del componente
    const componentNameMatch = content.match(/const (\w+) = React\.memo/);
    if (!componentNameMatch) {
      return { status: 'no_memo_found', file: filePath };
    }
    
    const componentName = componentNameMatch[1];

    // Buscar patrones problemáticos específicos:
    
    // 1. displayName aparece antes del primer `}` - Esto está mal
    const wrongDisplayNamePattern = new RegExp(`^\\s*${componentName}\\.displayName = '${componentName}';\\s*$`, 'gm');
    const hasWrongDisplayName = wrongDisplayNamePattern.test(content);
    
    if (hasWrongDisplayName) {
      // Remover la línea mal ubicada
      content = content.replace(wrongDisplayNamePattern, '');
      modified = true;
    }

    // 2. Buscar donde termina el return del componente (primera aparición de }) 
    const lines = content.split('\n');
    let componentReturnEnd = -1;
    let braceCount = 0;
    let insideComponent = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes(`const ${componentName} = React.memo`)) {
        insideComponent = true;
        continue;
      }

      if (insideComponent) {
        // Contar las llaves en esta línea
        for (const char of line) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }

        // Si llegamos a 0 llaves, hemos encontrado el final del componente
        if (braceCount === 0 && line.includes('}')) {
          // Si la línea no termina con '});', corregirlo
          if (!line.trim().endsWith('});')) {
            lines[i] = lines[i].replace(/}\s*$/, '});');
            modified = true;
          }
          componentReturnEnd = i;
          break;
        }
      }
    }

    // 3. Insertar displayName después del cierre del componente si no existe
    const hasDisplayName = content.includes(`${componentName}.displayName = '${componentName}';`);
    if (!hasDisplayName && componentReturnEnd !== -1) {
      lines.splice(componentReturnEnd + 1, 0, '', `${componentName}.displayName = '${componentName}';`);
      modified = true;
    }

    // 4. Asegurar export default al final
    const hasExportDefault = content.includes(`export default ${componentName}`);
    if (!hasExportDefault) {
      lines.push('', `export default ${componentName};`);
      modified = true;
    }

    if (modified) {
      const newContent = lines.join('\n');
      fs.writeFileSync(fullPath, newContent, 'utf8');
      return { status: 'fixed', file: filePath };
    } else {
      return { status: 'no_fix_needed', file: filePath };
    }

  } catch (error) {
    return { status: 'error', file: filePath, error: error.message };
  }
}

// Ejecutar corrección
let results = { fixed: [], no_fix_needed: [], not_found: [], no_memo_found: [], errors: [] };

console.log('🔧 Corrigiendo ubicación de displayName...\n');

filesToFix.forEach(file => {
  const result = fixDisplayNamePlacement(file);
  results[result.status].push(result);
});

console.log('📊 RESUMEN:');
console.log(`✅ Corregidos: ${results.fixed.length}`);
console.log(`ℹ️  Sin cambios: ${results.no_fix_needed.length}`);
console.log(`❓ Sin React.memo: ${results.no_memo_found.length}`);

if (results.fixed.length > 0) {
  console.log('\n🎯 ARCHIVOS CORREGIDOS:');
  results.fixed.forEach(result => console.log(`   • ${result.file}`));
}
