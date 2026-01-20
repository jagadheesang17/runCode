import { test } from "@playwright/test";
import { getListofLocation } from "../../locationAPI";

test.describe('Fetching the list of Lcoations', () => {
    test('Fetching the list of Lcoation', async () => {

        await getListofLocation();

    });
});



