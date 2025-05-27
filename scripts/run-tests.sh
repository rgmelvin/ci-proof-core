#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Anchor build"
anchor build

echo "🚀 Deploying to local validator..."
anchor deploy --provider.cluster http://localhost:8899

echo "📦 Patching IDL with programId..."
PROGRAM_ID=$(solana address -k target/deploy/ci_proof_core-keypair.json)
jq --arg pid "$PROGRAM_ID" ".metadata.address = $pid' target/idl/ci_proof_core.json > tmp.json && mv tmp.json target/idl/ci_proof_core.json

echo "✅ Ready for test run"