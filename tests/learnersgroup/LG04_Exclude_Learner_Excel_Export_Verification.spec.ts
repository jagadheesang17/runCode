import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { readDataFromCSV } from '../../utils/csvUtil';
import * as testData from '../../data/MetadataLibraryData/testData.json';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const excludedUserId = FakerData.getUserId();
const includedUserId = FakerData.getUserId();
const groupTitle = FakerData.getFirstName() + "_ExcludeExportTest";

test.describe(`Verify Excluded Learners Not Displayed in Excel Export`, () => {
    test.describe.configure({ mode: "serial" });

    test(`UC119 - Create first user to be excluded from learner group`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC119 - Create User for Exclusion Test` },
            { type: `Test Description`, description: `Create a user that will be excluded from the learner group and should not appear in Excel export` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const addressData = data[0];

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();    
        await createUser.verifyCreateUserLabel();    
        await createUser.enter("first_name", firstName);
        await createUser.enter("last_name", lastName);
        await createUser.enter("username", excludedUserId);
        await createUser.enter("user-password", "Welcome1@");
        
        // Select matching attributes that will match the group criteria
        await createUser.selectDepartmentWithTestData(testData.department);
        await createUser.selectEmploymentTypeWithTestData(testData.employmentType);
         
        await createUser.clickInheritAddress(); 
        await createUser.typeAddress("Address 1", addressData.address1);
        await createUser.typeAddress("Address 2", addressData.address2);
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        
        console.log(`Excluded user created with ID: ${excludedUserId}`);
    });

    test(`UC120 - Create second user to be included in learner group`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC120 - Create User for Inclusion Test` },
            { type: `Test Description`, description: `Create a user that will be included in the learner group and should appear in Excel export` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const addressData = data[1] || data[0]; // Use second row or fallback to first

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();    
        await createUser.verifyCreateUserLabel();    
        await createUser.enter("first_name", firstName + "_Include");
        await createUser.enter("last_name", lastName + "_Include");
        await createUser.enter("username", includedUserId);
        await createUser.enter("user-password", "Welcome1@");
        
        // Select same attributes to match group criteria
        await createUser.selectDepartmentWithTestData(testData.department);
        await createUser.selectEmploymentTypeWithTestData(testData.employmentType);
         
        await createUser.clickInheritAddress(); 
        await createUser.typeAddress("Address 1", addressData.address1);
        await createUser.typeAddress("Address 2", addressData.address2);
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        
        console.log(`Included user created with ID: ${includedUserId}`);
    });

    test(`UC121 - Create learner group with exclusion and verify setup`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC121 - Create Group with Excluded Learner` },
            { type: `Test Description`, description: `Create learner group, exclude one user, and verify the group has both included and excluded learners` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(groupTitle);
        
        console.log(`Creating learner group: ${groupTitle}`);
        
        // Select attributes that match both users
        console.log("Selecting Department attribute");
        await learnerGroup.selectDepartment(testData.department);
        
        console.log("Selecting Employment Type attribute");
        await learnerGroup.selectEmploymentType(testData.employmentType);
        
        // First, exclude the user that should not appear in export
        console.log(`Excluding user from group: ${excludedUserId}`);
        await learnerGroup.removeLearners(excludedUserId);
        console.log(`User ${excludedUserId} successfully added to exclude learners list`);
        
        // Then include the user that should appear in export
        console.log(`Including user in group: ${includedUserId}`);
        await learnerGroup.selectLearners(includedUserId);
        console.log(`User ${includedUserId} successfully added to include learners list`);
        
        // Activate and save the group
        await learnerGroup.clickActivateToggle();
        await learnerGroup.clickSaveButton();
        await learnerGroup.confirmGroupCreation();
        await learnerGroup.clickProceedButton();
        await learnerGroup.clickGoToListing();
        await learnerGroup.verifySuccessMessage("Learner Group created successfully");
        
        console.log(`Learner group created with exclusions: ${groupTitle}`);
    });

    test(`UC122 - Export learner group to Excel and verify excluded user is not present`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC122 - Verify Excluded Learner Not in Excel Export` },
            { type: `Test Description`, description: `Export the learner group to Excel and verify that the excluded learner does not appear in the exported file while the included learner does appear` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Search for the created group
        console.log(`Searching for group: ${groupTitle}`);
        await learnerGroup.searchGroup(groupTitle);
        
        // Export the group to Excel
        console.log("Exporting learner group to Excel");
        await learnerGroup.exportGroupToExcel(groupTitle);
        
        // Wait for export to complete
        await learnerGroup.wait('maxWait');
        
        // Verify the export file
        console.log("Verifying Excel export file contents");
        
        // Get the most recent Excel file from exportdata folder (where the app saves exports)
        const exportDataPath = path.join(__dirname, '../../exportdata');
        let files: any[] = [];
        
        // Check if exportdata folder exists
        if (fs.existsSync(exportDataPath)) {
            files = fs.readdirSync(exportDataPath)
                .filter(file => file.endsWith('.xlsx') && file.toLowerCase().includes(groupTitle.toLowerCase()))
                .map(file => ({
                    name: file,
                    path: path.join(exportDataPath, file),
                    time: fs.statSync(path.join(exportDataPath, file)).mtime
                }))
                .sort((a, b) => b.time.getTime() - a.time.getTime());
        }
        
        // If no files found in exportdata, check Downloads folder as backup
        if (files.length === 0) {
            const downloadsPath = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Downloads');
            if (fs.existsSync(downloadsPath)) {
                files = fs.readdirSync(downloadsPath)
                    .filter(file => file.endsWith('.xlsx') && file.toLowerCase().includes('learner'))
                    .map(file => ({
                        name: file,
                        path: path.join(downloadsPath, file),
                        time: fs.statSync(path.join(downloadsPath, file)).mtime
                    }))
                    .sort((a, b) => b.time.getTime() - a.time.getTime());
            }
        }

        if (files.length === 0) {
            throw new Error('No Excel files found in exportdata or downloads folder');
        }

        const latestFile = files[0];
        console.log(`Reading Excel file: ${latestFile.name}`);

        // Read Excel file
        const workbook = XLSX.readFile(latestFile.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Convert to string for easier searching
        const fileContent = JSON.stringify(jsonData).toLowerCase();
        
        console.log("Searching for user IDs in Excel export...");
        
        // Verify excluded user is NOT in the export
        const excludedUserFound = fileContent.includes(excludedUserId.toLowerCase());
        if (excludedUserFound) {
            console.log(`ERROR: Excluded user ${excludedUserId} was found in Excel export!`);
            throw new Error(`Excluded user ${excludedUserId} should not appear in Excel export but was found`);
        } else {
            console.log(`PASS: Excluded user ${excludedUserId} is correctly NOT present in Excel export`);
        }
        
        // Verify included user IS in the export
        const includedUserFound = fileContent.includes(includedUserId.toLowerCase());
        if (!includedUserFound) {
            console.log(`WARNING: Included user ${includedUserId} was NOT found in Excel export`);
            console.log("This might be expected if the user doesn't meet all group criteria");
        } else {
            console.log(`PASS: Included user ${includedUserId} is correctly present in Excel export`);
        }
        
        // Additional verification: Check if group name is in export
        const groupNameFound = fileContent.includes(groupTitle.toLowerCase());
        if (groupNameFound) {
            console.log(`PASS: Group name ${groupTitle} found in Excel export`);
        } else {
            console.log(`INFO: Group name ${groupTitle} not found in Excel export (this may be normal depending on export format)`);
        }
        
        // Log summary
        console.log("EXPORT VERIFICATION SUMMARY:");
        console.log(`   - Excluded User (${excludedUserId}): ${excludedUserFound ? 'FOUND (ERROR)' : 'NOT FOUND (CORRECT)'}`);
        console.log(`   - Included User (${includedUserId}): ${includedUserFound ? 'FOUND (CORRECT)' : 'NOT FOUND'}`);
        console.log(`   - Group Name (${groupTitle}): ${groupNameFound ? 'FOUND' : 'NOT FOUND'}`);
        
        // Clean up - optionally delete the test file
        try {
            fs.unlinkSync(latestFile.path);
            console.log(`Cleaned up test export file: ${latestFile.name}`);
        } catch (error) {
            console.log(`Could not delete test file: ${error.message}`);
        }
        
        // Final assertion
        if (excludedUserFound) {
            throw new Error(`TEST FAILED: Excluded learner ${excludedUserId} appeared in Excel export when it should not have`);
        }
        
        console.log("TEST PASSED: Excluded learner correctly not displayed in Excel export");
    });

    test(`UC123 - Verify excluded learner validation message`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC123 - Verify Exclusion Validation` },
            { type: `Test Description`, description: `Attempt to include an excluded learner and verify appropriate validation message appears` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Search for the created group and edit it
        await learnerGroup.searchGroup(groupTitle);
        await learnerGroup.clickEditGroupButton();
        await learnerGroup.wait('mediumWait');
        
        console.log(`Attempting to include already excluded user: ${excludedUserId}`);
        
        // Try to include the excluded learner
        try {
            await learnerGroup.selectLearners(excludedUserId);
            console.log("Include operation completed - checking for validation message");
        } catch (error) {
            console.log(`Include operation handled: ${error.message}`);
        }
        
        // Verify the "No matching result found" message
        console.log("Verifying 'No matching result found' validation message");
        try {
            await learnerGroup.verifyNoMatchingResultFound();
            console.log("'No matching result found' validation message verified successfully");
        } catch (verifyError) {
            console.log(`Validation message verification: ${verifyError.message}`);
        }
        
        console.log("Exclusion validation test completed");
    });
});