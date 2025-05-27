// scripts/wait-for-program.ts
import { Connection, PublicKey } from "@solana/web3.js";
import { readFileSync } from "fs";
import path from "path";

const PROGRAM_NAME = "ci_proof_core";
const PROGRAM_LOG_IDENTIFIER = "Program log: Hello, world!";
const MAX_ATTEMPTS = 60;
const INTERVAL_MS = 1000;

async function waitForProgram(): Promise<void> {
  const anchorToml = readFileSync(path.join("Anchor.toml"), "utf8");
  const match = anchorToml.match(new RegExp(`${PROGRAM_NAME}\\s*=\\s*"([^"]+)"`));
  if (!match) throw new Error(`Could not find ${PROGRAM_NAME} in Anchor.toml`);
  const programId = new PublicKey(match[1]);

  const connection = new Connection("http://localhost:8899", "confirmed");
  let found = false;

  console.log(`🔍 Waiting for program ${programId.toBase58()} to emit log: "${PROGRAM_LOG_IDENTIFIER}"`);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const sigs = await connection.getSignaturesForAddress(programId, { limit: 5 });
    for (const sig of sigs) {
      const tx = await connection.getTransaction(sig.signature, { commitment: "confirmed" });
      if (tx?.meta?.logMessages?.some(log => log.includes(PROGRAM_LOG_IDENTIFIER))) {
        console.log(`✅ Found matching log in transaction: ${sig.signature}`);
        found = true;
        break;
      }
    }
    if (found) break;
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }

  if (!found) {
    throw new Error(`❌ Timed out waiting for "${PROGRAM_LOG_IDENTIFIER}" from ${programId.toBase58()}`);
  }
}

waitForProgram().catch((err) => {
  console.error(err);
  process.exit(1);
});
