export const SERVER_URL =
  import.meta.env.VITE_ATOM_SOCKET_API || 'https://fun-hub.fly.dev';
export const POLLING_INTERVAL = 500;
export const BASE_ROUTE = import.meta.env.DEV ? '/' : '/fun-hub/';
