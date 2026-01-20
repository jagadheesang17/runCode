import { postRequest } from "../../utils/requestUtils";
import { assertResponse, assertStatus } from "../../utils/verificationUtils";
import {GetContentLaunchURL} from "../../data/apiData/learner_formData";

import { URLConstants } from "../../data/apiData/apiUtil";

let endPointURL = URLConstants.learnerEndPointUrl
export async function getContentLaunchURL(userName: string,course_code: any) {
    let response = await postRequest(GetContentLaunchURL(course_code,userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    return response.data.user_id
}


