import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import * as fs from 'fs';
import * as path from 'path';
import { URLConstants } from "../data/apiData/apiUtil";
import { customAdminOuthData } from "../data/apiData/formData";

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
        console.log('No valid token cache found');
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
 * Check if the cached token is still valid
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

    return minutesUntilExpiry > TOKEN_VALIDITY_MINUTES;
}

/**
 * Generate a new OAuth token from the API (internal use only)
 */
async function generateNewTokenInternal(): Promise<TokenCache> {
    try {
        const endPointURL = URLConstants.adminEndPointUrl;
        
        const formData = new FormData();
        Object.entries(customAdminOuthData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const headers = {
            "Content-Type": "multipart/form-data",
            "Connection": "keep-alive"
        };

        const response: AxiosResponse<any> = await axios.post(endPointURL, formData, { headers });

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
 * Get a valid OAuth token (automatically refreshes if expired)
 */
async function getValidToken(): Promise<string> {
    const cachedToken = readTokenCache();

    if (isTokenValid(cachedToken)) {
        console.log('Using cached token');
        return cachedToken.accessToken;
    }

    console.log('Token expired or invalid, generating new token...');
    const newToken = await generateNewTokenInternal();
    return newToken.accessToken;
}

export async function postRequest(
    userData: Record<string, any>,
    endPoint: string,
    customHeaders?: Record<string, string>,
    additionalConfig?: AxiosRequestConfig,
): Promise<any> {

    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
        // Automatically get and validate access token (refreshes if expired)
        const accessToken = await getValidToken();

        const headers = {
            "Content-Type": "multipart/form-data",
            "Connection": "keep-alive",
            ...(accessToken && { "Authorization": accessToken }), // Add Authorization header if token exists
            ...customHeaders
        };

        const response: AxiosResponse<any> = await axios.post(endPoint, formData, {
            headers,
            ...additionalConfig
        });
        return {
            data: response.data,
            status: response.status
        }

    } catch (error) {
        console.error("Error making POST request:", error);
        throw error;
    }
}


export async function getRequest(
    userData: Record<string, any>,
    endPoint: string,
    customHeaders?: Record<string, string>,
    additionalConfig?: AxiosRequestConfig
): Promise<any> {
    try {
        const queryParams = new URLSearchParams(userData).toString();

        const headers = {
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            ...customHeaders
        };

        const url = queryParams ? `${endPoint}?${queryParams}` : endPoint;
        const response: AxiosResponse<any> = await axios.get(url, {
            headers,
            ...additionalConfig
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error making GET request:", error);
        throw error;
    }
}



export async function deleteRequest(
    userData: Record<string, any>,
    endPoint: string,
    customHeaders?: Record<string, string>,
    additionalConfig?: AxiosRequestConfig
): Promise<any> {

    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
        const headers = {
            "Content-Type": "multipart/form-data",
            "Connection": "keep-alive",
            ...customHeaders
        };

        const config: AxiosRequestConfig = {
            headers,
            data: formData,
            ...additionalConfig
        };

        const response: AxiosResponse<any> = await axios.delete(endPoint, config);

        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error("Error making DELETE request:", error);
        throw error;
    }
}
