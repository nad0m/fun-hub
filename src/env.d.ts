/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ATOM_SOCKET_API: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
