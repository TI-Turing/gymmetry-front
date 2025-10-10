const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to disable R8 minification completely
 * This prevents Coil3.PlatformContext removal issues
 */
const withDisableR8 = (config) => {
  return withAppBuildGradle(config, (config) => {
    const { modResults } = config;
    let contents = modResults.contents;

    // Replace all minifyEnabled references with false (hardcoded)
    contents = contents.replace(
      /minifyEnabled\s+enableMinifyInReleaseBuilds/g,
      'minifyEnabled false'
    );

    // Replace all shrinkResources references with false (hardcoded)
    contents = contents.replace(
      /shrinkResources\s+enableShrinkResources\.toBoolean\(\)/g,
      'shrinkResources false'
    );

    // Also replace any true values directly
    contents = contents.replace(/minifyEnabled\s+true/g, 'minifyEnabled false');

    contents = contents.replace(
      /shrinkResources\s+true/g,
      'shrinkResources false'
    );

    // Remove duplicate minifyEnabled/shrinkResources lines in release block
    contents = contents.replace(
      /(release\s*\{[\s\S]*?)(minifyEnabled\s+false\s+shrinkResources\s+false\s+)([\s\S]*?)(minifyEnabled[\s\S]*?shrinkResources[\s\S]*?)(proguardFiles)/,
      '$1$2$5'
    );

    modResults.contents = contents;
    return config;
  });
};

module.exports = withDisableR8;
