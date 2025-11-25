// utils/excelReader.ts
import * as XLSX from 'xlsx';

export class ExcelReader {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    // Method to read the entire sheet into an array of objects
    public readExcel(sheetIndexOrName: number | string = 0): any[] | null {
        try {
            const workbook = XLSX.readFile(this.filePath);

            let sheetName: string;
            if (typeof sheetIndexOrName === 'number') {
                if (sheetIndexOrName >= workbook.SheetNames.length) {
                    console.error(`Sheet index ${sheetIndexOrName} out of range. Max index: ${workbook.SheetNames.length - 1}`);
                    return null;
                }
                sheetName = workbook.SheetNames[sheetIndexOrName];
            } else if (typeof sheetIndexOrName === 'string') {
                if (!workbook.SheetNames.includes(sheetIndexOrName)) {
                    console.error(`Sheet name "${sheetIndexOrName}" not found in the workbook.`);
                    return null;
                }
                sheetName = sheetIndexOrName;
            } else {
                console.error('Invalid sheet index or name');
                return null;
            }

            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (data.length === 0) {
                return []; 
            }

            const headers = (data[0] as string[]).map(header => header.trim().toLowerCase()); // Normalize headers
            const rows = data.slice(1) as any[];

            return rows.map((row: any[]) => {
                const rowObject: any = {};
                headers.forEach((header: string, index: number) => {
                    rowObject[header] = row[index];
                });
                return rowObject;
            });
        } catch (error) {
            console.error('Error reading the Excel file:', error);
            return null;
        }
    }

   
    public getRowByTestcase(sheetIndexOrName: number | string, testcase: string ): any | null {
        const data = this.readExcel(sheetIndexOrName);
        if (data) {
            return data.find(row => row.testcase === testcase) || null;
        }
        return null;
    }
}
// Excel Writer for bulk enrollment
export class ExcelWriter {
    private filePath: string;
    
    constructor(filePath: string) {
        this.filePath = filePath;
    }

    // Method to create bulk enrollment Excel file with data
    public createBulkEnrollmentFile(enrollmentData: Array<{
        username: string;
        class_code: string;
        regdate?: string;
        status?: string;
    }>): void {
        try {
            // Create a new workbook
            const workbook = XLSX.utils.book_new();
            
            // Define headers for bulk enrollment
            const headers = ['username', 'class_code', 'regdate', 'status'];
            
            // Convert data to worksheet format
            const wsData = [headers, ...enrollmentData.map(row => [
                row.username,
                row.class_code,
                row.regdate || '',
                row.status || 'Enrolled'
            ])];
            
            // Create worksheet
            const worksheet = XLSX.utils.aoa_to_sheet(wsData);
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'BulkEnrollment');
            
            // Write to file
            XLSX.writeFile(workbook, this.filePath);
            console.log(`Bulk enrollment file created: ${this.filePath}`);
        } catch (error) {
            console.error('Error creating bulk enrollment file:', error);
            throw error;
        }
    }

    // Method to update existing Excel template with enrollment data
    public updateExcelTemplate(templatePath: string, enrollmentData: Array<{
        username: string;
        class_code: string;
        regdate?: string;
        status?: string;
    }>): void {
        try {
            let workbook: XLSX.WorkBook;
            
            // Try to read existing template, create new if it doesn't exist
            try {
                workbook = XLSX.readFile(templatePath);
            } catch {
                workbook = XLSX.utils.book_new();
            }
            
            // Get first sheet or create new one
            const sheetName = workbook.SheetNames[0] || 'Sheet1';
            let worksheet = workbook.Sheets[sheetName];
            
            if (!worksheet) {
                worksheet = XLSX.utils.aoa_to_sheet([]);
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            }
            
            // Clear existing data and add headers if empty
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            if (range.e.r === 0 && range.e.c === 0) {
                // Empty sheet, add headers
                const headers = ['username', 'class_code', 'regdate', 'status'];
                XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
            }
            
            // Add enrollment data starting from row 2 (after headers)
            const dataRows = enrollmentData.map(row => [
                row.username,
                row.class_code,
                row.regdate || '',
                row.status || 'Enrolled'
            ]);
            
            XLSX.utils.sheet_add_aoa(worksheet, dataRows, { origin: 'A2' });
            
            // Write updated file
            XLSX.writeFile(workbook, this.filePath);
            console.log(`Excel template updated: ${this.filePath}`);
        } catch (error) {
            console.error('Error updating Excel template:', error);
            throw error;
        }
    }

    // Method to add single enrollment record to existing file
    public addEnrollmentRecord(username: string, classCode: string, regDate?: string, status?: string): void {
        try {
            let workbook: XLSX.WorkBook;
            
            // Try to read existing file
            try {
                workbook = XLSX.readFile(this.filePath);
            } catch {
                // File doesn't exist, create new
                this.createBulkEnrollmentFile([{
                    username,
                    class_code: classCode,
                    regdate: regDate,
                    status: status || 'Enrolled'
                }]);
                return;
            }
            
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Find next empty row
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            const nextRow = range.e.r + 2; // +2 because row numbers are 1-based and we need next row
            
            // Add new record
            const newRecord = [username, classCode, regDate || '', status || 'Enrolled'];
            XLSX.utils.sheet_add_aoa(worksheet, [newRecord], { origin: `A${nextRow}` });
            
            // Write updated file
            XLSX.writeFile(workbook, this.filePath);
            console.log(`Added enrollment record for ${username} to ${this.filePath}`);
        } catch (error) {
            console.error('Error adding enrollment record:', error);
            throw error;
        }
    }
}

/* Example usage:
const writer = new ExcelWriter('./bulk_enrollment.xlsx');
writer.createBulkEnrollmentFile([
    { username: 'divyab', class_code: 'CLS001', regdate: '2024-01-15', status: 'Enrolled' },
    { username: 'user2', class_code: 'CLS001', regdate: '2024-01-15', status: 'Enrolled' }
]);

const reader = new ExcelReader('../data/expertousOneData.xlsx');
const testCaseID = "TC004";
const rowData = reader.getRowByTestcase('admin', testCaseID); 

if (rowData) {
    const login = rowData?.login; 
    console.log('Login:', login); 
} else {
    console.error(`No data found for testcase "${testCaseID}"`);
} */