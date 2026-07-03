# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-07-03

### Added

- Real-data example `collection-nls-buildings.json` cataloging the NLS Finland building footprints
  GeoParquet on Source Cooperative, with a complete OSI semantic model in both YAML and JSON
  (`nls-buildings.osi.yaml`, `nls-buildings.osi.json`).
- `check-osi-model` test step validating the example semantic models against the vendored OSI
  core-spec schema and keeping the YAML and JSON twins in sync.
- Biome for JSON formatting, with a husky and lint-staged pre-commit hook that formats staged JSON
  and lints staged Markdown.

### Fixed

- `osi:version` is now enforced as required by spec-compliant draft-07 validators. The `required` keyword
  previously sat as a sibling of `$ref`, which draft-07 ignores, so only lenient validators such as Ajv
  enforced it.
- `osi:semantic_model_href` now uses the `uri-reference` format, which ajv-formats implements. The previous
  `iri-reference` format was silently ignored.
- Markdown linting is now actually configured through `.remarkrc`. The remark presets were installed but
  never loaded, so `check-markdown` linted nothing.

### Changed

- Unknown `osi:` prefixed fields are now rejected at the Collection and Item level and inside
  `table:columns` entries, so typos and fields from earlier drafts fail validation.
- `osi:spatial`, its `spatial_index` object, and `osi:metrics` entries no longer accept unknown members.
- Documented the field-level deltas between `osi:spatial` and OSI Discussion 114, and added a Stability
  section to the README.
- Documented that Item-level scope is intentional.
- CI installs dependencies with `npm ci` against a committed lockfile.
- Removed the undeclared `portolan:geospatial` field from the tabular example.
- Examples now pin `osi:version` to `0.2.0.dev0`, the actual current draft version of the OSI core
  spec. The previous `1.0.0` claimed an OSI release that does not exist.

## [0.1.1] - 2026-07-02

### Changed

- Scoped `osi:version` to the stable surface. It now covers the linked semantic model and the `osi:metrics`
  summary only, and explicitly does not cover the experimental `osi:spatial` descriptor.

### Removed

- Dropped the `osi:role` and `osi:semantic_type` column annotations. Both are derivable from the linked OSI
  semantic model, have no STAC search consumer, and column typing already belongs to the Table extension.
  `osi:spatial` no longer depends on `osi:role`, its presence on a column is itself the spatial signal.

## [0.1.0] - 2026-06-29

### Added

- Initial Proposal draft of the STAC OSI Extension.
- Top-level fields `osi:version`, `osi:semantic_model_href`, and `osi:metrics`.
- The `osi:spatial` column descriptor and the `osi:role` and `osi:semantic_type` column annotations,
  the latter two removed again in 0.1.1.
- The `osi-semantic-model` link relation and the `osi` / `semantic-model` asset roles.
- Tabular and spatial example collections.

[Unreleased]: https://github.com/portolan-sdi/stac-osi-extension/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/portolan-sdi/stac-osi-extension/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/portolan-sdi/stac-osi-extension/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/portolan-sdi/stac-osi-extension/releases/tag/v0.1.0
