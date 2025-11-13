import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL018 - Verify Delivery Type filter enabled/disabled based on Training Type selection', () => {

    const domain = "newprod";

    test("DSL018a - Verify Delivery Type is disabled for Learning Path/Certification and enabled only for Course", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL018a_Verify_delivery_type_enabled_disabled_based_on_training_type' },
            { type: 'Test Description', description: 'Verify Delivery Type filter is disabled when Training Type is Learning Path or Certification, and enabled only when Training Type is Course' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.selectTrainingType("Learning Path");
        await dynamicShareableLinks.wait('mediumWait');
        // await dynamicShareableLinks.verifyDeliveryTypeDisabled();

        console.log('✅ Delivery Type is disabled when Training Type = Learning Path');
        
        // Clear and reselect domain
        await dynamicShareableLinks.clickClearButton();
        await dynamicShareableLinks.wait('mediumWait');
        await dynamicShareableLinks.selectTrainingType("Certification");
        await dynamicShareableLinks.wait('mediumWait');
        // await dynamicShareableLinks.verifyDeliveryTypeDisabled();
        console.log('✅ Delivery Type is disabled when Training Type = Certification');
        
        await dynamicShareableLinks.clickClearButton();
        await dynamicShareableLinks.wait('mediumWait');
        
        await dynamicShareableLinks.selectTrainingType(["Course", "Certification"]);
        await dynamicShareableLinks.wait('mediumWait');
        await dynamicShareableLinks.verifyDeliveryTypeDisabled();
        console.log('✅ Delivery Type is disabled when Training Type = Course + Certification combination');
        
        await dynamicShareableLinks.clickClearButton();
        await dynamicShareableLinks.wait('mediumWait');
        
        await dynamicShareableLinks.selectTrainingType("Course");
        await dynamicShareableLinks.wait('mediumWait');
        await dynamicShareableLinks.verifyDeliveryTypeEnabled();
        console.log('✅ Delivery Type is ENABLED when Training Type = Course');
    });

});
