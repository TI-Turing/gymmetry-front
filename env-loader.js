const path = require('path');
const fs = require('fs');

/**
 * Copies the appropriate .env file from environment folder to project root
 * This ensures that Expo can find and load the correct .env file based on NODE_ENV
 */
function setupEnvironmentFile() {
  const envPath = path.join(__dirname, 'environment');
  const nodeEnv = process.env.NODE_ENV || 'local';
  
  // Determine which .env file to load based on NODE_ENV
  let envFile;
  switch (nodeEnv) {
    case 'local':
      envFile = '.env.local';
      break;
    case 'development':
    case 'dev':
      envFile = '.env.development';
      break;
    case 'production':
    case 'prod':
      envFile = '.env.production';
      break;
    default:
      envFile = '.env.local';
  }
  
  const sourceFile = path.join(envPath, envFile);
  const targetFile = path.join(__dirname, '.env');
  
  // Check if the source file exists
  if (fs.existsSync(sourceFile)) {
    try {
      // Copy the content to .env in project root
      let envContent = fs.readFileSync(sourceFile, 'utf8');
      
      // Ensure EXPO_PUBLIC_ENV is set if not present
      if (!envContent.includes('EXPO_PUBLIC_ENV')) {
        envContent = `EXPO_PUBLIC_ENV=${nodeEnv}\n${envContent}`;
      }
      
      fs.writeFileSync(targetFile, envContent);
    } catch (err) {
      console.error(`❌ Error copying environment file: ${err.message}`);
    }
  } else {
    console.warn(`⚠️ Environment file not found: ${sourceFile}`);
    console.warn(`Available files in ${envPath}:`);
    
    try {
      const files = fs.readdirSync(envPath);
      files.filter(f => f.startsWith('.env')).forEach(f => {
        console.warn(`  - ${f}`);
      });
    } catch (err) {
      console.warn(`Error reading environment directory: ${err.message}`);
    }
  }
}

// If called directly (not required), set up the environment file
if (require.main === module) {
  setupEnvironmentFile();
}

module.exports = { setupEnvironmentFile };
