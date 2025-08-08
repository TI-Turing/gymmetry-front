const fs = require('fs');
const path = require('path');

// Buscar y corregir errores de "," expected en archivos optimizados
function fixCommaErrors() {
  const componentDirs = [
    'components/branchMedia',
    'components/branch', 
    'components/comment',
    'components/currentOccupancy',
    'components/dailyExercise',
    'components/dailyHistory',
    'components/diet',
    'components/employeeRegisterDaily',
    'components/employeeType',
    'components/employeeUser',
    'components/equipment',
    'components/exercise',
    'components/feed',
    'components/fitUser',
    'components/gymImage',
    'components/gymPlanSelectedModule',
    'components/gymPlanSelectedType',
    'components/gymType',
    'components/gym',
    'components/history',
    'components/journeyEmployee',
    'components/like',
    'components/logUninstall',
    'components/machineCategory',
    'components/machine',
    'components/module',
    'components/notificationOption',
    'components/notification',
    'components/occupancy',
    'components/otp',
    'components/paymentMethod',
    'components/permission',
    'components/physicalAssessment',
    'components/planType',
    'components/plan',
    'components/routineAssigned',
    'components/routineDay',
    'components/routineExercise',
    'components/routineTemplate',
    'components/schedule',
    'components/signalR',
    'components/subModule',
    'components/uninstallOption',
    'components/userType'
  ];

  let fixedFiles = 0;

  componentDirs.forEach(dir => {
    const listFile = path.join(__dirname, dir, `${path.basename(dir).charAt(0).toUpperCase() + path.basename(dir).slice(1)}List.tsx`);
    const possibleFiles = [
      listFile,
      path.join(__dirname, dir, 'List.tsx'),
      path.join(__dirname, `${dir}List.tsx`)
    ];

    possibleFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          let modified = false;

          // Buscar patrones que causen el error de coma
          
          // Patrón 1: Falta coma al final de propiedades en objetos
          const patterns = [
            // Objeto de estilos mal formateado
            /(\w+:\s*\{[^}]+\})\s*$/gm,
            // Propiedades de StyleSheet sin coma final
            /(elevation:\s*\d+)\s*$/gm,
            // Arrays mal cerrados
            /(\])\s*$/gm
          ];

          patterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
              content = content.replace(pattern, '$1,');
              modified = true;
            }
          });

          // Buscar la línea específica donde se espera coma
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Si la línea anterior era una propiedad de objeto y esta línea comienza con }
            if (i > 0 && line === '}' && lines[i-1].trim().match(/^\w+:/) && !lines[i-1].trim().endsWith(',')) {
              lines[i-1] = lines[i-1] + ',';
              modified = true;
            }
            
            // Si encontramos un bloque de estilos sin coma al final
            if (line.includes('elevation:') && !line.endsWith(',') && i < lines.length - 1 && lines[i+1].trim() === '}') {
              lines[i] = lines[i] + ',';
              modified = true;
            }
          }

          if (modified) {
            const newContent = lines.join('\n');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ Corregido: ${path.relative(__dirname, filePath)}`);
            fixedFiles++;
          }

        } catch (error) {
          console.log(`❌ Error procesando ${path.relative(__dirname, filePath)}: ${error.message}`);
        }
      }
    });
  });

  console.log(`\n📊 Resumen: ${fixedFiles} archivos corregidos`);
}

console.log('🔧 Corrigiendo errores de "," expected...\n');
fixCommaErrors();
