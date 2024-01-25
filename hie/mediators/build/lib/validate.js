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
exports.validateResource = exports.getMappings = exports.getConceptCode = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const resources_1 = require("./resources");
// ?q=145262&limit=25&exact_match=on&
//   -H 'accept: application/json' \
const getConceptCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (yield node_fetch_1.default(`${process.env.OCL_HOST}/concepts?` + new URLSearchParams({ q: code, exact_match: "on" }), { headers: { "Content-Type": "application/json", "Authorization": process.env.OCL_API_KEY || '' } })).json();
    console.log("API", response);
});
exports.getConceptCode = getConceptCode;
// getMappings
const getMappings = (code) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.getMappings = getMappings;
// 1. Validates concepts
const validateResource = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let parsed;
    switch (data.resourceType) {
        case "Condition":
            parsed = resources_1.parseCondition(data);
        case "Observation":
            break;
        default:
            return false;
    }
    let codes = parsed === null || parsed === void 0 ? void 0 : parsed.codes;
    for (let code of codes) {
        exports.getConceptCode(code);
    }
    return;
});
exports.validateResource = validateResource;
