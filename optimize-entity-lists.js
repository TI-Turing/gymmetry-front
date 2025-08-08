const fs = require('fs');
const path = require('path');

// Lista de componentes EntityList identificados previamente
const entityListComponents = [
  'components/auth/FilterableModal.tsx',
  'components/auth/UserManagementList.tsx',
  'components/branches/BranchList.tsx',
  'components/branches/BranchMediaList.tsx',
  'components/catalogs/AccessMethodTypeList.tsx',
  'components/catalogs/CatalogEntityList.tsx',
  'components/catalogs/CityList.tsx',
  'components/catalogs/CountryList.tsx',
  'components/catalogs/CurrencyList.tsx',
  'components/catalogs/IdentificationTypeList.tsx',
  'components/catalogs/MeasurementUnitList.tsx',
  'components/catalogs/NotificationChannelList.tsx',
  'components/catalogs/RegionList.tsx',
  'components/common/CustomEntityList.tsx',
  'components/common/EntityList.tsx',
  'components/common/SearchableList.tsx',
  'components/gym/EquipmentList.tsx',
  'components/gym/GymList.tsx',
  'components/gym/ServiceList.tsx',
  'components/layout/ModuleList.tsx',
  'components/layout/TabList.tsx',
  'components/plan/PersonalPlanList.tsx',
  'components/plan/PlanCommentList.tsx',
  'components/plan/PlanList.tsx',
  'components/plan/PlanProgressList.tsx',
  'components/plan/PlanVisitList.tsx',
  'components/planType/PlanTypeList.tsx',
  'components/branchService/BranchServiceList.tsx',
];

function optimizeEntityListComponent(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // 1. Agregar React.memo si no está presente
    if (!content.includes('React.memo') && content.includes('export function ')) {
      // Buscar la función exportada principal
      const functionMatch = content.match(/export function (\w+)\s*\(/);
      if (functionMatch) {
        const functionName = functionMatch[1];
        
        // Reemplazar export function con const + React.memo
        content = content.replace(
          new RegExp(`export function ${functionName}\\s*\\(`),
          `const ${functionName} = React.memo((`
        );

        // Encontrar el cierre de la función y agregar cierre de React.memo
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
            // Contar llaves para encontrar el final de la función
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
          
          // Agregar export default al final si no existe
          if (!content.includes(`export default ${functionName}`)) {
            lines.push(`\nexport default ${functionName};`);
          }
          
          content = lines.join('\n');
          modified = true;
        }
      }
    }

    // 2. Optimizar useCallback para servicePlaceholder si existe
    if (content.includes('const servicePlaceholder = () => Promise.resolve([])')) {
      content = content.replace(
        'const servicePlaceholder = () => Promise.resolve([])',
        'const servicePlaceholder = useCallback(() => Promise.resolve([]), [])'
      );
      modified = true;
    }

    // 3. Asegurar que useCallback está importado si se usa
    if (content.includes('useCallback') && !content.includes('import React, { useCallback }')) {
      content = content.replace(
        /import React(?:, \{ ([^}]+) \})?/,
        (match, imports) => {
          const existingImports = imports ? imports.split(',').map(s => s.trim()) : [];
          if (!existingImports.includes('useCallback')) {
            existingImports.push('useCallback');
          }
          return `import React, { ${existingImports.join(', ')} }`;
        }
      );
      modified = true;
    }

    // 4. Optimizar keyExtractor y renderItem con useCallback si no están optimizados
    const keyExtractorMatch = content.match(/const keyExtractor = ([^;]+);/);
    if (keyExtractorMatch && !keyExtractorMatch[1].includes('useCallback')) {
      content = content.replace(
        /const keyExtractor = ([^;]+);/,
        'const keyExtractor = useCallback($1, []);'
      );
      modified = true;
    }

    const renderItemMatch = content.match(/const render\w*Item = ([^;]+);/);
    if (renderItemMatch && !renderItemMatch[1].includes('useCallback')) {
      content = content.replace(
        /const (render\w*Item) = ([^;]+);/,
        'const $1 = useCallback($2, []);'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Optimizado: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  Ya optimizado: ${filePath}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Ejecutar optimización
console.log('🚀 Iniciando optimización de EntityList components...\n');

let totalProcessed = 0;
let totalOptimized = 0;

entityListComponents.forEach(component => {
  totalProcessed++;
  if (optimizeEntityListComponent(component)) {
    totalOptimized++;
  }
});

console.log(`\n📊 Resumen de optimización:`);
console.log(`   • Componentes procesados: ${totalProcessed}`);
console.log(`   • Componentes optimizados: ${totalOptimized}`);
console.log(`   • Sin cambios: ${totalProcessed - totalOptimized}`);

if (totalOptimized > 0) {
  console.log('\n🎯 Se recomienda ejecutar npm run lint:check para verificar el estado.');
}
