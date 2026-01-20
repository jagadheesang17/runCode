import { test } from "../../../../customFixtures/expertusFixture"
import { createILTMultiInstance, createVCMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";

test.describe("Sample: Multi-Instance ILT Creation - Future and Past Dates", () => {
    let futureCourseName: string;
    let pastCourseName: string;
    let futureInstanceNames: string[];
    let pastInstanceNames: string[];
    let vcCourseName: string;
    let vcInstanceName: string | string[];

    test("Test 1: Create Multi-Instance ILT Course with Past Dates", async () => {
        console.log("\n🎓 TEST 1: Creating Multi-Instance ILT Course with Past Dates");
        
        // Create course with 1 past instance
        pastCourseName = `Past ILT single instance course`;
        pastInstanceNames = await createILTMultiInstance(
            pastCourseName,
            "published",
            3,  // 3 instances
            "pastclass"  // Past dates
        );
        
        console.log(`✅ Created Past ILT Course: ${pastCourseName}`);
        console.log(`📋 Instance Names (${pastInstanceNames.length}):`, pastInstanceNames);
        pastInstanceNames.forEach((name, index) => {
            console.log(`   ${index + 1}. ${name}`);
        });
    });

    // test("Test 2: Create Multi-Instance VC Course with Future Dates", async () => {
    //     console.log("\n🎥 TEST 2: Creating Multi-Instance VC Course with Future Dates");
        
    //     // Create VC course with 1 instance (future date)
    //     vcCourseName = `Virtual classes`;
    //     vcInstanceName = await createVCMultiInstance(
    //         vcCourseName,
    //         "published",
    //         1,  // 1 instance
    //         "future"  // Future dates
    //     ) as string;
        
    //     console.log(`✅ Created Future VC Course: ${vcCourseName}`);
    //     console.log(`📋 Instance Names:`, vcInstanceName);
    //     console.log(`   - ${vcInstanceName}`);
    // });




});
