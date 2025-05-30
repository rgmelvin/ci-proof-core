# ci-proof-core

🔪 Minimal Working Solana Anchor CI (No Docker, No Beargrease)

This repo proves the minimal setup required to run a full Solana Anchor test suite inside GitHub Actions CI — cleanly, deterministically, and without external tooling.

------

## ✅ What It Does

- Builds an Anchor program
- Deploys to `solana-test-validator` in CI
- Automatically patches `Anchor.toml` and `lib.rs` with the deployed program ID
- Runs TypeScript ESM tests via Mocha using `ts-node`in `NodeNext` mode
- Passes CI with a single command: `yarn test`

------

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

## 🛠️ How It Works

### 1. CI starts a native validator:

```yaml
solana-test-validator &
```

This uses the system’s Solana CLI — no Docker needed.

### 2. CI creates and funds a wallet:

```yaml
solana-keygen new --no-bip39-passphrase -o ~/.config/solana/id.json
solana config set --keypair ~/.config/solana/id.json
solana airdrop 10
```

This wallet is used to deploy and test the program.

### 3. CI deploys the Anchor program:

```yaml
anchor deploy
```

This writes `target/deploy/ci_proof_core-keypair.json`, which contains the actual deployed program ID.

### 4. CI patches the deployed ID into:

- `Anchor.toml`
- `programs/ci-proof-core/src/lib.rs`

Example line patched:

```toml
ci_proof_core = "8cZtsmjcEvh6UMU6ZzBpGEmL1hjxetEsH2U9cQiHeYiE"
```

and

```rust
declare_id!("8cZtsmjcEvh6UMU6ZzBpGEmL1hjxetEsH2U9cQiHeYiE");
```

### 5. CI rebuilds and redeploys:

```yaml
anchor build
anchor deploy
```

Now the `.so` file matches the correct ID.

### 6. CI runs the test suite:

```bash
yarn test --exit
```

This calls the `say_hello` instruction and verifies the program logs.

Example output:

```bash
✅  Transaction signature: ...
✔ calls say_hello (348ms)
```

------

## 📦 How to Use This Scaffold

1. Clone the repo:

```bash
git clone https://github.com/rgmelvin/ci-proof-core.git
cd ci-proof-core
```

1. Run locally:

```bash
solana-test-validator &
solana airdrop 10
anchor build && anchor deploy
yarn test
```

1. Modify the program in `src/lib.rs`
2. Add your own test in `tests/*.test.mts`

   For more details on running CI-Proof-Core, see the [Beginner's Guide to ci-proof-core](https://github.com/rgmelvin/ci-proof-core/blob/main/docs/beginner-guide.md) for full instructions on running tests, understanding structure, and modifying the program.



------

## 🧭 How This Relates to Beargrease

`ci-proof-core` is a **transparent diagnostic harness**, not a Beargrease replacement.

It was built to:

- Prove exactly what Beargrease must do under the hood
- Expose each failure point (wallets, program ID, timing, build order)
- Serve as a teaching and debugging tool

Beargrease remains the goal:

- Plug-and-play
- Portable
- Fully automated and reusable across multiple Anchor projects

We will use `ci-proof-core` to incrementally reintroduce Beargrease modules, verifying correctness at every step. Future Beargrease updates will refer to this scaffold for clarity and reproducibility.
This scaffold serves as the controlled environment for testing Beargrease’s new [Directory Checkout Mode](https://github.com/rgmelvin/beargrease-by-Cabrillo!) introduced in v1.1.0. Any new module, patch, or CI flow in Beargrease must prove itself here before upstreaming.


------

## 🧪 Known-Good Configuration

- Solana CLI v1.18.11
- Anchor CLI v0.31.1
- Node.js v20.18.0 (as used in GitHub Actions runner)
- Yarn v1.22.22
- TypeScript + Mocha using ESM (`.mts`) and `ts-node`

------

## 🔐 Security Scope and Disclaimer

This repository is a **conceptual proof**—not a production-hardened implementation.

The CI pipeline and test harness here are intended to demonstrate a clean, fully working flow for:

- Building and deploying Anchor programs in CI
- Dynamically patching program IDs
- Running Mocha-based ESM tests against a local `solana-test-validator`

While it uses best practices for dependency management, permission scoping, and workflow hygiene, **it does not include**:

- Container isolation for validator sandboxing
- Secret rotation or hardened credential management
- Runtime validation of Solana program logic or test results beyond the included assertions
- Audit-ready controls for production deployment pipelines

This project is published under the MIT License and provided *as-is*, without warranty. It is meant for education, experimentation, and as a foundation for building more robust systems—like the upcoming Beargrease harness, which will include:

- Pluggable security modules
- CI credential sandboxing
- Verifiable test isolation
- Portable and standardized workflows for team use

If you use this scaffold in a real-world system, please **audit your changes carefully**, and do not treat it as a drop-in production pipeline without further hardening.

---

## 🌟 Version

- `scaffold-v0.1`: clean baseline without Beargrease or Docker

------

## 🔧 Maintained by

**Cabrillo! Labs**
 Contact: [cabrilloweb3@gmail.com](mailto:cabrilloweb3@gmail.com)

------

## 📜 License

MIT – see [MIT License](https://github.com/rgmelvin/ci-proof-core/blob/main/LICENSE)
