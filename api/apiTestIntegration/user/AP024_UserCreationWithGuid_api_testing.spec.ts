import { test } from "@playwright/test";
import { listSingleUser, userCreationWithGuid } from "../../userAPI";
import { generateOauthToken } from "../../accessToken";
import { userCreationWithGuidData } from "../../../data/apiData/formData";
import { FakerData } from "../../../utils/fakerUtils";
import { assertResponse } from "../../../utils/verificationUtils";
import { verifyUserGuidInDatabase } from "../../../tests/admin/DB/DBJobs";

let generatingusername = FakerData.getUserId();
let access_token: any;
let createdUserId: any;
let userId: any;
let userName: any;
let userGuid: any;

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Testing UserAPI Functionality with GUID', () => {
    test.describe.configure({ mode: 'serial' });

    test('AP024 - Create User with GUID', async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `AP024 - User Creation with GUID` },
            { type: `Test Description`, description: `Create user using userCreationWithGuid API with dynamic GUID field` }
        );

        const userData = userCreationWithGuidData(generatingusername);
        userGuid = userData.guid; // Capture the GUID for database verification
        console.log('User creation data with GUID:', userData);
        console.log('Generated GUID:', userGuid);
        
        createdUserId = await userCreationWithGuid(userData, { Authorization: access_token });
        console.log('Created User ID:', createdUserId);
    });

    test('AP024 - Get the created user with GUID', async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `AP024 - Verify Created User with GUID` },
            { type: `Test Description`, description: `Retrieve and verify the user created with GUID` }
        );

        let userDetails: any = await listSingleUser(generatingusername, { Authorization: access_token });
        [userId, userName] = userDetails;
        
        console.log('Retrieved User ID:', userId);
        console.log('Retrieved Username:', userName);
        
        await assertResponse(userId, createdUserId);
        console.log('✅ User with GUID created and verified successfully');
    });

    test('AP024 - Database Verification - GUID in customer_custom_id', async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `AP024 - Database GUID Verification` },
            { type: `Test Description`, description: `Verify that the created GUID is present in users_view table customer_custom_id field` }
        );

        console.log('🔍 Starting database verification for GUID');
        console.log(`📋 UserID: ${createdUserId}`);
        console.log(`📋 Expected GUID: ${userGuid}`);
        console.log(`📋 Username: ${generatingusername}`);

        // Execute database verification
        const isGuidVerified = await verifyUserGuidInDatabase(createdUserId, userGuid);
        
        if (isGuidVerified) {
            console.log('✅ Database verification successful: GUID found in customer_custom_id field');
        } else {
            throw new Error(`❌ Database verification failed: GUID ${userGuid} not found for user ${createdUserId}`);
        }

        console.log('🎉 AP024 Database verification completed successfully');
    });
});