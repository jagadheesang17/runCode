/**
 * Example: How to use the token in your API calls
 * 
 * The token is stored in tokenCache.json as:
 * {
 *   "accessToken": "Bearer eyJhbGc...",  ← Already formatted with "Bearer "
 *   "expiresIn": 3600,
 *   "generatedAt": "2025-12-15T10:30:00.000Z",
 *   "expiresAt": "2025-12-15T11:30:00.000Z"
 * }
 */

import { generateOauthToken } from './api/accessToken';
// OR use the new direct method:
// import { getOauthToken } from './utils/tokenManager';

async function exampleUsage() {
    
    // Example 1: Using generateOauthToken (backward compatible)
    const access_token = await generateOauthToken();
    // Returns: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
    
    // Use it in your API call
    const result = await retrive_listofCourse({ 
        Authorization: access_token 
    });
    
    console.log('Token:', access_token);
    console.log('Result:', result);
}

// Example 2: Multiple API calls - token is cached automatically!
async function multipleApiCalls() {
    
    // First call - may generate new token
    const token1 = await generateOauthToken();
    await retrive_listofCourse({ Authorization: token1 });
    
    // Second call - uses cached token (instant!)
    const token2 = await generateOauthToken();
    await retrive_users({ Authorization: token2 });
    
    // Third call - still using cached token
    const token3 = await generateOauthToken();
    await retrive_programs({ Authorization: token3 });
    
    // All three tokens are the same "Bearer <token>" from cache!
    console.log('Same token used:', token1 === token2 && token2 === token3);
}

// Example 3: Direct usage (recommended for new code)
async function directUsage() {
    const { getOauthToken } = require('./utils/tokenManager');
    
    const token = await getOauthToken();
    // Returns: "Bearer eyJhbGc..." directly from tokenCache.json
    
    await retrive_listofCourse({ Authorization: token });
}

// Mock function for example
async function retrive_listofCourse(headers: { Authorization: string }) {
    console.log('Calling API with headers:', headers);
    // Your actual API implementation here
}

async function retrive_users(headers: { Authorization: string }) {
    console.log('Calling API with headers:', headers);
}

async function retrive_programs(headers: { Authorization: string }) {
    console.log('Calling API with headers:', headers);
}

// Uncomment to test:
// exampleUsage();
// multipleApiCalls();
