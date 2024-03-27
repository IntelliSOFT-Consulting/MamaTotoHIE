
let CAREPAY_POLICY_ID = process.env['CAREPAY_POLICY_ID'];
let CAREPAY_CATEGORY_ID = process.env['CAREPAY_CATEGORY_ID'];



export const processIdentifiers = async (identifiers: any) => {
  try {
    let ids:any = {};
    for(let id of identifiers){
      let idType = id?.type?.coding[0].code;
      let idSystem = id?.type?.coding[0].system;
      // ids[`${id?.type?.}`]
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
        console.log(`${_date[0]}-${_date[2].padStart(2, '0')}-${_date[1].padStart(2, '0')}`,)
        let n:any = {}

        let phoneNumbers = patient.telecom;
        phoneNumbers.map( (numb:any) => {
            n[numb.use] = numb.value;
        })
        console.log(n);


        return {
                "title": gender == "MALE" ? "MR" : "MRS" ,
                "firstName": patient.name[0].given[0] ?? "",
                ...(patient.name[0].given[1] ? true: false) && {"middleName": patient.name[0].given[1]},
                ...(patient.name[0].family ? true: false) && {"lastName": patient.name[0].family},
                "gender": gender,
                "dateOfBirth": patient.birthDate,
                // "dateOfBirth":  `${_date[0]}-${_date[2].padStart(2, '0')}-${_date[1].padStart(2, '0')}`,
                "maritalStatus": "SINGLE",
                "nationality": "string",
                "identification": [
                  {
                    "type": "NATIONAL_ID",
                    "number": `78452638982${generateRandomString(4)}`
                  }
                ],
                "acceptTermsAndCondition": true,
                "beneficiaryType": "string",
                "occupation": "EMPLOYED",
                "employment": {
                  "employeeCode": "string",
                  "workCountryCode": "string",
                  "workCountyCode": "string",
                  "workLocationCode": "string",
                  "department": "string",
                  "profession": "string",
                  "salary": "string",
                  "commission": true
                },
                "email": `${patient.name[0].given[0] ?? " "}@gmail.com`,"residentialCountryCode": "string",
                "residentialCountyCode": "string",
                "residentialLocationCode": "string",
                "height": -1.7976931348623157e+308,
                "weight": -1.7976931348623157e+308,
                "bmi": -1.7976931348623157e+308,
                "categoryId": CAREPAY_CATEGORY_ID,
                "policyId": `${CAREPAY_POLICY_ID}`,
                "insuranceMemberId": "string",
                "familyIdentifier": "string",
                "relationship": "PRIMARY",
                "phoneNumber": n?.phone ?? n?.mobile,
                "dateOfEnrollment": "2014-02-07",
                "document": [
                  {
                    "documentType": "string",
                    "documentLocation": "string"
                  }
                ],
                "visaPlaceOfIssueCode": "string",
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
                  "signatureDate": "2023-10-10"
                }
              }
        }
    catch (error) {
        console.log(error);
        return null;    
    }
}