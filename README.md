# Block Sherpa — Smart Contract Developer Assessment

**Candidate:** Md Asif Iqbal
**Task:** PropertyRegistry smart contract + Polygon Amoy integration + frontend

This repo is built to run inside a **GitHub Codespace** (Node 20 devcontainer) so the
exact environment is reproducible. Open it in a Codespace, or run locally with Node 20+.

## What's inside
- `contracts/PropertyRegistry.sol` — Solidity registry (register / transfer / view + events, access control)
- `test/PropertyRegistry.test.js` — Hardhat tests (registration, transfer, only-owner)
- `scripts/deploy.js` — deploy to Polygon Amoy
- `frontend/` — React + TypeScript + Tailwind + ethers.js UI (Register button + tx hash)
- `.devcontainer/` — Codespace config (auto-installs deps on create)

## Contract API
```
registerProperty(string _address, uint256 _price) -> uint256 propertyId   // caller becomes owner
transferOwnership(uint256 _propertyId, address _newOwner)                 // only owner
getProperty(uint256 _propertyId) view -> (string address, address owner, uint256 price)
Events: PropertyRegistered, OwnershipTransferred
```

## Run locally (or in Codespace)
```bash
# 1) Smart contract compile + test
npm install
npx hardhat compile
npx hardhat test

# 2) Frontend
cd frontend
npm install
cp .env.example .env          # set VITE_CONTRACT_ADDRESS after deploy
npm run dev
```

## Deploy to Polygon Amoy
```bash
export PRIVATE_KEY="0xYOUR_TEST_WALLET_PRIVATE_KEY"   # Amoy testnet ONLY
export AMOY_RPC_URL="https://rpc-amoy.polygon.technology"
npx hardhat run scripts/deploy.js --network amoy
# copy printed address into frontend/.env as VITE_CONTRACT_ADDRESS
```
Get Amoy testnet POL from the Polygon Faucet: https://faucet.polygon.technology
Add Polygon Amoy to MetaMask: chainId 80002, RPC https://rpc-amoy.polygon.technology.

## Deliverable
Record a 10–15 min Loom walking through: contract code → Amoy deployment → frontend
working → approach + challenges. Send the link to **tech@blockcsherpa.dev** with
subject **"Smart Contract Developer Test - Md Asif Iqbal"**.
