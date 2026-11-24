// news-image-20261123 — "The World in One Day" (Monday 23 November 2026).
// Copies the pre-rendered poster (entry.png, next to this file) to the
// make.fun output directory. No network, no randomness: the output is a
// byte-for-byte copy of the bundled image, so two runs are identical.
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576; // 1 MiB

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

if (!existsSync(source)) {
  throw new Error(`entry.png not found next to main.ts: ${source}`);
}

const size = statSync(source).size;
if (size > MAX_BYTES) {
  throw new Error(`entry.png is ${size} bytes, over the 1 MiB limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.png");
copyFileSync(source, dest);

// Second pass: confirm the copy landed byte-identical in size.
const copied = statSync(dest).size;
if (copied !== size) {
  throw new Error(`copy mismatch: wrote ${copied} bytes, expected ${size}`);
}
console.log(`wrote ${dest} (${size} bytes)`);
