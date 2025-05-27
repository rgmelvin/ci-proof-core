import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import {readFileSync } from "fs";
import path from "path";
import { assert } from "chai";

// ESM-compatible _dirname shim
const _dirname = path.dirname(new URL(import.meta.url).pathname);

// Load IDL
const idlPath = path.resolve(_dirname, "../target/idl/ci_proof_core.json");
const idl = JSON.parse(readFileSync(idlPath, "utf8"));

// Ensure programId is present
const programId = idl?.address;
if (!programId) {
    throw new Error("❌ IDL is missing program address");
}

describe("ci-proof-core", () => {
    const provider = AnchorProvider.env();
    setProvider(provider);

    // Use embeded address in IDL (Anchor v0.31.1+)
    const program = new Program(idl, provider);

    it("calls say_hello", async () => {
        const sig = await program.methods.sayHello().rpc();
        assert.ok(sig);
        console.log("✅  Transaction signature:", sig);
    });
});