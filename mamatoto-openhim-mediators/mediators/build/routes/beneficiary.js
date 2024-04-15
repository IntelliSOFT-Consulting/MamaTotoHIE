"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../lib/utils");
const uuid_1 = require("uuid");
exports.router = express_1.default.Router();
exports.router.use(express_1.default.json());
// create or register a new patient
exports.router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = req.body;
        console.log(req.headers);
        let patientId = uuid_1.v4();
        let Patient = {
            resourceType: "Patient",
            id: patientId,
            name: [
                {
                    prefix: [data.title],
                    given: [data.firstName, data.middleName],
                    family: data.lastName
                }
            ],
            identifier: [
                {
                    type: {
                        coding: [{
                                system: "http://hl7.org/fhir/administrative-identifier",
                                code: data.identification[0].type,
                                display: data.identification[0].type
                            }],
                        text: data.identification[0].type
                    },
                    system: "identification", value: data.identification[0].number
                }
            ],
            gender: String(data.gender).toLocaleLowerCase(),
            birthDate: data.dateOfBirth,
            maritalStatus: data.maritalStatus,
            telecom: [
                {
                    system: "phone", value: data.phoneNumber
                },
                {
                    system: "email", value: data.email
                }
            ],
            address: {
                country: data.residentialCountryCode, district: data.residentialCountyCode, city: data.residentialLocationCode
            },
        };
        // Policy
        let Coverage = {
            "resourceType": "Coverage",
            "id": uuid_1.v4(),
            "beneficiary": {
                "reference": `Patient/${patientId}`
            },
            "relationship": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/coverage-selfpay",
                        "code": data.relationship
                    }
                ]
            },
            "identifier": [
                {
                    "system": "http://example.com/fhir/coverage-category",
                    "value": data.categoryId
                },
                {
                    "system": "http://example.com/fhir/coverage-policy",
                    "value": data.policyId
                },
                {
                    "system": "http://example.com/fhir/coverage-membership",
                    "value": data.membershipNumber
                },
                {
                    "system": "http://example.com/fhir/coverage-insurance",
                    "value": data.insuranceMemberId
                },
                {
                    "system": "http://example.com/fhir/coverage-family",
                    "value": data.familyIdentifier
                }
            ],
            "status": "active",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/coverage-type",
                        "code": "medical"
                    }
                ]
            },
            "subscriberId": data.membershipNumber,
            "subscriber": {
                "reference": `Patient/${patientId}`
            },
            "dependent": "1",
            "period": {
                "start": data.startDate,
                "end": data.endDate
            },
        };
        let DocumentReference = {
            "resourceType": "DocumentReference",
            "id": uuid_1.v4(),
            "subject": {
                "reference": `Patient/${patientId}`
            },
            "type": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "34565-2"
                    }
                ],
                "text": data.document[0].documentType
            },
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://hl7.org/fhir/ValueSet/document-reference-category",
                            "code": "clinical"
                        }
                    ],
                    "text": "Clinical"
                }
            ],
            "content": [
                {
                    "attachment": {
                        "contentType": "application/pdf",
                        "url": data.document[0].documentLocation,
                        "title": data.document[0].documentType
                    }
                }
            ],
            "status": "current",
        };
        let RelatedPerson = {
            "resourceType": "RelatedPerson",
            "id": uuid_1.v4(),
            "patient": {
                "reference": `Patient/${patientId}`
            },
            "relationship": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                            "code": data.nextOfKin.relationship
                        }
                    ],
                    "text": data.nextOfKin.relationship
                },
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                            "code": "NOK"
                        }
                    ],
                    "text": "Next of Kin"
                },
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                            "code": "EC"
                        }
                    ],
                    "text": "Emergency Contact"
                }
            ],
            "name": {
                "text": data.nextOfKin.name
            },
            "telecom": [
                {
                    "system": "phone",
                    "value": data.nextOfKin.phoneNumber
                }
            ]
        };
        let patient = (yield utils_1.FhirApi({ url: `/Patient/${patientId}`, data: JSON.stringify(Patient), method: 'PUT' })).data;
        console.log("patient: ", patient);
        let relatedPerson = (yield utils_1.FhirApi({ url: `/RelatedPerson/${RelatedPerson.id}`, data: JSON.stringify(RelatedPerson), method: 'PUT' })).data;
        console.log("relatedPerson: ", relatedPerson);
        let coverage = (yield utils_1.FhirApi({ url: `/Coverage/${Coverage.id}`, data: JSON.stringify(Coverage), method: 'PUT' })).data;
        console.log("coverage: ", coverage);
        let documentReference = (yield utils_1.FhirApi({ url: `/DocumentReference/${DocumentReference.id}`, data: JSON.stringify(DocumentReference), method: 'PUT' })).data;
        console.log("documentReference: ", documentReference);
        // build bundle
        const fhirBundle = {
            resourceType: 'Bundle',
            type: 'collection',
            entry: [
                { resource: patient },
                { resource: relatedPerson },
                { resource: coverage },
                { resource: documentReference }
                // Add more entries if needed
            ]
        };
        if (patient.id) {
            res.statusCode = 200;
            res.json(fhirBundle);
            return;
        }
        res.statusCode = 400;
        res.json(patient);
        return;
    }
    catch (error) {
        res.statusCode = 400;
        console.log(error);
        res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                    "severity": "error",
                    "code": "exception",
                    "details": {
                        "text": String(error)
                    }
                }]
        });
        return;
    }
}));
//update patient details
exports.router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = req.body;
        let crossBorderId = req.query.identifier || null;
        if (!crossBorderId) {
            let error = "crossBorderId is a required parameter";
            res.statusCode = 400;
            res.json({
                "resourceType": "OperationOutcome",
                "id": "exception",
                "issue": [{
                        "severity": "error",
                        "code": "exception",
                        "details": {
                            "text": `Failed to register patient. ${JSON.stringify(error)}`
                        }
                    }]
            });
            return;
        }
        let patient = yield utils_1.getPatientByCrossBorderId(String(crossBorderId) || '');
        if (!patient) {
            let error = "Invalid crossBorderId provided";
            res.statusCode = 400;
            res.json({
                "resourceType": "OperationOutcome",
                "id": "exception",
                "issue": [{
                        "severity": "error",
                        "code": "exception",
                        "details": {
                            "text": `Patient not found - ${JSON.stringify(error)}`
                        }
                    }]
            });
            ;
            return;
        }
        let fhirId = patient.id;
        let updatedPatient = (yield utils_1.FhirApi({
            url: `/Patient/${fhirId}`,
            method: "PUT",
            data: JSON.stringify(Object.assign(Object.assign({}, data), { id: fhirId }))
        }));
        console.log(updatedPatient);
        res.statusCode = 200;
        res.json(updatedPatient.data);
        return;
    }
    catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                    "severity": "error",
                    "code": "exception",
                    "details": {
                        "text": `Failed to update patient- ${JSON.stringify(error)}`
                    }
                }]
        });
        return;
    }
}));
exports.default = exports.router;
