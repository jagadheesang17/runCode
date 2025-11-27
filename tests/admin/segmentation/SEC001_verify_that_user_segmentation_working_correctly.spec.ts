import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture"
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from '../../../utils/fakerUtils';
import { updateFieldsInJSON } from "../../../utils/jsonDataHandler";


const adminUser: any = FakerData.getUserId()
const learnerUser: any = FakerData.getUserId()
const learnerFirstName = FakerData.getFirstName()
const learnerLastName = FakerData.getLastName()
const learnerFullName = learnerFirstName + " " + learnerLastName
const roleName = FakerData.getFirstName() + " Admin Role"
const groupTitle: any = FakerData.getFirstName() + " Admin Group"
const OrgName = "A " + FakerData.getOrganizationName() + " ORG"
let otherUser = credentials.LEARNERUSERNAME.username


test.describe(`Verify that user segmentation working correctly`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Create user in admin login`, async ({ adminHome, createUser, adminRoleHome, CompletionCertification, organization, contentHome, adminGroup, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create user in admin login` },
            { type: `Test Description`, description: `Create user in admin login` }

        );
        //creating admin user
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.clickMenu("User");
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", adminUser);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", FakerData.getEmail());
        await createUser.clickSave();
        await createUser.verifyUserCreationSuccessMessage();

        //creating organization
        await adminHome.menuButton();
        await adminHome.people();
        await organization.organizationMenu()
        await organization.createOrganization();
        await organization.enterName(OrgName);
        await organization.selectOrgType("Internal");
        await organization.typeDescription();
        await organization.clickSave();
        await CompletionCertification.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();
        //creating admin role
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.clickAdminRole()
        await adminRoleHome.clickAddAdminRole()
        await adminRoleHome.enterName(roleName);
        await adminRoleHome.clickAllPriveileges();
        await adminRoleHome.clickSave()
        await adminRoleHome.verifyRole(roleName)

        //creating admin group
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.clickCreateGroup();
        await adminGroup.selectroleAdmin(roleName);
        await adminGroup.enterGroupTitle(groupTitle)
        await adminGroup.selectOrg(OrgName)
        await adminGroup.searchUser(adminUser)
        await adminGroup.clickuserCheckbox(adminUser)
        await adminGroup.clickSelelctUsers();
        await adminGroup.clickActivate();
        await adminGroup.clickSave()
        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();

        //creating learner
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name",learnerFirstName);
        await createUser.enter("last_name", learnerLastName);
        await createUser.enter("username", learnerUser);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", FakerData.getEmail());
        await createUser.enrterOrgName(OrgName)
        await createUser.clickSave();
        await createUser.verifyUserCreationSuccessMessage();
    });


    test(`Login as admin user and verify that user segmentation working correctly`, async ({ createUser,learnerHome, adminHome, adminGroup, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Login as admin user and verify that user segmentation working correctly` },
            { type: `Test Description`, description: `Login as admin user and verify that user segmentation working correctly` }

        );
        //Verifying user segmentation
        await learnerHome.basicLogin(adminUser, "default");
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(learnerUser);
        await createUser.verifyUserSegmentation(learnerFullName,otherUser);
    })

})
