import express from 'express';
import { FhirApi} from '../lib/utils';
import fetch from 'node-fetch';

let SURVEY_FOLLOW_UP_URL = process.env['SURVEY_FOLLOW_UP_URL'] ?? '';
let TURN_IO_ACCESS_TOKEN = process.env['TURN_IO_ACCESS_TOKEN'] ?? '';

export const router = express.Router();

router.use(express.json());

//process FHIR Beneficiary
router.post('/turn', async (req, res) => {
    try {
        let data = req.body;
        // console.log("CarePay Request Payload", data);
        if(data.resourceType != "Patient"){
          res.statusCode = 200;
          res.json({
          "resourceType": "OperationOutcome",
          "id": "exception",
          "issue": [{
              "severity": "error",
              "code": "exception",
              "details": {
                  "text": `Invalid Patient Resource`
              }}]});
          return;
        }

        // fetch patient & send payload to turn.io
        let turnResponse = await(await (fetch(SURVEY_FOLLOW_UP_URL, {
            method: "POST",
            body:JSON.stringify({"wa_id":`${data?.telecom?.[0]?.value ?? data?.telecom?.[1]?.value }`}),
            headers: {"Content-Type":"application/json", "Authorization":`Bearer ${TURN_IO_ACCESS_TOKEN}`}
        }))).json();

        console.log(`Res: ${JSON.stringify(turnResponse)}`)

        if(turnResponse.status === 400){
          res.statusCode = 400;
          res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                "severity": "error",
                "code": "exception",
                "details": {
                    "text": `Failed to post beneficiary- ${JSON.stringify(turnResponse)}`
                }
            }]
          });
          return;
        }
        res.statusCode = 200;
        // data['identifier'] = [];
        console.log(turnResponse);
        res.json(data);
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
                    "text": `Failed to post beneficiary- ${JSON.stringify(error)}`
                }
            }]
        });
        return;
    }
});


//process FHIR beneficiary
router.put('/notifications/Encounter/:id', async (req, res) => {
  try {
      let {id} = req.params;
      let data = await (await FhirApi({url: `/Encounter/${id}`})).data;
      let tag = data.meta?.tag ?? null;
      // console.log(parsedIds);

      // console.log(tag, identifiers);
      if (data.status !== "finished"){
        res.statusCode = 200;
        // console.log("found: ", tag, identifiers);
        res.json(data);
        return;
      }

      let previousVersion = await (await FhirApi({url: `/Encounter/${id}/_history/${parseInt(data?.meta?.versionId) - 1}`})).data;
      if (previousVersion.status === data.status){
        // visit status hasn't changed
        res.statusCode = 200;
        res.json(data);
        return;
      }

      let patient = await (await FhirApi({url: `/${data?.subject?.reference}`})).data;

      let TURN_MEDIATOR_ENDPOINT = process.env['TURN_MEDIATOR_ENDPOINT'] ?? "";
      let OPENHIM_CLIENT_ID = process.env['OPENHIM_CLIENT_ID'] ?? "";
      let OPENHIM_CLIENT_PASSWORD = process.env['OPENHIM_CLIENT_PASSWORD'] ?? "";
      let response = await (await fetch(TURN_MEDIATOR_ENDPOINT, {
        body: JSON.stringify(patient),
        method: "POST",
        headers:{"Content-Type":"application/json",
        "Authorization": 'Basic ' + Buffer.from(OPENHIM_CLIENT_ID + ':' + OPENHIM_CLIENT_PASSWORD).toString('base64')}
      })).json();
      if(response.code >= 400){
        res.statusCode = response.code;
        res.json({
          "resourceType": "OperationOutcome",
          "id": "exception",
          "issue": [{
              "severity": "error",
              "code": "exception",
              "details": {
                  "text": `Failed to post beneficiary- ${JSON.stringify(response)}`
              }
          }]
        });
        return;
      }
      res.statusCode = 200;
      res.json(response);
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
                  "text": `Failed to post beneficiary- ${JSON.stringify(error)}`
              }
          }]
      });
      return;
  }
});

export default router;