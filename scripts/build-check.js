#!/usr/bin/env node

/**
 * Pre-build validation script for Kamunity
 * Checks environment variables and dependencies before building
 */

console.log('🔍 Running pre-build checks...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].slice(1));

console.log(`Node.js version: ${nodeVersion}`);
if (majorVersion < 18) {
  console.error('❌ Node.js 18+ required');
  process.exit(1);
}
console.log('✅ Node.js version OK\n');

// Check critical environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SITE_URL',
  'RESEND_API_KEY',
  'SENDGRID_FROM_EMAIL', // Note: kept for backwards compatibility
  'MIKE_FULLER_EMAIL'
];

const optionalEnvVars = [
  'NEXT_PUBLIC_CRISP_WEBSITE_ID',
  'NODE_ENV'
];

console.log('Checking environment variables:');

// Check required variables
let missingRequired = [];
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing (REQUIRED)`);
    missingRequired.push(varName);
  }
});

// Check optional variables
optionalEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚠️  ${varName}: Missing (optional - using fallback)`);
  }
});

if (missingRequired.length > 0) {
  console.error(`\n❌ Build failed: Missing required environment variables:`);
  missingRequired.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease set these variables in your deployment environment.');
  process.exit(1);
}

// Set fallback values for missing optional variables
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://kamunity.ai';
}

console.log('\n✅ All checks passed! Ready to build.\n'); 