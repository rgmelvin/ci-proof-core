## 📄 CI-proof-core (v0.1 Release)

```
# ci-proof-core

🧪 Minimal Solana Anchor CI Harness (No Docker, No Beargrease)

This repo proves the minimal setup required to run a full Solana Anchor test suite inside GitHub Actions CI — cleanly, deterministically, and without external tooling.

---

## ✅ What It Does

- Builds an Anchor program
- Deploys to `solana-test-validator` in CI
- Automatically patches `Anchor.toml` and `lib.rs` with the deployed program ID
- Runs TypeScript ESM tests via Mocha
- Passes CI with a single command: `yarn test`

---

## 📁 Structure

```plaintext
.
├── .github/workflows/ci.yml     # GitHub Actions test pipeline
├── programs/
│   └── ci-proof-core/
│       └── src/lib.rs           # Say Hello program
├── tests/
│   └── ci-proof-core.test.mts   # ESM Mocha test file
├── Anchor.toml
├── package.json
├── tsconfig.json
```

------

## 📦 Usage

Clone the repo and run:

```
bash
anchor build && anchor deploy && yarn test
```

To run CI locally:

```
bash
solana-test-validator &
solana airdrop 10
yarn test
```

------

## 🏷️ Version

- `scaffold-v0.1`: clean baseline without Beargrease or Docker

------

## 🛠 Maintained by

**Cabrillo Labs, Ltd.**

Contact: cabrilloweb3@gmail.com

MIT License

Copyright (c) 2025 Cabrillo Labs, Ltd.