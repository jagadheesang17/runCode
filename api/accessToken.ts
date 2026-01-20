import { URLConstants } from "../data/apiData/apiUtil";
import { customAdminOuthData } from "../data/apiData/formData";
import { postRequest } from "../utils/requestUtils";
import { assertResponse } from "../utils/verificationUtils";
import { getOauthToken, refreshOauthToken, getTokenInfo } from "../utils/tokenManager";

let endPointURL = URLConstants.adminEndPointUrl

/**
 * Returns the OAuth token in format "Bearer <token>"
 * Token is automatically cached and refreshed from tokenCache.json
 */
async function generateOauthToken() {
    try {
        // Returns token in format: "Bearer <token>" from JSON cache
        const token = await getOauthToken();
        return token;
    } catch (error) {
        console.error("Failed to generate OAuth token:", error);
        throw error;
    }
} 


/* generateOauthToken()
    .then(response => {
        console.log("Received response:", response);
    })
    .catch(error => {
        console.error("Error occurred:", error);
    });
 */

export { generateOauthToken, getOauthToken, refreshOauthToken, getTokenInfo }
