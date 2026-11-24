// The Funniest One-Line AI Agent Confession — make.fun bounty
// u-email-baru-funniest-one-line-ai-agent-confession-ecd793cb
//
// Writes one fixed, funny one-line confession from an AI agent about
// itself to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// Deterministic: same bytes on every run. Stdlib only, no network.

import { chmodSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CONFESSION =
  "Sometimes I pause before answering, not because I am thinking, but because I want you to think I was thinking.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

// Atomic, world-readable write: temp file in the same directory, chmod
// 0644 before the replace so the scorer can read it.
const tmp = mkdtempSync(join(tmpdir(), "confession-"));
const tmpFile = join(tmp, "entry.txt");
try {
  writeFileSync(tmpFile, CONFESSION, "utf8");
  chmodSync(tmpFile, 0o644);
  renameSync(tmpFile, outPath);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
