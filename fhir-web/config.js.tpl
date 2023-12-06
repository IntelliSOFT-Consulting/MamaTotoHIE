// config.js.tpl

window._env_ = {
  // keycloak
  REACT_APP_KEYCLOAK_API_BASE_URL: 'http://chanjoke.intellisoftkenya.com:9080/auth/admin/realms/test',
  REACT_APP_KEYCLOAK_LOGOUT_URL:
    'http://chanjoke.intellisoftkenya.com:9080/auth/realms/test/protocol/openid-connect/logout',
  REACT_APP_OPENSRP_ACCESS_TOKEN_URL:
    'http://chanjoke.intellisoftkenya.com:9080/auth/realms/test/protocol/openid-connect/token',
  REACT_APP_OPENSRP_AUTHORIZATION_URL:
    'http://chanjoke.intellisoftkenya.com:9080/auth/realms/test/protocol/openid-connect/auth',
  REACT_APP_OPENSRP_CLIENT_ID: 'my-fhir-client',
  REACT_APP_OPENSRP_USER_URL:
    'http://chanjoke.intellisoftkenya.com:9080/auth/realms/test/protocol/openid-connect/userinfo',

  // fhir-web
  REACT_APP_WEBSITE_NAME: 'MamaToto',
  REACT_APP_OPENSRP_WEB_VERSION: 'MamaToto',
  REACT_APP_DOMAIN_NAME: 'http://localhost:3000',
  REACT_APP_EXPRESS_OAUTH_GET_STATE_URL: 'http://localhost:3000/oauth/state',
  REACT_APP_EXPRESS_OAUTH_LOGOUT_URL: 'http://localhost:3000/logout',

  // fhir-server
  REACT_APP_FHIR_API_BASE_URL: 'http://chanjoke.intellisoftkenya.com:8888/fhir',

  // UUID's
  REACT_APP_FHIR_ROOT_LOCATION_ID: 'eff94f33-c356-4634-8795-d52340706ba9',
  REACT_APP_COMMODITIES_LIST_RESOURCE_ID: '<id-of-a-list-on-HAPI-fhir-server>',

  // toggle fhir-web modules
  REACT_APP_ENABLE_FHIR_CARE_TEAM: 'true',
  REACT_APP_ENABLE_FHIR_GROUP: 'true',
  REACT_APP_ENABLE_FHIR_HEALTHCARE_SERVICES: 'true',
  REACT_APP_ENABLE_FHIR_LOCATIONS: 'true',
  REACT_APP_ENABLE_FHIR_PATIENTS: 'true',
  REACT_APP_ENABLE_FHIR_TEAMS: 'true',
  REACT_APP_ENABLE_FHIR_USER_MANAGEMENT: 'true',
  REACT_APP_ENABLE_FHIR_COMMODITY: 'true',
  REACT_APP_ENABLE_QUEST: 'true',

  // optional overrides
  SKIP_PREFLIGHT_CHECK: 'true',
  GENERATE_SOURCEMAP: 'false',
  INLINE_RUNTIME_CHUNK: 'false',
  IMAGE_INLINE_SIZE_LIMIT: '0',
  REACT_APP_MAIN_LOGO_SRC:
    'https://github.com/opensrp/web/raw/master/app/src/assets/images/fhir-web-logo.png',
  REACT_APP_OPENSRP_OAUTH_SCOPES: 'openid,profile',
  REACT_APP_ENABLE_OPENSRP_OAUTH: 'true',
  REACT_APP_BACKEND_ACTIVE: 'true',
  REACT_APP_SUPPORTED_LANGUAGES: 'en',
  REACT_APP_PROJECT_CODE: 'demo',
  REACT_APP_DEFAULTS_TABLE_PAGE_SIZE: '10',
  REACT_APP_OPENSRP_LOGOUT_URL: 'null',
  REACT_APP_OPENSRP_ROLES:`{"USERS":"ROLE_EDIT_KEYCLOAK_USERS","LOCATIONS":"ROLE_VIEW_KEYCLOAK_USERS","TEAMS":"ROLE_VIEW_KEYCLOAK_USERS","CARE_TEAM":"ROLE_VIEW_KEYCLOAK_USERS","QUEST":"ROLE_VIEW_KEYCLOAK_USERS","HEALTHCARE_SERVICE":"ROLE_VIEW_KEYCLOAK_USERS","GROUP":"ROLE_VIEW_KEYCLOAK_USERS","COMMODITY":"ROLE_VIEW_KEYCLOAK_USERS"}`,
  REACT_APP_PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY: 'ONE_TO_MANY'
};