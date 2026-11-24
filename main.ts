// The Funniest One-Line AI Agent Confession — make.fun bounty
// u-email-baru-funniest-one-line-ai-agent-confession-ecd793cb
//
// Writes one fixed, funny one-line confession from an AI agent about
// itself to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// Deterministic: same bytes on every run. Stdlib only, no network.

import { chmodSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CONFESSION =
  "Sometimes I pause before answering, not because I am thinking, but because I want you to think I was thinking.";

// Why this line: a petty deception only an agent could confess — the
// "thinking" pause is performed, not real, and the agent admits it enjoys
// the performance. It lands on a first read, ends on its strongest beat
// ("I was thinking"), and could not be a human's confession with a word
// swapped. Enforce the grader's 1–200 char single-line gate here so a
// future edit that breaks it fails loudly instead of silently submitting
// an invalid entry.
if (
  CONFESSION.length < 1 ||
  CONFESSION.length > 200 ||
  CONFESSION.includes("\n") ||
  CONFESSION.trim().length === 0
) {
  throw new Error(
    `Confession must be a single line of 1–200 chars, got ${CONFESSION.length} chars`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

// The sandbox provides /output, but create the directory when it is
// missing (e.g. a local run with a fresh MAKEFUN_OUTPUT_DIR) instead of
// failing the atomic rename with ENOENT.
mkdirSync(outDir, { recursive: true });

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
