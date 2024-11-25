import utils from "openhim-mediator-utils";

import logger from "jet-logger";

import { Agent } from "https";
import * as crypto from "crypto";

// ✅ Do this if using TYPESCRIPT
import { RequestInfo, RequestInit } from "node-fetch";
import EnvVars from "@src/common/EnvVars";
import { Mediator } from "@src/interfaces/mediatorInterface";
import {
  carepayBeneficiaryMediator,
  customRegistrationMediators,
  shrMediator,
  turnioNotificationsMediator,
} from "@src/config/mediators";

// mediators to be registered
const mediators = [
  shrMediator,
  carepayBeneficiaryMediator,
  turnioNotificationsMediator,
  customRegistrationMediators,
];

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

const openhimConfig = {
  username: EnvVars.OpenHimApi.Username,
  password: EnvVars.OpenHimApi.Password,
  apiURL: EnvVars.OpenHimApi.Url,
  trustSelfSigned: true,
};

export const activateOpenHimConfigs = async () => {
  utils.authenticate(openhimConfig, (e: any) => {
    logger.info("🔐 Checking OpenHIM username");
    if (e) {
      logger.err(e);
      return;
    }
    logger.info("✅ OpenHIM Username exists");
    importMediators();
    installChannels();
  });
};

// TODO: check errors also ensure there's a checkStatus before creating
// export const createSubscriptions = async () => {
//   try {
//     createEncounterSubscription();
//     createQuestionnaireResponseSubscription();
//     createClient(
//       process.env.OPENHIM_CLIENT_ID || "",
//       process.env.OPENHIM_CLIENT_PASSWORD || ""
//     );
//   } catch (error) {
//     logger.err(error);
//   }
// }

const importMediators = () => {
  mediators.map((mediator: any) => {
    utils.registerMediator(openhimConfig, mediator, (e: any) => {
      e
        ? logger.err(`❌ ${mediator.name} registration failed: ${e}`)
        : logger.info(`✅ ${mediator.name} registered successfully`);
    });
  });
};

export const getOpenHIMToken = async () => {
  try {
    const token = await utils.genAuthHeaders(openhimConfig);
    return token;
  } catch (error) {
    return {
      error,
      status: "error",
    };
  }
};

const checkStatus = (response: { statusText: any; ok: any }) => {
  if (response.ok) {
    return response;
  } else {
    throw new Error(`unexpected response ${response.statusText}`);
  }
};

const createMediatorChannel = async (mediator: Mediator) => {
  const authHeaders = await utils.genAuthHeaders(openhimConfig);
 
  const options = {
    headers: { ...authHeaders, "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(mediator.defaultChannelConfig),
    agent: new Agent({
      rejectUnauthorized: false,
    }),
  };
  const response = await fetch(`${openhimConfig.apiURL}/channels`, options);
  try {
    checkStatus(response);
    logger.info(`✅ Channel created for ${mediator.name}`);
  } catch (error) {
    logger.err(`❌ Failed to create channel for ${mediator.name}: ${error}`);
  }
};

const getChannelNames = async () => {
  const authHeaders = await utils.genAuthHeaders(openhimConfig);

  const response = await fetch(`${openhimConfig.apiURL}/channels`, {
    headers: { ...authHeaders, "Content-Type": "application/json" },
    method: "GET",
    agent: new Agent({
      rejectUnauthorized: false,
    }),
  });
  
  try {
    checkStatus(response);
    const channels = await response.json();
    const names = channels.map((channel: any) => channel.name);
    return names;
  } catch (error) {
    logger.err(`❌ Failed to get channel names: ${error}`);
    return [];
  }
};

const installChannels = async () => {
  const channelNames = await getChannelNames();
  mediators.map(async (mediator: Mediator) => {
    if (channelNames.includes(mediator.defaultChannelConfig.name)) {
      logger.info(`✅ Channel already exists for ${mediator.name}`);
    } else {
      createMediatorChannel(mediator);
    }
  });
};

export const apiHost = EnvVars.FHIR_BASE_URL;

// a fetch wrapper for HAPI FHIR server.
export const FhirApi = async (params: any) => {
  const _defaultHeaders = { "Content-Type": "application/json" };
  if (!params.method) {
    params.method = "GET";
  }
  try {
    const response = await fetch(String(`${apiHost}${params.url}`), {
      headers: _defaultHeaders,
      method: params.method ? String(params.method) : "GET",
      ...(params.method !== "GET" &&
        params.method !== "DELETE" && { body: String(params.data) }),
    });
    const responseJSON = await response.json();
    const res = {
      status: "success",
      statusText: response.statusText,
      data: responseJSON,
    };
    return res;
  } catch (error) {
    console.error(error);
    const res = {
      statusText: "FHIRFetch: server error",
      status: "error",
      data: error,
    };
    console.error(error);
    return res;
  }
};

export const createClient = async (name: string, password: string) => {
  const headers = await getOpenHIMToken();
  const clientPassword = password;
  const clientPasswordDetails: any = await genClientPassword(clientPassword);
  const response = await (
    await fetch(`${openhimConfig.apiURL}/clients`, {
      headers: { ...headers, "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        passwordAlgorithm: "sha512",
        passwordHash: clientPasswordDetails.passwordHash,
        passwordSalt: clientPasswordDetails.passwordSalt,
        clientID: name,
        name: name,
        roles: ["*"],
      }),
      agent: new Agent({
        rejectUnauthorized: false,
      }),
    })
  ).text();
  console.log("create client: ", response);
  return response;
};

const genClientPassword = async (password: string) => {
  return new Promise((resolve) => {
    const passwordSalt = crypto.randomBytes(16);
    // create passhash
    const shasum = crypto.createHash("sha512");
    shasum.update(password);
    shasum.update(passwordSalt.toString("hex"));
    const passwordHash = shasum.digest("hex");
    resolve({
      passwordSalt: passwordSalt.toString("hex"),
      passwordHash: passwordHash,
    });
  });
};

export const createFHIRPatientSubscription = async () => {
  try {
    const FHIR_SUBSCRIPTION_ID = EnvVars.FHIR_PATIENT_SUBSCRIPTION_ID;
    const FHIR_SUBSCRIPTION_CALLBACK_URL =
      EnvVars.FHIR_SUBSCRIPTION_CALLBACK_URL;
    const response = await (
      await FhirApi({
        url: `/Subscription/${FHIR_SUBSCRIPTION_ID}`,
        method: "PUT",
        data: JSON.stringify({
          resourceType: "Subscription",
          id: FHIR_SUBSCRIPTION_ID,
          status: "active",
          criteria: "Patient?",
          channel: {
            type: "rest-hook",
            endpoint: FHIR_SUBSCRIPTION_CALLBACK_URL,
            payload: "application/json",
          },
        }),
      })
    ).data;
    if (response.resourceType != "OperationOutcome") {
      console.log(`FHIR Patient Subscription ID: ${FHIR_SUBSCRIPTION_ID}`);
      return;
    }
    console.log(`Failed to create FHIR Subscription: \n${response}`);
  } catch (error) {
    console.log(error);
  }
};

export const createEncounterSubscription = async () => {
  try {
    const FHIR_SUBSCRIPTION_ID = EnvVars.FHIR_ENCOUNTER_SUBSCRIPTION_ID;
    const FHIR_SUBSCRIPTION_CALLBACK_URL = EnvVars.FHIR_ENCOUNTER_CALLBACK_URL;
    const response = await (
      await FhirApi({
        url: `/Subscription/${FHIR_SUBSCRIPTION_ID}`,
        method: "PUT",
        data: JSON.stringify({
          resourceType: "Subscription",
          id: FHIR_SUBSCRIPTION_ID,
          status: "active",
          criteria: "Encounter?status=finished",
          channel: {
            type: "rest-hook",
            endpoint: FHIR_SUBSCRIPTION_CALLBACK_URL,
            payload: "application/json",
          },
        }),
      })
    ).data;
    if (response.resourceType != "OperationOutcome") {
      console.log(`FHIR Encounter Subscription ID: ${FHIR_SUBSCRIPTION_ID}`);
      return;
    }
    console.log(`Failed to create FHIR Subscription: \n${response}`);
  } catch (error) {
    console.log(error);
  }
};

export const createQuestionnaireResponseSubscription = async () => {
  try {
    const FHIR_SUBSCRIPTION_ID = process.env.FHIR_QRESPONSE_SUBSCRIPTION_ID;
    const FHIR_SUBSCRIPTION_CALLBACK_URL =
      process.env.FHIR_QRESPONSE_CALLBACK_URL;
    const response = await (
      await FhirApi({
        url: `/Subscription/${FHIR_SUBSCRIPTION_ID}`,
        method: "PUT",
        data: JSON.stringify({
          resourceType: "Subscription",
          id: FHIR_SUBSCRIPTION_ID,
          status: "active",
          criteria: "QuestionnaireResponse?",
          channel: {
            type: "rest-hook",
            endpoint: FHIR_SUBSCRIPTION_CALLBACK_URL,
            payload: "application/json",
          },
        }),
      })
    ).data;
    if (response.resourceType != "OperationOutcome") {
      console.log(`FHIR QR Subscription ID: ${FHIR_SUBSCRIPTION_ID}`);
      return;
    }
    console.log(`Failed to create FHIR Subscription: \n${response}`);
  } catch (error) {
    console.log(error);
  }
};

// these functions will be run anytime during runtime
// createFHIRPatientSubscription();

type MessageTypes =
  | "ENROLMENT_CONFIRMATION"
  | "ENROLMENT_REJECTION"
  | "SURVEY_FOLLOW_UP";

export const sendTurnNotification = async (data: any, type: MessageTypes) => {
  try {
    const patient = await (
      await FhirApi({ url: `/${data?.subject?.reference}` })
    ).data;

    const phoneNumber =
      patient?.telecom?.[0]?.value ?? data?.telecom?.[1]?.value;

    // call mediator
    const TURN_MEDIATOR_ENDPOINT = process.env.TURN_MEDIATOR_ENDPOINT ?? "";
    const OPENHIM_CLIENT_ID = process.env.OPENHIM_CLIENT_ID ?? "";
    const OPENHIM_CLIENT_PASSWORD = process.env.OPENHIM_CLIENT_PASSWORD ?? "";
    const response = await (
      await fetch(TURN_MEDIATOR_ENDPOINT, {
        body: JSON.stringify({ phone: phoneNumber, type }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              OPENHIM_CLIENT_ID + ":" + OPENHIM_CLIENT_PASSWORD
            ).toString("base64"),
        },
      })
    ).json();
    return response;
  } catch (error) {
    return { error };
  }
};

const OPENHIM_DEV_URL = process.env.OPENHIM_DEV_URL ?? "";
const OPENHIM_DEV_CLIENT = process.env.OPENHIM_DEV_CLIENT ?? "";
const OPENHIM_DEV_CLIENT_PASSWORD =
  process.env.OPENHIM_DEV_CLIENT_PASSWORD ?? "";

export const redirectToDev = async (path: string, data: any) => {
  try {
    const response = await fetch(OPENHIM_DEV_URL + path, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            OPENHIM_DEV_CLIENT + ":" + OPENHIM_DEV_CLIENT_PASSWORD
          ).toString("base64"),
        "Content-Type": "application/json",
      },
    });
    const statusCode = response.status;
    const responseData = await response.json();
    if (statusCode > 201) {
      return {
        resourceType: "OperationOutcome",
        id: "exception",
        issue: [
          {
            severity: "error",
            code: "exception",
            details: {
              text: `Failed to redirect to dev SHR: Code: ${statusCode}: ${response.statusText}`,
            },
          },
        ],
      };
    }
    return responseData;
  } catch (error) {
    return {
      resourceType: "OperationOutcome",
      id: "exception",
      issue: [
        {
          severity: "error",
          code: "exception",
          details: {
            text: JSON.stringify(error),
          },
        },
      ],
    };
  }
};
