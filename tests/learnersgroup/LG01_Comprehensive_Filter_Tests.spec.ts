import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import * as testData from '../../data/MetadataLibraryData/testData.json';

const groupTitle = FakerData.getFirstName() + "_ComprehensiveFilterTest";

test.describe('Comprehensive Filter Tests - All Filter Types', () => {
    test.describe.configure({ mode: "serial" });

    test('UC050: Department Filter Test', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC050 - Department Filter Testing' },
            { type: 'Test Description', description: 'Verify that the department filter works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Department filter using JSON data
        await learnerGroup.filterByDepartment(testData.department);
        await learnerGroup.validateFilterResults("Department", testData.department);
    });

    test('UC051: Organization Filter Test', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC051 - Organization Filter Testing' },
            { type: 'Test Description', description: 'Verify that the organization filter works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Organization filter using fallback data (not in JSON)
        const organizationValue = "ROIORG3";
        await learnerGroup.filterByOrganization(organizationValue);
        await learnerGroup.validateFilterResults("Organization", organizationValue);
    });

    test('UC052: Employee Type Filter Test', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC052 - Employee Type Filter Testing' },
            { type: 'Test Description', description: 'Verify that the employee type filter works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Employee Type filter using JSON data
        await learnerGroup.filterByEmployeeType(testData.employmentType);
        await learnerGroup.validateFilterResults("Employee Type", testData.employmentType);
    });

    test('UC053: Job Role Filter Test', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC053 - Job Role Filter Testing' },
            { type: 'Test Description', description: 'Verify that the job role filter works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Job Role filter using JSON data
        await learnerGroup.filterByJobRole(testData.jobTitle);
        await learnerGroup.validateFilterResults("Job Role", testData.jobTitle);
    });

    test('UC054: User Type Filter Test', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC054 - User Type Filter Testing' },
            { type: 'Test Description', description: 'Verify that the user type filter works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply User Type filter using JSON data
        await learnerGroup.filterByUserType(testData.userType);
        await learnerGroup.validateFilterResults("User Type", testData.userType);
    });

    test('UC055: Domain Filter Test (Dropdown)', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC055 - Domain Filter Testing' },
            { type: 'Test Description', description: 'Verify that the domain filter dropdown works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Domain filter using fallback data (not in JSON)a
     
        const domainValue = "qaautomation"
        await learnerGroup.filterByDomain(domainValue);
        await learnerGroup.validateFilterResults("Domain", domainValue);
    });

    test('UC056: Group Role Filter Test', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC056 - Group Role Filter Testing' },
            { type: 'Test Description', description: 'Verify that the group role filter works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Group Role filter using available jobRole data
        await learnerGroup.filterByGroupRole(testData.jobRole);
        await learnerGroup.validateFilterResults("Group Role", testData.jobRole);
    });

    test('UC057: Country Filter Test (Dropdown with Search)', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC057 - Country Filter Testing' },
            { type: 'Test Description', description: 'Verify that the country filter dropdown with search works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Country filter using fallback data (not in JSON)
        const countryValue = "United States";
        await learnerGroup.filterByCountry(countryValue);
        await learnerGroup.validateFilterResults("Country", countryValue);
    });

    test.skip('UC058: State Filter Test (Dropdown with Search)', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC058 - State Filter Testing' },
            { type: 'Test Description', description: 'Verify that the state filter dropdown with search works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply State filter using fallback data (not in JSON)
        const stateValue = "California";
        await learnerGroup.filterByState(stateValue);
        await learnerGroup.validateFilterResults("State", stateValue);
    });

    test('UC059: Language Filter Test', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC059 - Language Filter Testing' },
            { type: 'Test Description', description: 'Verify that the language filter works correctly with JSON test data' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Language filter using fallback data (not in JSON)
        const languageValue = "English";
        await learnerGroup.filterByLanguage(languageValue);
        await learnerGroup.validateFilterResults("Language", languageValue);
    });

    // test('UC060: Comprehensive Multi-Filter Test', async ({ adminHome, learnerGroup }) => {
    //     test.info().annotations.push(
    //         { type: 'Author', description: 'Jagadish' },
    //         { type: 'TestCase', description: 'UC060 - Comprehensive Multi-Filter Testing' },
    //         { type: 'Test Description', description: 'Test multiple filters in sequence to ensure they all work correctly together' }
    //     );

    //     await adminHome.loadAndLogin("CUSTOMERADMIN");
    //     await adminHome.menuButton();
    //     await adminHome.people();
    //     await adminHome.clickLearnerGroupLink();
        
    //     // Test multiple filters in sequence
    //     await learnerGroup.filterByDepartment(testData.department);
    //     await learnerGroup.validateFilterResults("Department", testData.department);
        
    //     await learnerGroup.filterByEmployeeType(testData.employmentType);
    //     await learnerGroup.validateFilterResults("Employee Type", testData.employmentType);
        
    //     await learnerGroup.filterByUserType(testData.userType);
    //     await learnerGroup.validateFilterResults("User Type", testData.userType);
        
    //     const countryValue = "United States";
    //     await learnerGroup.filterByCountry(countryValue);
    //     await learnerGroup.validateFilterResults("Country", countryValue);
    // });

});