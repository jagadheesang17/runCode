import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from '../../utils/fakerUtils';
import { userCreationData } from "../../data/apiData/formData";
import { userCreation } from "../../api/userAPI";

let userName = FakerData.getUserId();
let createdUserId: any;
test(`Creating a new user from admin side`, async ({ adminHome, editCourse, createUser, learnerHome, adminRoleHome, adminGroup, createCourse, contentHome, learnerGroup }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Kathir A` },
        { type: `TestCase`, description: `Creating new user for Verifying Terms and Conditions popup present on the learner page` },
        { type: `Test Description`, description: `Creating user forVerifying Terms and Conditions popup present on the learner page for newly created user` }

    );
    createdUserId = await userCreation(userCreationData(userName));
    await learnerHome.basicLogin(userName, "defaultportal");
    await learnerHome.termsAndConditionScroll("Deny");
    await learnerHome.verifyLoggedOut();

}
);

