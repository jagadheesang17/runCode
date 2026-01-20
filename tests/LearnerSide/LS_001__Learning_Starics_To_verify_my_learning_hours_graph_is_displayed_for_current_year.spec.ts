import { test } from "../../customFixtures/expertusFixture";
import enrollmentUsersData from '../../data/enrollmentUserData/EnrollmentUser.json';


const users: any[] = enrollmentUsersData;

test.describe(`My learning hours graph is displayed & Assignment Type, Training Type, Delivery Type for current year `, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of E-learning single instance `, async ({ learnerHome, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `kathir A` },
            { type: `TestCase`, description: `my learning hours graph is displayed for current year` },
            { type: `Test Description`, description: `To verify my learning hours graph is displayed for current year` }

        );

        await learnerHome.basicLogin(users[1]?.username, "LearnerPortal");
        await dashboard.selectDashboardItems("Learning Statistics");
        await dashboard.getLearningHours();
        await dashboard.verifyAssignmentTypeChart();
        await dashboard.verifyTrainingTypeChart();
        await dashboard.verifyDeliveryTypeChart();
        await dashboard.clickOverallLink();
        await dashboard.verifyAssignmentTypeChart();
        await dashboard.verifyTrainingTypeChart();
        await dashboard.verifyDeliveryTypeChart();
        await dashboard.verifyActionCenter();
        await dashboard.verifyWishListChartAndGetCount();

    })
})