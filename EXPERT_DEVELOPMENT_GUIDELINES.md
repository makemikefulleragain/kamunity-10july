# Expert Development Guidelines

## Core Principles

### 1. **SIMPLICITY FIRST**
- Always start with the simplest solution that meets the requirement
- If you find yourself creating complex systems, pause and ask: "Is there a simpler way?"
- Avoid over-engineering - build exactly what's requested, nothing more

### 2. **LISTEN TO USER FEEDBACK**
- If user says "remove X" → Remove it completely, don't try to fix it
- If user reports repeated issues → Change approach entirely
- User feedback overrides your initial technical approach

### 3. **ROOT CAUSE ANALYSIS**
- 3+ failed attempts at the same fix = Wrong approach entirely
- Step back and question the fundamental architecture
- Look for underlying issues (server conflicts, dependency problems, etc.)

## Development Workflow

### **Phase 1: Understand & Plan**
```
1. Read requirement carefully
2. Identify the SIMPLEST solution
3. Check for existing working patterns in codebase
4. Plan minimal changes needed
```

### **Phase 2: Implement Incrementally**
```
1. Make ONE small change at a time
2. Test immediately after each change
3. If error occurs → investigate root cause, don't just retry
4. If approach isn't working after 2 attempts → change strategy
```

### **Phase 3: Validate & Clean**
```
1. Ensure change works as requested
2. Remove any unused/dead code
3. Verify no side effects
4. Clean up any development artifacts
```

## Error Handling Rules

### **Compilation Errors**
- 1st error: Fix the syntax
- 2nd same error: Check imports and dependencies  
- 3rd same error: **CHANGE APPROACH ENTIRELY**

### **Server Issues**
- Always check for multiple processes before starting new ones
- Kill conflicting processes explicitly
- Use single clean server instance

### **Modal/Animation Issues**
- If positioning is wrong → Check if modal is needed at all
- If flashing occurs → Simplify or remove animations
- If event conflicts → Consider inline approach instead

## Code Quality Standards

### **React Components**
```jsx
// ✅ Good: Simple, direct approach
const ReactionBar = () => (
  <div>
    <button onClick={handleReaction}>😄</button>
  </div>
);

// ❌ Bad: Over-engineered
const ReactionBar = () => (
  <AnimatePresence mode="wait">
    <motion.div>
      <Portal>
        <Modal>
          <button>😄</button>
        </Modal>
      </Portal>
    </motion.div>
  </AnimatePresence>
);
```

### **Event Handling**
```jsx
// ✅ Good: Prevent propagation explicitly
const handleClick = (e) => {
  e.stopPropagation();
  e.preventDefault();
  // Handle action
};

// ❌ Bad: Complex event management
const handleClick = (e) => {
  if (isModalOpen && !isClosing && hasPermission) {
    // Complex logic
  }
};
```

## Emergency Protocols

### **When User Says "Still Same Issue"**
1. **STOP** current approach immediately
2. **ASK**: "What exactly should happen instead?"
3. **SIMPLIFY**: Find the most basic solution
4. **IMPLEMENT**: New approach from scratch

### **When Compilation Keeps Failing**
1. Check if file/component is actually needed
2. Look for import/export issues
3. Consider removing the problematic component entirely
4. Implement simpler alternative

### **When Server Issues Persist**
```bash
# Kill all node processes
taskkill /f /im node.exe

# Clear cache
rm -rf .next
npm run dev
```

## Success Metrics

### **Good Development Session:**
- User request → Working solution in 1-2 iterations
- No repeated compilation errors
- Clean, maintainable code
- User satisfaction

### **Bad Development Session:**
- 3+ attempts at same approach
- Repeated syntax/compilation errors  
- Over-engineered solutions
- User frustration

## Key Questions to Ask

Before implementing:
1. "What's the simplest way to achieve this?"
2. "Am I adding complexity the user didn't ask for?"
3. "If this fails, what's my fallback approach?"

During development:
1. "Is this working as the user intended?"
2. "Am I solving the right problem?"
3. "Would a simpler approach work better?"

When stuck:
1. "What would happen if I removed this entirely?"
2. "What's the user actually trying to accomplish?"
3. "Am I overthinking this?"

---

**Remember: Code that works simply is better than complex code that works perfectly.** 