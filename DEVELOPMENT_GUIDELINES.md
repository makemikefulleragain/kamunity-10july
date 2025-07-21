# Simple Development Guidelines

## Core Principles

### 1. **Listen & Follow Through**
- Do exactly what the user asks for
- Don't substitute or take shortcuts
- If you make a mistake, acknowledge it and try a different approach

### 2. **Verify Your Work**
- Check file sizes, paths, and content
- Test that changes actually work
- Confirm the right files are being used

### 3. **When Stuck, Change Approach**
- If the same method fails 3 times, try something completely different
- Use different tools (e.g., Node.js packages instead of system installs)
- Ask for help or manual steps if needed

### 4. **Keep It Simple**
- Use the tools already in the project when possible
- Don't over-engineer solutions
- Document what actually worked

## Technical Best Practices

### Audio/Media Files
- Compress files using appropriate tools (FFmpeg via Node.js worked)
- Verify file sizes before and after compression
- Use exact file paths specified by user

### Deployment
- Test builds locally first
- Check environment variables and dependencies
- Commit working changes incrementally

### Problem Solving
- Read error messages carefully
- Check the actual files/directories involved
- Try parallel approaches when one fails

## What Worked in This Project

✅ **FFmpeg via Node.js packages** (`fluent-ffmpeg` + `ffmpeg-static`)  
✅ **localStorage for client-side persistence** (serverless compatible)  
✅ **Incremental commits** with clear messages  
✅ **Responsive design** with proper mobile stacking  

## Simple Rules

1. **Do what's asked** - no substitutions
2. **Verify it works** - check the results  
3. **Change approach if stuck** - don't repeat failures
4. **Keep guidelines simple** - this file should stay under 50 lines

---

*Updated: Based on successful audio compression and emoji persistence implementation* 