import express from 'express';
import { FhirApi, redirectToDev } from '../lib/utils';


const _TEST_PHONE_NUMBERS = process.env.TEST_PHONE_NUMBERS ?? '';
const TEST_PHONE_NUMBERS = _TEST_PHONE_NUMBERS.split(',');



// PHONE_NUMBER_FILTERING

export const router = express.Router();

// router.use(express.json());

// Custom middleware to handle application/fhir+json content type
router.use(express.json({
  type: ['application/json', 'application/fhir+json'],
}));


//process FHIR Beneficiary
router.post('/Patient', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    if (data.resourceType !== 'Patient') {
      res.statusCode = 400;
      res.json({
        'resourceType': 'OperationOutcome',
        'id': 'exception',
        'issue': [{
          'severity': 'error',
          'code': 'exception',
          'details': {
            'text': 'Invalid Patient Resource',
          },
        }],
      });
      return;
    }
    // support [test phone number -> dev]
    if (TEST_PHONE_NUMBERS.includes(`${data?.telecom?.[0]?.value ?? data?.telecom?.[1]?.value}`)) {
      console.log('...redirecting');
      try {
        const response = await redirectToDev('/fhir/Patient', data);
        console.log(JSON.stringify(response));
        if (response.resourceType == 'OperationOutcome') {
          res.statusCode = 400;
          res.json(response);
          return;

        }
        res.statusCode = 201;
        res.json(response);
        return;
      } catch (error) {
        res.statusCode = 400;
        res.json({
          'resourceType': 'OperationOutcome',
          'id': 'exception',
          'issue': [{
            'severity': 'error',
            'code': 'exception',
            'details': {
              'text': JSON.stringify(error),
            },
          }],
        });
        return;
      }

    }

    // default & production [save to SHR]
    const shrResponse = await (await FhirApi({
      url: '/Patient', method: 'POST', data: JSON.stringify(data),
    })).data;
    if (shrResponse.resourceType === 'OperationOutcome') {
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
      'resourceType': 'OperationOutcome',
      'id': 'exception',
      'issue': [{
        'severity': 'error',
        'code': 'exception',
        'details': {
          'text': JSON.stringify(error),
        },
      }],
    });
    return;
  }
});


router.post('/QuestionnaireResponse', async (req, res) => {
  try {
    const data = req.body;
    if (data.resourceType !== 'QuestionnaireResponse') {
      res.statusCode = 400;
      res.json({
        'resourceType': 'OperationOutcome',
        'id': 'exception',
        'issue': [{
          'severity': 'error',
          'code': 'exception',
          'details': {
            'text': 'Invalid QuestionnaireResponse Resource',
          },
        }],
      });
      return;
    }

    const patient = await (await FhirApi({ url: `/${data?.subject?.reference}` })).data;
    // support [test phone number -> dev]
    console.log(patient);
    // if (TEST_PHONE_NUMBERS.indexOf(`${patient?.telecom?.[0]?.value ?? patient?.telecom?.[1]?.value}`) > -1) {
    if (patient.resourceType === 'OperationOutcome'){
      console.log('...redirecting');
      try {
        const response = await redirectToDev('/fhir/QuestionnaireResponse', data);
        if (response.resourceType == 'OperationOutcome') {
          res.statusCode = 400;
          res.json(response);
          return;
        }
        res.statusCode = 201;
        res.json(response);
        return;
      } catch (error) {
        res.statusCode = 400;
        res.json({
          'resourceType': 'OperationOutcome',
          'id': 'exception',
          'issue': [{
            'severity': 'error',
            'code': 'exception',
            'details': {
              'text': JSON.stringify(error),
            },
          }],
        });
        return;
      }

    }

    // default & production [save to SHR]
    const shrResponse = await (await FhirApi({
      url: '/QuestionnaireResponse', method: 'POST', data: JSON.stringify(data),
    })).data;
    if (shrResponse.resourceType === 'OperationOutcome') {
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
      'resourceType': 'OperationOutcome',
      'id': 'exception',
      'issue': [{
        'severity': 'error',
        'code': 'exception',
        'details': {
          'text': JSON.stringify(error),
        },
      }],
    });
    return;
  }
});


export default router;