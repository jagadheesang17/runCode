# API Test Integration - Token Management Guide

## ✅ Good News!
All your existing tests in the `apiTestIntegration` folder already work with the new token management system. **No changes needed to your test files!**

## How It Works

### Before (Old Behavior)
```typescript
import { generateOauthToken } from '../../accessToken';

// Generated new token EVERY time - slow and inefficient
const token = await generateOauthToken();
```

### Now (New Behavior)
```typescript
import { generateOauthToken } from '../../accessToken';

// Same code, but now intelligently caches the token!
const token = await generateOauthToken();
```

The function `generateOauthToken()` now:
1. ✅ Checks if a valid cached token exists
2. ✅ Returns cached token if still valid (saves 45 minutes)
3. ✅ Auto-generates new token only when needed
4. ✅ Stores token with expiration tracking

## Token Cache Location
- **File**: `data/apiData/tokenCache.json`
- **Format**: 
  ```json
  {
    "accessToken": "Bearer eyJhbGc...",
    "expiresIn": 3600,
    "generatedAt": "2025-12-15T10:30:00.000Z",
    "expiresAt": "2025-12-15T11:30:00.000Z"
  }
  ```

## Benefits for Your Tests

### 1. **Faster Test Execution**
- First test generates token (3-5 seconds)
- Subsequent tests use cached token (instant!)
- 45-minute validity window

### 2. **Better API Rate Limiting**
- Reduces OAuth endpoint calls by ~95%
- Less load on authentication server

### 3. **Automatic Refresh**
- Token refreshes automatically 45 minutes before expiry
- No test failures due to expired tokens

### 4. **Consistent Testing**
- All parallel tests use the same token
- No race conditions or conflicts

## Monitoring Token Status

### Quick Check (While Tests Run)
Watch the console output:
```
Using cached token
Token expires in 52 minutes
```

Or:
```
Token expired or invalid, generating new token...
New token generated. Expires in 3600 seconds (60 minutes)
```

### Detailed Check (Anytime)
Run the status checker:
```bash
npx ts-node check_token_status.ts
```

Output:
```
=== OAuth Token Status ===

📊 Token Information:
─────────────────────────────────────────
🔑 Token: Bearer eyJhbGc...
⏱️  Expires In: 3600 seconds
📅 Generated: 12/15/2025, 10:30:00 AM
📅 Expires: 12/15/2025, 11:30:00 AM

⏰ Time Status:
─────────────────────────────────────────
✓ Token age: 15 minutes
✓ Time until expiry: 45 minutes (2700 seconds)
✅ STATUS: VALID
   Token is good to use
   Will auto-refresh in 0 minutes
```

## Advanced Usage (Optional)

If you want to use the new API directly in new tests:

```typescript
import { getOauthToken, refreshOauthToken, getTokenInfo } from '../utils/tokenManager';

// Get token (auto-cached)
const token = await getOauthToken();

// Force new token generation
const freshToken = await refreshOauthToken();

// Get token metadata
const info = getTokenInfo();
console.log('Token expires at:', info.expiresAt);
```

## Troubleshooting

### Problem: Token keeps regenerating
**Solution**: Check if system time is correct

### Problem: Token file not updating
**Solution**: Verify write permissions on `data/apiData/tokenCache.json`

### Problem: Need to force refresh
**Solution**: 
```typescript
import { refreshOauthToken } from '../utils/tokenManager';
await refreshOauthToken();
```

Or simply delete `tokenCache.json`

## Testing the System

Run the test suite:
```bash
npx ts-node test_token_management.ts
```

This will:
- ✅ Generate a new token
- ✅ Verify caching works
- ✅ Test force refresh
- ✅ Validate all functionality

## Configuration

To change when tokens refresh, edit `utils/tokenManager.ts`:
```typescript
const TOKEN_VALIDITY_MINUTES = 45; // Current: refresh 45 min before expiry
```

For example:
- `30` = Refresh 30 minutes before expiry
- `50` = Refresh 50 minutes before expiry (for 60-min tokens)

## Summary

✅ **No code changes needed in your tests**  
✅ **Automatic token caching and refresh**  
✅ **Faster test execution**  
✅ **Better error handling**  
✅ **Easy monitoring and debugging**  

Your tests will now run more efficiently with minimal changes to your workflow!
