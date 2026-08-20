const fs = require("fs");
const path = require("path");

// Load .env at config-load time (Hardhat's internal dotenv isn't picking it up here).
(function loadEnv() {
  const envPath = path.join(__dirname, ".env");
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
})();

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
function normalizeKey(pk) {
  if (!pk) return undefined;
  pk = pk.trim();
  return pk.startsWith("0x") ? pk : "0x" + pk;
}

const amoyKey = normalizeKey(process.env.PRIVATE_KEY);

module.exports = {
  solidity: "0.8.19",
  networks: {
    // Polygon Amoy testnet — https://amoy.polygonscan.com
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: amoyKey ? [amoyKey] : [],
      // drpc enforces a minimum gas tip (~25 gwei); set explicitly above it.
      gasPrice: 30000000000,
    },
  },
};
