"use strict";
// To Do: 
//     1. Add support for multiple systems 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFhirPatient = exports.parseIdentifiers = exports.Patient = exports.parseOrganization = exports.Organization = exports.Observation = exports.parseObservation = exports.AllergyIntolerance = exports.parseAllergyIntolerance = exports.Immunization = exports.parseImmunization = exports.Medication = exports.parseMedication = exports.parseCondition = exports.Condition = exports.generatePatientReference = exports.generateReferenceFromCrossBorderId = exports.generateCode = exports.resourceParser = exports.resourceBuilder = exports._supportedResources = void 0;
const utils_1 = require("./utils");
exports._supportedResources = ['Observation', 'Medication', 'AllergyIntolerance', 'Immunization', 'Condition'];
const resourceBuilder = (resourceType, data) => {
    try {
        switch (resourceType) {
            case "Patient":
                return exports.Patient(data);
            case "Condition":
                return exports.Condition(data);
            case "Observation":
                return exports.Observation(data);
            case "Immunization":
                return exports.Immunization(data);
            case "Medication":
                return exports.Medication(data);
            case "AllergyIntolerance":
                return exports.AllergyIntolerance(data);
            default:
                return null;
        }
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
exports.resourceBuilder = resourceBuilder;
const resourceParser = (resourceType, data) => {
    try {
        switch (resourceType) {
            case "Patient":
                return exports.parseFhirPatient(data);
            case "Condition":
                return exports.parseCondition(data);
            case "Observation":
                return exports.parseObservation(data);
            case "Immunization":
                return exports.parseImmunization(data);
            case "Medication":
                return exports.parseMedication(data);
            case "AllergyIntolerance":
                return exports.parseAllergyIntolerance(data);
            default:
                return null;
        }
    }
    catch (error) {
    }
};
exports.resourceParser = resourceParser;
const generateCode = (system, code, display) => {
    try {
        new URL(system);
    }
    catch (error) {
        console.log("invalid system value");
        return null;
    }
    return { system, code, display };
};
exports.generateCode = generateCode;
const generateReferenceFromCrossBorderId = (crossBorderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let patient = yield utils_1.getPatientByCrossBorderId(crossBorderId);
        if (!patient) {
            return null;
        }
        patient = exports.parseFhirPatient(patient);
        return {
            "reference": `Patient/${patient.id}`,
            "display": `${patient.surname}, ${patient.otherNames}`
        };
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.generateReferenceFromCrossBorderId = generateReferenceFromCrossBorderId;
const generatePatientReference = (resource, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (['Patient'].indexOf(resource) < 0) {
            console.error(`Failed to generate resource: invalid resource: ${resource}`);
            return null;
        }
        let patient = (yield utils_1.FhirApi({ url: `/${resource}/${id}` })).data;
        patient = exports.parseFhirPatient(patient);
        return {
            "reference": `${resource}/${id}`,
            "display": `${patient.surname}, ${patient.otherNames}`
        };
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.generatePatientReference = generatePatientReference;
// Observations
// Condition
const Condition = (data) => {
    try {
        return {
            resourceType: "Condition",
            clinicalStatus: {
                "coding": [{
                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                        "code": "active"
                    }]
            },
            category: [{
                    "coding": [{
                            "system": "http://loinc.org",
                            "code": "75326-9",
                            "display": "Problem"
                        }]
                }],
            "code": { "coding": data.codes },
            "subject": { "reference": data.patient },
            "onsetDateTime": data.onsetDateTime,
        };
    }
    catch (error) {
        console.error("failed to build Condition resource", error);
        return null;
        ;
    }
};
exports.Condition = Condition;
const parseCondition = (data) => {
    try {
        return {
            onsetDateTime: data.onsetDateTime,
            id: (data === null || data === void 0 ? void 0 : data.id) || null,
            practitioner: data.asserter.reference.split('/')[1],
            codes: data.code.coding[0],
            patient: data.subject.reference.split('/')[1],
        };
    }
    catch (error) {
        console.log("failed to parse Condition resource", error);
        return null;
        ;
    }
};
exports.parseCondition = parseCondition;
// Medication
const parseMedication = (data) => {
    try {
        return true;
    }
    catch (error) {
        console.log("failed to parse Medication resource", error);
        return null;
    }
};
exports.parseMedication = parseMedication;
const Medication = (data) => {
    try {
        return true;
    }
    catch (error) {
        console.error("failed to build Medication resource", error);
        return null;
    }
};
exports.Medication = Medication;
// Immunization
const parseImmunization = (data) => {
    try {
        return true;
    }
    catch (error) {
        console.log("failed to parse Immunization resource", error);
        return null;
    }
};
exports.parseImmunization = parseImmunization;
const Immunization = (data) => {
    try {
        return true;
    }
    catch (error) {
        console.error("failed to build Immunization resource", error);
        return null;
    }
};
exports.Immunization = Immunization;
// AllergyIntolerance
const parseAllergyIntolerance = (data) => {
    try {
        return { code: data.codes, patient: data.patient.reference.split('/')[1] };
    }
    catch (error) {
        console.log("failed to parse AllergyIntolerance resource", error);
        return null;
    }
};
exports.parseAllergyIntolerance = parseAllergyIntolerance;
const AllergyIntolerance = (data) => {
    try {
        return {
            resourceType: "AllergyIntolerance",
            clinicalStatus: {
                coding: [{ "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", "code": "active" }]
            },
            verificationStatus: {
                "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification", "code": "confirmed" }]
            },
            code: data.codes,
            patient: data.patient
        };
    }
    catch (error) {
        console.error("failed to build AllergyIntolerance resource", error);
        return null;
    }
};
exports.AllergyIntolerance = AllergyIntolerance;
// Observation
const parseObservation = (data) => {
    try {
        return true;
    }
    catch (error) {
        console.log("failed to parse Observation resource", error);
        return null;
    }
};
exports.parseObservation = parseObservation;
const Observation = (data) => {
    try {
        return true;
    }
    catch (error) {
        console.error("failed to build Observation resource", error);
        return null;
    }
};
exports.Observation = Observation;
// Organization.
const Organization = (name, country, townOrCityOrCounty, address) => {
    try {
        return {
            resourceType: "Organization", "name": name,
            address: [{ "line": [address], "city": townOrCityOrCounty, "country": country }]
        };
    }
    catch (error) {
        console.error("failed to build Organization resource", error);
        return null;
        ;
    }
};
exports.Organization = Organization;
const parseOrganization = (data) => {
    try {
        return {
            id: (data === null || data === void 0 ? void 0 : data.id) || null,
            name: data.name, address: data.address[0].line,
            city: data.address[0].city, country: data.address[0].country
        };
    }
    catch (error) {
        console.log("failed to parse Organization resource", error);
        return null;
        ;
    }
};
exports.parseOrganization = parseOrganization;
// Patient
let Patient = (patient) => {
    try {
        return Object.assign(Object.assign({ resourceType: 'Patient' }, (patient.id && { id: patient.id })), { identifier: [
                { "value": patient.pointOfCareId, "id": "POINT_OF_CARE_ID" },
                { "value": patient.crossBorderId, "id": "CROSS_BORDER_ID" },
                { "value": patient.nationalId, "id": "NATIONAL_ID", "system": patient.country }
            ], name: [{ family: patient.surname, given: [patient.otherNames,], },], maritalStatus: {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
                        "code": patient.maritalStatus.toUpperCase(),
                        "display": patient.maritalStatus
                    }
                ],
                "text": patient.maritalStatus
            }, telecom: [{ value: patient.phone, },], birthDate: new Date(patient.dob).toISOString().slice(0, 10), gender: (patient.sex).toLowerCase(), address: [
                {
                    state: patient.county,
                    district: patient.district,
                    city: patient.subCounty,
                    village: patient.ward || patient.region,
                    country: patient.country
                },
            ], contact: [
                {
                    telecom: [{ value: patient.nextOfKinPhone, },],
                    name: { family: patient.nextOfKinName, },
                    relationship: [{ text: patient.nextOfKinRelationship }]
                },
            ] });
    }
    catch (error) {
        console.log("failed to build Patient resource: ", error);
        return;
    }
};
exports.Patient = Patient;
const parseIdentifiers = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    let patient = (yield utils_1.FhirApi({ url: `/ Patient ? identifier = ${patientId} `, })).data;
    if (!((patient === null || patient === void 0 ? void 0 : patient.total) > 0 || (patient === null || patient === void 0 ? void 0 : patient.entry.length) > 0)) {
        return null;
        ;
    }
    let identifiers = patient.entry[0].resource.identifier;
    return identifiers.map((id) => {
        return {
            [id.id]: id
        };
    });
});
exports.parseIdentifiers = parseIdentifiers;
const parseFhirPatient = (patient) => {
    var _a, _b, _c;
    try {
        let identifiers = patient.identifier;
        let _ids = {};
        for (let id of identifiers) {
            _ids[id.id] = id;
        }
        console.log(_ids);
        return {
            surname: patient.name[0].family,
            crossBorderId: ((_a = _ids.CROSS_BORDER_ID) === null || _a === void 0 ? void 0 : _a.value) || '',
            pointOfCareId: ((_b = _ids.POINT_OF_CARE_ID) === null || _b === void 0 ? void 0 : _b.value) || '',
            nationalId: ((_c = _ids.NATIONAL_ID) === null || _c === void 0 ? void 0 : _c.value) || '',
            otherNames: patient.name[0].given[0],
            sex: patient.gender,
            dob: new Date(patient.birthDate).toDateString(),
            maritalStatus: patient.maritalStatus.coding[0].display,
            // "occupation": "Student",
            // "education": "Primary School",
            deceased: patient.deceasedBoolean,
            // "address": "58, Nakuru Town East",
            phone: patient.telecom[0].value,
            country: patient.address[0].country,
            region: patient.address[0].country === "Uganda" ? patient.address[0].village : undefined,
            district: patient.address[0].district || undefined,
            county: patient.address[0].state,
            subCounty: patient.address[0].city,
            nextOfKinRelationship: patient.contact[0].relationship[0].text,
            nextOfKinName: patient.contact[0].name.family,
            nextOfKinPhone: patient.contact[0].telecom,
        };
    }
    catch (error) {
        console.log("failed to parse Patient resource: ", error);
        return null;
    }
};
exports.parseFhirPatient = parseFhirPatient;
