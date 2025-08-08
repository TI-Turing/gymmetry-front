const fs = require('fs');
const path = require('path');

// Lista real de componentes EntityList encontrados en el workspace
const entityListComponents = [
  'components/feed/FeedList.tsx',
  'components/fitUser/FitUserList.tsx',
  'components/machine/MachineList.tsx',
  'components/subModule/SubModuleList.tsx',
  'components/routineDay/RoutineDayList.tsx',
  'components/config/ConfigList.tsx',
  'components/userType/UserTypeList.tsx',
  'components/uninstallOption/UninstallOptionList.tsx',
  'components/schedule/ScheduleList.tsx',
  'components/post/PostList.tsx',
  'components/routineTemplate/RoutineTemplateList.tsx',
  'components/plan/PlanList.tsx',
  'components/physicalAssessment/PhysicalAssessmentList.tsx',
  'components/routineAssigned/RoutineAssignedList.tsx',
  'components/permission/PermissionList.tsx',
  'components/branch/BranchList.tsx',
  'components/signalR/SignalRList.tsx',
  'components/paymentMethod/PaymentMethodList.tsx',
  'components/occupancy/CurrentOccupancyList.tsx',
  'components/otp/OtpList.tsx',
  'components/notification/NotificationList.tsx',
  'components/module/ModuleList.tsx',
  'components/machineCategory/MachineCategoryList.tsx',
  'components/like/LikeList.tsx',
  'components/planType/PlanTypeList.tsx',
  'components/history/DailyHistoryList.tsx',
  'components/gymPlanSelectedType/GymPlanSelectedTypeList.tsx',
  'components/gymType/GymTypeList.tsx',
  'components/gymImage/GymImageList.tsx',
  'components/gymPlanSelectedModule/GymPlanSelectedModuleList.tsx',
  'components/routineExercise/RoutineExerciseList.tsx',
  'components/exercise/DailyExerciseList.tsx',
  'components/exercise/DailyExerciseHistoryList.tsx',
  'components/equipment/EquipmentList.tsx',
  'components/exercise/ExerciseList.tsx',
  'components/gym/GymList.tsx',
  'components/notificationOption/NotificationOptionList.tsx',
  'components/employeeUser/EmployeeUserList.tsx',
  'components/employeeType/EmployeeTypeList.tsx',
  'components/employeeRegisterDaily/EmployeeRegisterDailyList.tsx',
  'components/diet/DietList.tsx',
  'components/logUninstall/LogUninstallList.tsx',
  'components/dailyHistory/DailyHistoryList.tsx',
  'components/dailyExercise/DailyExerciseList.tsx',
  'components/daily/DailyList.tsx',
  'components/currentOccupancy/CurrentOccupancyList.tsx',
  'components/common/EntityList.tsx',
  'components/journeyEmployee/JourneyEmployeeList.tsx',
  'components/comment/CommentList.tsx',
  'components/categoryExercise/CategoryExerciseList.tsx',
  'components/branchService/BranchServiceList.tsx',
  'components/branchMedia/BranchMediaList.tsx',
  'components/auth/FilterableModal.tsx'
];

function optimizeEntityListComponent(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return { status: 'not_found', file: filePath };
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    let changes = [];

    // 1. Verificar si usa EntityList (componente del patrón)
    const usesEntityList = content.includes('<EntityList') || content.includes('EntityList');
    if (!usesEntityList) {
      return { status: 'not_entity_list', file: filePath };
    }

    // 2. Agregar React.memo si no está presente
    if (!content.includes('React.memo') && content.includes('export function ')) {
      const functionMatch = content.match(/export function (\w+)\s*\(/);
      if (functionMatch) {
        const functionName = functionMatch[1];
        
        // Reemplazar export function con const + React.memo
        content = content.replace(
          new RegExp(`export function ${functionName}\\s*\\(`),
          `const ${functionName} = React.memo((`
        );

        // Buscar el cierre de la función
        const lines = content.split('\n');
        let braceCount = 0;
        let functionStarted = false;
        let functionEndIndex = -1;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          if (line.includes(`const ${functionName} = React.memo`)) {
            functionStarted = true;
            continue;
          }

          if (functionStarted) {
            for (const char of line) {
              if (char === '{') braceCount++;
              if (char === '}') braceCount--;
            }

            if (braceCount === 0 && line.includes('}')) {
              functionEndIndex = i;
              break;
            }
          }
        }

        if (functionEndIndex !== -1) {
          lines[functionEndIndex] = lines[functionEndIndex].replace(/}$/, '});');
          lines.splice(functionEndIndex + 1, 0, `\n${functionName}.displayName = '${functionName}';`);
          
          if (!content.includes(`export default ${functionName}`)) {
            lines.push(`\nexport default ${functionName};`);
          }
          
          content = lines.join('\n');
          modified = true;
          changes.push('React.memo');
        }
      }
    }

    // 3. Optimizar servicePlaceholder con useCallback
    if (content.includes('const servicePlaceholder = () => Promise.resolve([])')) {
      content = content.replace(
        'const servicePlaceholder = () => Promise.resolve([])',
        'const servicePlaceholder = useCallback(() => Promise.resolve([]), [])'
      );
      modified = true;
      changes.push('servicePlaceholder useCallback');
    }

    // 4. Asegurar import de useCallback
    if (content.includes('useCallback') && !content.includes('useCallback')) {
      const reactImportMatch = content.match(/import React(?:, \{ ([^}]+) \})?/);
      if (reactImportMatch) {
        const existingImports = reactImportMatch[1] ? reactImportMatch[1].split(',').map(s => s.trim()) : [];
        if (!existingImports.includes('useCallback')) {
          existingImports.push('useCallback');
          content = content.replace(
            /import React(?:, \{ ([^}]+) \})?/,
            `import React, { ${existingImports.join(', ')} }`
          );
          modified = true;
          changes.push('useCallback import');
        }
      }
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      return { status: 'optimized', file: filePath, changes };
    } else {
      return { status: 'already_optimized', file: filePath };
    }

  } catch (error) {
    return { status: 'error', file: filePath, error: error.message };
  }
}

// Ejecutar optimización
let results = {
  optimized: [],
  already_optimized: [],
  not_entity_list: [],
  not_found: [],
  errors: []
};

console.log('🚀 Iniciando optimización masiva de EntityList components...\n');

entityListComponents.forEach(component => {
  const result = optimizeEntityListComponent(component);
  results[result.status].push(result);
});

// Mostrar resumen
console.log('📊 RESUMEN DE OPTIMIZACIÓN:');
console.log(`✅ Optimizados: ${results.optimized.length}`);
console.log(`ℹ️  Ya optimizados: ${results.already_optimized.length}`);
console.log(`⚠️  No son EntityList: ${results.not_entity_list.length}`);
console.log(`❌ No encontrados: ${results.not_found.length}`);
console.log(`🔥 Errores: ${results.errors.length}`);

if (results.optimized.length > 0) {
  console.log('\n🎯 COMPONENTES OPTIMIZADOS:');
  results.optimized.forEach(result => {
    console.log(`   • ${result.file} (${result.changes.join(', ')})`);
  });
}

if (results.errors.length > 0) {
  console.log('\n❌ ERRORES:');
  results.errors.forEach(result => {
    console.log(`   • ${result.file}: ${result.error}`);
  });
}

console.log('\n🎯 Se recomienda ejecutar npm run lint:check para verificar el estado.');
