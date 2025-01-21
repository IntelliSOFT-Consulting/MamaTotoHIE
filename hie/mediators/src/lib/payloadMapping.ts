import { FhirApi } from './utils';
import path from 'path';
import fs from 'fs';

const CAREPAY_BASE_URL = process.env.CAREPAY_BASE_URL;
const CAREPAY_CATEGORY_ID = process.env.CAREPAY_CATEGORY_ID;
const CAREPAY_USERNAME = process.env.CAREPAY_USERNAME;
const CAREPAY_PASSWORD = process.env.CAREPAY_PASSWORD;
const CAREPAY_POLICY_ID = process.env.CAREPAY_POLICY_ID;

const CAREPAY_DEV_BASE_URL = process.env.CAREPAY_DEV_BASE_URL;
const CAREPAY_DEV_CATEGORY_ID = process.env.CAREPAY_DEV_CATEGORY_ID;
const CAREPAY_DEV_USERNAME = process.env.CAREPAY_DEV_USERNAME;
const CAREPAY_DEV_PASSWORD = process.env.CAREPAY_DEV_PASSWORD;
const CAREPAY_DEV_POLICY_ID = process.env.CAREPAY_DEV_POLICY_ID;





const LAST_RUN_FILE = path.join(__dirname, 'last_run.txt');

// Function to read the last run timestamp from the file
const readLastRunTimestamp = (): string | null => {
  try {
    if (fs.existsSync(LAST_RUN_FILE)) {
      return fs.readFileSync(LAST_RUN_FILE, 'utf8');
    }
  } catch (error) {
    console.error('Error reading last run timestamp:', error);
  }
  return null;
};

const getCurrentDate = () => new Date().toISOString().slice(0, 10);


export const processIdentifiers = async (identifiers: any) => {
  try {
    const ids: any = {};
    for (const id of identifiers) {
      const idType = id?.type?.coding[0].code;
      const idSystem = id?.type?.coding[0].system;
      ids[idType] = id?.value;
    }
    return ids;
  } catch (error) {
    return {};
  }
};

function generateRandomString(length: number) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



export const fhirPatientToCarepayBeneficiary = async (patient: any, mode = 'dev') => {
  try {
    const gender = String(patient.gender).toUpperCase();
    const _date = String(patient.birthDate).split('-');
    // console.log(`${_date[0]}-${_date[2].padStart(2, '0')}-${_date[1].padStart(2, '0')}`,)
    const n: any = {};

    const phoneNumbers = patient.telecom ?? [];
    phoneNumbers?.map((numb: any) => {
      if (Object.keys(numb).includes('value')) {
        n[numb.system] = numb.value;
      }
    });

    const maritalStatus = patient?.maritalStatus?.coding?.[0]?.code;

    return {
      'title': gender == 'MALE' ? 'MR' : 'MRS',
      'firstName': patient.name[0].given[0] ?? '',
      ...(patient.name[0].given[1] ? true : false) && { 'middleName': patient.name[0].given[1] },
      ...(patient.name[0].family ? true : false) && { 'lastName': patient.name[0].family },
      'gender': gender,
      'dateOfBirth': patient.birthDate,
      // "dateOfBirth":  `${_date[0]}-${_date[2].padStart(2, '0')}-${_date[1].padStart(2, '0')}`,
      'maritalStatus': maritalStatus === 'M' ? 'MARRIED' : 'SINGLE',
      // "nationality": "KE",
      'identification': [
        {
          'type': 'NATIONAL_ID',
          'number': `${patient?.identifier?.[0]?.value}`,
        },
      ],
      // "acceptTermsAndCondition": true,
      // "occupation": "EMPLOYED",
      // "email": `${(patient.name[0].given[0]).replace(" ", "-") ?? ""}@gmail.com`,
      'residentialCountryCode': 'string',
      // "height": 140,
      // "weight": -1.7976931348623157e+308,
      // "bmi": -1.7976931348623157e+308,
      'categoryId': `${CAREPAY_CATEGORY_ID}`,
      'policyId': `${CAREPAY_POLICY_ID}`,
      'relationship': 'PRIMARY',
      'phoneNumber': n?.phone ?? n?.mobile,
      // "dateOfEnrollment": "2014-02-07",
      'startDate': new Date().toISOString(),
      // "endDate": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      // "medicalApplicationForm": {
      //   "mafConditions": [
      //     {
      //       "question": "Diabetes, gout, or any disorder of thyroid, or other glands.",
      //       "answer": true,
      //       "answerDetails": "My diabetes was diagnosed 2 years ago, and I have been under controlled treatment ever since.",
      //       "premiumImpact": 0.1,
      //       "medicalCodes": [
      //         {
      //           "codingStandard": "ICD-10-CM",
      //           "code": "A15-A19"
      //         }
      //       ]
      //     }
      //   ],
      //   "signatureDate": getCurrentDate()
      // }
    };
  }
  catch (error) {
    console.log(error);
    return null;
  }
};

export const buildEncounter = async (visit: any) => {
  try {
    const patient = await (await FhirApi({ url: `/Patient?identifier=${visit.patientRef}` })).data;
    console.log(patient);
    if (!(patient?.total) || !(patient?.entry)) {
      return { 'error': 'Patient not found' };
    }
    const status = String(visit.status).toLowerCase();
    const encounterPayload = {
      resourceType: 'Encounter',
      id: visit.code,
      status: (status === 'closed') ? 'finished' : status,
      subject: {
        reference: `Patient/${patient?.entry[0].resource?.id}`,
      },
      period: {
        start: visit.date,
        end: visit.endDate,
      },
      extension: [
        {
          url: 'https://mamatoto.dev/StructureDefinition/patient-benefit',
          valueReference: {
            reference: `Coverage/${visit.benefitRef}`,
          },
        },
        {
          url: 'https://mamatoto.dev/StructureDefinition/patient-plan',
          valueReference: {
            reference: `Coverage/${visit.planRef}`,
          },
        },
      ],
      serviceProvider: {
        reference: `Organization/${visit.providerRef}`,
      },
    };
    const encounter = await FhirApi({ url: `/Encounter/${encounterPayload.id}`, method: 'PUT', data: JSON.stringify(encounterPayload) });
    // console.log(encounter);
    return encounter;
  } catch (error) {
    return { error };
  }
};
const getLastYearISOString = () => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setFullYear(now.getFullYear() - 2);
  return yesterday.toISOString();
};

export const fetchVisits = async (status: string | null = null) => {
  try {

    const cpUrl = `${CAREPAY_BASE_URL}/visit/visits?since=${getLastYearISOString()}`;
    const authToken = await getCarepayAuthToken();
    const accessToken = authToken.accessToken;
    const visits = await (await fetch(cpUrl, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    })).json();
    console.log(`Fetched ${visits.length} visits`);
    for (const visit of visits) {
      const encounter = await buildEncounter(visit);
      // console.log(encounter);
      // return encounter
    }
    // Save the current timestamp to the file
    // fs.writeFileSync(LAST_RUN_FILE, new Date().toISOString());
  } catch (error) {
    return { error };
  }
};


export const fetchApprovedEndorsements = async () => {
  try {
    const authToken = await getCarepayAuthToken();
    const accessToken = authToken.accessToken;
    const cpUrl = `${CAREPAY_BASE_URL}/beneficiary/beneficiaries?policyIds=${CAREPAY_POLICY_ID}`;
    const beneficiaries = await (await fetch(cpUrl, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    })).json();
    console.log(`found ${beneficiaries.length} approved beneficiaries`);
    for (const i of beneficiaries) {
      const patient = await (await FhirApi({ url: `/Patient?identifier=${i.membershipNumber}` })).data;
      if (patient?.entry) {
        console.log(`found ${i.membershipNumber} in the SHR`);
        const patientResource = patient?.entry[0]?.resource;
        if (!JSON.stringify(patientResource.identifier).includes('CAREPAY-PATIENT-REF')) {
          const carepayPatientRef = { type: { coding: [{ system: 'http://carepay.com', code: 'CAREPAY-PATIENT-REF', display: 'Carepay Patient Ref' }] }, value: i.id };
          patientResource.identifier.push(carepayPatientRef);
          // update patient;
          console.log(patientResource);
          const updated = await (await FhirApi({
            url: `/Patient/${patient?.entry[0]?.resource?.id}`, method: 'PUT',
            data: JSON.stringify({ ...patientResource }),
          })).data;
          console.log(`...updated Patient/${updated.id} with ${i.membershipNumber} -> ${i.id}`);
        }else{
          console.log(`...skipping ${i.membershipNumber} with ref already`);
        }
      }
    }
    return beneficiaries;

  } catch (error) {
    return false;
  }
};


export const getCarepayAuthToken = async () => {
  try {
    const cpLoginUrl = `${CAREPAY_BASE_URL}/usermanagement/login`;
    const accessToken = await (await (fetch(cpLoginUrl, {
      method: 'POST', body: JSON.stringify({
        'username': CAREPAY_USERNAME,
        'password': CAREPAY_PASSWORD,
      }),
      headers: { 'Content-Type': 'application/json' },
    }))).json();
    return accessToken;
  } catch (error) {
    return null;
  }
};
