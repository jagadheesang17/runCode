import { test } from "@playwright/test";
import { listSingleUser, userCreationWithGuid, updateCustomGuid } from "../../userAPI";
import { generateOauthToken } from "../../accessToken";
import { userCreationWithGuidData, updateCustomGuidData } from "../../../data/apiData/formData";
import { FakerData } from "../../../utils/fakerUtils";
import { assertResponse } from "../../../utils/verificationUtils";
import { verifyUserGuidInDatabase } from "../../../tests/admin/DB/DBJobs";

let generatingusername = FakerData.getUserId();
let access_token: any;
let createdUserId: any;
let userId: any;
let userName: any;
let originalGuid: any;
let updatedGuid: any;

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Testing UpdateCustomGuid API Functionality', () => {
    test.describe.configure({ mode: 'serial' });

    test('AP025 - Create User with Initial GUID', async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `AP025 - Create User with Initial GUID` },
            { type: `Test Description`, description: `Create user using userCreationWithGuid API for testing GUID update functionality` }
        );

        const userData = userCreationWithGuidData(generatingusername);
        originalGuid = userData.guid; // Capture the original GUID
        console.log('User creation data with original GUID:', userData);
        console.log('Generated Original GUID:', originalGuid);
        
        createdUserId = await userCreationWithGuid(userData, { Authorization: access_token });
        console.log('Created User ID:', createdUserId);
    });

    test('AP025 - Verify Initial User Creation with GUID', async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `AP025 - Verify Initial User Creation` },
            { type: `Test Description`, description: `Verify the user was created successfully with initial GUID` }
        );

        let userDetails: any = await listSingleUser(generatingusername, { Authorization: access_token });
        [userId, userName] = userDetails;
        
        console.log('Retrieved User ID:', userId);
        console.log('Retrieved Username:', userName);
        
        await assertResponse(userId, createdUserId);
        console.log('✅ User with initial GUID created and verified successfully');
    });

    test('AP025 - Database Verification - Initial GUID in customer_custom_id', async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `AP025 - Initial GUID Database Verification` },
            { type: `Test Description`, description: `Verify that the original GUID is present in users_view table customer_custom_id field` }
        );

        console.log('🔍 Starting database verification for original GUID');
        console.log(`📋 UserID: ${createdUserId}`);
        console.log(`📋 Original GUID: ${originalGuid}`);

        const isOriginalGuidVerified = await verifyUserGuidInDatabase(createdUserId, originalGuid);
        
        if (isOriginalGuidVerified) {
            console.log('✅ Database verification successful: Original GUID found in customer_custom_id field');
        } else {
            throw new Error(`❌ Database verification failed: Original GUID ${originalGuid} not found for user ${createdUserId}`);
        }

        console.log('🎉 Original GUID database verification completed successfully');
    });

    test('AP025 - Update Custom GUID', async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `AP025 - Update Custom GUID` },
            { type: `Test Description`, description: `Update user GUID using updateCustomGuid API with new dynamic GUID` }
        );

        // Generate new GUID for update
        updatedGuid = FakerData.getLastName() + Date.now();
        console.log('Generated Updated GUID:', updatedGuid);

        const updateData = updateCustomGuidData(generatingusername, createdUserId, updatedGuid);
        console.log('Update GUID data:', updateData);
        
        const updateResult = await updateCustomGuid(updateData, { Authorization: access_token });
        console.log('Update GUID Result:', updateResult);
        
        // Verify the update was successful
        await assertResponse(updateResult, createdUserId);
        console.log('✅ GUID updated successfully via API');
    });

    test('AP025 - Database Verification - Updated GUID in customer_custom_id', async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `AP025 - Updated GUID Database Verification` },
            { type: `Test Description`, description: `Verify that the updated GUID is present in users_view table customer_custom_id field and original GUID is no longer present` }
        );

        console.log('🔍 Starting database verification for updated GUID');
        console.log(`📋 UserID: ${createdUserId}`);
        console.log(`📋 Updated GUID: ${updatedGuid}`);
        console.log(`📋 Original GUID: ${originalGuid}`);

        // Verify updated GUID is present
        const isUpdatedGuidVerified = await verifyUserGuidInDatabase(createdUserId, updatedGuid);
        
        if (isUpdatedGuidVerified) {
            console.log('✅ Database verification successful: Updated GUID found in customer_custom_id field');
        } else {
            throw new Error(`❌ Database verification failed: Updated GUID ${updatedGuid} not found for user ${createdUserId}`);
        }

        // Verify original GUID is no longer present
        const isOriginalGuidStillPresent = await verifyUserGuidInDatabase(createdUserId, originalGuid);
        
        if (!isOriginalGuidStillPresent) {
            console.log('✅ Database verification successful: Original GUID is no longer present (correctly updated)');
        } else {
            throw new Error(`❌ Database verification failed: Original GUID ${originalGuid} is still present for user ${createdUserId} (update failed)`);
        }

        console.log('🎉 AP025 Database verification completed successfully - GUID update verified');
    });

    test('AP025 - Final Verification - Complete Update Process', async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `AP025 - Complete Update Process Verification` },
            { type: `Test Description`, description: `Final verification that the complete GUID update process was successful` }
        );

        console.log('🔍 Final verification summary:');
        console.log(`📋 Username: ${generatingusername}`);
        console.log(`📋 User ID: ${createdUserId}`);
        console.log(`📋 Original GUID: ${originalGuid}`);
        console.log(`📋 Updated GUID: ${updatedGuid}`);

        // One final database check to ensure data consistency
        const finalVerification = await verifyUserGuidInDatabase(createdUserId, updatedGuid);
        
        if (finalVerification) {
            console.log('✅ Final verification successful: GUID update process completed successfully');
            console.log('🎉 AP025 - UpdateCustomGuid API testing completed successfully!');
        } else {
            throw new Error(`❌ Final verification failed: GUID update process incomplete`);
        }
    });
});