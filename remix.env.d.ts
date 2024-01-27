/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_SECRET?: string;
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      PORT?: string;
      DOMAIN?: string;
    }
  }
}
