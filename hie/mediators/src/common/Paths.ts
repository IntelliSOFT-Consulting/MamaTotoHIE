/**
 * Express router paths go here.
 */


export default {
  Auth: {
    Base: '/auth',
    GetToken: '/token',
    AuthenticateClient: '/client',
  },
} as const;
