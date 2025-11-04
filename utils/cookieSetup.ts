import { AdminHomePage } from '../pages/AdminHomePage'
import { CoursePage } from '../pages/CoursePage'
import { FakerData } from './fakerUtils'
import fs from 'fs'
import { chromium } from '@playwright/test'

export const setupCourseCreation = async () => {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ viewport: null })
    const page = await context.newPage()
    const adminHome = new AdminHomePage(page, context)
    const createCourse = new CoursePage(page, context)
    const courseName = FakerData.getCourseName() 
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.menuButton()
    await adminHome.clickLearningMenu()
    await adminHome.clickCourseLink()
    await createCourse.clickCreateCourse()
    await createCourse.verifyCreateUserLabel("CREATE COURSE")
    await createCourse.enter("course-title", courseName)
    const cookies = await context.cookies()
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
    fs.writeFileSync('data/cookies.txt', cookieString)
    console.log('✅ Cookie updated')
    
    await context.close()
    await browser.close()
}
