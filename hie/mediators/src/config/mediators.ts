import { Mediator } from "@src/interfaces/mediatorInterface";

const shrMediator: Mediator = {
  urn: "urn:mediator:mamatoto-shr",
  version: "1.0.0",
  name: "MamaToto SHR Mediator",
  description: "This mediator is responsible for handling SHR bound requests.",
  defaultChannelConfig: {
    name: "MamaToto SHR Channel",
    urlPattern: "^/fhir/.*$",
    routes: [
      {
        name: "SHR Route",
        host: "hapi-fhir-jpa",
        pathTransform: "s///.*$/",
        port: "8080",
        primary: true,
        type: "http",
        status: "enabled",
      },
    ],
    allow: ["*"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    type: "http",
  },
  endpoints: [
    {
      name: "MamaToto SHR Mediator Endpoint",
      host: "hapi-fhir-jpa",
      path: "/fhir",
      port: "8080",
      primary: true,
      type: "http",
      status: "enabled",
    },
  ],
};

const carepayBeneficiaryMediator: Mediator = {
  urn: "urn:carepay-beneficiary:ips",
  version: "1.0.0",
  name: "CarePay Beneficiary Mediator",
  description:
    "This mediator is responsible for processing the CarePay Beneficiary Payload.",
  defaultChannelConfig: {
    name: "CarePay Beneficiary Channel",
    urlPattern: "/beneficiary/carepay",
    routes: [
      {
        name: "CarePay Beneficiary Route",
        host: "mediators",
        path: "/beneficiary/carepay",
        port: "3000",
        primary: true,
        type: "http",
        status: "enabled",
      },
    ],
    allow: ["*"],
    methods: ["POST"],
    type: "http",
  },
  endpoints: [
    {
      name: "CarePay Beneficiary Endpoint",
      host: "mediators",
      path: "/beneficiary/carepay",
      port: "3000",
      primary: true,
      type: "http",
      status: "enabled",
    },
  ],
};

const turnioNotificationsMediator: Mediator = {
  urn: "urn:turnio-notifications:ips",
  version: "1.0.0",
  name: "Turn.io Notifications Mediator",
  description:
    "This mediator is responsible for forwarding notification events to Turn.io.",
  defaultChannelConfig: {
    name: "Turn.io Notifications Channel",
    urlPattern: "/callback/turn",
    routes: [
      {
        name: "Turn.io Notifications Route",
        host: "mediators",
        path: "/callback/turn",
        port: "3000",
        primary: true,
        type: "http",
        status: "enabled",
      },
    ],
    allow: ["*"],
    methods: ["POST"],
    type: "http",
  },
  endpoints: [
    {
      name: "Turn.io Notifications Endpoint",
      host: "mediators",
      path: "/callback/turn",
      port: "3000",
      primary: true,
      type: "http",
      status: "enabled",
    },
  ],
};

const customRegistrationMediators: Mediator = {
  urn: "urn:custom-registation:whatsapp",
  version: "1.0.0",
  name: "Custom Registration Mediator",
  description:
    "This mediator is responsible for processing the CarePay Beneficiary Payload.",
  defaultChannelConfig: {
    name: "Custom Registration Workflow Channel",
    urlPattern: "^/custom/.*$",
    routes: [
      {
        name: "Custom Registration Route",
        host: "mediators",
        pathTransform: "s///.*$/",
        port: "3000",
        primary: true,
        type: "http",
        status: "enabled",
      },
    ],
    allow: ["*"],
    methods: ["POST"],
    type: "http",
  },
  endpoints: [
    {
      name: "Custom Registration Endpoint",
      host: "mediators",
      path: "/custom",
      port: "3000",
      primary: true,
      type: "http",
      status: "enabled",
    },
  ],
};

export { shrMediator, carepayBeneficiaryMediator, turnioNotificationsMediator, customRegistrationMediators };
