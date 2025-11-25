// Quick verification script to test the fixed date logic
const { format } = require('date-fns');

console.log("🧪 Testing Fixed Date Logic for Cron Job");
console.log("==========================================");

// Simulate the original buggy logic
function buggyLogic() {
    console.log("\n❌ Original Buggy Logic:");
    const currentTime = new Date();
    console.log(`   Current Time: ${format(currentTime, 'yyyy-MM-dd HH:mm:ss')}`);
    
    // This mutates currentTime
    const pastDate = currentTime.setDate(currentTime.getDate() - 2);
    console.log(`   After setDate(-2): ${format(currentTime, 'yyyy-MM-dd HH:mm:ss')}`);
    console.log(`   pastDate value: ${format(pastDate, 'yyyy-MM-dd HH:mm:ss')}`);
    
    // This tries to add 2 days back to already modified currentTime
    currentTime.setDate(currentTime.getDate() + 2);
    console.log(`   After setDate(+2): ${format(currentTime, 'yyyy-MM-dd HH:mm:ss')}`);
    
    const newTime = new Date(currentTime.getTime() - 15 * 60 * 1000);
    console.log(`   Final newTime: ${format(newTime, 'yyyy-MM-dd HH:mm:ss')}`);
    
    return {
        completion_date: format(pastDate, 'yyyy-MM-dd HH:mm:ss'),
        expired_on: format(newTime, 'yyyy-MM-dd HH:mm:ss')
    };
}

// Simulate the fixed logic
function fixedLogic() {
    console.log("\n✅ Fixed Logic:");
    const currentTimeString = new Date().toISOString();
    
    // Create separate date objects
    const currentTime = new Date(currentTimeString);
    const pastDate = new Date(currentTimeString);
    pastDate.setDate(pastDate.getDate() - 2);
    
    const expiredOnTime = new Date(currentTimeString);
    expiredOnTime.setTime(expiredOnTime.getTime() - 15 * 60 * 1000);
    
    console.log(`   Current Time: ${format(currentTime, 'yyyy-MM-dd HH:mm:ss')}`);
    console.log(`   Past Date (-2 days): ${format(pastDate, 'yyyy-MM-dd HH:mm:ss')}`);
    console.log(`   Expired On (-15 mins): ${format(expiredOnTime, 'yyyy-MM-dd HH:mm:ss')}`);
    
    return {
        completion_date: format(pastDate, 'yyyy-MM-dd HH:mm:ss'),
        expired_on: format(expiredOnTime, 'yyyy-MM-dd HH:mm:ss')
    };
}

// Run both tests
const buggyResult = buggyLogic();
const fixedResult = fixedLogic();

console.log("\n📊 Comparison:");
console.log("================");
console.log(`Buggy completion_date:  ${buggyResult.completion_date}`);
console.log(`Fixed completion_date:  ${fixedResult.completion_date}`);
console.log(`Buggy expired_on:       ${buggyResult.expired_on}`);
console.log(`Fixed expired_on:       ${fixedResult.expired_on}`);

console.log("\n🎯 Key Differences:");
console.log("===================");
if (buggyResult.completion_date !== fixedResult.completion_date) {
    console.log("❌ Completion dates differ - this confirms the bug!");
} else {
    console.log("✅ Completion dates match");
}

if (buggyResult.expired_on !== fixedResult.expired_on) {
    console.log("❌ Expired dates differ - this confirms the bug!");
} else {
    console.log("✅ Expired dates match");
}

console.log("\n🚀 The fix ensures:");
console.log("• Each date calculation uses a fresh, unmodified Date object");
console.log("• completion_date is always exactly 2 days ago");
console.log("• expired_on is always exactly 15 minutes ago");
console.log("• No date object mutations that cause cumulative errors");