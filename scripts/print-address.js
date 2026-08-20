const fs = require("fs");
const path = require("path");

// Minimal .env loader (node_modules dotenv isn't exposed outside Hardhat's toolbox).
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnv();

let pk = process.env.PRIVATE_KEY;
if (!pk) {
  console.error("✗ PRIVATE_KEY is not set in the root .env");
  console.error("  Add PRIVATE_KEY=... (64 hex chars, with or without 0x) in .env, then re-run.");
  process.exit(1);
}
pk = pk.trim();
if (!pk.startsWith("0x")) pk = "0x" + pk;
if (!/^0x[0-9a-fA-F]{64}$/.test(pk)) {
  console.error("✗ PRIVATE_KEY is invalid in the root .env (expected 64 hex chars).");
  process.exit(1);
}

const { ethers } = require("hardhat");
const wallet = new ethers.Wallet(pk);
console.log("Fund this Polygon Amoy testnet address at the faucet:");
console.log("  " + wallet.address);
console.log("Faucet: https://faucet.polygon.technology  (select 'Polygon Amoy')");
