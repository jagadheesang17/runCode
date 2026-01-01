# Cookie-Based Authentication for Admin Login

## Overview
The framework supports cookie-based authentication for **all admin roles that share the same credentials**. This significantly speeds up test execution by reusing authentication cookies instead of logging in every time.

**Supported Admin Roles:**
- CUSTOMERADMIN
- CUSTOMERADMIN1
- LEARNERADMIN
- COMMERCEADMIN
- SUPERADMIN
- PEOPLEADMIN
- ENROLLADMIN

## Quick Reference

| Login Method | Role | Uses Cookies? | Speed |
|-------------|------|---------------|-------|
| `loadAndLogin("CUSTOMERADMIN")` | Admin | ✅ Yes | 1-2s |
| `loadAndLogin("SUPERADMIN")` | Admin | ✅ Yes | 1-2s |
| `loadAndLogin("PEOPLEADMIN")` | Admin | ✅ Yes | 1-2s |
| `loadAndLogin("LEARNERADMIN")` | Admin | ✅ Yes | 1-2s |
| `loadAndLogin("INSTRUCTORNAME")` | Instructor | ❌ No | 5-10s |
| `learnerLogin("...", "...")` | Learner | ❌ No | 5-10s |

**Cookie Expiry:** 10 minutes of inactivity  
**Retry on Failure:** 3 attempts with 2s delay

---

## How It Works

### 1. Cookie Generation (Global Setup)
When you run tests:
```bash
npx playwright test
```

**Step 1:** `global-setup.ts` runs **first** (before any tests)  
**Step 2:** Logs in as CUSTOMERADMIN with **3 retry attempts**  
**Step 3:** Saves cookies in **both formats**:
   - `data/cookies.txt` → For API tests (text format)
   - `data/cookies.json` → For UI tests (JSON format)  
**Step 4:** All admin roles reuse these cookies (since they share credentials)

### 2. During Test Execution

#### Admin Roles Login (Cookie-Based):
```typescript
await adminHome.loadAndLogin("CUSTOMERADMIN")   // Cookie-based ✅
await adminHome.loadAndLogin("SUPERADMIN")       // Cookie-based ✅
await adminHome.loadAndLogin("PEOPLEADMIN")      // Cookie-based ✅
await adminHome.loadAndLogin("LEARNERADMIN")     // Cookie-based ✅
```
1. ✅ Loads cookies from `data/cookies.json` (Playwright native format)
2. ✅ If valid → Authenticates immediately (**1-2 seconds**)
3. ⚠️ If expired → Falls back to regular login (5-10 seconds)

#### Other Roles (Regular Login):
```typescript
await adminHome.loadAndLogin("INSTRUCTORNAME")   // Regular login
await adminHome.loadAndLogin("MANAGERNAME")      // Regular login
```
- ℹ️ Skips cookie loading (cookies work only for admin roles with shared credentials)
- 🔑 Uses standard UI login process

#### Learner Login (Unchanged):
```typescript
await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal")
```
- ✅ No changes - works exactly as before
- 🔑 Always uses regular login

---

## Execution Flow Diagram

```
Test Run Starts
    ↓
Global Setup (ONCE)
- Retry up to 3 times if fails
- Login as CUSTOMERADMIN
- Save cookies to data/cookies.txt
    ↓
Tests Execute
    ↓
┌─────────────────────┬─────────────────────┐
│                     │                     │
│ Admin Role Tests    │  Other Role Tests   │
│ (7 admin roles)     │ (Instructor, etc)   │
│                     │                     │
│ Load cookies.json   │  Skip cookie check  │
│      ↓              │      ↓              │
│  Valid? Yes         │  Regular Login      │
│      ↓              │  (5-10 seconds)     │
│ FAST (1-2s)         │                     │
│      ↓              │                     │
│  Valid? No          │                     │
│      ↓              │                     │
│ Regular Login       │                     │
│ (5-10 seconds)      │                     │
└─────────────────────┴─────────────────────┘
```

---

## Cookie Expiration & Retry

### Cookie Timeout
✅ **10 minutes of inactivity** → Cookies expire

### Retry Mechanism (Cookie Generation)
If cookie generation fails during global setup:

```
🔑 Starting cookie setup... (Attempt 1/3)
❌ Cookie generation failed (Attempt 1/3): Network timeout
⏳ Retrying in 2 seconds...

🔑 Starting cookie setup... (Attempt 2/3)
✅ Cookie updated successfully (Attempt 2/3)
```

- **Max Retries:** 3 attempts
- **Delay:** 2 seconds between retries
- **Auto-cleanup:** Closes browser on failure
- **Validation:** Checks if cookies were actually generated

---

## Console Output Examples

### ✅ CUSTOMERADMIN with Valid Cookies
```
🔐 Loading admin home page for CUSTOMERADMIN...
✅ Loaded 12 cookies from cookies.json for CUSTOMERADMIN
✅ Cookies are valid - authenticated
✅ Successfully authenticated using cookies for CUSTOMERADMIN
⏱️ Time: ~1-2 seconds
```

### ⚠️ CUSTOMERADMIN with Expired Cookies
```
🔐 Loading admin home page for CUSTOMERADMIN...
✅ Loaded 12 cookies from cookies.json for CUSTOMERADMIN
Cookies are invalid - on sign-in page
⚠️ Cookies expired (10min inactivity timeout), performing fresh login...
🔑 Performing regular login for CUSTOMERADMIN...
✅ Authentication successful for CUSTOMERADMIN
⏱️ Time: ~5-10 seconds
```

### ✅ SUPERADMIN/PEOPLEADMIN with Valid Cookies
```
🔐 Loading admin home page for SUPERADMIN...
✅ Loaded 12 cookies from cookies.json for SUPERADMIN
✅ Cookies are valid - authenticated
✅ Successfully authenticated using cookies for SUPERADMIN
⏱️ Time: ~1-2 seconds
```

### 🔑 Other Roles (Regular Login)
```
🔐 Loading admin home page for INSTRUCTORNAME...
ℹ️ Skipping cookie auth for INSTRUCTORNAME (only works for admin roles)
🔑 Performing regular login for INSTRUCTORNAME...
✅ Authentication successful for INSTRUCTORNAME
⏱️ Time: ~5-10 seconds
```

### 🔄 Cookie Generation with Retry
```
🔑 Starting cookie setup... (Attempt 1/3)
✅ Saved 12 cookies in both formats (Attempt 1/3)
```

### ❌ Cookie Generation Failed (with Retry)
```
🔑 Starting cookie setup... (Attempt 1/3)
❌ Cookie generation failed (Attempt 1/3): Click timeout
⏳ Retrying in 2 seconds...
🔑 Starting cookie setup... (Attempt 2/3)
✅ Saved 12 cookies in both formats (Attempt 2/3)
```

---

## Running Different Scenarios

### Single Test
```bash
npx playwright test tests/SomeTest.spec.ts
```
- Global setup generates cookies
- Test uses cookies ✅ FAST

### Specific Folder
```bash
npx playwright test tests/admin/
```
- Global setup generates cookies once
- All admin role tests → Use cookies ✅
- Other role tests (Instructor, Manager) → Regular login 🔑

### All Tests
```bash
npx playwright test
```
- Global setup generates cookies once
- All admin role tests → Use cookies (if within 10min)
- All other role tests → Regular login

---

## Benefits

✅ **Much faster** - All admin role tests skip login (1-2s vs 5-10s)  
✅ **Reliable** - 3 retry attempts if cookie generation fails  
✅ **Automatic fallback** - Expired cookies trigger regular login  
✅ **No test changes** - Works with existing code  
✅ **Shared credentials** - 7 admin roles reuse same cookies  
✅ **Learner logins unchanged** - Zero impact

---json
```

### Force fresh cookie generation:
```powershell
rm data/cookies.json
npx playwright test
```

### If cookies not working:
1. Delete `data/cookies.json
rm data/cookies.txt
npx playwright test
```

### If cookies not working:
1. Delete `data/cookies.txt`
2. Run tests - global-setup regenerates them
3. Check `playwright.config.ts` has:
   ```typescript
   globalSetup: require.resolve('./global-setup.ts')
   ```

### If cookie generation keeps failing:
- Check network connectivity
- Verify credentials in `credentialData.ts`
- Check if site is accessible
- Review console logs for specific errors

---json             # Generated by global-setup.ts (JSON format)

## File Structure

```
data/
  ├── cookies.txt              # For API tests (text format)
  └── cookies.json             # For UI tests (JSON format)

global-setup.ts                # Calls setupCourseCreation()
utils/
  └── cookieSetup.ts          # Saves cookies in BOTH formats
pages/
  ├── AdminLogin.ts           # Loads cookies.json for UI tests
  └── AdminHomePage.ts        # loadAndLogin() uses cookies
api/
  └── createCourseAPI.ts       # Uses cookies.txt for API calls
```
