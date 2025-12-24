import { postRequest } from "../utils/requestUtils";
import { ceuGetListOfData, ceuTypeCreationData, ceuTypeDelete, generateCode } from "../data/apiData/formData"
import { assertResponse, assertStatus } from "../utils/verificationUtils";
import { generateOauthToken } from "./accessToken";
import { URLConstants } from "../data/apiData/apiUtil";

let endPointURL = URLConstants.adminEndPointUrl

export async function createCEUType(code: string) {
    let response = await postRequest(ceuTypeCreationData(code), endPointURL);
    console.log(response.data);
    let ceutype_id = response.data.data.ceu_type_id
    console.log(ceutype_id);
    
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    //await assertResponse(response.data.message, "Request Successful");-->Request Successful is missing
    return ceutype_id;
}


export async function ceu_type_list(id: any) {
    let response = await postRequest(ceuGetListOfData, endPointURL);
    const result = response.data.data.find(item => item._id === id);
    console.log("All codes : ", response.data);
    console.log(result);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    //await assertResponse(response.data.message, "Request Successful"); --> Request Successful is missing
    console.log("retrivied code : " + result.code);
    return result.code
}

export async function delete_ceu_type(code: string) {
    let response = await postRequest(ceuTypeDelete(code), endPointURL);
    console.log(response.data);
    let message = response.data.data.message
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    //await assertResponse(response.data.message, "Request Successful");
    await assertResponse(response.data.data.result, "success");
    await assertResponse(message, true);

}
