import express from 'express';
import { FhirApi} from '../lib/utils';
import fetch from 'node-fetch';
import { url } from 'inspector';

let SURVEY_FOLLOW_UP = process.env['SURVEY_FOLLOW_UP_URL'] ?? '';
let ENROLMENT_CONFIRMATION = process.env['ENROLMENT_CONFIRMATION_URL'] ?? '';
let ENROLMENT_REJECTION = process.env['ENROLMENT_REJECTION_URL'] ?? '';

let TURN_IO_ACCESS_TOKEN = process.env['TURN_IO_ACCESS_TOKEN'] ?? '';

let urls: any = {
    SURVEY_FOLLOW_UP, ENROLMENT_CONFIRMATION, ENROLMENT_REJECTION
}

export const router = express.Router();

router.use(express.json());

//process FHIR Beneficiary
router.post('/turn', async (req, res) => {
    try {
        let data = req.body;
        // console.log("CarePay Request Payload", data);

        // fetch patient & send payload to turn.io
        // Notificationtype.
        let turnResponse = (await (fetch(urls[data?.type], {
            method: "POST",
            body:JSON.stringify({"wa_id":`${data?.phone }`}),
            headers: {"Content-Type":"application/json", "Authorization":`Bearer ${TURN_IO_ACCESS_TOKEN}`}
        })))

        // console.log(`Res: ${JSON.stringify(turnResponse)}`)
        res.statusCode =turnResponse.status;
        let turnResponseJson = await turnResponse.json()
        res.json(turnResponseJson);
        return;
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json(error);
        return;
    }
});

export default router;
