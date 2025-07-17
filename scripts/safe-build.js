#!/usr/bin/env node

/**
 * Safe build script with comprehensive error handling
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🛡️  Safe Build Script Starting...\n');

// Set environment defaults
if (!process.env.NEXT_PUBLIC_SITE_URL) {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://kamunity.org';
  console.log('📝 Set NEXT_PUBLIC_SITE_URL fallback');
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log('📝 Set NODE_ENV to production');
}

console.log('\n🔨 Starting Next.js build...\n');

// Run next build with proper error handling
const isWindows = process.platform === 'win32';
const command = isWindows ? 'npx.cmd' : 'npx';

const buildProcess = spawn(command, ['next', 'build'], {
  stdio: 'inherit',
  env: { ...process.env },
  cwd: process.cwd(),
  shell: isWindows
});

buildProcess.on('error', (error) => {
  console.error('❌ Build process error:', error);
  process.exit(1);
});

buildProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('\n✅ Build completed successfully!');
    process.exit(0);
  } else {
    console.error(`\n❌ Build failed with exit code: ${code}`);
    console.error('This usually indicates a compilation or configuration error.');
    console.error('Check the output above for specific error details.');
    process.exit(code);
  }
}); 