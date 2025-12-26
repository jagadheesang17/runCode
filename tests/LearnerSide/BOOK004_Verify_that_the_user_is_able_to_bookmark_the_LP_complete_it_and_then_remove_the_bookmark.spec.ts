import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let domain: any
test.describe(`Book004_Verify_that_the_user_is_able_to_bookmark_the_LP_complete_it_and_then_remove_the_bookmark.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of E-learning single instance `, async ({ adminHome, createCourse, learningPath }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Create the course as Single instance` },
            { type: `Test Description`, description: `Verify portal1 course is not availble to portal2 users` }

        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.getCourse();
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        domain = await createCourse.selectPortal();
        console.log(`${domain}`);
        await createCourse.contentLibrary(); //By default Youtube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })
    const title = FakerData.getCourseName();
    // const title = "Certification_2404";

     test(`Learning Path Creation`, async ({ adminHome, learningPath, createCourse }) => {
            test.info().annotations.push(
                { type: `Author`, description: `Arivazhagan P` },
                { type: `TestCase`, description: `Learning Path Creation` },
                { type: `Test Description`, description: `Learning Path Creation` }
            )
    
            await adminHome.loadAndLogin("CUSTOMERADMIN")
            await adminHome.menuButton();
            await adminHome.clickLearningMenu();
            await adminHome.clickLearningPath();
            await learningPath.clickCreateLearningPath();
            await learningPath.title(title);
            await learningPath.description(description);
            await learningPath.language();
            await learningPath.clickSave();
            await learningPath.clickProceedBtn();
            await learningPath.clickAddCourse();
            await learningPath.searchAndClickCourseCheckBox(courseName);
            await learningPath.clickAddSelectCourse();
            await learningPath.clickDetailTab();
            await learningPath.clickCatalogBtn();
            await learningPath.clickUpdateBtn();
            await learningPath.verifySuccessMessage();
            // await learningPath.clickEditLearningPath()
            // await createCourse.clickDetailButton();
            // await createCourse.clickCatalog()
            // await createCourse.clickUpdate();
            // await createCourse.verifySuccessMessage();
        })

    test(`Confirm that a learner can successfully bookmark the lp.`, async ({ learnerHome, catalog }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Confirm that a learner can successfully bookmark the lp.` },
            { type: `Test Description`, description: `Confirm that a learner can successfully bookmark the lp.` }

        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        // await catalog.clickViewCertificationDetails();
        await catalog.bookmarkClass(title);
        // await catalog.clickLaunchButton();
        //  await catalog.saveLearningStatus();
        //  await catalog.clickViewCertificate();
    })

    test(`Verify that a learner can successfully launch and complete the bookmarked lp.`, async ({ learnerHome, catalog, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Verify that a learner can successfully launch and complete the bookmarked lp.` },
            { type: `Test Description`, description: `Verify that a learner can successfully launch and complete the bookmarked lp.` }

        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickBookmarkLink();
        await dashboard.navigateBookmarkLinks("Learning Path");
        await dashboard.bookMarkSearch(title);
        await dashboard.bookmarkVerification(title);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();
    })
    test(`Verify able to remove the bookmarked lp`, async ({ learnerHome, dashboard, catalog }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Verify able to remove the bookmarked lp` },
            { type: `Test Description`, description: `Verify able to remove the bookmarked lp` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickBookmarkLink();
        await dashboard.navigateBookmarkLinks("Learning Path");
        await dashboard.bookMarkSearch(title);
        await dashboard.bookmarkRemove(title);
        await dashboard.bookMarkSearch(title);
        await catalog.noResultFound();

    })

})