import { faker } from "@faker-js/faker";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

let title: string ="";
test.describe(`CNT073 - Verify edit, preview, hide/unhide, re-order and delete options for attached content in create course page`, async () => {
    
    test(`Verify all action options for attached content in create course page`, async ({ 
        adminHome, 
        contentHome,
        createCourse
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT073` },
            { type: `Test Description`, description: `Verify edit, preview, hide/unhide, re-order and delete options for attached content in create course page` }
        );
        title = FakerData.getCourseName();
        // Login and navigate to create course page
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.wait("mediumWait");
        await createCourse.clickCreateCourse();
        await createCourse.wait("mediumWait");
        await createCourse.enter("course-title", title);
        await createCourse.selectLanguage("English");
        // Attach content to the course
        await createCourse.contentLibrary();
        await createCourse.clickhere();
        await createCourse.typeDescription(FakerData.getDescription());
        await createCourse.contentLibrary("AutoAudioFile");
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.editcourse();

        await createCourse.wait("minWait");

        // Verify Edit option is visible and clickable
        await createCourse.verifyEditContentOptionVisible();

        // Verify Preview option is visible and clickable
        await createCourse.verifyPreviewContentOptionVisible();

        // Verify Hide/Unhide option is visible and clickable
        await createCourse.verifyHideUnhideOptionVisible();

        // Verify Re-order option is visible and clickable
        await createCourse.verifyReorderOptionVisible();

        // Verify Delete option is visible and clickable
        await createCourse.verifyDeleteContentOptionVisible();
    });
});
