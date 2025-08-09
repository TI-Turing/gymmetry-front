const fs = require('fs');
const path = require('path');

function fixImportStatements() {
  const filesToCheck = [
    'components/exercise/DailyExerciseHistoryList.tsx',
    'components/exercise/DailyExerciseList.tsx',
    'components/history/DailyHistoryList.tsx',
    'components/occupancy/CurrentOccupancyList.tsx',
    'components/plan/PlanList.tsx'
  ];

  let fixedCount = 0;

  filesToCheck.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relativePath}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      // Fix all import: statements to import statements
      content = content.replace(/^import:\s+/gm, 'import ');
      
      // Fix any other malformed import patterns
      content = content.replace(/^import\s*:\s*/gm, 'import ');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed imports: ${relativePath}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  No import issues: ${relativePath}`);
      }

    } catch (error) {
      console.log(`❌ Error processing ${relativePath}:`, error.message);
    }
  });

  console.log(`\n🎯 Files fixed: ${fixedCount}/${filesToCheck.length}`);
}

fixImportStatements();
