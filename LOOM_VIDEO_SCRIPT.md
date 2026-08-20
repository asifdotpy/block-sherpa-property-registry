# Block Sherpa Assessment — Full Loom Video Script (word-for-word + navigation)

How to use this: The **SPOKEN** lines are what you say (read them naturally, not
like a robot). The **» ON SCREEN** lines are the click/navigation actions — do
them as you say the line above. Total runtime target: 10–15 min.

Pre-flight (do OFF camera, before you hit record):
- MetaMask: custom network "Polygon Amoy (drpc)" — RPC
  https://polygon-amoy.drpc.org, chainId 80002, symbol POL. Selected.
- Funded account 0x30c2b87424F8A5a621D4729Be348733d7Bf81281 shows ~0.1 POL.
- Terminal: `cd ~/career/applications/blocksherpa-pet360/assessment/frontend`
  then `npm run dev`. Keep the localhost tab open (don't record yet).
- Editor open at the assessment folder. Loom capturing screen + your voice.

────────────────────────────────────────
## 1. Intro — 0:00–1:00  (1 min)
────────────────────────────────────────

SPOKEN:
"Hi, I'm Asif Iqbal. This is my submission for the Block Sherpa Senior Smart
Contract Developer assessment. The task was to build a Property Registry smart
contract, deploy it to Polygon Amoy testnet, and integrate it with a frontend.
I extended the supplied real-estate platform pattern with an on-chain registry
that records each property's physical address, owner, and price — with proper
access control and events. Let me walk you through the contract, the tests, the
live deployment, and the working frontend."

» ON SCREEN: Loom is recording. Show your face briefly, then the folder in editor.

────────────────────────────────────────
## 2. Contract code — 1:00–5:00  (4 min)
────────────────────────────────────────

SPOKEN (open the file as you talk):
"Here's the contract — contracts/PropertyRegistry.sol. It's a single, focused
contract, Solidity 0.8.19."

» ON SCREEN: Open contracts/PropertyRegistry.sol in the editor. Scroll to top.

SPOKEN:
"At the storage layer I use a struct — Property — with four fields: the
physical address as a string, the current owner, the price as a uint256, and an
'exists' boolean flag. The flag matters: it lets me distinguish a property that
was never registered from one at id zero. Properties live in a private mapping
keyed by a uint256 id, and a public propertyCount tracks how many exist."

» ON SCREEN: Highlight the struct block (lines ~12–17) and the mapping (line 23).

SPOKEN:
"The core function is registerProperty. The caller becomes the owner, the id
auto-increments from propertyCount, the struct is stored, and I emit a
PropertyRegistered event carrying the new id, address, owner, and price. The
function returns the new id so off-chain code — like my frontend — can read
exactly which id was just created."

» ON SCREEN: Highlight registerProperty (lines ~65–77).

SPOKEN:
"transferOwnership is guarded by an onlyOwner modifier — only the current owner
can move it. I use custom errors, NotOwner and ZeroAddress, instead of string
requires, because custom errors are cheaper on gas and give the caller a precise
reason. Zero-address transfers are rejected. And it emits OwnershipTransferred."

» ON SCREEN: Highlight the onlyOwner modifier (50–55) and transferOwnership (81–89).

SPOKEN:
"Finally getProperty is a view function that returns the three fields. It
reverts with PropertyNotFound if the id was never registered — that's the
'exists' guard in action. No reading garbage from unset mappings."

» ON SCREEN: Highlight getProperty (96–104).

────────────────────────────────────────
## 3. Tests — 5:00–7:00  (2 min)
────────────────────────────────────────

SPOKEN:
"I wrote Hardhat tests covering the happy paths and the failure paths. Four
cases: a property registers, ownership transfers, a non-owner transfer reverts,
and a zero-address transfer reverts. Let me run them."

» ON SCREEN: Open test/PropertyRegistry.test.js. Show the four `it(...)` blocks.

SPOKEN:
"Run it."

» ON SCREEN: In terminal at the assessment root, run: `npx hardhat test`
Wait for the green checks. (If you re-ran dev server in another tab, make sure
this terminal is at the assessment ROOT, not frontend/.)

SPOKEN (once passing):
"All four pass — registration, transfer, and both revert cases."

» ON SCREEN: Loom shows "4 passing".

────────────────────────────────────────
## 4. Deployment — already live — 7:00–9:00  (2 min)
────────────────────────────────────────

SPOKEN:
"For deployment I configured the Amoy network in hardhat.config.js — chainId
80002, the drpc RPC, and an explicit gasPrice floor because that node enforces a
minimum tip. I already deployed this with `npx hardhat run scripts/deploy.js
--network amoy`, so rather than redeploy on camera, let me show you the live
contract on the explorer."

» ON SCREEN: Open hardhat.config.js, point at the amoy block (url, chainId 80002,
gasPrice 30000000000).

SPOKEN:
"Here it is on Amoy Polygonscan — contract 0xB38ba7A2892F5014aF1f4a1446Fb7D62630b32B4.
You can see it has deployed bytecode, so it's live on testnet. The address is
already wired into the frontend's environment file."

» ON SCREEN: Open https://amoy.polygonscan.com/address/0xB38ba7A2892F5014aF1f4a1446Fb7D62630b32B4
Show the "Contract" / bytecode present. Then open frontend/.env and show
VITE_CONTRACT_ADDRESS=0xB38ba7A2892F5014aF1f4a1446Fb7D62630b32B4.

────────────────────────────────────────
## 5. Frontend — 3-step flow — 9:00–12:00  (3 min)
────────────────────────────────────────

SPOKEN:
"The frontend is a React, TypeScript, and Tailwind app using ethers v6. I built
it as a real Web3 dApp flow in three steps: connect, register, verified. The
form stays disabled with hints until the wallet connects — you don't sign
anything before you're connected."

» ON SCREEN: Switch to the localhost dev tab (npm run dev already running).

SPOKEN (Step 1):
"Step one — Connect Wallet. I click Connect."

» ON SCREEN: Click "🔌 Connect Wallet". Approve the connection prompt in MetaMask
(built-in Amoy/drpc network already selected).

SPOKEN:
"MetaMask approves, the address pill appears, and — importantly — the form
below unlocks. Before this it was greyed out with a hint telling the user to
connect first."

» ON SCREEN: Show the connected pill + the now-enabled form.

SPOKEN (Step 2):
"Step two — register. The hints tell the user what to enter: the address is
free-form text stored on-chain, and the price is a number like 0.01 in testnet
POL. I'll enter a sample property and a price, then click Register on Blockchain."

» ON SCREEN: Type in the address field (e.g. "123 MG Road, Dhaka") and price
"0.01". Click "⛓ Register on Blockchain".

SPOKEN:
"MetaMask asks me to confirm the transaction — this is a real signed tx to the
live contract."

» ON SCREEN: Approve the tx in MetaMask. Wait for "Confirm in MetaMask…" to clear.

SPOKEN (Step 3):
"Step three — verified. The panel shows the real property ID pulled from the
on-chain event, the transaction hash with a Polygonscan link, and the property
details read back from the contract — address, owner, and price. End to end,
connect, sign, verified on-chain."

» ON SCREEN: Show the Verified panel: Property ID, tx hash (click the link to
show polygonscan), and the address/owner/price read-back.

────────────────────────────────────────
## 6. Approach & challenges — 12:00–14:00  (2 min)
────────────────────────────────────────

SPOKEN:
"A few design notes. Struct-plus-mapping is the natural fit for keyed lookup by
id. Custom errors keep gas down and reverts precise. The onlyOwner modifier
centralizes access control instead of repeating checks. One real challenge:
MetaMask's built-in Polygon Amoy entry points at a dead RPC that just throws
'Check network connectivity' — so I added a custom network with a working RPC.
That's the kind of environment issue you hit in practice, not just in theory.
I also keep a chainId check in the frontend so users can't accidentally sign on
the wrong network. This is an MVP extension; in production I'd add reentrancy
guards, price in a stable unit, and update functions per property."

────────────────────────────────────────
## 7. Close — 14:00–14:30  (30s)
────────────────────────────────────────

SPOKEN:
"That's the full flow — contract on Amoy, tests green, frontend registering
against the live contract. Happy to walk the CTO through any part in the next
step. Thanks, Block Sherpa."

» ON SCREEN: Stop Loom recording. Copy the share link.

══════════════════════════════════════════
SUBMISSION (after recording)
══════════════════════════════════════════
Email: tech@blockcsherpa.dev
Subject (exact): Smart Contract Developer Test - Md Asif Iqbal
Body:
- Loom link
- Repo: https://github.com/asifdotpy/block-sherpa-property-registry
- Deployed contract: 0xB38ba7A2892F5014aF1f4a1446Fb7D62630b32B4
- 2–3 lines: "PropertyRegistry on Polygon Amoy (struct+mapping, only-owner
  transfer, custom errors, events). 4/4 Hardhat tests pass. React+ethers v6
  frontend with a connect-gated register flow talking to the live contract."
