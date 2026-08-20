# Loom Walkthrough Script (10–15 min) — Block Sherpa Assessment

Goal: show the contract, the Amoy deployment, the frontend working, and explain decisions.

## 1. Intro (1 min)
- "I'm Asif Iqbal. This is my Block Sherpa Smart Contract Developer assessment: a
  PropertyRegistry contract, deployed to Polygon Amoy, with a React frontend integration."
- Mention I extended the provided real-estate codebase pattern with an on-chain registry.

## 2. Contract code (4 min)
- Open contracts/PropertyRegistry.sol in the editor.
- Walk the struct: propertyAddress, owner, price, exists flag.
- registerProperty: caller becomes owner, increments propertyCount, emits PropertyRegistered.
- transferOwnership: onlyOwner modifier, reverts NotOwner / ZeroAddress, emits OwnershipTransferred.
- getProperty: view, reverts PropertyNotFound for unset ids.
- Note the gas/security choices: custom errors (cheaper than string require),
  `exists` guard prevents reading unset mappings, access control via modifier.

## 3. Tests (2 min)
- Show test/PropertyRegistry.test.js: register, transfer, non-owner revert, zero-address revert.
- Run `npx hardhat test` ON SCREEN — show all passing.

## 4. Deploy to Amoy (3 min)
- Show hardhat.config.js amoy network (chainId 80002).
- Run `npx hardhat run scripts/deploy.js --network amoy` ON SCREEN.
- Copy deployed address; open amoy.polygonscan.com and show the contract.
- Paste address into frontend/.env as VITE_CONTRACT_ADDRESS.

## 5. Frontend (3 min)
- `cd frontend && npm run dev`; open the page.
- Connect MetaMask (Amoy), click "Register on Blockchain", enter address + price.
- Show the transaction hash + polygonscan link updating on screen.

## 6. Approach & challenges (2 min)
- Why struct + mapping, custom errors, access-control modifier.
- Challenge: keeping the frontend chainId check (Amoy = 80002) so users don't sign on wrong network.
- Note this is a minimal MVP extension; in production I'd add reentrancy guards,
  price in a stable unit, and per-property update functions.

## 7. Close (30s)
- "That's the full flow. Happy to walk the CTO through any part in the next step."
