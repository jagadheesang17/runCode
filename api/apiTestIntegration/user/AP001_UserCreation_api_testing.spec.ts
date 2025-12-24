import { test } from "@playwright/test";
import { listSingleUser, userCreation } from "../../userAPI";
import { userCreationData } from "../../../data/apiData/formData";
import { FakerData } from "../../../utils/fakerUtils";
import { assertResponse } from "../../../utils/verificationUtils";

let generatingusername = FakerData.getUserId();
let createdUserId: any;
let userId: any;
let userName: any;

test.describe('Testing UserAPI Functionality', () => {
    test.describe.configure({ mode: 'serial' });

    test('Create User', async () => {
        createdUserId = await userCreation(userCreationData(generatingusername));
        console.log(createdUserId);
    });

    test('Get the created user', async () => {
        let userDetails: any = await listSingleUser(generatingusername);
        [userId, userName] = userDetails;
        await assertResponse(userId, createdUserId);
    });
});
