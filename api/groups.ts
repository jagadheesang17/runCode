import { postRequest } from "../utils/requestUtils";
import { URLConstants } from "../data/apiData/apiUtil";
import { createAdminGroup} from "../data/apiData/formData"
import { assertResponse, assertStatus } from "../utils/verificationUtils";

let endPointURL = URLConstants.adminEndPointUrl

export async function createAdminGroup_fn(grpData:any){
    let response=await postRequest(grpData, endPointURL);
    console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.status, "success");
        await assertResponse(response.data.message, "admin group has been created");

}

export async function updateAdminGroup_fn(grpData1:any){
    let response=await postRequest(grpData1, endPointURL);
    console.log(response);
    console.log("Debug2:"+' '+grpData1.code);
    console.log(grpData1.status);
    console.log(grpData1.title);
    console.log(grpData1.code);  
        await assertStatus(response.status, 200);
        await assertResponse(response.data.status, "success");
        await assertResponse(response.data.message, "Admin group updated");
}

export async function addUsersInAdminGroup_fn(grpData1:any){
    let response=await postRequest(grpData1, endPointURL);
    console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.status, "success");
        await assertResponse(response.data.message, "user has been updated successfully");
}

export async function addOrganizationInAdminGroup_fn(grpData1:any){
    let response=await postRequest(grpData1, endPointURL);
    console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.status, "success");
        await assertResponse(response.data.message, "organization has been updated successfully");
}