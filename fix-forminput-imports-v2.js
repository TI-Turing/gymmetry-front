const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else if (file.endsWith('.tsx')) {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function fixFormInputImports() {
  console.log('🔧 Iniciando corrección masiva de imports de FormInput...\n');
  
  // Buscar todos los archivos tsx en components
  const files = getAllFiles('./components');
  
  let fixedCount = 0;
  
  files.forEach(filePath => {
    try {
      if (!fs.existsSync(filePath)) {
        return;
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Buscar el patrón problemático: import { FormInput } from '../common/FormInput' o similar
      const problemPattern = /import\s*{\s*FormInput\s*}\s*from\s*['"`]([.\/]*common\/FormInput)['"`];?/;
      
      if (problemPattern.test(content)) {
        // Reemplazar con import default
        const newContent = content.replace(
          /import\s*{\s*FormInput\s*}\s*from\s*['"`]([.\/]*common\/FormInput)['"`];?/g,
          "import FormInput from '$1';"
        );
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Corregido: ${filePath}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Error procesando ${filePath}:`, error.message);
    }
  });
  
  console.log(`\n📊 Resumen: ${fixedCount} archivos corregidos`);
}

function fixCommonIndexExport() {
  console.log('\n🔧 Corrigiendo export en components/common/index.ts...');
  
  const indexPath = 'components/common/index.ts';
  try {
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      const newContent = content.replace(
        /export\s*{\s*FormInput\s*}\s*from\s*['"`]\.\/FormInput['"`];?/,
        "export { default as FormInput } from './FormInput';"
      );
      
      if (content !== newContent) {
        fs.writeFileSync(indexPath, newContent, 'utf8');
        console.log(`✅ Corregido: ${indexPath}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error procesando ${indexPath}:`, error.message);
  }
}

function main() {
  fixFormInputImports();
  fixCommonIndexExport();
  console.log('\n🎉 Corrección masiva completada!');
}

main();
