/* eslint-disable n/no-process-env */
export default {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? 3000),
  CRON_INTERVAL: Number(process.env.CRON_INTERVAL ?? 10),
  OpenHimApi: {
    Username: (process.env.OPENHIM_USERNAME ?? ''),
    Password: (process.env.OPENHIM_PASSWORD ?? ''),
    Url: (process.env.OPENHIM_API_URL ?? ''),
  },
  FHIR_BASE_URL: (process.env.FHIR_BASE_URL ?? ''),
  FHIR_PATIENT_SUBSCRIPTION_ID: (process.env.FHIR_PATIENT_SUBSCRIPTION_ID ?? ''),
  FHIR_SUBSCRIPTION_CALLBACK_URL: (process.env.FHIR_SUBSCRIPTION_CALLBACK_URL ?? ''),
  FHIR_ENCOUNTER_SUBSCRIPTION_ID: (process.env.FHIR_ENCOUNTER_SUBSCRIPTION_ID ?? ''),
  FHIR_ENCOUNTER_CALLBACK_URL: (process.env.FHIR_ENCOUNTER_CALLBACK_URL ?? ''),
  CookieProps: {
    Key: 'ExpressGeneratorTs',
    Secret: (process.env.COOKIE_SECRET ?? ''),
    // Casing to match express cookie options
    Options: {
      httpOnly: true,
      signed: true,
      path: (process.env.COOKIE_PATH ?? ''),
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: (process.env.COOKIE_DOMAIN ?? ''),
      secure: (process.env.SECURE_COOKIE === 'true'),
    },
  },
  Jwt: {
    Secret: (process.env.JWT_SECRET ??  ''),
    Exp: (process.env.COOKIE_EXP ?? ''), // exp at the same time as the cookie
  },
} as const;
