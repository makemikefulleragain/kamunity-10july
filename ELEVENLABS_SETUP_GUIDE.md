# 🎙️ ElevenLabs TTS Setup Guide

## Step 1: Get ElevenLabs API Key

1. **Create ElevenLabs Account**
   - Go to [elevenlabs.io](https://elevenlabs.io)
   - Sign up for an account
   - Choose a plan (Creator plan $22/month recommended for quality voices)

2. **Get API Key**
   - Go to your ElevenLabs dashboard
   - Navigate to "Profile & API Key" section
   - Copy your API key (keep it secure!)

## Step 2: Configure Netlify Environment Variables

1. **Access Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Open your Kamunity project dashboard

2. **Add Environment Variable**
   - Go to **Site settings** → **Environment variables**
   - Click **Add a variable**
   - Set:
     - **Key**: `NEXT_PUBLIC_ELEVENLABS_API_KEY`
     - **Value**: Your ElevenLabs API key (starts with `sk-...`)

3. **Deploy Changes**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
   - Wait for deployment to complete

## Step 3: Test the Integration

1. **Access Admin Panel**
   - Go to: `https://yoursite.com/admin/audio-manager`
   - Enter password: `kamunity2024`
   - Check that "✅ ElevenLabs API Key Configured" appears

2. **Test Single Generation**
   - Click "Generate" for any perspective/timeline combo
   - Should see 🔄 then ✅ status

3. **Test Audio Playback**
   - Go to main content page
   - Select any perspective filter
   - Click the play button in audio player
   - Should hear high-quality voice narration

## Voice Personalities Configured

- **FUN**: Bella - Energetic, upbeat female voice
- **FACTUAL**: Josh - Professional, authoritative male voice  
- **SPICY**: Rachel - Dramatic, expressive female voice
- **NICE**: Dorothy - Warm, friendly female voice
- **UNUSUAL**: Antoni - Distinctive, unique male voice
- **CURIOUS**: Elli - Thoughtful, inquisitive female voice

## Manual Trigger Instructions

### When to Regenerate Audio:
- After updating content in `src/lib/constants.ts`
- When you want fresh audio for all perspectives
- If voices sound outdated or wrong

### How to Regenerate:
1. **Individual Regeneration**:
   - Go to `/admin/audio-manager`
   - Click "Generate" for specific perspective/timeline

2. **Bulk Regeneration**:
   - Click "🚀 Generate All Audio" button
   - Wait ~2-3 minutes for all 24 combinations
   - Monitor status icons for completion

3. **Cache Management**:
   - Click "🗑️ Clear Cache" to force regeneration
   - Useful when audio seems stale or incorrect

## Cost Monitoring

- **Estimated Cost**: ~$10-15/month for typical usage
- **Character Limit**: Each script ~500-800 characters
- **Monthly Usage**: ~24 regenerations × 30 days = 720 generations
- **Monitor Usage**: Check ElevenLabs dashboard regularly

## Troubleshooting

### ❌ API Key Missing
- Double-check environment variable name: `NEXT_PUBLIC_ELEVENLABS_API_KEY`
- Redeploy site after adding environment variable
- Check API key is valid in ElevenLabs dashboard

### ❌ Audio Generation Fails
- Check browser console for error messages
- Verify internet connection
- Check ElevenLabs account credits/quota

### ❌ Audio Won't Play
- Check browser audio permissions
- Try different browser
- Clear browser cache

### ❌ Wrong Voice Personality
- Voice IDs are hardcoded in `src/utils/audioGenerator.ts`
- To change voices, update voice IDs in `VOICE_PERSONALITIES` object

## Security Notes

- ✅ API key stored securely in Netlify environment
- ✅ Admin panel password-protected
- ✅ Audio cached to minimize API calls
- ⚠️ Change admin password in `src/pages/admin/audio-manager.tsx`

## Next Steps

1. Test the integration thoroughly
2. Monitor costs and usage
3. Adjust voice personalities if needed
4. Consider upgrading ElevenLabs plan for more voices
5. Add error notifications for failed generations

---

**🚀 Ready to use! Your Kamunity newsfeed now has distinctive AI voices for each perspective.** 