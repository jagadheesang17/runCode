import { expect } from "allure-playwright";
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

test.describe('DSL011 - Verify Price filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL011a - Verify learner can view unpaid trainings when Free checkbox is selected", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL011a_Verify_free_trainings_displayed' },
            { type: 'Test Description', description: 'Verify whether the learner can view the unpaid trainings when the admin selects the Free checkbox' }
        );
        const content='content testing-001';
        const courseName =  FakerData.getCourseName();  
        const result = await createCourseAPI(content,courseName,'published','single','e-learning');
        expect(result).toBe(courseName);
        console.log(` Successfully created course: "${courseName}"`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.selectTrainingType("Course");
        await dynamicShareableLinks.selectFreeCheckbox();
        const generatedURL = await dynamicShareableLinks.clickGenerateURL();
        await dynamicShareableLinks.openGeneratedURL(generatedURL);
        await dynamicShareableLinks.verifyAppliedFilter("Training Type", "Course");
        // await dynamicShareableLinks.verifyAppliedFilter("Price", "Free");
        await dynamicShareableLinks.searchTraining(courseName);
        await dynamicShareableLinks.verifyTrainingsDisplayed(courseName);
    });

    test("DSL011b - Verify learner can view paid trainings when Paid checkbox is selected", async ({ adminHome, dynamicShareableLinks,learnerHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL011b_Verify_paid_trainings_displayed' },
            { type: 'Test Description', description: 'Verify whether the learner can view the paid trainings when the admin selects the Paid checkbox' }
        );
        
        const content = 'content testing-001';
        const courseName =  FakerData.getCourseName();  
        const result = await createCourseAPI(content,courseName,'published','single','e-learning','700' ,'US Dollar');
        expect(result).toBe(courseName);
        console.log(` Successfully created course: "${courseName}"`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.selectTrainingType("Course");
        await dynamicShareableLinks.selectPaidCheckbox();
        await dynamicShareableLinks.enterMinPrice("700");
        await dynamicShareableLinks.enterMaxPrice("704");
        const generatedURL = await dynamicShareableLinks.clickGenerateURL();
        await dynamicShareableLinks.openGeneratedURL(generatedURL);
        await dynamicShareableLinks.verifyAppliedFilter("Training Type", "Course");
        // await dynamicShareableLinks.verifyAppliedFilter("Price", "700");
        await dynamicShareableLinks.searchTraining(courseName);
        await dynamicShareableLinks.verifyTrainingsDisplayed(courseName);
        await dynamicShareableLinks.verifyPrice("700");

    });

    test("DSL011c - Verify minimum and maximum price accepts only numeric values", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL011c_Verify_price_numeric_only' },
            { type: 'Test Description', description: 'Verify whether the minimum and maximum accepts only numeric values' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.selectPaidCheckbox();
        await dynamicShareableLinks.enterMinPrice("1aa");
        await dynamicShareableLinks.enterMaxPrice("120ads");
        await dynamicShareableLinks.verifyPriceFieldValue('min', '1');
        await dynamicShareableLinks.verifyPriceFieldValue('max', '120');
    });



    test("DSL011d - Verify price filter is displayed when Commerce is ON", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL011d_Verify_price_filter_commerce_on' },
            { type: 'Test Description', description: 'Verify whether the price filter is getting displayed in the Dynamic Share Link page when the Commerce is ON' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyPriceFilterDisplayed();
    });

    test("DSL011e - Verify price filter is not displayed when Commerce is OFF", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL011e_Verify_price_filter_commerce_off' },
            { type: 'Test Description', description: 'Verify whether the price filter is not getting displayed in the Dynamic Share Link page when the Commerce is OFF' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyPriceFilterNotDisplayed();
    });


});
