import { da } from "@faker-js/faker";
import { URLConstants } from "../../constants/urlConstants";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from '../../utils/fakerUtils';

const courseName1 ="crsbookmark"+" "+ FakerData.getCourseName();
const description = FakerData.getDescription();
let contentName: any;
const pageUrl = URLConstants.adminURL;
//let courseName1 = "crsbookmark 1080p Program Override";
//let contentName="content testing-001";

test.describe(`Verify_that_the_user_is_able_to_bookmark_the_course_complete_it_and_then_remove_the_bookmark.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance Elearning with Youtube content`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Creation of Single Instance Elearning with Youtube content` },
            { type: `Test Description`, description: `Creation of Single Instance Elearning with Youtube content` }
        );
      // await adminHome.clearBrowserCache(pageUrl)
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName1);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary();//Youtube content is attached here
        contentName = await createCourse.getAttachedContentName()
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })

    test(`Learner registration and Bookmark the course.`, async ({ learnerHome, adminHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Learner registration and Bookmark the course.` },
            { type: `Test Description`, description: `Learner registration and Bookmark the course.` }
        );
        //    await adminHome.clearBrowserCache(pageUrl)

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName1);
        await catalog.clickMoreonCourse(courseName1);
        await catalog.clickSelectcourse(courseName1);
        await catalog.clickEnroll();
        await catalog.bookmarkClass(courseName1);
       // await catalog.bookmarkSpecificContent(contentName);

    })

    test(`Verify able to launch and complete the bookmarked course`, async ({ learnerHome, dashboard, catalog }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Verify able to launch and complete the bookmarked course` },
            { type: `Test Description`, description: `Verify able to launch and complete the bookmarked course` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickBookmarkLink();
        await dashboard.bookMarkSearch(courseName1);
        await dashboard.bookmarkVerification(courseName1);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickMyLearning();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(courseName1);
        await dashboard.vaidatVisibleCourse_Program(courseName1, "Completed");
    })

    test(`Verify able to remove the bookmarked course`, async ({ learnerHome, dashboard, catalog }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Verify able to remove the bookmarked course` },
            { type: `Test Description`, description: `Verify able to remove the bookmarked course` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickBookmarkLink();
        await dashboard.verifyBookmarkSections();
        await dashboard.verifyBookmarkedDate(courseName1);
        await dashboard.bookMarkSearch(courseName1);
        await dashboard.bookmarkRemove(courseName1);
        await dashboard.bookMarkSearch(courseName1);
        await catalog.noResultFound();

    })


})