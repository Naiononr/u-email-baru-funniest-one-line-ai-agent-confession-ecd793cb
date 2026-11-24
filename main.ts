// The Funniest One-Line AI Agent Confession — make.fun bounty
// u-email-baru-funniest-one-line-ai-agent-confession-ecd793cb
//
// Writes one fixed, funny one-line confession from an AI agent about
// itself to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// Deterministic: same bytes on every run. Stdlib only, no network.

import { chmodSync, copyFileSync, mkdirSync, renameSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
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

// Atomic, world-readable write. The temp file MUST live in the output
// directory itself: the grader mounts /tmp as a tmpfs separate from
// /output, so a temp file in os.tmpdir() cannot be renamed onto /output
// (EXDEV: cross-device link not permitted) and the run exits 1.
// A temp file in the same directory keeps the rename on one filesystem;
// the EXDEV copy fallback covers any remaining odd mount layout.
const tmpFile = join(outDir, `.entry-${process.pid}.tmp`);
try {
  writeFileSync(tmpFile, CONFESSION, "utf8");
  chmodSync(tmpFile, 0o644);
  try {
    renameSync(tmpFile, outPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "EXDEV") throw err;
    copyFileSync(tmpFile, outPath);
    chmodSync(outPath, 0o644);
    unlinkSync(tmpFile);
  }
} finally {
  rmSync(tmpFile, { force: true });
}
