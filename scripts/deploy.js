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
