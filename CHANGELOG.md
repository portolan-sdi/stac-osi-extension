# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial Proposal draft of the STAC OSI Extension.
- Top-level fields `osi:version`, `osi:semantic_model_href`, and `osi:metrics`.
- Column annotations `osi:role`, `osi:semantic_type`, and the `osi:spatial` descriptor.
- The `osi-semantic-model` link relation and the `osi` / `semantic-model` asset roles.
- Tabular and spatial example collections.
- Stability section in the README separating the stable surface from the experimental `osi:spatial` descriptor.

### Changed

- Scoped `osi:version` to the stable surface (semantic model, `osi:metrics`, and the `dimension`/`measure`/`time` roles) so it no longer claims that the experimental `osi:spatial` descriptor conforms to a finalized OSI release.

[Unreleased]: https://github.com/portolan-sdi/stac-osi-extension/compare/v0.1.0...HEAD
