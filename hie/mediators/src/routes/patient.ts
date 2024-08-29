import express from 'express';
import { FhirApi, redirectToDev, sendTurnNotification } from '../lib/utils';
import { v4 as uuid } from 'uuid';
import fetch from 'node-fetch';
import { fetchVisits, fhirPatientToCarepayBeneficiary, processIdentifiers } from '../lib/payloadMapping';
import { url } from 'inspector';


const _TEST_PHONE_NUMBERS = process.env.TEST_PHONE_NUMBERS ?? "";
const TEST_PHONE_NUMBERS = _TEST_PHONE_NUMBERS.split(",");

const CAREPAY_BASE_URL = process.env['CAREPAY_BASE_URL'];
const CAREPAY_USERNAME = process.env['CAREPAY_USERNAME'];
const CAREPAY_PASSWORD = process.env['CAREPAY_PASSWORD'];
const CAREPAY_POLICY_ID = process.env['CAREPAY_POLICY_ID'];


// PHONE_NUMBER_FILTERING

export const router = express.Router();

router.use(express.json());


//process FHIR Beneficiary
router.post('/', async (req, res) => {
    try {
        let data = req.body;
        // console.log("CarePay Request Payload", data);
        if (data.resourceType != "Patient") {
            res.statusCode = 200;
            res.json({
                "resourceType": "OperationOutcome",
                "id": "exception",
                "issue": [{
                    "severity": "error",
                    "code": "exception",
                    "details": {
                        "text": `Invalid Patient Resource`
                    }
                }]
            });
            return;
        }
        // support [test phone number -> dev]
        if (TEST_PHONE_NUMBERS.indexOf(`${data?.telecom?.[0]?.value ?? data?.telecom?.[1]?.value}`) > -1) {
            try {
                let response = redirectToDev(data);
                res.statusCode = 200
                res.json(response);
                return;
            } catch (error) {
                res.statusCode = 400;
                res.json({
                    "resourceType": "OperationOutcome",
                    "id": "exception",
                    "issue": [{
                        "severity": "error",
                        "code": "exception",
                        "details": {
                            "text": `${JSON.stringify(error)}`
                        }
                    }]
                });
                return;
            }

        }

        // default & production [save to SHR]
        let shrResponse = await (await FhirApi({
            url: '/Patient', method: "POST", data: JSON.stringify(data)
        })).data;
        if (shrResponse.resourceType === "OperationOutcome") {
            res.statusCode = 400;
            res.json(shrResponse);
            return;
        }
        res.statusCode = 200;
        res.json(shrResponse);
        return;
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                "severity": "error",
                "code": "exception",
                "details": {
                    "text": `${JSON.stringify(error)}`
                }
            }]
        });
        return;
    }
});


export default router;