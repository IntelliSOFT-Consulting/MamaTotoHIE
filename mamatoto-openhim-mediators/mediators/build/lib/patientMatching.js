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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRecords = exports.getDuplicateGoldenRecords = exports.linkRecords = exports.findPossibleMatches = void 0;
const utils_1 = require("./utils");
const findPossibleMatches = (count) => __awaiter(void 0, void 0, void 0, function* () {
    let res = (yield utils_1.FhirApi({
        url: `/$mdm-query-links?_offset=${0}&_count=${count}`,
    })).data;
    console.log(res.parameter);
    let matches = [];
    for (let p of res.parameter) {
        if (p.name === "link") {
            // matches.push(p);
            let obj = {};
            p.part.map((part) => {
                obj[part.name] = part.valueString || part.valueBoolean || "";
            });
            matches.push(obj);
        }
    }
    return matches;
});
exports.findPossibleMatches = findPossibleMatches;
const linkRecords = (goldenRecord, sourceRecord) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield utils_1.FhirApi({
        url: `/$mdm-create-link`,
        method: 'POST',
        data: JSON.stringify({
            "resourceType": "Parameters",
            "parameter": [{
                    "name": "goldenResourceId",
                    "valueString": `Patient/${goldenRecord}`
                }, {
                    "name": "resourceId",
                    "valueString": `Patient/${sourceRecord}`
                }, {
                    "name": "matchResult",
                    "valueString": "MATCH"
                }]
        })
    });
    return res;
});
exports.linkRecords = linkRecords;
const getDuplicateGoldenRecords = (count) => __awaiter(void 0, void 0, void 0, function* () {
    let res = (yield utils_1.FhirApi({
        url: `/$mdm-duplicate-golden-resources?_offset=${0}&_count=${count}`,
    })).data;
    // console.log(res.parameter);
    let duplicates = [];
    for (let p of res.parameter) {
        if (p.name === "link") {
            // duplicates.push(p);
            let obj = {};
            p.part.map((part) => {
                obj[part.name] = part.valueString || part.valueBoolean || "";
            });
            duplicates.push(obj);
        }
    }
    console.log(duplicates);
    return duplicates;
});
exports.getDuplicateGoldenRecords = getDuplicateGoldenRecords;
// getDuplicateGoldenRecords(10)
const mergeRecords = (from, to) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield utils_1.FhirApi({
        url: `/$mdm-merge-golden-resources`,
        method: 'POST',
        data: JSON.stringify({
            "resourceType": "Parameters",
            "parameter": [{
                    "name": "fromGoldenResourceId",
                    "valueString": `Patient/${from}`
                }, {
                    "name": "toGoldenResourceId",
                    "valueString": `Patient/${to}`
                }]
        })
    });
    return res;
});
exports.mergeRecords = mergeRecords;
