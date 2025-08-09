const fs = require('fs');

const problematicFiles = [
  'components/diet/DietList.tsx',
  'components/employeeRegisterDaily/EmployeeRegisterDailyList.tsx',
  'components/employeeType/EmployeeTypeList.tsx',
  'components/employeeUser/EmployeeUserList.tsx',
  'components/equipment/EquipmentList.tsx',
  'components/exercise/ExerciseList.tsx',
  'components/feed/FeedList.tsx',
  'components/gymImage/GymImageList.tsx',
  'components/paymentMethod/PaymentMethodList.tsx'
];

function fixDataPropertyReferences() {
  console.log('🔧 Corrigiendo referencias a .Data en servicios...\n');
  
  let fixedCount = 0;
  
  problematicFiles.forEach(filePath => {
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${filePath}`);
        return;
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Reemplazar response.Data con response (ya que catalogService devuelve arrays directamente)
      const newContent = content.replace(
        /return response\.Data \|\| \[\];/g,
        'return response || [];'
      );
      
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Corregido: ${filePath}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  No requiere cambios: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error procesando ${filePath}:`, error.message);
    }
  });
  
  console.log(`\n📊 Resumen: ${fixedCount} archivos corregidos de ${problematicFiles.length} procesados`);
}

fixDataPropertyReferences();
