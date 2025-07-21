# Development Checklist

## Before Starting ANY Feature

- [ ] **Read requirement carefully** - What is the simplest solution?
- [ ] **Check existing patterns** - Is there already a working approach?
- [ ] **Plan minimal changes** - What's the smallest edit needed?

## During Development

- [ ] **Make one change at a time** - Test after each edit
- [ ] **If error occurs twice** - Investigate root cause, don't retry
- [ ] **If approach fails 3 times** - Change strategy completely

## When User Says "Still Same Issue"

- [ ] **STOP current approach** immediately
- [ ] **ASK**: "What exactly should happen instead?"
- [ ] **IMPLEMENT**: Simplest possible solution

## Before Showing to User

- [ ] **Test the exact user scenario** 
- [ ] **Check for console errors**
- [ ] **Verify no side effects**
- [ ] **Clean up any debug code**

## Server Management

- [ ] **Check for multiple processes** before starting dev server
- [ ] **Kill conflicting processes** if ports are busy
- [ ] **Use single clean server** instance

## Red Flags (Change Approach!)

- [ ] Creating complex modal systems for simple interactions
- [ ] Multiple compilation errors for same component  
- [ ] Adding animations/effects user didn't request
- [ ] Building anything more complex than requested

## Emergency Protocols

### When User Reports Repeated Issues:
1. **Remove the problematic component entirely**
2. **Implement the simplest possible alternative**
3. **Test immediately with user**

### When Compilation Keeps Failing:
1. **Delete the problematic file**
2. **Implement simpler version from scratch**
3. **Don't try to fix complex broken code**

---

**Golden Rule: If you're making it complex, you're probably doing it wrong.** 