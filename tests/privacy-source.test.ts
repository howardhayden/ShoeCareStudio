import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(path);
      return /\.(css|ts|tsx)$/.test(entry.name) ? [path] : [];
    }),
  );
  return nested.flat();
}

test("client source excludes persistence, transport, trackers, and diagnostic logging", async () => {
  const files = await sourceFiles("app");
  const sources = await Promise.all(files.map((file) => readFile(file, "utf8")));
  const clientSource = sources.join("\n");

  assert.doesNotMatch(clientSource, /\b(?:localStorage|sessionStorage|indexedDB)\b/);
  assert.doesNotMatch(clientSource, /\b(?:fetch|sendBeacon|XMLHttpRequest)\s*\(/);
  assert.doesNotMatch(clientSource, /\bnew\s+(?:WebSocket|EventSource|Image)\s*\(/);
  assert.doesNotMatch(clientSource, /https?:\/\//i);
  assert.doesNotMatch(clientSource, /\bconsole\.(?:log|info|debug|table)\s*\(/);
  assert.doesNotMatch(
    clientSource,
    /\b(?:mixpanel|amplitude|google-analytics|segment\.io)\b/i,
  );
});
