import { FhirApi } from "./utils";
import path from 'path';
import fs from 'fs';

const CAREPAY_BASE_URL = process.env['CAREPAY_BASE_URL'];
const CAREPAY_CATEGORY_ID = process.env['CAREPAY_CATEGORY_ID'];
const CAREPAY_USERNAME = process.env['CAREPAY_USERNAME'];
const CAREPAY_PASSWORD = process.env['CAREPAY_PASSWORD'];
const CAREPAY_POLICY_ID = process.env['CAREPAY_POLICY_ID'];

const CAREPAY_DEV_BASE_URL = process.env['CAREPAY_DEV_BASE_URL'];
const CAREPAY_DEV_CATEGORY_ID = process.env['CAREPAY_DEV_CATEGORY_ID'];
const CAREPAY_DEV_USERNAME = process.env['CAREPAY_DEV_USERNAME'];
const CAREPAY_DEV_PASSWORD = process.env['CAREPAY_DEV_PASSWORD'];
const CAREPAY_DEV_POLICY_ID = process.env['CAREPAY_DEV_POLICY_ID'];





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
    let ids:any = {};
    for(let id of identifiers){
      let idType = id?.type?.coding[0].code;
      let idSystem = id?.type?.coding[0].system;
      ids[idType] = id?.value;
    }
    return ids;
  } catch (error) {
    return {}
  }
}

function generateRandomString(length:number) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



export const fhirPatientToCarepayBeneficiary = async (patient: any, mode: string = "dev") => {
    try {
        let gender = String(patient.gender).toUpperCase();
        let _date = String(patient.birthDate).split("-");
        // console.log(`${_date[0]}-${_date[2].padStart(2, '0')}-${_date[1].padStart(2, '0')}`,)
        let n:any = {};

        let phoneNumbers = patient.telecom;
        phoneNumbers.map( ( numb:any ) => {
          if (Object.keys(numb).indexOf('value') > -1){
              n[numb.system] = numb.value;
          }
        })
        // console.log(n);

        let maritalStatus = patient?.maritalStatus?.coding?.[0]?.code;

        return {
          "title": gender == "MALE" ? "MR" : "MRS" ,
          "firstName": patient.name[0].given[0] ?? "",
          ...(patient.name[0].given[1] ? true: false) && {"middleName": patient.name[0].given[1]},
          ...(patient.name[0].family ? true: false) && {"lastName": patient.name[0].family},
          "gender": gender,
          "dateOfBirth": patient.birthDate,
          // "dateOfBirth":  `${_date[0]}-${_date[2].padStart(2, '0')}-${_date[1].padStart(2, '0')}`,
          "maritalStatus": maritalStatus === "M"? "MARRIED" : "SINGLE",
          // "nationality": "KE",
          "identification": [
            {
              "type": "NATIONAL_ID",
              "number": `${patient?.identifier?.[0]?.value}`
            }
          ],
          // "acceptTermsAndCondition": true,
          // "occupation": "EMPLOYED",
          // "email": `${(patient.name[0].given[0]).replace(" ", "-") ?? ""}@gmail.com`,
          "residentialCountryCode": "string",
          // "height": 140,
          // "weight": -1.7976931348623157e+308,
          // "bmi": -1.7976931348623157e+308,
          "categoryId":`${mode === "dev" ?  CAREPAY_DEV_CATEGORY_ID : CAREPAY_CATEGORY_ID}`,
          "policyId": `${mode === "dev" ?  CAREPAY_DEV_POLICY_ID :CAREPAY_POLICY_ID}`,
          "relationship": "PRIMARY",
          "phoneNumber": n?.phone ?? n?.mobile,
          // "dateOfEnrollment": "2014-02-07",
          "startDate": new Date().toISOString(),
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
        }
        }
    catch (error) {
        console.log(error);
        return null;    
    }
}

export const buildEncounter = async (visit: any) => {
  try {
    let patient = await (await FhirApi({url: `/Patient?identifier=${visit.patientRef}`})).data;
    // console.log(patient);
    if(!(patient?.total) || !(patient?.entry)){
      return {"error": "Patient not found"}
    }
    let status = String(visit.status).toLowerCase();
    let encounterPayload = {
      resourceType: "Encounter",
      id: visit.code,
      status: (status === "closed") ? "finished" : status,
      subject: {
        reference: `Patient/${patient?.entry[0].resource?.id}`
      },
      period:{
        start: visit.date,
        end: visit.endDate
      },
      extension:[
        {
          url: "https://mamatoto.dev/StructureDefinition/patient-benefit",
          valueReference:{
            reference: `Coverage/${visit.benefitRef}`
          }
        },
        {
          url: "https://mamatoto.dev/StructureDefinition/patient-plan",
          valueReference:{
            reference: `Coverage/${visit.planRef}`
          }
        },
      ],
      serviceProvider: {
        reference: `Organization/${visit.providerRef}`
      }
    }
    let encounter = await FhirApi({url: `/Encounter/${encounterPayload.id}`, method: "PUT", data: JSON.stringify(encounterPayload)});
    // console.log(encounter);
    return encounter;
  } catch (error) {
    return {error};
  }
}
const getLastYearISOString = () => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setFullYear(now.getFullYear() - 2);
  return yesterday.toISOString();
};

export const fetchVisits = async (status: string | null = null) => {
  try {

    let cpUrl = `${CAREPAY_BASE_URL}/visit/visits?since=${getLastYearISOString()}`;
    // let cpUrl = `${CAREPAY_BASE_URL}/visit/visits?since=${readLastRunTimestamp() ?? getLastYearISOString()}`;
     // send payload to carepay
     let cpLoginUrl = `${CAREPAY_BASE_URL}/usermanagement/login`;
     let authToken = await(await (fetch(cpLoginUrl,{
         method:"POST", body: JSON.stringify({"username":CAREPAY_USERNAME, "password":CAREPAY_PASSWORD}),
         headers:{"Content-Type":"application/json"}
     }))).json();
     let accessToken = authToken['accessToken'];
    let visits =  await (await fetch(cpUrl, {
      headers: {"Content-Type":"application/json", "Authorization":`Bearer ${accessToken}`}
    })).json();
    console.log(`Fetching visits ${visits.length} `);
    for (let visit of visits){
      let encounter = await buildEncounter(visit);
      // console.log(encounter);
      // return encounter
    }
    // Save the current timestamp to the file
    // fs.writeFileSync(LAST_RUN_FILE, new Date().toISOString());
  } catch (error) {
    return {error} 
  }
}

