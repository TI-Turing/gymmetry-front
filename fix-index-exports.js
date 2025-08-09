const fs = require('fs');
const path = require('path');

// Lista de directorios que contienen archivos index.ts con problemas de export
const problemPaths = [
  'components/branch/index.ts',
  'components/branchMedia/index.ts',
  'components/branchService/index.ts',
  'components/comment/index.ts',
  'components/currentOccupancy/index.ts',
  'components/dailyExercise/index.ts',
  'components/dailyHistory/index.ts',
  'components/diet/index.ts',
  'components/employeeRegisterDaily/index.ts',
  'components/employeeType/index.ts',
  'components/employeeUser/index.ts',
  'components/exercise/index.ts',
  'components/feed/index.ts',
  'components/fitUser/index.ts',
  'components/gym/index.ts',
  'components/gymImage/index.ts',
  'components/gymPlanSelectedModule/index.ts',
  'components/gymPlanSelectedType/index.ts',
  'components/gymType/index.ts',
  'components/journeyEmployee/index.ts',
  'components/like/index.ts',
  'components/logUninstall/index.ts',
  'components/machine/index.ts',
  'components/machineCategory/index.ts',
  'components/module/index.ts',
  'components/notification/index.ts',
  'components/notificationOption/index.ts',
  'components/otp/index.ts',
  'components/permission/index.ts',
  'components/physicalAssessment/index.ts',
  'components/plan/index.ts',
  'components/planType/index.ts',
  'components/post/index.ts',
  'components/routineAssigned/index.ts',
  'components/routineDay/index.ts',
  'components/routineExercise/index.ts',
  'components/routineTemplate/index.ts',
  'components/schedule/index.ts',
  'components/signalR/index.ts',
  'components/subModule/index.ts',
  'components/uninstallOption/index.ts',
  'components/userType/index.ts'
];

function fixIndexFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar el patrón: export { ComponentName } from './ComponentFile';
    const namedExportPattern = /export\s*{\s*(\w+)\s*}\s*from\s*['"`]\.\/(\w+)['"`];?/;
    const match = content.match(namedExportPattern);
    
    if (match) {
      const componentName = match[1];
      const fileName = match[2];
      
      // Crear el nuevo contenido usando default export
      const newContent = `export { default as ${componentName} } from './${fileName}';`;
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Corregido: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No requiere corrección: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Iniciando corrección de archivos index.ts...\n');
  
  let fixedCount = 0;
  
  for (const relativePath of problemPaths) {
    const fullPath = path.join(__dirname, relativePath);
    if (fixIndexFile(fullPath)) {
      fixedCount++;
    }
  }
  
  console.log(`\n📊 Resumen: ${fixedCount} archivos corregidos de ${problemPaths.length} procesados`);
}

main();
