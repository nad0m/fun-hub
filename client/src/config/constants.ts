export const SERVER_URL =
  import.meta.env.VITE_ATOM_SOCKET_API || 'http://localhost:8080';
export const POLLING_INTERVAL = 500;
export const BASE_ROUTE = import.meta.env.DEV ? '/' : '/fun-hub/';
