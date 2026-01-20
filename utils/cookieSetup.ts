import { FakerData } from './fakerUtils'
import fs from 'fs'
import { chromium } from '@playwright/test'
import { URLConstants } from '../constants/urlConstants'
import { credentials } from '../constants/credentialData'

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

/**
 * Generate cookies with retry mechanism
 * Retries up to 3 times if cookie generation fails
 */
export const setupCourseCreation = async () => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        let browser = null;
        let context = null;
        
        try {
            console.log(`🔑 Starting cookie setup... (Attempt ${attempt}/${MAX_RETRIES})`);
            
            browser = await chromium.launch({ 
                headless: false,
                args: ['--start-maximized']
            });
            context = await browser.newContext({ viewport: null });
            const page = await context.newPage();
            
            const courseName = FakerData.getCourseName();
            
            // Use the URL and credentials from constants based on environment
            const baseUrl = URLConstants.adminURL;
            const { username, password } = credentials.CUSTOMERADMIN;

            await page.goto(`${baseUrl.replace('/backdoor', '')}`, { timeout: 30000 });
            await page.click('#signin', { timeout: 10000 });
            await page.fill('#username', username);
            await page.fill('#password', password);
            await page.click("//button[contains(text(),'Sign In')]", { timeout: 20000 });
            
            // Navigate to course creation
            await page.click("//div[text()='Menu']", { timeout: 50000 });
            await page.click("//span[text()='Learning']", { timeout: 20000 });
            await page.click("//a[text()='Course']", { timeout: 20000 });
            await page.click("//button[text()='CREATE COURSE']", { timeout: 10000 });
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            await page.waitForTimeout(1000);
            await page.click("(//span[text()='Click here'])[1]", { timeout: 10000 });
            
            const cookies = await context.cookies();
            
            // Validate cookies before saving
            if (!cookies || cookies.length === 0) {
                throw new Error('No cookies generated');
            }
            
            // Ensure data directory exists
            const dataDir = 'data';
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            // Save in BOTH formats to support different use cases:
            
            // 1. Text format (cookies.txt) - For API tests
            const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
            fs.writeFileSync('data/cookies.txt', cookieString);
            
            // 2. JSON format (cookies.json) - For UI Playwright tests (more reliable)
            fs.writeFileSync('data/cookies.json', JSON.stringify(cookies, null, 2));
            
            console.log(`✅ Saved ${cookies.length} cookies in both formats (Attempt ${attempt}/${MAX_RETRIES})`);
            
            await page.waitForTimeout(2000);
            await context.close();
            await browser.close();
            
            // Success - return
            return;
            
        } catch (error: any) {
            lastError = error;
            console.error(`❌ Cookie generation failed (Attempt ${attempt}/${MAX_RETRIES}):`, error.message);
            
            // Cleanup on error
            try {
                if (context) await context.close();
                if (browser) await browser.close();
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
            
            // If not the last attempt, wait before retrying
            if (attempt < MAX_RETRIES) {
                console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }
    
    // All retries failed
    console.error(`❌ Cookie generation failed after ${MAX_RETRIES} attempts`);
    throw new Error(`Failed to generate cookies after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}