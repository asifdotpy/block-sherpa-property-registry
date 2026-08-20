import React, { useState } from "react";
import {
  connectWallet,
  getContract,
  getProperty,
  registerProperty,
  PropertyData,
} from "./registry";

export default function App() {
  const [status, setStatus] = useState<string>("Not connected");
  const [propertyId, setPropertyId] = useState<string>("1");
  const [address, setAddress] = useState<string>("");
  const [price, setPrice] = useState<string>("1");
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [txHash, setTxHash] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);

  async function handleRegister() {
    try {
      setBusy(true);
      setTxHash("");
      const provider = await connectWallet();
      const signer = await provider.getSigner();
      const contract = getContract(provider, signer);
      setStatus("Wallet connected — sending transaction…");
      const hash = await registerProperty(contract, address, price);
      setTxHash(hash);
      setStatus("Registered on-chain ✅");
      const id = BigInt(propertyId || "1");
      setProperty(await getProperty(contract, id));
    } catch (e: any) {
      setStatus("Error: " + (e?.message || String(e)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Property Detail — Blockchain</h1>

      <div className="mb-4 p-3 rounded bg-slate-800">
        <p className="text-sm text-slate-300">On-chain status</p>
        <p className="font-mono text-sm break-words">{status}</p>
        {property && (
          <div className="mt-2 text-sm">
            <p>Address: {property.propertyAddress}</p>
            <p>Owner: {property.owner}</p>
            <p>Price (wei): {property.price.toString()}</p>
          </div>
        )}
      </div>

      <label className="block text-sm mb-1">Property physical address</label>
      <input
        className="w-full p-2 rounded bg-slate-700 text-white mb-3"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="123 Main St"
      />

      <label className="block text-sm mb-1">Price (ETH)</label>
      <input
        className="w-full p-2 rounded bg-slate-700 text-white mb-3"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        className="w-full p-3 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        onClick={handleRegister}
        disabled={busy}
      >
        {busy ? "Working…" : "Register on Blockchain"}
      </button>

      {txHash && (
        <div className="mt-4 p-3 rounded bg-slate-800">
          <p className="text-sm text-slate-300">Transaction hash</p>
          <a
            className="font-mono text-xs text-sky-400 break-all"
            href={`https://amoy.polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}
