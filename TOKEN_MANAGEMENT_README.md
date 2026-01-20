# OAuth Token Management System

## Overview
This system implements automatic OAuth token caching and refresh to minimize unnecessary API calls and ensure tokens are always valid.

## How It Works

### Token Storage
- Tokens are stored in `data/apiData/tokenCache.json`
- The file contains:
  - `accessToken`: The Bearer token string
  - `expiresIn`: Token lifetime in seconds (typically 3600)
  - `generatedAt`: ISO timestamp when token was created
  - `expiresAt`: ISO timestamp when token will expire

### Automatic Token Refresh
- Tokens are automatically refreshed **45 minutes before expiration**
- This ensures your tests never use an expired token
- No manual intervention needed

## Usage

### Recommended (New Method)
```typescript
import { getOauthToken } from '../utils/tokenManager';

// In your test
const token = await getOauthToken();
// Token is automatically retrieved from cache or regenerated if needed
```

### Backward Compatible (Old Method)
```typescript
import { generateOauthToken } from '../api/accessToken';

// Still works - internally uses the new token manager
const tokenWithExpiry = await generateOauthToken();
```

### Force Token Refresh
```typescript
import { refreshOauthToken } from '../utils/tokenManager';

// Manually force a new token to be generated
const newToken = await refreshOauthToken();
```

### Get Token Information
```typescript
import { getTokenInfo } from '../utils/tokenManager';

// Get current token details for debugging
const info = getTokenInfo();
console.log('Token expires at:', info.expiresAt);
console.log('Token was generated at:', info.generatedAt);
```

## Benefits

1. **Reduced API Calls**: Token is reused until 45 minutes before expiration
2. **Automatic Management**: No need to track expiration manually
3. **Consistent State**: All tests use the same cached token
4. **Easy Debugging**: Token info stored in readable JSON format
5. **Backward Compatible**: Existing code continues to work

## Token Lifecycle

```
Token Generated
    ↓
Stored in tokenCache.json
    ↓
Used for 15 minutes (60min - 45min buffer)
    ↓
Auto-refreshed when accessed
    ↓
New token stored
    ↓
Cycle continues...
```

## File Structure

```
data/
  apiData/
    tokenCache.json         # Cached token data (auto-generated)
    
utils/
  tokenManager.ts           # Token management logic
  
api/
  accessToken.ts            # Backward compatible wrapper
  apiTestIntegration/       # All test files automatically use cached tokens
```

## Console Output

When running tests, you'll see helpful messages:
```
Using cached token
Token expires in 52 minutes
```

Or when refresh is needed:
```
Token expired or invalid, generating new token...
New token generated. Expires in 3600 seconds (60 minutes)
Token cached at 2025-12-15T10:30:00.000Z, expires at 2025-12-15T11:30:00.000Z
```

## Configuration

To adjust the refresh buffer time, edit `utils/tokenManager.ts`:
```typescript
const TOKEN_VALIDITY_MINUTES = 45; // Change this value
```

## Troubleshooting

### Token not refreshing
- Check that `tokenCache.json` has write permissions
- Verify system time is correct
- Check console output for error messages

### Force manual refresh
```typescript
import { refreshOauthToken } from '../utils/tokenManager';
await refreshOauthToken();
```

### Clear cached token
Simply delete or clear the contents of `data/apiData/tokenCache.json`

## Implementation Details

- **Thread-safe**: Single token file prevents race conditions
- **Error handling**: Falls back to generating new token on any error
- **Logging**: Comprehensive console output for debugging
- **Type-safe**: Full TypeScript type definitions
