/**
 * Express router paths go here.
 */


export default {
  Auth: {
    Base: '/auth',
    GetToken: '/token',
    AuthenticateClient: '/client',
  },
  HeyForm: {
    Base: '/hey_form',
    Webhook: '/webhook',
  }
} as const;
