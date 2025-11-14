import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

interface JsonUser {
    name: string;
    username: string;
}

interface JsonData {
    users?: JsonUser[];
    data?: any[];  // For change log data
}

export class ExportValidator {
    private static getJsonData(jsonFileName: string): any {
        const jsonPath = path.join(process.cwd(), 'test-results', `${jsonFileName}.json`);
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`JSON file not found: ${jsonFileName}.json`);
        }
        console.log(`Using ${jsonFileName}.json for validation`);
        return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    }

    public static async validateCSV(filePath: string, jsonFileName: string): Promise<boolean> {
        console.log('\n=== CSV VALIDATION REPORT ===');
        
        try {
            const jsonData = this.getJsonData(jsonFileName);
            const csvContent = fs.readFileSync(filePath, 'utf-8');
            
            console.log(`CSV File Path: ${filePath}`);
            console.log(`CSV File Size: ${fs.statSync(filePath).size} bytes`);
            
            // Check if it's addedUsers data or changeLog data
            if (jsonData.users) {
                // Admin Groups validation - validate users
                console.log(`JSON Users Count: ${jsonData.users.length}`);
                
                let foundCount = 0;
                let missingUsers = [];
                
                console.log('\nDetailed Validation Results:');
                
                for (let i = 0; i < jsonData.users.length; i++) {
                    const user = jsonData.users[i];
                    const nameFound = csvContent.includes(user.name);
                    const usernameFound = csvContent.includes(user.username);
                    const userValid = nameFound && usernameFound;
                    
                    const status = userValid ? 'FOUND' : 'MISSING';
                    const nameStatus = nameFound ? 'Found' : 'Missing';
                    const usernameStatus = usernameFound ? 'Found' : 'Missing';
                    
                    console.log(`${i + 1}. ${user.name} | ${user.username}`);
                    console.log(`   Name: ${nameStatus} | Username: ${usernameStatus} | Result: ${status}`);
                    
                    if (userValid) {
                        foundCount++;
                    } else {
                        missingUsers.push(user);
                    }
                }
                
                console.log(`\nValidation Summary:`);
                console.log(`Total Users: ${jsonData.users.length}`);
                console.log(`Found: ${foundCount}`);
                console.log(`Missing: ${missingUsers.length}`);
                
                const validationPassed = missingUsers.length === 0;
                console.log(`Result: ${validationPassed ? 'VALIDATION PASSED' : 'VALIDATION FAILED'}`);
                
                if (!validationPassed) {
                    console.log('\nMissing Users Details:');
                    missingUsers.forEach((user, index) => {
                        console.log(`${index + 1}. ${user.name} (${user.username})`);
                    });
                }
                
                console.log('=== END CSV VALIDATION ===\n');
                return validationPassed;
            } else {
                // Change Log validation - validate all data fields
                console.log(`JSON Change Log Entries: ${jsonData.length}`);
                
                let foundCount = 0;
                let missingEntries = [];
                
                console.log('\nDetailed Validation Results:');
                
                for (let i = 0; i < jsonData.length; i++) {
                    const entry = jsonData[i];
                    const dataFields = entry.data;
                    
                    // Check if all fields from this entry are present in CSV
                    let allFieldsFound = true;
                    const missingFields = [];
                    
                    for (const field of dataFields) {
                        if (field && field.trim() !== '') {
                            if (!csvContent.includes(field)) {
                                allFieldsFound = false;
                                missingFields.push(field);
                            }
                        }
                    }
                    
                    const status = allFieldsFound ? 'FOUND' : 'MISSING';
                    console.log(`${i + 1}. Entry: ${dataFields.join(' | ')}`);
                    console.log(`   Result: ${status}`);
                    if (!allFieldsFound) {
                        console.log(`   Missing fields: ${missingFields.join(', ')}`);
                    }
                    
                    if (allFieldsFound) {
                        foundCount++;
                    } else {
                        missingEntries.push({ index: i + 1, data: dataFields, missingFields });
                    }
                }
                
                console.log(`\nValidation Summary:`);
                console.log(`Total Entries: ${jsonData.length}`);
                console.log(`Found: ${foundCount}`);
                console.log(`Missing: ${missingEntries.length}`);
                
                const validationPassed = missingEntries.length === 0;
                console.log(`Result: ${validationPassed ? 'VALIDATION PASSED' : 'VALIDATION FAILED'}`);
                
                if (!validationPassed) {
                    console.log('\nMissing Entries Details:');
                    missingEntries.forEach((entry) => {
                        console.log(`${entry.index}. Missing fields: ${entry.missingFields.join(', ')}`);
                    });
                }
                
                console.log('=== END CSV VALIDATION ===\n');
                return validationPassed;
            }
            
        } catch (error) {
            console.log(`CSV validation error: ${error.message}`);
            console.log('=== END CSV VALIDATION ===\n');
            return false;
        }
    }

    public static async validateExcel(filePath: string, jsonFileName: string): Promise<boolean> {
        console.log('\n=== EXCEL VALIDATION REPORT ===');
        
        try {
            const jsonData = this.getJsonData(jsonFileName);
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            console.log(`Excel File Path: ${filePath}`);
            console.log(`Excel File Size: ${fs.statSync(filePath).size} bytes`);
            console.log(`Excel Sheet Name: ${sheetName}`);
            console.log(`Excel Rows Count: ${excelData.length}`);
            
            const excelContent = excelData.flat().join(' ');
            
            // Check if it's addedUsers data or changeLog data
            if (jsonData.users) {
                // Admin Groups validation - validate users
                console.log(`JSON Users Count: ${jsonData.users.length}`);
                
                let foundCount = 0;
                let missingUsers = [];
                
                console.log('\nDetailed Validation Results:');
                
                for (let i = 0; i < jsonData.users.length; i++) {
                    const user = jsonData.users[i];
                    const nameFound = excelContent.includes(user.name);
                    const usernameFound = excelContent.includes(user.username);
                    const userValid = nameFound && usernameFound;
                    
                    const status = userValid ? 'FOUND' : 'MISSING';
                    const nameStatus = nameFound ? 'Found' : 'Missing';
                    const usernameStatus = usernameFound ? 'Found' : 'Missing';
                    
                    console.log(`${i + 1}. ${user.name} | ${user.username}`);
                    console.log(`   Name: ${nameStatus} | Username: ${usernameStatus} | Result: ${status}`);
                    
                    if (userValid) {
                        foundCount++;
                    } else {
                        missingUsers.push(user);
                    }
                }
                
                console.log(`\nValidation Summary:`);
                console.log(`Total Users: ${jsonData.users.length}`);
                console.log(`Found: ${foundCount}`);
                console.log(`Missing: ${missingUsers.length}`);
                
                const validationPassed = missingUsers.length === 0;
                console.log(`Result: ${validationPassed ? 'VALIDATION PASSED' : 'VALIDATION FAILED'}`);
                
                if (!validationPassed) {
                    console.log('\nMissing Users Details:');
                    missingUsers.forEach((user, index) => {
                        console.log(`${index + 1}. ${user.name} (${user.username})`);
                    });
                }
                
                console.log('=== END EXCEL VALIDATION ===\n');
                return validationPassed;
            } else {
                // Change Log validation - validate all data fields
                console.log(`JSON Change Log Entries: ${jsonData.length}`);
                
                // First, let's see what's actually in the Excel
                console.log('\n=== EXCEL CONTENT PREVIEW ===');
                const firstRows = excelData.slice(0, Math.min(10, excelData.length));
                firstRows.forEach((row, idx) => {
                    console.log(`Excel Row ${idx + 1}: ${JSON.stringify(row)}`);
                });
                console.log('=== END PREVIEW ===\n');
                
                let foundCount = 0;
                let missingEntries = [];
                
                console.log('\nDetailed Validation Results:');
                
                for (let i = 0; i < jsonData.length; i++) {
                    const entry = jsonData[i];
                    const dataFields = entry.data;
                    
                    // Check if all fields from this entry are present in Excel
                    let allFieldsFound = true;
                    const missingFields = [];
                    
                    for (const field of dataFields) {
                        if (field && field.trim() !== '') {
                            if (!excelContent.includes(field)) {
                                allFieldsFound = false;
                                missingFields.push(field);
                            }
                        }
                    }
                    
                    const status = allFieldsFound ? 'FOUND' : 'MISSING';
                    console.log(`${i + 1}. Entry: ${dataFields.join(' | ')}`);
                    console.log(`   Result: ${status}`);
                    if (!allFieldsFound) {
                        console.log(`   Missing fields: ${missingFields.join(', ')}`);
                    }
                    
                    if (allFieldsFound) {
                        foundCount++;
                    } else {
                        missingEntries.push({ index: i + 1, data: dataFields, missingFields });
                    }
                }
                
                console.log(`\nValidation Summary:`);
                console.log(`Total Entries: ${jsonData.length}`);
                console.log(`Found: ${foundCount}`);
                console.log(`Missing: ${missingEntries.length}`);
                
                const validationPassed = missingEntries.length === 0;
                console.log(`Result: ${validationPassed ? 'VALIDATION PASSED' : 'VALIDATION FAILED'}`);
                
                if (!validationPassed) {
                    console.log('\nMissing Entries Details:');
                    missingEntries.forEach((entry) => {
                        console.log(`${entry.index}. Missing fields: ${entry.missingFields.join(', ')}`);
                    });
                }
                
                console.log('=== END EXCEL VALIDATION ===\n');
                return validationPassed;
            }
            
        } catch (error) {
            console.log(`Excel validation error: ${error.message}`);
            console.log('=== END EXCEL VALIDATION ===\n');
            return false;
        }
    }

    // Simple validation method for checking if specific usernames exist in exported files
    public static async validateUsernamesInCSV(filePath: string, usernames: string[]): Promise<boolean> {
        console.log('\n=== CSV USERNAME VALIDATION REPORT ===');
        
        try {
            const csvContent = fs.readFileSync(filePath, 'utf-8');
            
            console.log(`CSV File Path: ${filePath}`);
            console.log(`CSV File Size: ${fs.statSync(filePath).size} bytes`);
            console.log(`Usernames to validate: ${usernames.join(', ')}`);
            
            let foundCount = 0;
            let missingUsernames = [];
            
            console.log('\nUsername Validation Results:');
            
            for (const username of usernames) {
                const found = csvContent.includes(username);
                const status = found ? 'FOUND' : 'MISSING';
                console.log(`${username}: ${status}`);
                
                if (found) {
                    foundCount++;
                } else {
                    missingUsernames.push(username);
                }
            }
            
            console.log(`\nValidation Summary:`);
            console.log(`Total Usernames: ${usernames.length}`);
            console.log(`Found: ${foundCount}`);
            console.log(`Missing: ${missingUsernames.length}`);
            
            const validationPassed = missingUsernames.length === 0;
            console.log(`Result: ${validationPassed ? 'VALIDATION PASSED' : 'VALIDATION FAILED'}`);
            
            if (!validationPassed) {
                console.log(`Missing Usernames: ${missingUsernames.join(', ')}`);
            }
            
            console.log('=== END CSV USERNAME VALIDATION ===\n');
            return validationPassed;
            
        } catch (error) {
            console.log(`CSV username validation error: ${error.message}`);
            console.log('=== END CSV USERNAME VALIDATION ===\n');
            return false;
        }
    }

    public static async validateUsernamesInExcel(filePath: string, usernames: string[]): Promise<boolean> {
        console.log('\n=== EXCEL USERNAME VALIDATION REPORT ===');
        
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            console.log(`Excel File Path: ${filePath}`);
            console.log(`Excel File Size: ${fs.statSync(filePath).size} bytes`);
            console.log(`Excel Sheet Name: ${sheetName}`);
            console.log(`Usernames to validate: ${usernames.join(', ')}`);
            
            const excelContent = excelData.flat().join(' ');
            
            let foundCount = 0;
            let missingUsernames = [];
            
            console.log('\nUsername Validation Results:');
            
            for (const username of usernames) {
                const found = excelContent.includes(username);
                const status = found ? 'FOUND' : 'MISSING';
                console.log(`${username}: ${status}`);
                
                if (found) {
                    foundCount++;
                } else {
                    missingUsernames.push(username);
                }
            }
            
            console.log(`\nValidation Summary:`);
            console.log(`Total Usernames: ${usernames.length}`);
            console.log(`Found: ${foundCount}`);
            console.log(`Missing: ${missingUsernames.length}`);
            
            const validationPassed = missingUsernames.length === 0;
            console.log(`Result: ${validationPassed ? 'VALIDATION PASSED' : 'VALIDATION FAILED'}`);
            
            if (!validationPassed) {
                console.log(`Missing Usernames: ${missingUsernames.join(', ')}`);
            }
            
            console.log('=== END EXCEL USERNAME VALIDATION ===\n');
            return validationPassed;
            
        } catch (error) {
            console.log(`Excel username validation error: ${error.message}`);
            console.log('=== END EXCEL USERNAME VALIDATION ===\n');
            return false;
        }
    }
}