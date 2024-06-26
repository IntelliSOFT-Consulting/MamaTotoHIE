import utils from 'openhim-mediator-utils';
import shrMediatorConfig from '../config/shrMediatorConfig.json';
import carepayBeneficiary from '../config/beneficiaryMediator.json'
import turnioMediatorConfig from '../config/turnioNotificationsMediator.json';

import { Agent } from 'https';
import * as crypto from 'crypto';

// ✅ Do this if using TYPESCRIPT
import { RequestInfo, RequestInit } from 'node-fetch';

// mediators to be registered
const mediators = [
    shrMediatorConfig,
    carepayBeneficiary,
    turnioMediatorConfig
];

const fetch = (url: RequestInfo, init?: RequestInit) =>
    import('node-fetch').then(({ default: fetch }) => fetch(url, init));

const openhimApiUrl = process.env.OPENHIM_API_URL;
const openhimUsername = process.env.OPENHIM_USERNAME;
const openhimPassword = process.env.OPENHIM_PASSWORD;

const openhimConfig = {
    username: openhimUsername,
    password: openhimPassword,
    apiURL: openhimApiUrl,
    trustSelfSigned: true
}

utils.authenticate(openhimConfig, (e: any) => {
    console.log(e ? e : "✅ OpenHIM authenticated successfully");
    importMediators();
    installChannels();
})

export const importMediators = () => {
    try {
        mediators.map((mediator: any) => {
            utils.registerMediator(openhimConfig, mediator, (e: any) => {
                console.log(e ? e : "");
            });
        })
    } catch (error) {
        console.log(error);
    }
    return;
}

export const getOpenHIMToken = async () => {
    try {
        // console.log("Auth", auth)
        let token = await utils.genAuthHeaders(openhimConfig);
        return token
    } catch (error) {
        console.log(error);
        return { error, status: "error" }
    }
}

export const installChannels = async () => {
    let headers = await getOpenHIMToken();
    mediators.map(async (mediator: any) => {
        let response = await (await fetch(`${openhimApiUrl}/channels`, {
            headers: { ...headers, "Content-Type": "application/json" }, method: 'POST', body: JSON.stringify(mediator.defaultChannelConfig[0]), agent: new Agent({
                rejectUnauthorized: false
            })
        })).text();
        console.log(response);
    })
}

export let apiHost = process.env.FHIR_BASE_URL
console.log(apiHost)


// a fetch wrapper for HAPI FHIR server.
export const FhirApi = async (params: any) => {
    let _defaultHeaders = { "Content-Type": 'application/json' }
    if (!params.method) {
        params.method = 'GET';
    }
    try {
        let response = await fetch(String(`${apiHost}${params.url}`), {
            headers: _defaultHeaders,
            method: params.method ? String(params.method) : 'GET',
            ...(params.method !== 'GET' && params.method !== 'DELETE') && { body: String(params.data) }
        });
        let responseJSON = await response.json();
        let res = {
            status: "success",
            statusText: response.statusText,
            data: responseJSON
        };
        return res;
    } catch (error) {
        console.error(error);
        let res = {
            statusText: "FHIRFetch: server error",
            status: "error",
            data: error
        };
        console.error(error);
        return res;
    }
}

export const createClient = async (name: string, password: string) => {
    let headers = await getOpenHIMToken();
    const clientPassword = password
    const clientPasswordDetails: any = await genClientPassword(clientPassword)
    let response = await (await fetch(`${openhimApiUrl}/clients`, {
        headers: { ...headers, "Content-Type": "application/json" }, method: 'POST',
        body: JSON.stringify({
            passwordAlgorithm: "sha512",
            passwordHash: clientPasswordDetails.passwordHash,
            passwordSalt: clientPasswordDetails.passwordSalt,
            clientID: name, name: name, "roles": [
                "*"
            ],
        }), agent: new Agent({
            rejectUnauthorized: false
        })
    })).text();
    console.log("create client: ", response)
    return response
}



const genClientPassword = async (password: string) => {
    return new Promise((resolve) => {
        const passwordSalt = crypto.randomBytes(16);
        // create passhash
        let shasum = crypto.createHash('sha512');
        shasum.update(password);
        shasum.update(passwordSalt.toString('hex'));
        const passwordHash = shasum.digest('hex');
        resolve({
            "passwordSalt": passwordSalt.toString('hex'),
            "passwordHash": passwordHash
        })
    })
}


export let createFHIRPatientSubscription = async () => {
    try {
        let FHIR_SUBSCRIPTION_ID = process.env['FHIR_PATIENT_SUBSCRIPTION_ID'];
        let FHIR_SUBSCRIPTION_CALLBACK_URL = process.env['FHIR_SUBSCRIPTION_CALLBACK_URL'];
        let response = await (await FhirApi({ url:`/Subscription/${FHIR_SUBSCRIPTION_ID}`,
            method: "PUT", data: JSON.stringify({
                resourceType: 'Subscription',
                id: FHIR_SUBSCRIPTION_ID,
                status: "active",
                criteria: 'Patient?',
                channel: {
                    type: 'rest-hook',
                    endpoint: FHIR_SUBSCRIPTION_CALLBACK_URL,
                    payload: 'application/json'
                } 
            })
        })).data
        if(response.resourceType != "OperationOutcome"){
            console.log(`FHIR Patient Subscription ID: ${FHIR_SUBSCRIPTION_ID}`);
            return;
        }
        console.log(`Failed to create FHIR Subscription: \n${response}`);
    } catch (error) {
        console.log(error);
    }
}

export let createEncounterSubscription = async () => {
    try {
        let FHIR_SUBSCRIPTION_ID = process.env['FHIR_ENCOUNTER_SUBSCRIPTION_ID'];
        let FHIR_SUBSCRIPTION_CALLBACK_URL = process.env['FHIR_ENCOUNTER_CALLBACK_URL'];
        let response = await (await FhirApi({ url:`/Subscription/${FHIR_SUBSCRIPTION_ID}`,
            method: "PUT", data: JSON.stringify({
                resourceType: 'Subscription',
                id: FHIR_SUBSCRIPTION_ID,
                status: "active",
                criteria: 'Encounter?status=finished',
                channel: {
                    type: 'rest-hook',
                    endpoint: FHIR_SUBSCRIPTION_CALLBACK_URL,
                    payload: 'application/json'
                } 
            })
        })).data
        if(response.resourceType != "OperationOutcome"){
            console.log(`FHIR Encounter Subscription ID: ${FHIR_SUBSCRIPTION_ID}`);
            return;
        }
        console.log(`Failed to create FHIR Subscription: \n${response}`);
    } catch (error) {
        console.log(error);
    }
}





// these functions will be run anytime during runtime


createFHIRPatientSubscription();
createEncounterSubscription()
createClient(process.env['OPENHIM_CLIENT_ID'] || '', process.env['OPENHIM_CLIENT_PASSWORD'] || '');


