import { FhirApi } from "./utils";

let CAREPAY_POLICY_ID = process.env['CAREPAY_POLICY_ID'];
let CAREPAY_CATEGORY_ID = process.env['CAREPAY_CATEGORY_ID'];
let CAREPAY_BASE_URL = process.env['CAREPAY_BASE_URL'];
let CAREPAY_USERNAME = process.env['CAREPAY_USERNAME'];
let CAREPAY_PASSWORD = process.env['CAREPAY_PASSWORD'];



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



export const fhirPatientToCarepayBeneficiary = async (patient: any) => {
    try {
        let gender = String(patient.gender).toUpperCase();
        let _date = String(patient.birthDate).split("-");
        // console.log(`${_date[0]}-${_date[2].padStart(2, '0')}-${_date[1].padStart(2, '0')}`,)
        let n:any = {}

        let phoneNumbers = patient.telecom;
        phoneNumbers.map( (numb:any) => {
          if (Object.keys(numb).indexOf('value') > -1){
              n[numb.system] = numb.value;
          }
        })
        // console.log(n);


        return {
                "title": gender == "MALE" ? "MR" : "MRS" ,
                "firstName": patient.name[0].given[0] ?? "",
                ...(patient.name[0].given[1] ? true: false) && {"middleName": patient.name[0].given[1]},
                ...(patient.name[0].family ? true: false) && {"lastName": patient.name[0].family},
                "gender": gender,
                "dateOfBirth": patient.birthDate,
                // "dateOfBirth":  `${_date[0]}-${_date[2].padStart(2, '0')}-${_date[1].padStart(2, '0')}`,
                "maritalStatus": "SINGLE",
                "nationality": "KE",
                "identification": [
                  {
                    "type": "NATIONAL_ID",
                    "number": `78452638982${generateRandomString(4)}`
                  }
                ],
                "acceptTermsAndCondition": true,
                "occupation": "EMPLOYED",
                "email": `${(patient.name[0].given[0]).replace(" ", "-") ?? ""}@gmail.com`,"residentialCountryCode": "string",
                "height": -1.7976931348623157e+308,
                "weight": -1.7976931348623157e+308,
                "bmi": -1.7976931348623157e+308,
                "categoryId": CAREPAY_CATEGORY_ID,
                "policyId": `${CAREPAY_POLICY_ID}`,
                "relationship": "PRIMARY",
                "phoneNumber": n?.phone ?? n?.mobile,
                "dateOfEnrollment": "2014-02-07",
                "startDate": new Date().toISOString(),
                // "endDate": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                "medicalApplicationForm": {
                  "mafConditions": [
                    {
                      "question": "Diabetes, gout, or any disorder of thyroid, or other glands.",
                      "answer": true,
                      "answerDetails": "My diabetes was diagnosed 2 years ago, and I have been under controlled treatment ever since.",
                      "premiumImpact": 0.1,
                      "medicalCodes": [
                        {
                          "codingStandard": "ICD-10-CM",
                          "code": "A15-A19"
                        }
                      ]
                    }
                  ],
                  "signatureDate": getCurrentDate()
                }
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
      status: status == "closed" ? "finished" : status,
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


export const fetchVisits = async (status: string | null = null) => {
  try {

    let cpUrl = `${CAREPAY_BASE_URL}/visit/visits`;
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
  } catch (error) {
    return {error} 
  }
}

