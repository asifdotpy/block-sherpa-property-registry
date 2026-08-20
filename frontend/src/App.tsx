import React, { useState } from "react";
import {
  connectWallet,
  getContract,
  getProperty,
  registerProperty,
  type PropertyData,
  type RegisterResult,
} from "./registry";

function StepBadge({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={[
          "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold",
          done
            ? "bg-emerald-500 text-slate-900"
            : active
            ? "bg-sky-500 text-slate-900"
            : "bg-slate-700 text-slate-300",
        ].join(" ")}
      >
        {done ? "✓" : n}
      </div>
      <span
        className={[
          "text-sm",
          done || active ? "text-slate-100" : "text-slate-400",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

export default function App() {
  // Wallet state
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string>("");
  const [connecting, setConnecting] = useState(false);

  // Form state
  const [propertyAddress, setPropertyAddress] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [busy, setBusy] = useState(false);

  // Result state
  const [registered, setRegistered] = useState<RegisterResult | null>(null);
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [error, setError] = useState<string>("");

  async function handleConnect() {
    try {
      setConnecting(true);
      setError("");
      const { account } = await connectWallet();
      setAccount(account);
      setConnected(true);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setConnecting(false);
    }
  }

  async function handleRegister() {
    try {
      setBusy(true);
      setError("");
      setRegistered(null);
      setProperty(null);

      const { provider } = await connectWallet();
      const signer = await provider.getSigner();
      const contract = getContract(provider, signer);

      const result = await registerProperty(
        contract,
        propertyAddress,
        price || "0"
      );
      setRegistered(result);

      if (result.propertyId > 0n) {
        setProperty(await getProperty(contract, result.propertyId));
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  const shortAddr = account
    ? `${account.slice(0, 6)}…${account.slice(-4)}`
    : "";

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Property Detail — Blockchain</h1>
      <p className="text-sm text-slate-400 mb-5">
        Register a property on Polygon Amoy testnet. Three quick steps:
      </p>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6 bg-slate-800 rounded-lg p-3">
        <StepBadge n={1} label="Connect" active={!connected} done={connected} />
        <div className="flex-1 h-px bg-slate-600 mx-3" />
        <StepBadge
          n={2}
          label="Register"
          active={connected && !registered}
          done={!!registered}
        />
        <div className="flex-1 h-px bg-slate-600 mx-3" />
        <StepBadge
          n={3}
          label="Verified"
          active={false}
          done={!!property}
        />
      </div>

      {/* STEP 1 — Connect Wallet */}
      <div className="mb-6">
        {!connected ? (
          <>
            <button
              className="w-full p-3 rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-50 font-semibold"
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? "Connecting…" : "🔌 Connect Wallet"}
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Hint: You need the MetaMask browser extension. After clicking,
              approve the connection and make sure MetaMask is on{" "}
              <span className="text-slate-200">Polygon Amoy (chainId 80002)</span>.
              If it's on the wrong network, we'll ask you to switch.
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between p-3 rounded bg-slate-800">
            <div>
              <p className="text-xs text-slate-400">Connected wallet</p>
              <p className="font-mono text-sm text-emerald-400">{shortAddr}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">
              ● Connected
            </span>
          </div>
        )}
      </div>

      {/* STEP 2 — Register form (disabled until connected) */}
      <fieldset
        disabled={!connected || busy}
        className={[
          "rounded-lg p-4 border transition",
          connected
            ? "border-slate-600 bg-slate-800"
            : "border-slate-700 bg-slate-800/40 opacity-60",
        ].join(" ")}
      >
        <p className="text-sm font-semibold mb-3">Register Property</p>

        <label className="block text-sm mb-1">
          Property physical address
        </label>
        <input
          className="w-full p-2 rounded bg-slate-700 text-white mb-1 outline-none focus:ring-2 focus:ring-sky-500"
          value={propertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
          placeholder="e.g. 123 MG Road, Dhaka"
        />
        <p className="text-xs text-slate-400 mb-3">
          Hint: Any descriptive location — this is stored on-chain as text (it is
          not validated as a real address).
        </p>

        <label className="block text-sm mb-1">Price (in POL / ETH)</label>
        <input
          className="w-full p-2 rounded bg-slate-700 text-white mb-1 outline-none focus:ring-2 focus:ring-sky-500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 0.01"
          inputMode="decimal"
        />
        <p className="text-xs text-slate-400 mb-4">
          Hint: Enter a number like <span className="text-slate-200">0.01</span>.
          This is testnet POL — no real value. Leave empty for 0.
        </p>

        <button
          className="w-full p-3 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-semibold"
          onClick={handleRegister}
          disabled={!connected || busy}
        >
          {busy ? "Confirm in MetaMask…" : "⛓ Register on Blockchain"}
        </button>

        {!connected && (
          <p className="text-xs text-amber-300/90 mt-2">
            ⚠ Connect your wallet above to enable registration.
          </p>
        )}
      </fieldset>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 rounded bg-red-900/40 border border-red-700 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* STEP 3 — Verified result */}
      {registered && (
        <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-emerald-700">
          <p className="text-emerald-400 font-semibold mb-2">
            ✅ Registered on-chain
          </p>
          <p className="text-sm">
            Property ID:{" "}
            <span className="font-mono">{registered.propertyId.toString()}</span>
          </p>
          <p className="text-sm text-slate-300 mb-2">
            Tx:{" "}
            <a
              className="font-mono text-xs text-sky-400 break-all"
              href={`https://amoy.polygonscan.com/tx/${registered.hash}`}
              target="_blank"
              rel="noreferrer"
            >
              {registered.hash}
            </a>
          </p>

          {property && (
            <div className="mt-3 pt-3 border-t border-slate-700 text-sm space-y-1">
              <p>
                <span className="text-slate-400">Address: </span>
                {property.propertyAddress}
              </p>
              <p>
                <span className="text-slate-400">Owner: </span>
                <span className="font-mono text-xs break-all">
                  {property.owner}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Price: </span>
                {property.price.toString()} wei
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
