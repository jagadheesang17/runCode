import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const categoryName: any = FakerData.getCategory();
const currencyName: any = "Canadian Dollar";
test(`Verify that the user can successfully add a cancellation policy for E-learning under the Metadata Library module in the E-Commerce platform`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Verify that the user can successfully add a cancellation policy for E-learning' },
        { type: 'Test Description', description: "Verify that the user can successfully add a cancellation policy for E-learning" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_ECommerce();
    await metadatalibrary.clickOnTypeAndSelectType("E-Learning");
    await metadatalibrary.clickAddAnotherPolicy();
})
test(`Verify that the user can successfully add a cancellation policy for Classroom under the Metadata Library module in the E-Commerce platform`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify that the user can successfully add a cancellation policy for Classroom' },
        { type: 'Test Description', description: "Verify that the user can successfully add a cancellation policy for Classroom" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_ECommerce();
    await metadatalibrary.clickOnTypeAndSelectType("Classroom");
    await metadatalibrary.clickAddAnotherPolicy();
    await metadatalibrary.clickDeleteRecentlyCreated("Classroom");
})
test(`Verify that the user can successfully add a cancellation policy for Virtual Class under the Metadata Library module in the E-Commerce platform`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify that the user can successfully add a cancellation policy for Virtual Class' },
        { type: 'Test Description', description: "Verify that the user can successfully add a cancellation policy for Virtual Class" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_ECommerce();
    await metadatalibrary.clickOnTypeAndSelectType("Virtual Class");
    await metadatalibrary.clickAddAnotherPolicy();
    await metadatalibrary.clickDeleteRecentlyCreated("Virtual Class");
})
test(`Verify that the user can successfully add a cancellation policy for Learning Path under the Metadata Library module in the E-Commerce platform`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify that the user can successfully add a cancellation policy for Learning Path' },
        { type: 'Test Description', description: "Verify that the user can successfully add a cancellation policy for Learning Path" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_ECommerce();
    await metadatalibrary.clickOnTypeAndSelectType("Learning Path");
    await metadatalibrary.clickAddAnotherPolicy();
})
test(`Verify that the user can successfully add a cancellation policy for Certification under the Metadata Library module in the E-Commerce platform`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify that the user can successfully add a cancellation policy for Certification' },
        { type: 'Test Description', description: "Verify that the user can successfully add a cancellation policy for Certification" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_ECommerce();
    await metadatalibrary.clickOnTypeAndSelectType("Certification");
    await metadatalibrary.clickAddAnotherPolicy();
})

test(`Verify that the user can enable and disable a currency in the currency list under the Metadata Library module in the E-Commerce platform`, async ({ adminHome, createCourse, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify that the user can enable and disable a currency in the currency list' },
        { type: 'Test Description', description: 'Verify that the user can enable and disable a currency in the currency list' }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_ECommerce();
    //verify disable the currency
    await metadatalibrary.toggleSwitchInCurrency(currencyName,"disable")
    await metadatalibrary.currencyList();
    //verify whether that disabled currency is not present in course page
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCurrencyNotPresent(currencyName);
    //verify enable the disabled currency
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_ECommerce();
    await metadatalibrary.toggleSwitchInCurrency(currencyName,"enable")

})

