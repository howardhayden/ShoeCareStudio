import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders the standalone entry route and initial semantic state", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>ShoeCareStudio — Leather shoe-care reference<\/title>/);
  assert.match(html, /<main[^>]+id="main-content"/);
  assert.match(html, /data-care-transition-trace="none"/);
  assert.equal(
    (html.match(/<section[^>]*data-care-surface="true"[^>]*>/g) ?? []).length,
    1,
  );
  assert.match(html, /Black leather shoe care/);
  assert.match(html, /Pre-production reference/);
  assert.doesNotMatch(html, /<input[^>]+type="text"/);
});
