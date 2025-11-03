import { PlaywrightWrapper } from "../utils/playwright";
import { ExportValidator } from "../utils/exportValidator";
import * as fs from 'fs';
import * as path from 'path';

export class ExportPage extends PlaywrightWrapper {
    
    private selectors = {
        exportIcon: `(//button[contains(@class,'export')]/i)[1]`,
        exportAs: (filetype: string) => `(//span[text()='Export as ${filetype}'])[1]`,
    }

    public async clickExportAs(filetype: string): Promise<void> {
        await this.wait("minWait");
        await this.click(this.selectors.exportIcon, "Export Icon", "Button");
        await this.wait("minWait");

        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.click(this.selectors.exportAs(filetype), `Export as ${filetype}`, "Option")
        ]);
        
        console.log(`Export as ${filetype} initiated`);
        const projectDownloadsDir = path.join(process.cwd(), 'test-results', 'downloads');
        
        if (!fs.existsSync(projectDownloadsDir)) {
            fs.mkdirSync(projectDownloadsDir, { recursive: true });
        }

        const fileExtension = filetype === 'CSV' ? '.csv' : '.xlsx';
        const fileName = `export_${Date.now()}${fileExtension}`;
        const filePath = path.join(projectDownloadsDir, fileName);
        
        await download.saveAs(filePath);
        console.log(`\n=== ${filetype.toUpperCase()} EXPORT COMPLETED ===`);
        console.log(`File downloaded to: ${filePath}`);
        console.log(`File size: ${fs.statSync(filePath).size} bytes`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
    }

    // For AG013 - JSON-based validation (compares UI data with exported file)
    public async validateExported(filetype: string): Promise<void> {
        // Get the latest exported file
        const projectDownloadsDir = path.join(process.cwd(), 'test-results', 'downloads');
        const files = fs.readdirSync(projectDownloadsDir);
        const fileExtension = filetype === 'CSV' ? '.csv' : '.xlsx';
        const exportedFiles = files.filter(file => file.endsWith(fileExtension));
        
        if (exportedFiles.length === 0) {
            throw new Error(`No ${filetype} file found in downloads directory`);
        }
        
        // Get the most recent file
        const latestFile = exportedFiles.sort((a, b) => {
            const aTime = fs.statSync(path.join(projectDownloadsDir, a)).mtime.getTime();
            const bTime = fs.statSync(path.join(projectDownloadsDir, b)).mtime.getTime();
            return bTime - aTime;
        })[0];
        
        const filePath = path.join(projectDownloadsDir, latestFile);
        console.log(`Validating file: ${filePath}`);

        let validationResult = false;
        if (filetype === 'CSV') {
            validationResult = await ExportValidator.validateCSV(filePath);
        } else if (filetype === 'Excel') {
            validationResult = await ExportValidator.validateExcel(filePath);
        }
        
        if (!validationResult) {
            console.log(`\n=== ${filetype.toUpperCase()} VALIDATION FAILED ===`);
            throw new Error(`${filetype} validation failed - exported data does not match UI data`);
        }
        
        console.log(`=== ${filetype.toUpperCase()} EXPORT & VALIDATION SUCCESS ===\n`);
    }

    // For AG014 - Simple username validation (checks if specific usernames exist in exported file)
    public async validateUsernamesInExport(filetype: string, usernames: string[]): Promise<void> {
        // Get the latest exported file
        const projectDownloadsDir = path.join(process.cwd(), 'test-results', 'downloads');
        const files = fs.readdirSync(projectDownloadsDir);
        const fileExtension = filetype === 'CSV' ? '.csv' : '.xlsx';
        const exportedFiles = files.filter(file => file.endsWith(fileExtension));
        
        if (exportedFiles.length === 0) {
            throw new Error(`No ${filetype} file found in downloads directory`);
        }
        
        // Get the most recent file
        const latestFile = exportedFiles.sort((a, b) => {
            const aTime = fs.statSync(path.join(projectDownloadsDir, a)).mtime.getTime();
            const bTime = fs.statSync(path.join(projectDownloadsDir, b)).mtime.getTime();
            return bTime - aTime;
        })[0];
        
        const filePath = path.join(projectDownloadsDir, latestFile);
        console.log(`Validating usernames in file: ${filePath}`);

        let validationResult = false;
        if (filetype === 'CSV') {
            validationResult = await ExportValidator.validateUsernamesInCSV(filePath, usernames);
        } else if (filetype === 'Excel') {
            validationResult = await ExportValidator.validateUsernamesInExcel(filePath, usernames);
        }
        
        if (!validationResult) {
            console.log(`\n=== ${filetype.toUpperCase()} USERNAME VALIDATION FAILED ===`);
            throw new Error(`${filetype} username validation failed - usernames ${usernames.join(', ')} not found in exported file`);
        }
        
        console.log(`=== ${filetype.toUpperCase()} USERNAME VALIDATION SUCCESS ===\n`);
    }
}