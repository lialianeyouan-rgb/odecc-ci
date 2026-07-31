/// <reference types="vite/client" />

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "dompurify" {
  const DOMPurify: {
    sanitize: (dirty: string) => string;
  };
  export default DOMPurify;
}

declare module "@netlify/functions" {
  export type Handler = (event: unknown, context: unknown) => Promise<{
    statusCode: number;
    body: string;
  }>;
}
