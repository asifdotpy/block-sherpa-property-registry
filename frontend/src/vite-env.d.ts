/// <reference types="vite/client" />

declare module "*.json" {
  const value: { abi: any; bytecode: any };
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_AMOY_RPC_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
