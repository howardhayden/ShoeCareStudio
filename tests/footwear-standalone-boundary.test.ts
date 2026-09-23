import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
const packageLock = JSON.parse(text("package-lock.json")) as {
  packages: Record<string, { license?: string }>;
};
const licenseMap = JSON.parse(text("LICENSE-MAP.json")) as {
  format: string;
  project: string;
  source_available_not_open_source: boolean;
  default_license: string;
  commercial_use_granted: boolean;
  implementation_reuse_granted: boolean;
  noncommercial_reuse_granted: boolean;
  institutional_reuse_exception: boolean;
  no_automatic_permissive_exceptions: boolean;
  permissive_exceptions: unknown[];
};

test("standalone manifest and path denominator stay care-only", () => {
  assert.equal(packageJson.name, "shoe-care-studio");
  assert.equal(packageJson.displayName, "ShoeCareStudio");
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.license, "LicenseRef-Hayden-Proprietary-1.1");
  assert.equal(packageLock.packages[""]?.license, packageJson.license);
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

test("repository licensing is prospectively proprietary and preserves earlier grants", () => {
  assert.notDeepEqual(bytes("LICENSE"), bytes("LICENSES/PolyForm-Noncommercial-1.0.0.txt"));
  assert.equal(
    createHash("sha256").update(bytes("LICENSE")).digest("hex"),
    "07b7734eb4da7c79ffdd32d4641ab64eea1922e8149ebf50c430e5f54657628c",
  );
  assert.match(text("LICENSE"), /^# Hayden Howard Proprietary Product and Source License 1\.1/);
  assert.match(text("LICENSE"), /SPDX-License-Identifier: LicenseRef-Hayden-Proprietary-1\.1/);
  assert.match(text("LICENSE"), /permissions validly attached to earlier distributed copies remain governed by\s+their own terms and do not automatically attach to later copies or snapshots/i);
  assert.doesNotMatch(text("LICENSE"), /\bAI training\b/);
  assert.match(text("LICENSES/PolyForm-Noncommercial-1.0.0.txt"), /^# PolyForm Noncommercial License 1\.0\.0/);
  assert.match(text("LICENSES/CC-BY-NC-SA-4.0.txt"), /^Attribution-NonCommercial-ShareAlike 4\.0 International/);
  assert.match(
    text("NOTICE"),
    /^Required Notice: Copyright \(c\) 2026 Hayden Howard\.$/m,
  );
  assert.match(text("NOTICE"), /Policy effective prospectively/);
  assert.match(text("COMMERCIAL_BASELINE.md"), /495d4538f38d92bd29841dd158ee12093a72fcbf/);
  assert.match(text("COMMERCIAL_BASELINE.md"), /96a95cd24069a01d0ce6b90f88fd39d62f2be026/);
  assert.match(text("COMMERCIAL_BASELINE.md"), /does not revoke, narrow, or pretend to replace/i);
  assert.match(text("COMMERCIAL_BASELINE.md"), /LicenseRef-Hayden-Proprietary-1\.0/);
  assert.match(text("COMMERCIAL_BASELINE.md"), /LicenseRef-Hayden-Proprietary-1\.1/);
  const historicalPolicy = bytes("LICENSES/HISTORICAL/Hayden-Proprietary-1.0.txt");
  assert.equal(
    createHash("sha256").update(historicalPolicy).digest("hex"),
    "8278becffe88f697fd622a6399623d77f0ec923d1f76dd182a8d3ed43b7fc796",
  );
  assert.match(historicalPolicy.toString("utf8"), /^# Hayden Howard Proprietary Product and Source License 1\.0/);
  assert.match(historicalPolicy.toString("utf8"), /SPDX-License-Identifier: LicenseRef-Hayden-Proprietary-1\.0/);
  assert.notDeepEqual(historicalPolicy, bytes("LICENSE"));
  assert.equal(licenseMap.format, "howardhayden-license-map-v3");
  assert.equal(licenseMap.project, "ShoeCareStudio");
  assert.equal(licenseMap.source_available_not_open_source, true);
  assert.equal(licenseMap.default_license, "LicenseRef-Hayden-Proprietary-1.1");
  assert.equal(licenseMap.commercial_use_granted, false);
  assert.equal(licenseMap.implementation_reuse_granted, false);
  assert.equal(licenseMap.noncommercial_reuse_granted, false);
  assert.equal(licenseMap.institutional_reuse_exception, false);
  assert.equal(licenseMap.no_automatic_permissive_exceptions, true);
  assert.deepEqual(licenseMap.permissive_exceptions, []);

  const readme = text("README.md");
  assert.match(readme, /LicenseRef-Hayden-Proprietary-1\.1/);
  assert.match(readme, /no general implementation[\s\S]*noncommercial-use right/i);
  assert.match(readme, /Permissions validly attached to earlier distributed copies remain governed/i);
  assert.doesNotMatch(readme, /public source-available software for noncommercial use/i);
  assert.match(readme, /zero\s+Verified requirements/i);
  assert.match(readme, /productionUnlocked.*false/i);
  assert.match(text("THIRD_PARTY_NOTICES.md"), /Third-party notices/);
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
