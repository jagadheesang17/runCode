import * as fs from 'fs';
import * as path from 'path';
import { URLConstants } from "../data/apiData/apiUtil";
import { customAdminOuthData } from "../data/apiData/formData";
import { postRequest } from "./requestUtils";

const TOKEN_CACHE_PATH = path.join(__dirname, '../data/apiData/tokenCache.json');
const TOKEN_VALIDITY_MINUTES = 45; // Refresh token 45 minutes before expiry

interface TokenCache {
    accessToken: string;
    expiresIn: number;
    generatedAt: string;
    expiresAt: string;
}

/**
 * Read the token cache from the JSON file
 */
function readTokenCache(): TokenCache {
    try {
        if (fs.existsSync(TOKEN_CACHE_PATH)) {
            const data = fs.readFileSync(TOKEN_CACHE_PATH, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('No valid token cache found, will generate new token');
    }
    return {
        accessToken: '',
        expiresIn: 0,
        generatedAt: '',
        expiresAt: ''
    };
}

/**
 * Write the token cache to the JSON file
 */
function writeTokenCache(cache: TokenCache): void {
    try {
        fs.writeFileSync(TOKEN_CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
        console.log(`Token cached at ${cache.generatedAt}, expires at ${cache.expiresAt}`);
    } catch (error) {
        console.error('Failed to write token cache:', error);
    }
}

/**
 * Check if the cached token is still valid (considering 45-minute refresh window)
 */
function isTokenValid(cache: TokenCache): boolean {
    if (!cache.accessToken || !cache.expiresAt) {
        return false;
    }

    const now = new Date();
    const expiresAt = new Date(cache.expiresAt);
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    const minutesUntilExpiry = timeUntilExpiry / (1000 * 60);

    console.log(`Token expires in ${Math.floor(minutesUntilExpiry)} minutes`);

    // Return false if token expires within TOKEN_VALIDITY_MINUTES or already expired
    return minutesUntilExpiry > TOKEN_VALIDITY_MINUTES;
}

/**
 * Generate a new OAuth token from the API
 */
async function generateNewToken(): Promise<TokenCache> {
    try {
        const endPointURL = URLConstants.adminEndPointUrl;
        const response = await postRequest(customAdminOuthData, endPointURL);

        if (response.data && response.data.access_token) {
            const now = new Date();
            const expiresInSeconds = response.data.expires_in || 3600;
            const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000);

            const cache: TokenCache = {
                accessToken: "Bearer " + response.data.access_token,
                expiresIn: expiresInSeconds,
                generatedAt: now.toISOString(),
                expiresAt: expiresAt.toISOString()
            };

            writeTokenCache(cache);
            console.log(`New token generated. Expires in ${expiresInSeconds} seconds (${Math.floor(expiresInSeconds / 60)} minutes)`);
            
            return cache;
        } else {
            throw new Error("Access token not found in response");
        }
    } catch (error) {
        console.error("Failed to generate OAuth token:", error);
        throw error;
    }
}

/**
 * Get a valid OAuth token (either from cache or generate new)
 * This is the main function to be used throughout the application
 */
export async function getOauthToken(): Promise<string> {
    const cachedToken = readTokenCache();

    if (isTokenValid(cachedToken)) {
        console.log('Using cached token');
        return cachedToken.accessToken;
    }

    console.log('Token expired or invalid, generating new token...');
    const newToken = await generateNewToken();
    return newToken.accessToken;
}

/**
 * Force refresh the token (useful for testing or manual refresh)
 */
export async function refreshOauthToken(): Promise<string> {
    console.log('Forcing token refresh...');
    const newToken = await generateNewToken();
    return newToken.accessToken;
}

/**
 * Get token information for debugging
 */
export function getTokenInfo(): TokenCache {
    return readTokenCache();
}
