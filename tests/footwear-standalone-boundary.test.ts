import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function bytes(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url));
}

function text(path: string) {
  return bytes(path).toString("utf8");
}

const packageJson = JSON.parse(text("package.json")) as {
  name: string;
  displayName: string;
  private: boolean;
  license: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};
const licenseMap = JSON.parse(text("LICENSE-MAP.json")) as {
  project: string;
  source_available_not_open_source: boolean;
  default_license: string;
  commercial_use_granted: boolean;
  permissive_exceptions: unknown[];
};

test("standalone manifest and path denominator stay care-only", () => {
  assert.equal(packageJson.name, "shoe-care-studio");
  assert.equal(packageJson.displayName, "ShoeCareStudio");
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.license, "PolyForm-Noncommercial-1.0.0");
  assert.deepEqual(Object.keys(packageJson.dependencies).sort(), [
    "next",
    "react",
    "react-dom",
    "three",
  ]);
  assert.equal("chess.js" in packageJson.dependencies, false);
  assert.equal("tailwindcss" in packageJson.devDependencies, false);

  for (const path of [
    "app/components/care/LeatherFootwearRenderer.tsx",
    "app/components/care/ShoeCareStudio.tsx",
    "app/domain/footwear-care.ts",
    "app/domain/footwear-care-store.ts",
    "app/domain/footwear-material.ts",
    "docs/footwear/requirements-v1.3-current.jsonl",
    "docs/footwear/requirements-v1.3-summary.json",
    "tools/assemble-footwear-register.mjs",
  ]) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, path);
  }

  for (const path of [
    "app/components/avatar",
    "app/components/chess",
    "app/components/studio",
    "app/domain/avatar-machine.ts",
    "app/domain/content.ts",
    "app/domain/movement-logic.ts",
    "app/domain/persistence.ts",
    "app/hooks",
    ".openai/hosting.json",
  ]) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), false, path);
  }
});

test("repository licensing is source-available, noncommercial, and internally coherent", () => {
  assert.deepEqual(bytes("LICENSE"), bytes("LICENSES/PolyForm-Noncommercial-1.0.0.txt"));
  assert.match(text("LICENSE"), /^# PolyForm Noncommercial License 1\.0\.0/);
  assert.match(
    text("NOTICE"),
    /^Required Notice: Copyright \(c\) 2026 Hayden Howard\.$/m,
  );
  assert.equal(licenseMap.project, "ShoeCareStudio");
  assert.equal(licenseMap.source_available_not_open_source, true);
  assert.equal(licenseMap.default_license, "PolyForm-Noncommercial-1.0.0");
  assert.equal(licenseMap.commercial_use_granted, false);
  assert.deepEqual(licenseMap.permissive_exceptions, []);

  const readme = text("README.md");
  assert.match(readme, /public source-available software for noncommercial use/i);
  assert.match(readme, /not open-source software/i);
  assert.match(readme, /does not permit\s+commercial use/i);
  assert.match(readme, /zero\s+Verified requirements/i);
  assert.match(readme, /productionUnlocked.*false/i);
});

test("standalone provenance pins the reviewed and merged Evenward source", () => {
  const extraction = text("docs/STANDALONE-EXTRACTION.md");
  assert.match(extraction, /https:\/\/github\.com\/howardhayden\/evenward/);
  assert.match(extraction, /d27e73a600794405ce995c24dab23baca0902ba5/);
  assert.match(extraction, /2add02c71d868d78d9c174f6ce9f9917373fe1e6/);
  assert.match(extraction, /https:\/\/github\.com\/howardhayden\/evenward\/pull\/3/);
  assert.match(extraction, /28a681bdf4ef6e0073f3958dac0157fa77373c77/);
  assert.match(extraction, /do not[\s\S]*production evidence/i);
});
