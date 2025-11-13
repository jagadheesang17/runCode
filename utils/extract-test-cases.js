const fs = require('fs');
const path = require('path');

// Function to extract test case information from a file
function extractTestCaseInfo(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath, '.spec.ts');
        
        // Extract test describe blocks
        const describeRegex = /test\.describe\s*\(`([^`]+)`/g;
        const testRegex = /test\s*\(`([^`]+)`[\s\S]*?test\.info\(\)\.annotations\.push\s*\(\s*([\s\S]*?)\);/g;
        
        let describes = [];
        let match;
        
        // Get describe blocks
        while ((match = describeRegex.exec(content)) !== null) {
            describes.push(match[1]);
        }
        
        // Get test cases with annotations
        const tests = [];
        testRegex.lastIndex = 0; // Reset regex
        
        while ((match = testRegex.exec(content)) !== null) {
            const testName = match[1];
            const annotationsBlock = match[2];
            
            // Extract annotations
            const authorRegex = /{\s*type:\s*[`'"](Author|author)[`'"],\s*description:\s*[`'"]([^`'"]+)[`'"]/;
            const testCaseRegex = /{\s*type:\s*[`'"](TestCase|testcase|Test Case)[`'"],\s*description:\s*[`'"]([^`'"]+)[`'"]/;
            const descriptionRegex = /{\s*type:\s*[`'"](Test Description|test description|Description)[`'"],\s*description:\s*[`'"]([^`'"]+)[`'"]/;
            
            const authorMatch = authorRegex.exec(annotationsBlock);
            const testCaseMatch = testCaseRegex.exec(annotationsBlock);
            const descMatch = descriptionRegex.exec(annotationsBlock);
            
            tests.push({
                testName: testName,
                author: authorMatch ? authorMatch[2] : 'N/A',
                testCase: testCaseMatch ? testCaseMatch[2] : 'N/A',
                description: descMatch ? descMatch[2] : 'N/A'
            });
        }
        
        return {
            fileName: fileName,
            describes: describes,
            tests: tests
        };
        
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return null;
    }
}

// Main function to process AG test files
function extractAGTestCases() {
    const testDir = path.join(__dirname, '..', 'tests', 'admin', 'adminGroups_addinguserstodefaultAdminGroups');
    
    // Get AG021 to AG038 files
    const agFiles = [];
    for (let i = 21; i <= 38; i++) {
        const pattern = `AG0${i.toString().padStart(2, '0')}_`;
        try {
            const files = fs.readdirSync(testDir);
            const matchingFile = files.find(file => file.startsWith(pattern) && file.endsWith('.spec.ts'));
            if (matchingFile) {
                agFiles.push(path.join(testDir, matchingFile));
            }
        } catch (error) {
            console.error(`Error reading directory: ${error.message}`);
        }
    }
    
    console.log('='.repeat(100));
    console.log('TEST CASES EXTRACTION FOR AG021 TO AG038');
    console.log('='.repeat(100));
    
    agFiles.forEach((filePath, index) => {
        const testInfo = extractTestCaseInfo(filePath);
        if (testInfo) {
            console.log(`\n${index + 1}. FILE: ${testInfo.fileName}`);
            console.log('-'.repeat(80));
            
            if (testInfo.describes.length > 0) {
                console.log('DESCRIBE BLOCKS:');
                testInfo.describes.forEach((desc, i) => {
                    console.log(`   ${i + 1}. ${desc}`);
                });
                console.log('');
            }
            
            if (testInfo.tests.length > 0) {
                console.log('TEST CASES:');
                testInfo.tests.forEach((test, i) => {
                    console.log(`   Test ${i + 1}:`);
                    console.log(`   └─ Name: ${test.testName}`);
                    console.log(`   └─ Author: ${test.author}`);
                    console.log(`   └─ TestCase: ${test.testCase}`);
                    console.log(`   └─ Scenario: ${test.description}`);
                    console.log('');
                });
            } else {
                console.log('   No test cases with annotations found.');
            }
        }
    });
    
    console.log('='.repeat(100));
    console.log('EXTRACTION COMPLETE');
    console.log('='.repeat(100));
}

// Run the extraction
extractAGTestCases();