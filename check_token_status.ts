/**
 * Token Status Checker
 * Quick script to check the current token status without generating a new one
 */

import * as fs from 'fs';
import * as path from 'path';

const TOKEN_CACHE_PATH = path.join(__dirname, 'data/apiData/tokenCache.json');

function checkTokenStatus() {
    console.log('=== OAuth Token Status ===\n');

    try {
        if (!fs.existsSync(TOKEN_CACHE_PATH)) {
            console.log('❌ No token cache found');
            console.log('📝 Token will be generated on first API call\n');
            return;
        }

        const data = fs.readFileSync(TOKEN_CACHE_PATH, 'utf-8');
        const cache = JSON.parse(data);

        if (!cache.accessToken) {
            console.log('❌ Token cache is empty');
            console.log('📝 Token will be generated on first API call\n');
            return;
        }

        const now = new Date();
        const generatedAt = new Date(cache.generatedAt);
        const expiresAt = new Date(cache.expiresAt);
        
        const timeElapsed = now.getTime() - generatedAt.getTime();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        
        const minutesElapsed = Math.floor(timeElapsed / (1000 * 60));
        const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));
        const secondsUntilExpiry = Math.floor(timeUntilExpiry / 1000);

        console.log('📊 Token Information:');
        console.log('─────────────────────────────────────────');
        console.log('🔑 Token:', cache.accessToken.substring(0, 50) + '...');
        console.log('⏱️  Expires In:', cache.expiresIn, 'seconds');
        console.log('📅 Generated:', generatedAt.toLocaleString());
        console.log('📅 Expires:', expiresAt.toLocaleString());
        console.log('');
        console.log('⏰ Time Status:');
        console.log('─────────────────────────────────────────');
        console.log('✓ Token age:', minutesElapsed, 'minutes');
        console.log('✓ Time until expiry:', minutesUntilExpiry, 'minutes', `(${secondsUntilExpiry} seconds)`);

        if (timeUntilExpiry < 0) {
            console.log('❌ STATUS: EXPIRED');
            console.log('   Token will be refreshed on next API call');
        } else if (minutesUntilExpiry <= 45) {
            console.log('⚠️  STATUS: WILL REFRESH SOON');
            console.log('   Token will be auto-refreshed on next API call');
            console.log('   (Refresh happens 45 minutes before expiry)');
        } else {
            console.log('✅ STATUS: VALID');
            console.log('   Token is good to use');
            console.log(`   Will auto-refresh in ${minutesUntilExpiry - 45} minutes`);
        }

        console.log('');
        console.log('📁 Cache Location:', TOKEN_CACHE_PATH);
        console.log('');

    } catch (error) {
        console.error('❌ Error reading token cache:', error);
    }
}

// Run the status check
checkTokenStatus();
