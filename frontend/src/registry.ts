import { BrowserProvider, Contract, JsonRpcSigner, parseEther } from "ethers";
import PropertyRegistryArtifact from "./contracts/PropertyRegistry.json";
const abi = PropertyRegistryArtifact.abi;

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;
const AMOY_CHAIN_ID = 80002;

export interface PropertyData {
  propertyAddress: string;
  owner: string;
  price: bigint;
}

export async function connectWallet(): Promise<BrowserProvider> {
  const eth = (window as any).ethereum;
  if (!eth) throw new Error("MetaMask not found");
  const provider = new BrowserProvider(eth);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== AMOY_CHAIN_ID) {
    throw new Error("Please switch MetaMask to Polygon Amoy (chainId 80002)");
  }
  return provider;
}

export function getContract(
  provider: BrowserProvider,
  signer: JsonRpcSigner
): Contract {
  return new Contract(CONTRACT_ADDRESS, abi, signer);
}

export async function getProperty(
  contract: Contract,
  id: bigint
): Promise<PropertyData> {
  return contract.getProperty(id);
}

export async function registerProperty(
  contract: Contract,
  propertyAddress: string,
  priceEth: string
): Promise<string> {
  const tx = await contract.registerProperty(
    propertyAddress,
    parseEther(priceEth)
  );
  await tx.wait();
  return tx.hash;
}
