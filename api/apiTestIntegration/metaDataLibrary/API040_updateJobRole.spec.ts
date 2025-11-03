import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { createJobRole, updateJobRole } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

let access_token: string;
const jobRoleName = FakerData.getJobRoleName() + " " + "Role";
const updatedJobRoleName = FakerData.getJobRoleName() + " " + "Updated";
const generatedcode = generateCode();

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Update Job Role', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating Job Role through API', async () => {
        await createJobRole(jobRoleName, generatedcode,{ Authorization: access_token });
    });
    test(`Verify that a job role can be added under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a job role can be added under Metadata Library' },
            { type: 'Test Description', description: "Verify that a job role can be added under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
         await adminHome.meta_People();
        // Add specific navigation for job role verification
        await metadatalibrary.jobRoleExpandButton();
        await metadatalibrary.jobRoleSearchField(jobRoleName);
        await metadatalibrary.verify_JobRole(jobRoleName)
    });

    //Update Job Role
    test('Updating Job Role through API', async () => {
        await updateJobRole(generatedcode,updatedJobRoleName,{ Authorization: access_token });
    });

    test(`Verify that a job role can be updated under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a job role can be updated under Metadata Library' },
            { type: 'Test Description', description: "Verify that a job role can be updated under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
         await adminHome.meta_People();
        // Add specific navigation for job role verification
        await metadatalibrary.jobRoleExpandButton();
        await metadatalibrary.jobRoleSearchField(jobRoleName);
        await metadatalibrary.noResultFoundMsgOnJobRole()
        await metadatalibrary.jobRoleSearchField(updatedJobRoleName);
        await metadatalibrary.verify_JobRole(updatedJobRoleName)
    });
});
