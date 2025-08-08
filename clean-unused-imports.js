const fs = require('fs');
const path = require('path');

function cleanUnusedImports() {
  const directories = [
    'components',
    'services', 
    'hooks',
    'utils',
    'contexts'
  ];

  let cleanedFiles = 0;
  const results = [];

  directories.forEach(dir => {
    const fullDirPath = path.join(__dirname, dir);
    if (fs.existsSync(fullDirPath)) {
      processDirectory(fullDirPath, results);
    }
  });

  function processDirectory(dirPath, results) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        processDirectory(itemPath, results);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const result = cleanFileImports(itemPath);
        if (result.cleaned) {
          results.push(result);
          cleanedFiles++;
        }
      }
    });
  }

  function cleanFileImports(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      let cleaned = false;
      const removedImports = [];

      // Patrones comunes de imports no utilizados
      const unusedPatterns = [
        // Imports específicos reportados por lint
        { pattern: /import.*TextInput.*from.*react-native.*\n/, name: 'TextInput (no usado)' },
        { pattern: /import.*FormInput.*from.*\n/, name: 'FormInput (no usado)' },
        { pattern: /import.*BackHandler.*from.*react-native.*\n/, name: 'BackHandler (no usado)' },
        { pattern: /import.*useColorScheme.*from.*\n/, name: 'useColorScheme (no usado)' },
        { pattern: /import.*createJSReanimatedModule.*from.*\n/, name: 'createJSReanimatedModule (no usado)' },
        
        // Patterns específicos encontrados en el lint
        { pattern: /import.*PasswordValidation.*from.*\n/, name: 'PasswordValidation (no usado)' },
        { pattern: /import.*CountryType.*from.*\n/, name: 'CountryType (no usado)' },
        { pattern: /import.*Environment.*from.*\n/, name: 'Environment (no usado)' }
      ];

      unusedPatterns.forEach(({ pattern, name }) => {
        if (pattern.test(newContent)) {
          newContent = newContent.replace(pattern, '');
          removedImports.push(name);
          cleaned = true;
        }
      });

      // Limpiar líneas vacías consecutivas que quedan después de remover imports
      if (cleaned) {
        newContent = newContent.replace(/\n\n\n+/g, '\n\n');
        fs.writeFileSync(filePath, newContent, 'utf8');
      }

      return {
        file: path.relative(__dirname, filePath),
        cleaned,
        removedImports
      };

    } catch (error) {
      return {
        file: path.relative(__dirname, filePath),
        cleaned: false,
        error: error.message
      };
    }
  }

  console.log('🧹 Limpieza de imports no utilizados completada\n');
  console.log(`📊 Archivos procesados: ${cleanedFiles}`);
  
  if (results.length > 0) {
    console.log('\n✅ Archivos limpiados:');
    results.forEach(result => {
      console.log(`   • ${result.file}: ${result.removedImports.join(', ')}`);
    });
  }
}

cleanUnusedImports();
