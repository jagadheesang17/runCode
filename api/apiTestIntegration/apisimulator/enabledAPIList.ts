import { Page, chromium } from "@playwright/test";
import path from "path";
import * as fs from 'fs';

export async function getAdminAPI() {

    const browser = await chromium.launch({ headless: false }); // Launch browser
    const context = await browser.newContext();
    const page = await context.newPage();

  // await page.goto('https://qa.expertusoneqa.com/api/v2/simulator'); // Navigate to a page
   await page.goto('https://newprod.expertusoneqa.in/api/v2/simulator'); // Navigate to a page
    await page.waitForTimeout(5000);
    await page.locator("//span[text()='Admin']").click();
    await page.waitForTimeout(5000);
    const locator = page.locator("//ul[@id='adminAPI']//a//span");
    const count = await locator.count();
    let adminAPIs: any = [];
    for (let i = 0; i < count; i++) {
        const adminAPIList = await locator.nth(i).innerHTML();
        await adminAPIs.push(adminAPIList);
    }
    console.log(adminAPIs);

    try {
        const filePath = '../../../data/apiData/adminAPIList.json';
        // const filePath='D:\ArivuPlaywrightWorkspace\QAAutomation\data\apiData';
        const fileName = path.join(__dirname, filePath)
        fs.writeFileSync(fileName, JSON.stringify(adminAPIs));
        console.log(`adminAPIs saved to ${filePath}`);
    } catch (err) {
        console.error('Error writing file:', err);
    }

}


export async function getLearnerAPI() {

    const browser = await chromium.launch({ headless: false }); // Launch browser
    const context = await browser.newContext();
    const page = await context.newPage();

   // await page.goto('https://qa.expertusoneqa.com/api/v2/simulator'); // Navigate to a page
    await page.goto('https://newprod.expertusoneqa.in/api/v2/simulator'); // Navigate to a page
    await page.waitForTimeout(5000);
    await page.locator("//span[text()='Learner']").click();
    await page.waitForTimeout(5000);
    const locator = page.locator("//ul[@id='learnerAPI']//span");
    const count = await locator.count();
    let learnerAPIs: any = [];
    for (let i = 0; i < count; i++) {
        const learnerAPIList = await locator.nth(i).innerHTML();
        await learnerAPIs.push(learnerAPIList);
    }
    console.log(learnerAPIs);

    try {
        const filePath = '../../../data/apiData/learnerAPIList.json';
        // const filePath='D:\ArivuPlaywrightWorkspace\QAAutomation\data\apiData';
        const fileName = path.join(__dirname, filePath)
        fs.writeFileSync(fileName, JSON.stringify(learnerAPIs));
        console.log(`learnerAPIs saved to ${filePath}`);
    } catch (err) {
        console.error('Error writing file:', err);
    }

}