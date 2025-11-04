import { FakerData } from './fakerUtils'
import fs from 'fs'
import { chromium } from '@playwright/test'
import { URLConstants } from '../constants/urlConstants'
import { credentials } from '../constants/credentialData'

export const setupCourseCreation = async () => {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    })
    const context = await browser.newContext({ viewport: null })
    const page = await context.newPage()
    
    const courseName = FakerData.getCourseName()
    
    // Use the URL and credentials from constants based on environment
    console.log('🔑 Starting cookie setup...')
    const baseUrl = URLConstants.adminURL
    const { username, password } = credentials.CUSTOMERADMIN

    await page.goto(`${baseUrl.replace('/backdoor', '')}`)
    await page.click('#signin')
    await page.fill('#username', username)
    await page.fill('#password', password)
    await page.click("//button[contains(text(),'Sign In')]")    
    // Navigate to course creation
    await page.click("//div[text()='Menu']")
    await page.click("//span[text()='Learning']")
    await page.click("//a[text()='Course']")
    await page.click("//button[text()='CREATE COURSE']")
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    await page.click("(//span[text()='Click here'])[1]")
    const cookies = await context.cookies()
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
    fs.writeFileSync('data/cookies.txt', cookieString)
    console.log('✅ Cookie updated')
    
    await page.waitForTimeout(2000)
    await context.close()
    await browser.close()
}