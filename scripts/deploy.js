const fs = require("fs");
const path = require("path");

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

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying PropertyRegistry with:", deployer.address);

  const Factory = await hre.ethers.getContractFactory("PropertyRegistry");
  const registry = await Factory.deploy();
  await registry.deployed();

  console.log("PropertyRegistry deployed to:", registry.address);
  console.log("Set VITE_CONTRACT_ADDRESS=" + registry.address + " in frontend/.env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
