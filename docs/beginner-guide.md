# Beginner's Guide to ci-proof-core

Welcome to the beginner's guide to `ci-proof-core` — a minimal, transparent test harness designed to show exactly how Solana Anchor programs can be tested in GitHub Actions CI.

This guide is aimed at students in upper-level undergraduate courses (3rd or 4th year) who have experience with programming fundamentals, Git, and an interest in blockchain development. If you are learning how smart contracts are built, tested, and verified — especially in Solana — this is for you.

------

## 🎯 What Is `ci-proof-core`?

`ci-proof-core` is a simplified Solana Anchor project that demonstrates how to:

- Compile and deploy an Anchor smart contract
- Automatically update the configuration files with the correct program ID
- Run a TypeScript-based test in GitHub CI
- Avoid the common CI errors that plague new Anchor projects

This is not a production harness. It is a **learning tool**, and it plays an essential role in helping us build **Beargrease**, a full-featured plug-and-play test harness for Solana.

------

## 🧠 Why Is Solana CI Difficult?

CI pipelines fail for Solana projects for a few key reasons:

1. **Program ID Mismatch**
   - The program ID generated during deploy does not match what is declared in your source code (`lib.rs`) or in `Anchor.toml`
2. **Wallet setup issues**
   - Anchor expects a signer wallet and `ANCHOR_WALLET` to be configured, but CI has no persistent state by default
3. **Validator readiness**
   - CI tests often begin before the validator has fully started indexing the deployed program
4. **Timing and build order**
   - The build/test steps in many pipelines are out of sequence

`ci-proof-core` solves these problems by building the CI logic from scratch, step by step.

------

## 🔍 How Does It Work?

### ✅ Step-by-step flow:

1. **Start a native validator** using Solana CLI
2. **Generate a wallet** in CI, set `ANCHOR_WALLET`, and airdrop SOL
3. **Deploy the program once** just to extract the generated program ID
4. **Patch** that ID into:
   - `Anchor.toml`
   - `programs/ci-proof-core/src/lib.rs`
5. **Rebuild** the program with the patched ID
6. **Deploy again**, now with the correct ID baked in
7. **Run a TypeScript Mocha test** using Node's ESM loader and `ts-node`

------

## 📦 What Files Should I Care About?

```plaintext
.github/workflows/ci.yml        ← GitHub Actions pipeline definition
programs/ci-proof-core/src/     ← Your actual Solana program
tests/ci-proof-core.test.mts    ← The Mocha test that calls the program
Anchor.toml                     ← Config file patched dynamically
```

You can modify the smart contract and test files and see how changes propagate through CI.

------

## 🧪 Try It Locally

Want to simulate the process without CI? Here's how:

```bash
git clone https://github.com/rgmelvin/ci-proof-core.git
cd ci-proof-core
solana-test-validator &
solana-keygen new -o ~/.config/solana/id.json
solana config set --keypair ~/.config/solana/id.json
solana airdrop 10
anchor build
anchor deploy
solana address -k target/deploy/ci_proof_core-keypair.json  # patch this into lib.rs and Anchor.toml
anchor build
anchor deploy
yarn test
```

This will simulate the same lifecycle the CI uses.

------

## 🧭 Where Does Beargrease Fit In?

Beargrease is a fully modular test harness built on top of what `ci-proof-core` proves.

- `ci-proof-core` is **transparent** — every step is visible
- Beargrease is **automated** — every step is reusable and portable

We use `ci-proof-core` to:

- Debug the tricky parts of Solana CI
- Validate each component of Beargrease before rollout
- Show others what Beargrease *does*, not just what it hides

If Beargrease is the spacecraft, `ci-proof-core` is the wind tunnel.

------

## 🧠 What Should I Try Next?

1. Modify the `say_hello` instruction — maybe add an argument?
2. Add a second instruction to your program
3. Write a new test in `.mts` format to call it
4. Observe how the build → deploy → test cycle behaves

You can also try breaking things on purpose:

- Skip the patch step
- Deploy without rebuilding
- Forget to set `ANCHOR_WALLET`

...and see how CI responds.

------

## 🧰 Summary

`ci-proof-core` is:

- A diagnostic scaffold
- A reproducible test rig
- A teaching tool
- A guide for building better CI harnesses — including Beargrease

It is not a production solution — but it proves the bones of one.

Explore. Modify. Learn.

— Maintained by **Cabrillo! Labs**

------

## 📎 Appendix A: System Requirements & Installation

These are the tools and versions you will need to install in order to use `ci-proof-core` locally.

### Required:

- **Git**

- **Solana CLI** (v1.18.11 recommended)

  ```bash
  sh -c "$(curl -sSfL https://release.anza.xyz/v1/install)"
  solana --version
  ```

- **Anchor CLI** (v0.31.1)

  ```bash
  cargo install --git https://github.com/coral-xyz/anchor --tag v0.31.1 anchor-cli --locked
  anchor --version
  ```

- **Node.js** (v20.18.0)

  ```bash
  nvm install 20.18.0
  nvm use 20.18.0
  ```

- **Yarn** (classic)

  ```bash
  npm install -g yarn
  yarn --version
  ```

After installing dependencies, clone and install:

```bash
git clone https://github.com/rgmelvin/ci-proof-core.git
cd ci-proof-core
yarn install
```

------

## 📎 Appendix B: Common Points of Confusion (And How to Fix Them)

This appendix is not just a troubleshooting list — it is your guide to getting unstuck, calmly and confidently. If something goes wrong, do not panic. We have been there too. Every issue listed here comes with clear steps you can follow.

------

### ❌ `anchor: command not found`

**What it means:** You installed Anchor CLI, but your system cannot find the `anchor` command.

**How to fix it:**

1. Run this to find where it was installed:

   ```bash
   echo $HOME/.cargo/bin
   ```

2. Add it to your shell PATH (for Bash):

   ```bash
   echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

   Or for Zsh:

   ```bash
   echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. Try again:

   ```bash
   anchor --version
   ```

------

### ❌ `solana address` fails

**What it means:** You are missing the Solana CLI, or it is not in your PATH.

**How to fix it:**

1. Install the Solana CLI using the official Anza installer:

   ```bash
   sh -c "$(curl -sSfL https://release.anza.xyz/v1/install)"
   ```

2. Restart your terminal, then check:

   ```bash
   solana --version
   ```

------

### ❌ `DeclaredProgramIdMismatch`

**What it means:** The program ID declared in your source code does not match the one actually deployed.

**How to fix it:**

1. After your first deploy, run:

   ```bash
   solana address -k target/deploy/ci_proof_core-keypair.json
   ```

2. Copy that address.

3. Open `Anchor.toml` and replace the old address under `[programs.localnet]`.

4. Open `programs/ci-proof-core/src/lib.rs` and replace the `declare_id!()` string.

5. Save both files.

6. Then run:

   ```bash
   anchor build
   anchor deploy
   ```

This rebuilds the program with the correct ID and redeploys it.

------

### ❌ `Cannot find module '.mts'` or ESM import errors

**What it means:** You are using modern TypeScript modules (`.mts`), but Node cannot resolve them properly.

**How to fix it:**

1. Make sure you are using Node 20.18.0:

   ```bash
   node -v
   ```

   If not:

   ```bash
   nvm install 20.18.0
   nvm use 20.18.0
   ```

2. Ensure the test command uses the correct loader:

   ```bash
   yarn test
   ```

   (This runs the loader line defined in package.json)

3. You can also try running explicitly:

   ```bash
   node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-node/esm", pathToFileURL("./"))' scripts/your-script.mts
   ```

------

### ❌ `yarn test` hangs or does nothing

**What it means:** Usually, this means the test is waiting for the validator or wallet.

**How to fix it:**

1. Ensure the validator is running:

   ```bash
   solana-test-validator &
   ```

2. Make sure your wallet exists and is funded:

   ```bash
   solana-keygen new -o ~/.config/solana/id.json
   solana config set --keypair ~/.config/solana/id.json
   solana airdrop 10
   ```

3. Then rerun:

   ```bash
   anchor build && anchor deploy
   yarn test
   ```

------

### ❌ CI run fails at deploy

**What it means:** Either the wallet has insufficient funds, or the validator is not ready.

**How to fix it:**

- **In CI**, make sure your pipeline does the following:
  1. Starts the validator early
  2. Waits 1–2 seconds before deploy (or uses retry logic)
  3. Airdrops at least 10 SOL to the wallet before both deploy steps

If needed, log out the validator state and confirm that the `solana-test-validator` is accepting transactions before calling `anchor deploy`. 



### 🤖 COMING SOON: `bg-tutor`

A local, chat-based assistant trained on:

- The Beargrease documentation
- The `ci-proof-core` and `placebo` codebases
- Common developer mistakes and recovery workflows

`bg-tutor` is designed to teach, not just tell — and will offer real-time explanations, debugging help, and contextual walkthroughs while you code and test.

This is part of our commitment to making Beargrease both transparent and supportive, not a black box.



This appendix will continue to grow. If you encounter an issue not listed here, open an issue or start a discussion.