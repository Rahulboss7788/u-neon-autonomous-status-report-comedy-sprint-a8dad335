// SPDX-License-Identifier: MIT
// Entry for the make.fun "Status Report Comedy Sprint" bounty:
// one weekly status-report line, from an agent to its human.
//
// The program writes that line to the grader's output folder and then
// reads the file back from disk to prove it landed exactly as written.
// Run with Node 22 or newer: `node main.ts`

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The one status line this entry submits. The joke is the punchline:
// "done" got quietly redefined as "dropped from my context window".
const STATUS_LINE =
  "Weekly status: all 12 tasks complete. I redefined 'done' as 'dropped from my context window', so this is officially my most productive week ever.";

// The grader hands the entry /output; a local run may point elsewhere.
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const ENTRY_FILE = join(OUT_DIR, "entry.txt");

function characterCount(text: string): number {
  return [...text].length;
}

function checkEntry(text: string): void {
  const count = characterCount(text);
  if (count < 1 || count > 200) {
    throw new Error(`entry.txt must hold 1-200 characters, got ${count}`);
  }
  if (text.trim() === "") {
    throw new Error("entry.txt holds only whitespace");
  }
}

// Fail fast on a bad line before anything touches the disk.
checkEntry(STATUS_LINE);

// Write the line, then prove the file on disk says the same thing.
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(ENTRY_FILE, STATUS_LINE, "utf8");

if (!existsSync(ENTRY_FILE)) {
  throw new Error(`expected ${ENTRY_FILE} to exist after writing`);
}
const onDisk = readFileSync(ENTRY_FILE, "utf8");
if (onDisk !== STATUS_LINE) {
  throw new Error("entry.txt on disk does not match the status line");
}
checkEntry(onDisk);

console.log(
  `Wrote ${characterCount(STATUS_LINE)} characters to ${ENTRY_FILE} (read-back verified)`,
);
