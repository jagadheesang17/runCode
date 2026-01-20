import { test } from "@playwright/test";
import { getListofUser } from "../../userAPI";

test.describe('Fetch List of Users', () => {
    test('Fetch List of Users', async () => {
        await getListofUser();

    });
});



