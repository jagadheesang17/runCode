import { test } from "@playwright/test";
import { retrive_listofCourse } from "../../courseAPI";


test.describe('Testing the Functionality of Courses via API', () => {
    test('Fetching the List of Courses', async () => {
        let lstCourse = await retrive_listofCourse();
        console.log(lstCourse);
    });
});



