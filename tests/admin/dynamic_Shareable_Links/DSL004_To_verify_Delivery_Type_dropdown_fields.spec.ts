import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL004 - Verify Delivery Type dropdown fields in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL004 - Verify Delivery Type dropdown displays E-Learning, Classroom, Virtual Class options", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL004_Verify_delivery_type_fields_displayed' },
            { type: 'Test Description', description: 'Verify that E-Learning, Classroom, and Virtual Class options are displayed when clicking on Delivery Type dropdown' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);

        // Verify the expected delivery type options are displayed
        // Different environments use different naming: [Environment variant, Alternative variant]
        const expectedDeliveryTypes = [
            ["Classroom", "Attend-In Person"],
            ["Virtual Class", "Attend-Remote"],
            ["E-Learning", "E-learning"]
        ];
        await dynamicShareableLinks.validateDeliveryTypes(expectedDeliveryTypes);

    });

});
