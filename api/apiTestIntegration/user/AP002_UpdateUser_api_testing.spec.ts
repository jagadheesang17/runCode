import { test } from "@playwright/test";
import { getUserDetail, listSingleUser, updateUser, userCreation } from "../../userAPI";
import { userCreationData } from "../../../data/apiData/formData";
import { FakerData } from "../../../utils/fakerUtils";
import { assertResponse } from "../../../utils/verificationUtils";

let createUserName = FakerData.getUserId()
let createdUserId: string
let userId: string, userName: string;

test.describe(`AP002_UpdateUser_api_testing`, async () => {
    test.describe.configure({ mode: 'serial' });

    test('Create User ', async () => {
        createdUserId = await userCreation(userCreationData(createUserName));
    });

    test('Get the created user', async () => {

        let userDetails: any = await listSingleUser(createUserName);
        [userId, userName] = userDetails;
        await assertResponse(userId, createdUserId);
    });

    test('Update the  User ', async () => {
        let updatedUser = await updateUser(createUserName);
        console.log(updatedUser);

    });

    test('Retrive the Updated user', async () => {
        let userDetails: any = await listSingleUser(createUserName);
        [userId, userName] = userDetails;
        await assertResponse(userId, createdUserId);
    });

})