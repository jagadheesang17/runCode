import { postRequest } from "../utils/requestUtils";
import { getListoflocation, listSingleLocationData, updateLocationData } from "../data/apiData/formData";
import { assertResponse, assertStatus } from "../utils/verificationUtils";
import { URLConstants } from "../data/apiData/apiUtil";

let endPointURL = URLConstants.adminEndPointUrl

export async function getListofLocation() {
    let response = await postRequest(getListoflocation, endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function locationCreation(locationData: any) {
    try {

        let response = await postRequest(locationData, endPointURL);
        console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.result, "success");
        return response.data.location_id
    } catch (error) {
        console.error("Failed to execute", error);
        throw error;
    }
}

export async function listSingleLocation(locationName: string) {
    let response = await postRequest(listSingleLocationData(locationName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
} 

export async function updateLocation(locationName: any) {
    let response = await postRequest(updateLocationData(locationName), endPointURL);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    //await assertResponse(response.data.message, "Request Successful");
    return response.data.location_id
}



