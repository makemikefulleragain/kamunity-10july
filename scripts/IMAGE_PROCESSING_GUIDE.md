# 🎨 Image Processing Guide

## Overview
This script automatically converts, resizes, and optimizes your images for the Kamunity website. No more manual resizing!

## Quick Start

### 1. Put your images anywhere on your computer
Examples:
- `C:\Users\mikef\Downloads\my-logo.png`
- `./Desktop/bunnykat-character.jpg`
- `./Photos/hero-image.jpg`

### 2. Run the processing script
```bash
# Minimum required (logo + bunnykat):
npm run process-images -- --logo "C:\path\to\your\logo.png" --bunnykat "C:\path\to\bunnykat.jpg"

# Full example with all images:
npm run process-images -- --logo "./my-logo.png" --bunnykat "./character.jpg" --hero-home "./hero.jpg" --hero-about "./about.jpg" --hero-content "./content.jpg"
```

### 3. That's it! 
The script will automatically:
- ✅ Resize everything to perfect dimensions
- ✅ Generate all favicon sizes (16x16, 32x32, 180x180, etc.)
- ✅ Create optimized web formats
- ✅ Generate social sharing images
- ✅ Place everything in the right folders

## What Images Do You Need?

### Required:
- **Logo**: Your main Kamunity logo (any size, PNG/SVG preferred)
- **Bunnykat**: Your character/mascot image (any size)

### Optional but Recommended:
- **Hero Home**: Background image for homepage hero section
- **Hero About**: Background image for about page
- **Hero Content**: Background image for content page

## Example Commands

### Just logo and character:
```bash
npm run process-images -- --logo "./Downloads/kamunity-logo.png" --bunnykat "./Downloads/bunnykat-mascot.jpg"
```

### Logo, character, and homepage hero:
```bash
npm run process-images -- --logo "./logo.svg" --bunnykat "./mascot.png" --hero-home "./hero-bg.jpg"
```

### Everything:
```bash
npm run process-images -- --logo "./assets/logo.png" --bunnykat "./assets/character.jpg" --hero-home "./assets/home-bg.jpg" --hero-about "./assets/about-bg.jpg" --hero-content "./assets/content-bg.jpg"
```

## What Gets Generated

### From your Logo:
- `public/kamunity-logo.png` (300x100) - Header logo
- `public/logo.svg` (copied if SVG, or converted)
- `public/favicon.ico` (32x32) - Browser icon
- `public/favicon-16x16.png` (16x16)
- `public/favicon-32x32.png` (32x32)
- `public/apple-touch-icon.png` (180x180) - iOS home screen
- `public/android-chrome-192x192.png` (192x192) - Android
- `public/android-chrome-512x512.png` (512x512) - Android
- `public/og-image.png` (1200x630) - Social sharing

### From your Bunnykat:
- `public/character-mascot.png` (400x400) - Used throughout site

### From your Hero images:
- `public/images/home-hero.jpg` (800x600) - Homepage background
- `public/images/home-hero-mobile.jpg` (600x800) - Mobile homepage
- `public/images/about-hero.jpg` (800x600) - About page background
- `public/images/content-hero.jpg` (800x600) - Content page background

## File Size Tips

### Your source images can be:
- ✅ Any size (will be resized automatically)
- ✅ Any format: PNG, JPG, JPEG, SVG, WebP, GIF
- ✅ High resolution (better quality after processing)

### The script will optimize them to:
- 📱 Perfect web sizes
- 🚀 Fast loading speeds
- 💾 Small file sizes
- 🖥️ Retina display ready

## Troubleshooting

### "Cannot find source file":
- Make sure the file path is correct
- Use full paths like `C:\Users\mikef\Downloads\logo.png`
- Or relative paths like `./Desktop/logo.png`

### "Command not found":
- Make sure you're in the project directory
- Run `npm install` first if needed

### "Sharp error":
- The sharp library handles most image formats
- If you get errors, try converting to PNG first

## What Happens After Processing?

1. **Automatic replacement**: All your placeholder images get replaced
2. **No code changes needed**: The website already looks for these files
3. **Instant results**: Refresh your browser to see the new images
4. **Perfect optimization**: Everything is web-ready and fast-loading

## Next Steps

After running the script:
1. ✅ Check your website at `http://localhost:3000`
2. ✅ Verify images load correctly
3. ✅ Test on mobile and desktop
4. ✅ Deploy when ready!

---

## Quick Reference

```bash
# Show help
npm run process-images

# Basic usage
npm run process-images -- --logo "path/to/logo.png" --bunnykat "path/to/character.jpg"

# Advanced usage  
npm run process-images -- --logo "./logo.svg" --bunnykat "./mascot.png" --hero-home "./hero.jpg" --hero-about "./about.jpg" --hero-content "./content.jpg"
```

**Ready to make your images perfect? Just run the command with your image paths!** 🚀 