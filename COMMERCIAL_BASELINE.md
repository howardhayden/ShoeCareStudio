# Commercial baseline

Policy effective date: 2026-09-23

## Baseline selector

The **COMMERCIAL BASELINE** is the first commit that adds this file together
with the `LicenseRef-Hayden-Proprietary-1.0` policy set. Its immediate parent is:

`495d4538f38d92bd29841dd158ee12093a72fcbf`

Its immutable ID is the first result of
`git log --diff-filter=A --format=%H -- COMMERCIAL_BASELINE.md`. The parent pin
and required policy files make the boundary auditable without a self-referential
commit hash: it is the first descendant of that parent containing this file and
the matching root `LICENSE`, `LICENSING.md`, `NOTICE`, and `LICENSE-MAP.json`.

Owner-controlled changes first distributed from the baseline forward are
intended to use the current proprietary terms unless an express, signed,
material-specific grant says otherwise. Repository visibility, a build command,
product payment, or an SPDX header added without that grant is not an exception.

## Earlier grants preserved

This boundary is prospective. It does not revoke, narrow, or pretend to replace
permissions already attached to earlier distributed copies. At the audit boundary:

- this repository had no publicly released OSI-approved product-code snapshot;
- the first complete standalone product snapshot was
  `96a95cd24069a01d0ce6b90f88fd39d62f2be026` (2026-09-01), distributed under
  PolyForm Noncommercial 1.0.0 for the covered software; and
- the associated CC BY-NC-SA grants remain effective within their original
  material and scope.

Those permissions remain effective for the earlier distributed copies and
licensed material according to their own terms. This baseline does not assert
that they automatically attach to a later snapshot. Historical license texts
under `LICENSES/` are evidence of prior terms, not a new grant over the current
copy or post-baseline Owner-controlled changes. Third-party packages and
components retain their own terms and notices, including those in
`THIRD_PARTY_NOTICES.md`.

## Controlling prospective surfaces

The prospective policy is expressed consistently through:

- `LICENSE`, `LICENSING.md`, `NOTICE`, and `LICENSE-MAP.json`;
- `COMMERCIAL-LICENSE.md`, `PERMISSIVE-EXCEPTIONS.md`, and
  `WORKFLOW-BOUNDARIES.md`;
- `README.md`, `CONTRIBUTING.md`, package metadata, and licensing tests; and
- any future distribution, release, CI, package, or product terms.

Dated footwear v1.3 decisions, registers, and extraction records remain
historical evidence. Their then-current noncommercial distribution directives
do not override this later prospective baseline, and their product-safety and
production-gate findings are unchanged.
