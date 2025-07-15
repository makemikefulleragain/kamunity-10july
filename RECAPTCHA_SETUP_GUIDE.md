# reCAPTCHA Setup Guide - Fix Form Submission Errors

## Issue
Your email subscription and contact forms are failing with "Invalid site key" errors because reCAPTCHA is not properly configured.

## Solution
You need to set up Google reCAPTCHA v3 and configure the keys in your Netlify environment variables.

## Step 1: Create reCAPTCHA Keys

1. **Go to Google reCAPTCHA Console**
   - Visit: https://www.google.com/recaptcha/admin/create
   - Sign in with your Google account

2. **Create a New Site**
   - **Label**: `Kamunity AI Website`
   - **reCAPTCHA type**: Select `reCAPTCHA v3`
   - **Domains**: Add both:
     - `kamunityai.netlify.app`
     - `kamunity.ai` (if you have custom domain)
   - **Accept Terms** and click **Submit**

3. **Get Your Keys**
   - **Site Key**: Copy this (starts with `6L...`)
   - **Secret Key**: Copy this (starts with `6L...`)

## Step 2: Configure Netlify Environment Variables

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/
   - Select your `kamunityai` site

2. **Navigate to Environment Variables**
   - Go to `Site settings` → `Environment variables`

3. **Add the reCAPTCHA Keys**
   Add these two environment variables:

   **Variable 1:**
   - Key: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - Value: Your site key (6L...)
   - Scopes: `All scopes`

   **Variable 2:**
   - Key: `RECAPTCHA_SECRET_KEY`
   - Value: Your secret key (6L...)
   - Scopes: `All scopes`

4. **Verify Resend API Key is Set**
   Make sure you also have:
   - Key: `RESEND_API_KEY`
   - Value: `re_S12n...` (your Resend API key)

## Step 3: Deploy Changes

1. **Commit and Push**
   ```bash
   git add .
   git commit -m "Fix reCAPTCHA configuration and form error handling"
   git push origin main
   ```

2. **Netlify will automatically redeploy** with the new environment variables

## Step 4: Test Forms

After deployment completes (~2-3 minutes):

1. **Test Email Subscription**
   - Go to your website: https://kamunityai.netlify.app
   - Try subscribing with your email
   - Should work without "Invalid site key" errors

2. **Test Contact Form**
   - Go to: https://kamunityai.netlify.app/contact
   - Fill out and submit the contact form
   - Should work and send emails via Resend

## Troubleshooting

**If forms still don't work:**

1. **Check Netlify Deploy Log**
   - Look for build errors
   - Verify environment variables are set

2. **Check Browser Console**
   - Press F12, go to Console tab
   - Look for any remaining errors

3. **Verify reCAPTCHA Domain**
   - Make sure your domain is correctly added in Google reCAPTCHA console
   - Both `kamunityai.netlify.app` and any custom domains

**Common Issues:**
- Wrong reCAPTCHA type (use v3, not v2)
- Missing domain in reCAPTCHA console
- Typo in environment variable names
- Environment variables not deployed (trigger redeploy)

## Expected Results

After setup:
- ✅ Email subscriptions work
- ✅ Contact form submissions work  
- ✅ Welcome emails sent via Resend
- ✅ Admin notifications received
- ✅ No "Invalid site key" errors
- ✅ No "unable to process" errors

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly in Netlify
3. Test with a fresh browser tab (hard refresh) 