#!/usr/bin/env node

/**
 * Debug build script for Netlify troubleshooting
 */

console.log('🐛 Debug Build Information\n');

// Environment information
console.log('=== ENVIRONMENT ===');
console.log(`Node.js: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);
console.log(`Working Directory: ${process.cwd()}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);

// Check if this is a Netlify build
if (process.env.NETLIFY) {
  console.log('🌐 Running on Netlify');
  console.log(`Build ID: ${process.env.BUILD_ID || 'undefined'}`);
  console.log(`Deploy URL: ${process.env.DEPLOY_URL || 'undefined'}`);
} else {
  console.log('💻 Running locally');
}

console.log('\n=== PACKAGE INFO ===');
try {
  const packageJson = require('../package.json');
  console.log(`Name: ${packageJson.name}`);
  console.log(`Version: ${packageJson.version}`);
} catch (error) {
  console.log('❌ Could not read package.json');
}

console.log('\n=== CRITICAL PATHS ===');
const fs = require('fs');
const path = require('path');

const criticalPaths = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'src',
  'src/pages',
  'src/components'
];

criticalPaths.forEach(pathName => {
  const fullPath = path.join(process.cwd(), pathName);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${pathName}`);
  } else {
    console.log(`❌ ${pathName} - MISSING`);
  }
});

console.log('\n=== ENVIRONMENT VARIABLES ===');
const envVars = [
  'NEXT_PUBLIC_SITE_URL',
  'NODE_ENV',
  'NETLIFY',
  'BUILD_ID'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: undefined`);
  }
});

console.log('\n=== DEPENDENCIES ===');
try {
  const packageJson = require('../package.json');
  const deps = Object.keys(packageJson.dependencies || {});
  console.log(`Dependencies count: ${deps.length}`);
  console.log('Critical dependencies:');
  ['next', 'react', 'react-dom'].forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: MISSING`);
    }
  });
} catch (error) {
  console.log('❌ Could not check dependencies');
}

console.log('\n=== CHECKING IMPORTS ===');
try {
  // Check for critical files that might cause build failures
  const criticalFiles = [
    'src/lib/constants.ts',
    'src/types/index.ts',
    'src/components/Layout.tsx',
    'src/pages/_app.tsx',
    'src/pages/index.tsx'
  ];
  
  criticalFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${filePath}`);
    } else {
      console.log(`❌ ${filePath} - MISSING (may cause build failure)`);
    }
  });
} catch (error) {
  console.log('❌ Error checking critical files:', error.message);
}

console.log('\n=== BUILD ATTEMPT ===');
console.log('Starting Next.js build with error capture...\n');

console.log('\n🐛 Debug information complete\n'); 