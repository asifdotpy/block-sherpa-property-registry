import {
  BrowserProvider,
  Contract,
  JsonRpcSigner,
  parseEther,
  Log,
} from "ethers";
import PropertyRegistryArtifact from "./contracts/PropertyRegistry.json";
const abi = PropertyRegistryArtifact.abi;

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;
const AMOY_CHAIN_ID = 80002;
const AMOY_CHAIN_ID_HEX = "0x13882";

export interface PropertyData {
  propertyAddress: string;
  owner: string;
  price: bigint;
}

export interface RegisterResult {
  hash: string;
  propertyId: bigint;
}

export interface ConnectResult {
  provider: BrowserProvider;
  account: string;
}

export async function connectWallet(): Promise<ConnectResult> {
  const eth = (window as any).ethereum;
  if (!eth) {
    throw new Error(
      "MetaMask not detected. Install the MetaMask browser extension, then reload this page."
    );
  }
  const provider = new BrowserProvider(eth);
  const accounts: string[] = await provider.send("eth_requestAccounts", []);

  const network = await provider.getNetwork();
  if (Number(network.chainId) !== AMOY_CHAIN_ID) {
    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: AMOY_CHAIN_ID_HEX },
      ]);
    } catch {
      throw new Error(
        "Please switch MetaMask to Polygon Amoy (chainId 80002), then click Connect again."
      );
    }
  }
  return { provider, account: accounts[0] };
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
  const [propertyAddress, owner, price] = await contract.getProperty(id);
  return { propertyAddress, owner, price };
}

export async function registerProperty(
  contract: Contract,
  propertyAddress: string,
  priceEth: string
): Promise<RegisterResult> {
  const tx = await contract.registerProperty(
    propertyAddress,
    parseEther(priceEth)
  );
  const receipt = await tx.wait();

  // Pull the real assigned propertyId from the PropertyRegistered event.
  let propertyId = 0n;
  const iface = contract.interface;
  for (const raw of receipt.logs as Log[]) {
    try {
      const parsed = iface.parseLog({
        topics: raw.topics as string[],
        data: raw.data,
      });
      if (parsed && parsed.name === "PropertyRegistered") {
        propertyId = BigInt(parsed.args[0]);
        break;
      }
    } catch {
      // not our event — ignore
    }
  }

  return { hash: tx.hash, propertyId };
}
