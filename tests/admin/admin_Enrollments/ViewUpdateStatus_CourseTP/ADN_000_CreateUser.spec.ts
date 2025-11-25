import { test } from "@playwright/test";
import { userCreation } from "../../../../api/userAPI";
import { generateOauthToken } from "../../../../api/accessToken";
import { userCreationData } from "../../../../data/apiData/formData";
import { FakerData } from "../../../../utils/fakerUtils";
import * as fs from 'fs';
import * as path from 'path';

let access_token: any;
let enrollmentUsers: any[] = [];

test.describe('CC000 - Create Enrollment Test Users', () => {
    
    test('CC000 - Create 3 dedicated users for enrollment tests', async () => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC000_Create_Enrollment_Test_Users' },
            { type: 'Test Description', description: 'Create 3 dedicated learners for enrollment tests' }
        );

        // Generate OAuth token
        access_token = await generateOauthToken();
        console.log('✅ Access Token generated');

        // Create 3 users
        for (let i = 1; i <= 3; i++) {
            const generatingusername = FakerData.getUserId();
            console.log(`🔄 Creating user ${i} with username: ${generatingusername}`);

            const userData = userCreationData(generatingusername);
            
            const createdUserId = await userCreation(userData, { Authorization: access_token });
            console.log(`✅ User ${i} created with ID: ${createdUserId}`);

            const enrollmentUserData = {
                firstname: userData.first_name,
                lastname: userData.last_name,
                username: userData.username,
                password: "Welcome1@",
                userId: createdUserId,
                email: `${userData.username}`,
                createdDate: new Date().toISOString()
            };

            enrollmentUsers.push(enrollmentUserData);

            console.log(`📋 User ${i} Details:`);
            console.log(`   - First Name: ${enrollmentUserData.firstname}`);
            console.log(`   - Last Name: ${enrollmentUserData.lastname}`);
            console.log(`   - Username: ${enrollmentUserData.username}`);
            console.log(`   - User ID: ${enrollmentUserData.userId}`);
            console.log(`   - Email: ${enrollmentUserData.email}`);
        }

        // Save all users to JSON file
        const dataDir = path.join(process.cwd(), 'data', 'enrollmentUserData');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const filePath = path.join(dataDir, 'EnrollmentUser.json');
        fs.writeFileSync(filePath, JSON.stringify(enrollmentUsers, null, 2));

        console.log('✅ Enrollment test users data saved to:', filePath);
        console.log(`✅ Total ${enrollmentUsers.length} users created for enrollment tests`);
    });
});
