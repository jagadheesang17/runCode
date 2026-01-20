import { test } from "@playwright/test";
import { getListofLocation } from "../../locationAPI";
import { listOrganization, listOrganizationData } from "../../organizationAPI";

test.describe('Fetching the list of Organizations', () => {
    test('Fetching the list of Organizations', async () => {

    await listOrganizationData();

    });
});



