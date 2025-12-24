import { test } from "../../../customFixtures/expertusFixture";
import { generateCode, getListCategory } from "../../../data/apiData/formData";
import { listCategory, listTags } from "../../metaDataLibraryAPI";
import { FakerData } from "../../../utils/fakerUtils";


let order="new-old"
test('List of Tags', async () => {
     await listTags(order);
});


