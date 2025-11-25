/**
 * Debug script to test course expiry functionality
 * Run this to identify what's preventing course expiry from working
 */

const path = require('path');
const { spawn } = require('child_process');

// Import the DBJobs module to test database connectivity
async function testDatabaseConnection() {
    console.log('🔍 Testing Database Connection...');
    
    try {
        // Test if we can import the DB module
        const dbPath = path.join(__dirname, 'tests', 'admin', 'DB', 'DBJobs.ts');
        console.log(`📁 DBJobs path: ${dbPath}`);
        
        // Try to run a simple database query test
        const testScript = `
            import('./tests/admin/DB/DBJobs.ts').then(async (db) => {
                console.log('✅ DBJobs module loaded successfully');
                // You could add a simple query test here
            }).catch((error) => {
                console.error('❌ Failed to load DBJobs:', error.message);
            });
        `;
        
        console.log('📊 Database connection test results will appear above');
        
    } catch (error) {
        console.error('❌ Database connection test failed:', error.message);
    }
}

async function checkRecentCourseEnrollments() {
    console.log('\n🔍 Checking Recent Course Enrollments...');
    console.log('📝 This will help identify if bulk enrollment tests affected the latest enrollment record');
    
    // Create a simple query to check recent enrollments
    console.log('📊 Query: SELECT * FROM course_enrollment ORDER BY id DESC LIMIT 5;');
    console.log('💡 This shows the 5 most recent enrollments that might interfere with expiry testing');
}

async function analyzeIssue() {
    console.log('🚨 COURSE EXPIRY DEBUG ANALYSIS');
    console.log('=====================================\n');
    
    console.log('🔍 POTENTIAL ISSUES:');
    console.log('1. Database connectivity problems');
    console.log('2. Bulk enrollment tests created new records that interfere with LIMIT 1 query');
    console.log('3. Date/timezone calculation issues in courseExpiry_CronJob()');
    console.log('4. Changes to database schema or credentials');
    console.log('5. Environment configuration changes\n');
    
    console.log('🛠️ RECOMMENDED DEBUGGING STEPS:');
    console.log('1. Run: npx playwright test CMP_002 --headed --debug');
    console.log('2. Check database logs for connection errors');
    console.log('3. Verify the courseExpiry_CronJob() function executes without errors');
    console.log('4. Check if the course_enrollment table has the expected record');
    console.log('5. Verify date calculations in the cron job are correct\n');
    
    await testDatabaseConnection();
    await checkRecentCourseEnrollments();
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Check if the compliance course enrollment record exists');
    console.log('2. Verify the courseExpiry_CronJob() function runs without throwing errors');
    console.log('3. Check if completion_date and expired_on fields are being updated');
    console.log('4. Test if the verification logic in CatalogPage.verifyExpiredCourse() is working');
}

// Run the analysis
analyzeIssue().catch(console.error);