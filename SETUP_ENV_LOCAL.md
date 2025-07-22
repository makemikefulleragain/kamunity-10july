# 🔧 Setup .env.local File

**MISSING FILE DETECTED:** Your `.env.local` file is missing, which is why GA4 shows "mock data"

## 📝 **Create .env.local File Manually**

Create a new file called `.env.local` in your project root with this exact content:

```env
# Google Analytics 4 Configuration
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-T8ZM5YHTJR
NEXT_PUBLIC_GA4_PROPERTY_ID=497342428

# Google Service Account for GA4 Data API
GOOGLE_SERVICE_ACCOUNT_EMAIL=kamunity-analytics-reader@kamunity-analytics.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0T0Vjj5NmR8Bg\nlLnU5Ku23G/TQ4USMEUHeCibrYEftiTpSonZXI5rHxgwtAiSohxNm2/VloEfay/M\nb8UfxlJx1q/V9HqSiRbJIHfpFbkXL3GbABXWKOhi7sD5KGGCyXM1MatY/rHUVU5y\ncMTEIfqDHIXKnffepYl/6090oSP7XKb1miv265rTT9QdhBG6fyxW+i0PAeQClqQC\nKjKOm7JRuWFjeKuq8KfsspMVitvivFVvlWWNb2WOutGuuQYCrBi/kJO4UUdiQqe3\nqHee4+q+IFrnFjwv0xHiF+sEcFa8ZD8mBcHHTxuhQFr7nSe8UyWAH6kQQtiB7tmL\nun92jXjXAgMBAAECggEADeaYnmLYxcddVPTSWM/iTyAyfNKVRUA0ai2Az/Ox4zx7\nHwMwmnHQxwBoMIUIrilSTkdf+VL3lHECh9vMEjWLcJxRBQkqk/Z+q7XVmMIkeV2e\ngAkjJdYUiGAIv4y168vVFnJEWAGWuxxyhk8cVFScSBRgWi0QiXkwnwyInSC5Me0i\n4TJyPWQoLvcClGHdyCPm21OLLs56LFTn6fDZoMHGSDJDKa0ovF737ovfwHIFcpC7\nxBZ1lyRofX0CjUDjZYxW5JlDLSfL/i8bFHVCmrhuibYcGm1yDhAxY4EmBdJ8vfZE\n4I5N5SVMBfEv4q9t1EVYokitzE4/3MCtHHib1fjbiQKBgQDufJNOBfkIL0oEdYBJ\nZvtnV9i3m/FNPjBGfhXroB5EQ+gj6gemp8Qj2ZFK7u5hiNfCqsUL7FZ+gvPyEhXB\nFi2jmjRE0ADQpgUEK2carjn4k4DVb6cStSSBx8bWL4i23p8hlkem3wxUM8vDKCWB\nxbSPrM/Z9sZcSN8ldBqeFjf0TwKBgQDBjP+zXO0fSfNXJeB1aGFxLiFbY2z1K9wh\nbnS4WLHrgmbyIlosOldKKRQ+vFi9gdXc4TopQvTLfOSjjpSX3tox6aP200nYGEYw\nOWvYUU+q+IFILoVBEJIQiUCc5uqvx1LRD8v3HOUpTlWrQ4Dx9Ih/s8fJX/aJMZx3\nTv5V1SOo+QKBgCsEI1nGcAXO6c3mF86lmaEpUjjEEwE4v2JnqbKHfg4YJY4cz2Z7\nCkDhJHjcofjLwwck4EfnSC6nljLKmkvqoS7KSLVEw3DfETaQUZeZZ3FzwaA99GfG\nbqBOFYpappE9lHxta90ojEO/1/gKjMFclNX5eMA658qLhlxuFcMABPW3AoGAVFBc\nz0Cq1xd61rrcRaj70bb7tvjf7Ql3MmUQmYGht+std0s5psyfW+H7PL0Fl0Ao7rh6\ngqD1THOSkiE5X9Mnj9isoYg3QdiJMtbAwRHit6LbhpslV0ulpWh06iS5lWsqC4Jr\nIrHGrjC+pwWX9U7F64Ngg7u3BNrEw0B5EODxUNkCgYEAoa5PR0l6HSCskVxTUp51\n42v1SZT2nSnFADHPGZwAg1udXjDcG5f2hnuQt2C83IxMlW6qRikD+7W/8gmO+JvR\nm9sPc1wZGOpaXZ6UYkIMK9EvmcLLipUmEUuDLFwOT9f5eCdvg8WDqwtYIm8fuFXS\neshoWKy7ZB/Rmm0Lf50y7d8=\n-----END PRIVATE KEY-----"
```

## 🚀 **Next Steps**

1. **Create** `.env.local` file with content above
2. **Save** the file in your project root (same folder as `package.json`)
3. **Restart** your dev server: Stop (`Ctrl+C`) and run `npm run dev` again
4. **Verify** GA4 logs no longer show "mock data"

## ✅ **Expected Result**

After restart, you should see real GA4 data instead of mock data in your admin dashboard.

**This will show your actual website traffic from the past few weeks!** 📊 