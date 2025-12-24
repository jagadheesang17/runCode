import { test } from "@playwright/test";
import { listSingleUser, userCreation } from "../../userAPI";
import { userCreationData, userCreationDataWithOptional } from "../../../data/apiData/formData";
import { FakerData } from "../../../utils/fakerUtils";
import { assertResponse } from "../../../utils/verificationUtils";
import { readDataFromCSV } from "../../../utils/csvUtil";
let generatingusername = FakerData.getUserId();
let userName = FakerData.getUserId();
let createdUserId: any;

test.describe('Testing UserAPI Functionality', () => {
    test.describe.configure({ mode: 'serial' });

    test('Create User with Mandatory Data', async () => {
            createdUserId = await userCreation(userCreationDataWithOptional(generatingusername));
            console.log("Created User with Mandatory Data:", createdUserId);
    });

    test('Create User with Optional Data', async () => {
        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);
        for (const row of data) {
            const { country, state, timezone, city, zipcode } = row;
            createdUserId = await userCreation(userCreationDataWithOptional(userName, "manager", country, state, timezone, city, zipcode));
            console.log("Created User with Optional Data:", createdUserId);
        }
    });
});
