# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial Proposal draft of the STAC OSI Extension.
- Top-level fields `osi:version`, `osi:semantic_model_href`, and `osi:metrics`.
- The `osi:spatial` column descriptor, marked experimental at the schema level.
- The `osi-semantic-model` link relation and the `osi` / `semantic-model` asset roles.
- Tabular and spatial example collections.

### Changed

- Scoped `osi:version` to the stable surface. It now covers the linked semantic model and the `osi:metrics`
  summary only, and explicitly does not cover the experimental `osi:spatial` descriptor.

### Removed

- Dropped the `osi:role` and `osi:semantic_type` column annotations. Both are derivable from the linked OSI
  semantic model, have no STAC search consumer, and column typing already belongs to the Table extension.
  `osi:spatial` no longer depends on `osi:role`, its presence on a column is itself the spatial signal.

[Unreleased]: https://github.com/portolan-sdi/stac-osi-extension/compare/v0.1.0...HEAD
