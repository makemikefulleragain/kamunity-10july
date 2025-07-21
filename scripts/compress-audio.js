#!/usr/bin/env node

/**
 * Audio Compression Script
 * 
 * This script provides multiple ways to compress audio files:
 * 1. Instructions for manual compression
 * 2. Web-based compression options
 * 3. Command-line solutions
 */

const fs = require('fs');
const path = require('path');

console.log('🎵 KAMUNITY AUDIO COMPRESSION TOOLKIT\n');

// Check if ffmpeg is available
function checkFFmpeg() {
  const { execSync } = require('child_process');
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Compress with ffmpeg if available
function compressWithFFmpeg(inputFile, outputFile, quality = '128k') {
  const { execSync } = require('child_process');
  
  try {
    console.log(`🔄 Compressing ${inputFile} to ${quality} bitrate...`);
    
    const command = `ffmpeg -i "${inputFile}" -acodec mp3 -ab ${quality} "${outputFile}" -y`;
    execSync(command, { stdio: 'inherit' });
    
    const originalSize = fs.statSync(inputFile).size;
    const compressedSize = fs.statSync(outputFile).size;
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Compression complete!`);
    console.log(`📉 Size reduction: ${reduction}%`);
    console.log(`📁 Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📁 Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    
    return true;
  } catch (error) {
    console.error('❌ FFmpeg compression failed:', error.message);
    return false;
  }
}

// Main function
function main() {
  const audioDir = path.join(process.cwd(), 'public', 'audio');
  const targetFile = path.join(audioDir, 'KAMUNITY_NEWS_TODAY.mp3');
  const compressedFile = path.join(audioDir, 'KAMUNITY_NEWS_TODAY_COMPRESSED.mp3');
  
  // Check if target file exists
  if (!fs.existsSync(targetFile)) {
    console.log('❌ KAMUNITY_NEWS_TODAY.mp3 not found in public/audio/');
    return;
  }
  
  const fileSize = fs.statSync(targetFile).size;
  const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
  
  console.log(`📁 Current file size: ${fileSizeMB} MB`);
  
  if (fileSize < 2 * 1024 * 1024) { // Less than 2MB
    console.log('✅ File size is acceptable (<2MB). No compression needed.');
    return;
  }
  
  console.log(`⚠️  File is large (${fileSizeMB} MB). Compression recommended.\n`);
  
  // Try ffmpeg compression
  if (checkFFmpeg()) {
    console.log('✅ FFmpeg found! Attempting compression...\n');
    
    if (compressWithFFmpeg(targetFile, compressedFile, '128k')) {
      console.log(`\n📝 To use compressed file, run:`);
      console.log(`   copy "${compressedFile}" "${targetFile}"`);
      return;
    }
  }
  
  // Fallback options
  console.log('🔧 COMPRESSION OPTIONS:\n');
  
  console.log('Option 1: Online Compression');
  console.log('   • Visit: https://www.freeconvert.com/mp3-compressor');
  console.log('   • Upload your file and compress to 128kbps');
  console.log('   • Download and replace KAMUNITY_NEWS_TODAY.mp3\n');
  
  console.log('Option 2: Install FFmpeg');
  console.log('   • Run as Administrator: choco install ffmpeg');
  console.log('   • Then run this script again\n');
  
  console.log('Option 3: Manual with Audacity');
  console.log('   • Download Audacity (free)');
  console.log('   • File > Export > Export as MP3');
  console.log('   • Set Quality to 128 kbps');
  console.log('   • Save as KAMUNITY_NEWS_TODAY.mp3\n');
  
  console.log('Option 4: Use CDN');
  console.log('   • Upload to AWS S3, Cloudinary, or Google Drive');
  console.log('   • Update audio src to use external URL\n');
  
  console.log('🎯 Recommended: Option 1 (online compression) for quick results!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { compressWithFFmpeg, checkFFmpeg }; 