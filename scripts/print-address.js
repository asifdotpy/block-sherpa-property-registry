const { ethers } = require("hardhat");

const pk = process.env.PRIVATE_KEY;
if (!pk || !pk.startsWith("0x") || pk.length !== 66) {
  console.error("✗ PRIVATE_KEY is not set or invalid in the root .env");
  console.error("  Set PRIVATE_KEY=0x... (64 hex chars) in .env, then re-run.");
  process.exit(1);
}

const wallet = new ethers.Wallet(pk);
console.log("Fund this Polygon Amoy testnet address at the faucet:");
console.log("  " + wallet.address);
console.log("Faucet: https://faucet.polygon.technology  (select 'Polygon Amoy')");
