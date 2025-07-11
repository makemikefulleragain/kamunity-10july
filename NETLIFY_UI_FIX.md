# 🚨 NETLIFY UI FIX - DO THIS FIRST!

## Steps to Fix in Netlify Dashboard:

1. **Go to your Netlify site dashboard**
2. **Click on "Site configuration" → "Build & deploy" → "Continuous deployment"**
3. **Find "Build settings" and click "Edit settings"**
4. **Update these fields:**
   - **Base directory**: `MVP/MVP/kamunityAI`
   - **Build command**: `npm ci && npm run build`
   - **Publish directory**: `MVP/MVP/kamunityAI/.next`
   - **Functions directory**: `MVP/MVP/kamunityAI/netlify/functions`

5. **Click "Save"**
6. **Trigger a new deploy**

## Alternative Settings if Above Doesn't Work:
   - **Base directory**: `MVP/MVP/kamunityAI`
   - **Build command**: `cd MVP/MVP/kamunityAI && npm ci && npm run build`
   - **Publish directory**: `MVP/MVP/kamunityAI/out`
   - **Functions directory**: `MVP/MVP/kamunityAI/netlify/functions` 