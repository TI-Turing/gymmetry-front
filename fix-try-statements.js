const fs = require('fs');
const path = require('path');

function fixTryStatements() {
  const allFiles = [
    'components/exercise/DailyExerciseHistoryList.tsx',
    'components/exercise/DailyExerciseList.tsx',
    'components/history/DailyHistoryList.tsx',
    'components/occupancy/CurrentOccupancyList.tsx',
    'components/plan/PlanList.tsx'
  ];

  let fixedCount = 0;

  allFiles.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relativePath}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      // Fix try: statements to try statements
      content = content.replace(/try:\s*{/g, 'try {');
      
      // Fix catch: statements to catch statements
      content = content.replace(/catch:\s*{/g, 'catch {');
      
      // Fix property: object syntax issues
      content = content.replace(/(\w+):\s*{/g, '$1: {');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed syntax: ${relativePath}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  No syntax issues: ${relativePath}`);
      }

    } catch (error) {
      console.log(`❌ Error processing ${relativePath}:`, error.message);
    }
  });

  console.log(`\n🎯 Files fixed: ${fixedCount}/${allFiles.length}`);
}

fixTryStatements();
