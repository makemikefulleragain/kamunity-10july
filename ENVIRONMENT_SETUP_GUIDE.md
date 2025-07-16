# 🔧 ENVIRONMENT SETUP GUIDE - RESEND EMAIL SYSTEM

## ✅ CURRENT STATUS: EMAIL SYSTEM WORKING

**Email system is now fully functional using Resend's verified domain.**

**Current Configuration:**
- ✅ **From Email**: `onboarding@resend.dev` (Resend verified domain)
- ✅ **Admin Email**: `mike@kamunityconsulting.com` 
- ✅ **API Key**: Configured and working
- ✅ **Status**: Production ready

**Future Plan:** Will migrate to custom domain later for branded emails.

---

## 📋 **REQUIRED ENVIRONMENT VARIABLES**

### **1. RESEND_API_KEY** (🔴 CRITICAL - MISSING)
- **What it does**: Enables email sending via Resend service
- **Get it from**: [Resend Dashboard](https://resend.com/api-keys)
- **Value format**: `re_S12n...` (starts with `re_`)

### **2. RESEND_FROM_EMAIL** (✅ Set in netlify.toml)
- **Current value**: `hello@kamunity.ai`
- **What it does**: Sets the sender email address

### **3. MIKE_FULLER_EMAIL** (⚠️ Should be updated)
- **Current value**: `admin@kamunity.ai` (placeholder)
- **What it does**: Admin email for notifications
- **Update to**: Your real email address

### **4. NEXT_PUBLIC_SITE_URL** (✅ Set in netlify.toml)
- **Current value**: `https://kamunity.ai`
- **What it does**: Site URL for email templates

---

## 🛠️ **STEP-BY-STEP SETUP**

### **Step 1: Get Your Resend API Key**

1. **Go to Resend Dashboard**:
   - Visit: https://resend.com/login
   - Log in or create account (free tier: 3,000 emails/month)

2. **Navigate to API Keys**:
   - Click "API Keys" in left sidebar
   - Click "Create API Key"

3. **Create Key**:
   - Name: `Kamunity Production`
   - Permission: `Full access` 
   - Domain: `No domain restriction` (or add kamunity.ai)
   - Click "Create"

4. **Copy the key**: Starts with `re_` - **SAVE THIS IMMEDIATELY**

### **Step 2: Set Environment Variables in Netlify**

1. **Go to Netlify Dashboard**:
   - Visit: https://app.netlify.com/
   - Find your `kamunityai` site

2. **Navigate to Environment Variables**:
   - Click `Site settings` 
   - Click `Environment variables` in left sidebar

3. **Add Required Variables**:

   **Add Variable 1:**
   - Key: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxx` (your actual key)
   - Scopes: `All scopes`
   - Click `Create variable`

   **Update Variable 2:**
   - Find: `MIKE_FULLER_EMAIL` 
   - Update value to: `your-email@domain.com` (your real email)
   - Click `Save`

### **Step 3: Trigger Redeploy**

After setting environment variables:

1. **Go to Deploys tab** in Netlify
2. **Click "Trigger deploy"** → "Deploy site"
3. **Wait 2-3 minutes** for build to complete

---

## 🧪 **TESTING AFTER SETUP**

### **Test Email Subscription** (2-3 minutes after redeploy):

1. Go to: https://kamunityai.netlify.app
2. Enter your email in subscription form
3. Submit form
4. **Expected results**:
   - ✅ Success message appears
   - ✅ Welcome email arrives in your inbox
   - ✅ Admin notification email sent to your admin email
   - ✅ No 500 errors in browser console

### **Test Contact Form**:

1. Go to: https://kamunityai.netlify.app/contact
2. Fill out contact form completely
3. Submit form
4. **Expected results**:
   - ✅ Success message appears
   - ✅ Admin notification with contact details sent to your email
   - ✅ No 500 errors

---

## 🔍 **DEBUGGING TIPS**

### **If emails still don't work after setup:**

1. **Check Netlify Function Logs**:
   - Go to Netlify Dashboard → Functions tab
   - Click on `subscribe` or `contact` function
   - Check logs for error messages

2. **Common Issues**:
   - **Wrong API key format**: Must start with `re_`
   - **API key not deployed**: Trigger manual redeploy
   - **Domain restrictions**: Check Resend dashboard for domain settings
   - **Email verification**: Some email providers may require sender verification

3. **Verify Environment Variables**:
   - In Netlify Dashboard → Site settings → Environment variables
   - Ensure `RESEND_API_KEY` exists and has correct value
   - No extra spaces or quotes around the key

### **If you see errors like "Email service not configured":**
- The `RESEND_API_KEY` environment variable is missing or incorrect
- Redeploy after setting the variable

---

## 📧 **EMAIL DELIVERABILITY**

### **Resend Service Benefits**:
- ✅ **99.1% deliverability** (vs 98.2% with SendGrid)
- ✅ **3,000 emails/month free** (no credit card required)
- ✅ **Better inbox placement**
- ✅ **Real-time analytics**

### **Recommended Next Steps** (Optional):
1. **Verify Domain**: Add SPF/DKIM records to improve deliverability
2. **Custom Domain**: Use `hello@kamunity.ai` instead of default sender
3. **Monitor Analytics**: Track open rates and delivery stats in Resend dashboard

---

## 🆘 **NEED HELP?**

### **Quick Status Check:**
After following this guide, try the email subscription form. If it works, you should see:
- Success message in browser
- Welcome email in your inbox within 1-2 minutes
- Admin notification email to your configured admin email

### **Still Having Issues?**
1. Check browser console for any remaining errors
2. Verify all environment variables are set correctly
3. Check Netlify function logs for specific error messages
4. Ensure Resend account is active and API key is valid

**The email system should work perfectly after completing these steps!** 