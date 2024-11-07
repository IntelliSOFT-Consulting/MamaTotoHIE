/**
 * Express router paths go here.
 */


export default {
  Auth: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
