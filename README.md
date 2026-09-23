# ShoeCareStudio

ShoeCareStudio is a local-first, accessibility-oriented **pre-production**
reference for caring for black, smooth, finished leather shoes with the named
Saphir Amiral Gloss profile. It combines a fail-closed semantic state machine,
an explicit release-first interaction boundary, and a procedural Three.js
reference renderer.

This is a source extraction from the
[Evenward footwear work packet](https://github.com/howardhayden/evenward/tree/28a681bdf4ef6e0073f3958dac0157fa77373c77/docs/footwear).
It is not a physical-outcome measurement tool, safety certification,
accessibility conformance claim, product endorsement, or production release.
The application does not assert that a shoe is restored, protected, undamaged,
or polished to a measured finish.

## Current evidence boundary

The additive v1.3 register contains **145 requirements**: 103
`candidate-required` rows and 42 `inherited-blocker` rows. It contains **zero
Verified requirements**, and `productionUnlocked` remains `false`. A passing
build or merged source branch does not change that boundary.

The historical EVW-prefixed IDs and Evenward-named candidate files in
[`docs/footwear`](docs/footwear) are intentionally preserved for provenance and
byte-level evidence anchors. See
[`docs/STANDALONE-EXTRACTION.md`](docs/STANDALONE-EXTRACTION.md) for the exact
standalone boundary.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm install
npm run dev
```

Then open the local URL printed by Next.js. The care run remains in memory: the
client contains no persistence, transport, tracker, or analytics path.

## Verify

```sh
npm run check
npm run test:footwear
```

`npm run check` lints, type-checks, creates the static export, runs the focused
unit/source-contract suite, and inspects the rendered HTML. The footwear command
also checks the generated register and exercises the bounded state model. These
checks verify source behavior; they do not provide the missing physical,
optical, device, accessibility, or independent-review evidence.

## Architecture

- `app/domain/footwear-care.ts` owns semantic state and fail-closed transitions.
- `app/domain/footwear-care-store.ts` owns release-first lifecycle transactions.
- `app/domain/footwear-material.ts` owns care-to-material conversion and fidelity demand.
- `app/components/care/ShoeCareStudio.tsx` presents written instructions and controls.
- `app/components/care/LeatherFootwearRenderer.tsx` consumes state as a visual reference.
- `docs/footwear` preserves the atomized requirements, both red teams, corrections, and evidence.

WebGL is a visual consumer, never the source of care truth. If the renderer is
unavailable during approach or contact, the parent performs an ordered release
and pauses the run.

## License

Owner-controlled material in this snapshot is offered prospectively under the
[Hayden Howard Proprietary Product and Source License 1.0](LICENSE), identified
as `LicenseRef-Hayden-Proprietary-1.0`. It grants no general implementation
reuse, modification, redistribution, self-hosting, or noncommercial-use right.
Official-product use is limited to the free offering or purchased entitlement
actually made available by the Owner.

Valid permissions attached to earlier distributed copies remain effective for
those copies and licensed material according to their own terms; they do not
automatically attach to a later snapshot. Historical license texts are retained
as evidence, and third-party components keep their own terms; see
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). See
[`COMMERCIAL_BASELINE.md`](COMMERCIAL_BASELINE.md),
[`LICENSING.md`](LICENSING.md), and [`LICENSE-MAP.json`](LICENSE-MAP.json) for
scope and precedence. [`COMMERCIAL-LICENSE.md`](COMMERCIAL-LICENSE.md) is a
policy summary, not an automatic offer of separate source rights.
