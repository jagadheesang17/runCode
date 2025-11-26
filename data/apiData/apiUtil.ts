import { environmentSetup } from '../../playwright.config';
export let URLConstants: any
export let credentials: any
switch (environmentSetup) {
    case "automationtenant":
        URLConstants = {
            adminEndPointUrl: "https://automationtenant.expertusoneqa.in/api/v2/admin/rest",
            learnerEndPointUrl: "https://automationtenant.expertusoneqa.in/api/v2/learner/rest"
        }
        credentials = {
            data: {
                id: "b3727c29-6bbc-4bc3-8276-8b232ec70222",
                client_id: "38f78440b5e4693f47361d3e5c0c80b9",
                client_secret: "ec7905d0fc328980352675c79fceaa66"
            }

        }

        break;
    case "qa":
        URLConstants = {
            adminEndPointUrl: "https://qa.expertusoneqa.com/api/v2/admin/rest",
            learnerEndPointUrl: "https://qa.expertusoneqa.com/api/v2/learner/rest"
        }
        credentials = {
            data: {
              //  id: "cbd3c1f9-b4f7-49b3-8436-e45ab428bdb0",
              id: "b3727c29-6bbc-4bc3-8276-8b232ec70222",
                client_id: "38f78440b5e4693f47361d3e5c0c80b9",
                client_secret: "ec7905d0fc328980352675c79fceaa66"
            }

        }

        break;
    case "automation":
        URLConstants = {
            adminEndPointUrl: "https://automation.expertusoneqa.in/api/v2/admin/rest",
            learnerEndPointUrl: "https://automation.expertusoneqa.in/api/v2/learner/e1internal/rest"
        }
        credentials = {
            data: {
                id: "b3727c29-6bbc-4bc3-8276-8b232ec70222",
                client_id: "38f78440b5e4693f47361d3e5c0c80b9",
                client_secret: "ec7905d0fc328980352675c79fceaa66"
            }

        }

        break;
    case "qaProduction":
        URLConstants = {
            adminEndPointUrl: "https://newprod.expertusoneqa.in/api/v2/admin/rest",
            learnerEndPointUrl: "https://newprod.expertusoneqa.in/api/v2/learner/rest"
        }
        credentials = {
            data: {
                id: "b5149db2-7d6c-400c-b3ae-be27f88d77e3",
                client_id: "e52c88e2a908fb0209af9d6a7eadd799",
                client_secret: "333c9721b3fe89a61adf4fb543e33775"
            }

        }

        break;
    case "dev":
        URLConstants = {
            adminEndPointUrl: "https://qa.expertusoneqa.com/api/v2/admin/rest",
            learnerEndPointUrl: "https://qa.expertusoneqa.com/api/v2/learner/rest"
        }
        credentials = {
            data: {
                id: "b3727c29-6bbc-4bc3-8276-8b232ec70222",
                client_id: "38f78440b5e4693f47361d3e5c0c80b9",
                client_secret: "ec7905d0fc328980352675c79fceaa66"
            }

        }

        break;
    default:
        throw new Error(`Invalid environment setup: ${environmentSetup}`);
}
