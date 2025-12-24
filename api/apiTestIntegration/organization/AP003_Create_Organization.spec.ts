import { expect, test } from "@playwright/test";
import { createOrganization, listOrganization } from "../../organizationAPI";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";


const orgName = (FakerData.OrganizationName());
const code = "ORG-" + generateCode();

test.describe(`AP002_UpdateUser_api_testing`, async () => {
    test.describe.configure({ mode: 'serial' });

    test('Create Organization ', async () => {

        await createOrganization(orgName,code)
    });

    test(`Get created Organization`, async () => {
        let createdOrg = await listOrganization(orgName);
        expect(createdOrg).toContainEqual(orgName);
    })
})  