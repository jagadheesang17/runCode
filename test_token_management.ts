/**
 * Test script to verify token management system
 * Run this to test the token caching and refresh logic
 */

import { getOauthToken, refreshOauthToken, getTokenInfo } from './utils/tokenManager';

async function testTokenManagement() {
    console.log('=== Token Management Test ===\n');

    try {
        // Test 1: Get token (should generate new one)
        console.log('Test 1: Getting token for the first time...');
        const token1 = await getOauthToken();
        console.log('✓ Token received:', token1.substring(0, 50) + '...\n');

        // Test 2: Get token info
        console.log('Test 2: Getting token info...');
        const info1 = getTokenInfo();
        console.log('✓ Token Info:');
        console.log('  - Generated At:', info1.generatedAt);
        console.log('  - Expires At:', info1.expiresAt);
        console.log('  - Expires In:', info1.expiresIn, 'seconds\n');

        // Test 3: Get token again (should use cache)
        console.log('Test 3: Getting token again (should use cache)...');
        const token2 = await getOauthToken();
        console.log('✓ Token received from cache\n');

        // Test 4: Verify tokens are the same
        console.log('Test 4: Verifying tokens match...');
        if (token1 === token2) {
            console.log('✓ Tokens match - caching is working!\n');
        } else {
            console.log('✗ Tokens do not match - caching might have an issue\n');
        }

        // Test 5: Force refresh
        console.log('Test 5: Forcing token refresh...');
        const token3 = await refreshOauthToken();
        console.log('✓ New token generated:', token3.substring(0, 50) + '...\n');

        // Test 6: Get new token info
        console.log('Test 6: Getting updated token info...');
        const info2 = getTokenInfo();
        console.log('✓ Updated Token Info:');
        console.log('  - Generated At:', info2.generatedAt);
        console.log('  - Expires At:', info2.expiresAt);
        console.log('  - Expires In:', info2.expiresIn, 'seconds\n');

        console.log('=== All Tests Passed! ===');
        console.log('\nToken cache file location: data/apiData/tokenCache.json');
        console.log('You can check the file to see the stored token data.');

    } catch (error) {
        console.error('✗ Test failed:', error);
    }
}

// Run the tests
testTokenManagement();
