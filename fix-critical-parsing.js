const fs = require('fs');
const path = require('path');

// Archivos con errores críticos de parsing
const criticalFiles = [
  'components/gym/GymScreen.tsx',
  'components/gym/GymInfoView.tsx'
];

function fixCriticalParsingErrors() {
  console.log('🔧 Corrigiendo errores críticos de parsing...\n');
  
  criticalFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        // 1. Arreglar imports problemáticos
        if (content.includes("import {") && content.includes("} from 'react-native'")) {
          // Reorganizar imports de react-native para mejor legibilidad
          content = content.replace(
            /import\s*\{([^}]+)\}\s*from\s*'react-native'/g,
            (match, imports) => {
              const cleanImports = imports.split(',').map(imp => imp.trim()).join(', ');
              return `import { ${cleanImports} } from 'react-native'`;
            }
          );
          modified = true;
        }
        
        // 2. Asegurar que no hay declaraciones después de export default
        const exportDefaultMatch = content.match(/export default [^;]+;([\s\S]*)/);
        if (exportDefaultMatch && exportDefaultMatch[1].trim()) {
          // Hay código después del export default - moverlo antes
          const afterExport = exportDefaultMatch[1];
          content = content.replace(/export default [^;]+;[\s\S]*/, '');
          content = content + '\n' + afterExport + '\n\nexport default withWebLayout(GymScreen, { defaultTab: \'gym\' });';
          modified = true;
        }
        
        // 3. Verificar que la función principal retorna JSX
        const functionMatch = content.match(/function\s+(\w+)\s*\([^)]*\)\s*:\s*React\.JSX\.Element\s*\{/);
        if (functionMatch) {
          const functionName = functionMatch[1];
          
          // Buscar el return statement
          const returnMatch = content.match(new RegExp(`function\\s+${functionName}[^{]*\\{([\\s\\S]*?)^\\}`, 'm'));
          if (returnMatch && !returnMatch[1].includes('return (')) {
            console.log(`⚠️  ${filePath}: Función ${functionName} podría no tener return válido`);
          }
        }
        
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`✅ Corregido: ${filePath}`);
        } else {
          console.log(`ℹ️  Sin cambios: ${filePath}`);
        }
        
      } catch (error) {
        console.log(`❌ Error procesando ${filePath}: ${error.message}`);
      }
    } else {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    }
  });
}

// Ejecutar corrección
fixCriticalParsingErrors();

console.log('\n🎯 Corrección completada. Ejecutar npm run lint:check para verificar.');
