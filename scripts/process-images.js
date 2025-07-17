const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration for all required images
const IMAGE_CONFIG = {
  // Logo configurations
  logo: {
    source: null, // Will be set by user
    outputs: [
      { path: 'public/kamunity-logo.png', width: 300, height: 100, format: 'png', background: { r: 0, g: 0, b: 0, alpha: 0 } },
      { path: 'public/logo.svg', width: null, height: null, format: 'svg' }, // SVG will be copied as-is or converted
    ]
  },
  
  // Bunnykat/Character mascot
  bunnykat: {
    source: null,
    outputs: [
      { path: 'public/character-mascot.png', width: 400, height: 400, format: 'png', background: { r: 0, g: 0, b: 0, alpha: 0 } },
    ]
  },
  
  // Hero images
  heroHome: {
    source: null,
    outputs: [
      { path: 'public/images/home-hero.jpg', width: 800, height: 600, format: 'jpeg', quality: 85 },
      { path: 'public/images/home-hero-mobile.jpg', width: 600, height: 800, format: 'jpeg', quality: 80 },
    ]
  },
  
  heroAbout: {
    source: null,
    outputs: [
      { path: 'public/images/about-hero.jpg', width: 800, height: 600, format: 'jpeg', quality: 85 },
    ]
  },
  
  heroContent: {
    source: null,
    outputs: [
      { path: 'public/images/content-hero.jpg', width: 800, height: 600, format: 'jpeg', quality: 85 },
    ]
  },
  
  // Favicon set (will use logo as source)
  favicons: {
    source: null, // Will use logo source
    outputs: [
      { path: 'public/favicon.ico', width: 32, height: 32, format: 'png' }, // Will convert to ICO later
      { path: 'public/favicon-16x16.png', width: 16, height: 16, format: 'png' },
      { path: 'public/favicon-32x32.png', width: 32, height: 32, format: 'png' },
      { path: 'public/apple-touch-icon.png', width: 180, height: 180, format: 'png' },
      { path: 'public/android-chrome-192x192.png', width: 192, height: 192, format: 'png' },
      { path: 'public/android-chrome-512x512.png', width: 512, height: 512, format: 'png' },
    ]
  },
  
  // Social sharing image
  ogImage: {
    source: null, // Will be generated from logo + text
    outputs: [
      { path: 'public/og-image.png', width: 1200, height: 630, format: 'png' },
    ]
  }
};

// Helper function to ensure directory exists
async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Process a single image with given configuration
async function processImage(sourceFile, outputConfig) {
  console.log(`Processing: ${sourceFile} -> ${outputConfig.path}`);
  
  await ensureDir(outputConfig.path);
  
  let image = sharp(sourceFile);
  
  // Get original image info
  const metadata = await image.metadata();
  console.log(`  Source: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);
  
  // Apply transformations
  if (outputConfig.width || outputConfig.height) {
    const resizeOptions = {
      width: outputConfig.width,
      height: outputConfig.height,
      fit: 'contain', // Maintain aspect ratio, add padding if needed
      background: outputConfig.background || { r: 255, g: 255, b: 255, alpha: 1 }
    };
    image = image.resize(resizeOptions);
  }
  
  // Convert format and apply quality settings
  switch (outputConfig.format) {
    case 'png':
      image = image.png({ quality: outputConfig.quality || 90 });
      break;
    case 'jpeg':
    case 'jpg':
      image = image.jpeg({ quality: outputConfig.quality || 85 });
      break;
    case 'webp':
      image = image.webp({ quality: outputConfig.quality || 80 });
      break;
  }
  
  // Save the processed image
  await image.toFile(outputConfig.path);
  console.log(`  ✓ Created: ${outputConfig.path}`);
}

// Generate Open Graph image with logo and text
async function generateOGImage(logoSource, outputPath) {
  console.log(`Generating OG image: ${outputPath}`);
  
  await ensureDir(outputPath);
  
  // Create a canvas with gradient background
  const canvas = sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 79, g: 70, b: 229, alpha: 1 } // Indigo background
    }
  });
  
  // If we have a logo, composite it onto the canvas
  if (logoSource) {
    const logo = await sharp(logoSource)
      .resize(300, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    
    canvas.composite([
      { input: logo, top: 200, left: 450 } // Center the logo
    ]);
  }
  
  await canvas.png().toFile(outputPath);
  console.log(`  ✓ Created: ${outputPath}`);
}

// Convert PNG to ICO format (simplified - just copy for now)
async function convertToIco(pngPath, icoPath) {
  // For now, just copy the PNG as ICO (browsers accept PNG in .ico files)
  await fs.copyFile(pngPath, icoPath);
  console.log(`  ✓ Converted to ICO: ${icoPath}`);
}

// Main processing function
async function processAllImages(sourceImages) {
  console.log('🚀 Starting image processing...\n');
  
  // Validate source images
  for (const [type, source] of Object.entries(sourceImages)) {
    if (source && IMAGE_CONFIG[type]) {
      try {
        await fs.access(source);
        IMAGE_CONFIG[type].source = source;
        console.log(`✓ Found ${type}: ${source}`);
      } catch {
        console.log(`❌ Cannot find ${type} source: ${source}`);
        return;
      }
    }
  }
  
  console.log('\n📁 Ensuring directories exist...');
  await ensureDir('public/images/temp.txt');
  
  // Process each image type
  for (const [type, config] of Object.entries(IMAGE_CONFIG)) {
    if (!config.source) {
      console.log(`⏭️  Skipping ${type} (no source provided)`);
      continue;
    }
    
    console.log(`\n🎨 Processing ${type}...`);
    
    // Special handling for favicons (use logo source)
    if (type === 'favicons' && !config.source && IMAGE_CONFIG.logo.source) {
      config.source = IMAGE_CONFIG.logo.source;
    }
    
    // Process each output configuration
    for (const outputConfig of config.outputs) {
      if (outputConfig.format === 'svg' && config.source.endsWith('.svg')) {
        // Just copy SVG files
        await ensureDir(outputConfig.path);
        await fs.copyFile(config.source, outputConfig.path);
        console.log(`  ✓ Copied SVG: ${outputConfig.path}`);
      } else {
        await processImage(config.source, outputConfig);
      }
    }
  }
  
  // Generate OG image
  if (IMAGE_CONFIG.logo.source) {
    console.log('\n🖼️  Generating Open Graph image...');
    await generateOGImage(IMAGE_CONFIG.logo.source, 'public/og-image.png');
  }
  
  // Convert favicon PNG to ICO
  const faviconPng = 'public/favicon-32x32.png';
  const faviconIco = 'public/favicon.ico';
  try {
    await convertToIco(faviconPng, faviconIco);
  } catch (error) {
    console.log(`⚠️  Could not convert to ICO: ${error.message}`);
  }
  
  console.log('\n✅ Image processing complete!');
  console.log('\n🔍 Generated files:');
  
  // List all generated files
  for (const config of Object.values(IMAGE_CONFIG)) {
    for (const output of config.outputs || []) {
      try {
        const stats = await fs.stat(output.path);
        console.log(`  ${output.path} (${Math.round(stats.size / 1024)}KB)`);
      } catch {
        // File doesn't exist, skip
      }
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎨 Kamunity Image Processor

Usage: node scripts/process-images.js [options]

Options:
  --logo <path>           Path to your logo file (PNG/SVG)
  --bunnykat <path>       Path to your character/mascot image  
  --hero-home <path>      Path to homepage hero image
  --hero-about <path>     Path to about page hero image
  --hero-content <path>   Path to content page hero image
  --help                  Show this help message

Examples:
  node scripts/process-images.js --logo "./my-logo.png" --bunnykat "./mascot.jpg"
  node scripts/process-images.js --logo "./logo.svg" --hero-home "./hero.jpg" --bunnykat "./character.png"

This script will:
✓ Resize and optimize all images for web
✓ Generate all required favicon sizes
✓ Create responsive image variants
✓ Generate Open Graph social sharing images
✓ Place everything in the correct locations
    `);
    return;
  }
  
  // Parse command line arguments
  const sourceImages = {};
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--logo':
        sourceImages.logo = value;
        sourceImages.favicons = value; // Use logo for favicons too
        break;
      case '--bunnykat':
        sourceImages.bunnykat = value;
        break;
      case '--hero-home':
        sourceImages.heroHome = value;
        break;
      case '--hero-about':
        sourceImages.heroAbout = value;
        break;
      case '--hero-content':
        sourceImages.heroContent = value;
        break;
      case '--help':
        console.log('Help message shown above');
        return;
    }
  }
  
  await processAllImages(sourceImages);
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = { processAllImages, IMAGE_CONFIG }; 